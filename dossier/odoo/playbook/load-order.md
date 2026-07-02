# JR-Tech Demo Load Playbook — Ordered Execution for an AI/MCP Agent

> **Audience:** a future AI agent driving an Odoo 19 instance over **XML-RPC / JSON-RPC** (or an
> **Odoo MCP server**). This is the machine-runnable counterpart to the human-facing
> `site/tools/ai-build-playbook.html`. Data lives in `../seed/`; schema in `../seed/SCHEMA.md`.

---

## 0. Connection & conventions

XML-RPC endpoints: `/xmlrpc/2/common` (auth) and `/xmlrpc/2/object` (CRUD via `execute_kw`).

```python
import xmlrpc.client
URL, DB, USER, PWD = "https://jrtech-demo.odoo.com", "jrtech_demo", "admin", "<api_key>"
common = xmlrpc.client.ServerProxy(f"{URL}/xmlrpc/2/common")
uid = common.authenticate(DB, USER, PWD, {})
models = xmlrpc.client.ServerProxy(f"{URL}/xmlrpc/2/object")
def call(model, method, *args, **kw):
    return models.execute_kw(DB, uid, PWD, model, method, list(args), kw)
```

### Odoo MCP mapping
Each `call(model, method, args)` below maps directly to an MCP tool invocation:
- `call(m,'search_read',[domain],{fields})`  → MCP tool `odoo.search_read {model, domain, fields}`
- `call(m,'create',[vals])`                   → MCP tool `odoo.create {model, values}`
- `call(m,'write',[[id],vals])`               → MCP tool `odoo.write {model, ids, values}`
- `call(m,'<action>',[[id]])`                 → MCP tool `odoo.call_method {model, method, ids}`

### Idempotency — search-before-create (MANDATORY)
Never blind-create. For every record, search on its **unique key**, reuse if found, else create and
record the external_id. Unique keys per model:

| Model | Unique key field |
|-------|------------------|
| res.partner | `name` (+ `vat` if present) |
| product.template | `default_code` |
| product.category / hr.department / account.journal | `name` |
| account.account | `code` |
| account.tax | `name` + `type_tax_use` |
| sale.order / purchase.order / account.move | `name` |
| mrp.production | `name` |

```python
def upsert(model, key_field, key_value, vals):
    found = call(model, 'search', [[(key_field,'=',key_value)]], limit=1)
    if found:
        call(model,'write',[found, vals]); return found[0]
    return call(model,'create',[{**vals, key_field: key_value}])
```
Better: assign the seed `xml_id` as an `ir.model.data` external id so a re-run is a true upsert.
Use `call(model,'create',[vals])` then create `ir.model.data {module:'jr_seed', name:xml_id,
model, res_id}`, OR load via `load()` with an `id` column.

---

## Load order (dependency-correct). Each step lists model + key fields + source file.

### Phase 0 — Localization & company (do via UI/config first, then API for the rest)
1. **Install modules** (see `../plan/implementation-plan.md` §3). Set company country=Malaysia,
   currency=MYR, install `l10n_my` chart.
2. **`res.company`** ← `company.json:company`. Set `company_registry`, `vat`, SST reg, MSIC, address.
3. **Branches / `stock.warehouse`** ← `company.json:branches`, `warehouses`.
   - `call('stock.warehouse','create',[{name,code}])`

### Phase 1 — Accounting backbone (before any monetary record)
4. **`account.account`** ← `accounts.csv` (key `code`). Many already exist from `l10n_my`; upsert.
5. **`account.tax`** ← `taxes.csv` (key `name`+`type_tax_use`). Link repartition to `tax_account_code`.
6. **`account.journal`** ← `journals.csv` (key `code`). Bank journals link `default_account_code`.
7. **`account.payment.term`** — create "Immediate" (exists) and "30 Days".
8. **`product.pricelist`** — create "Default" (exists), "Hotel/Chain", "Project".

### Phase 2 — Org & people
9. **`hr.department`** ← `departments.csv` — create parents first (`parent_xml_id` blank), then children.
10. **`hr.employee`** ← `employees.csv`. Set `department_id`, `job_title`, `work_email`.
11. **`res.users`** for rows with `create_user=yes` (login=`user_login`); link `employee.user_id`.

### Phase 3 — Master data: products & partners
12. **`product.category`** ← `product_categories.csv` — parents before children.
13. **`product.template`** ← `products.csv` (key `default_code`). Map `product_type`
    (storable→consu+is_storable, service→service), set `list_price`, `standard_price`,
    `taxes_id`/`supplier_taxes_id`, `sale_ok`/`purchase_ok`, `rent_ok`, `categ_id`, routes.
14. **`res.partner` customers** ← `customers.csv` (key `name`). Set ranks, payment term, pricelist,
    tag by `archetype`.
15. **`res.partner` vendors** ← `vendors.csv` (key `name`).

### Phase 4 — Manufacturing structures
16. **`mrp.bom`** ← `boms.csv` (key product+`name`). Requires products from step 13.
17. **`mrp.bom.line`** ← `bom_lines.csv` — write as `bom_line_ids` on the BoM or create per line.
18. **`stock.warehouse.orderpoint`** ← `reordering_rules.csv` (product + warehouse).
19. **Opening stock** — optional: create an inventory adjustment so storables have on-hand qty
    (recommended so MOs/SOs can deliver). Use `stock.quant` set qty at WH/Gelugor.

### Phase 5 — CRM & sales pipeline
20. **`crm.stage`** / **`crm.team`** — ensure stages (New/Qualified/Proposition/Won/Lost) & teams
    (Equipment/Chemicals/Projects) exist.
21. **`crm.lead`** ← `crm_leads.csv` (key `name`). Set `partner_id`, `stage_id`, `expected_revenue`,
    `user_id`, `team_id`.

### Phase 6 — Transactions: sales, rental, purchase, manufacturing
22. **`sale.order`** ← `sale_orders.csv` + lines from `sale_order_lines.csv`
    (`order_line` = list of `(0,0,{product_id, product_uom_qty, price_unit})`).
    Then for `state in (sale,done)`: `call('sale.order','action_confirm',[[id]])`.
23. **`sale.order` (rental)** ← `rental_contracts.csv` + `rental_lines.csv`; set `is_rental_order`,
    rental start/return on lines; confirm.
24. **`purchase.order`** ← `purchase_orders.csv` + `purchase_order_lines.csv`; confirm those with
    `state in (purchase,done)` via `button_confirm`.
25. **`mrp.production`** ← `manufacturing_orders.csv`. Set `product_id`, `bom_id` (lookup by product),
    `product_qty`. Confirm (`action_confirm`); mark `done` ones produced (`button_mark_done`).

### Phase 7 — Recurring, service, projects
26. **`sale.subscription.plan`** — ensure Monthly & Quarterly plans.
27. **Subscriptions** ← `subscriptions.csv` + `subscription_lines.csv` (in v19 these are
    `sale.order` with a `plan_id`). Confirm to start recurrence.
28. **`project.project`** ← `projects.csv` (incl. the FSM project "JR Field Service").
29. **`project.task`** ← `project_tasks.csv` and the `field_service` rows of `service_tasks.csv`.
30. **`maintenance.request`** ← `service_tasks.csv` rows where `kind=maintenance`
    (set `maintenance_team_id`, `schedule_date`).
31. **`repair.order`** ← `service_tasks.csv` rows where `kind=repair`.
32. **`helpdesk.team`** then **`helpdesk.ticket`** ← `helpdesk_tickets.csv`.

### Phase 8 — Finance close loop
33. **`account.move` invoices** ← `invoices.csv`. Prefer generating from the source SO
    (`sale.order._create_invoices()`); otherwise create `out_invoice` with lines mirroring the SO,
    apply SST taxes, then `action_post`.
34. **`account.payment`** ← `payments.csv` for `payment_status=paid`. Register against the invoice
    (`account.payment.register` wizard) and reconcile.
35. **Opening entries** ← `opening_entries.csv`. Group rows by date+label into one balanced
    `account.move` (journal=Misc), then `action_post`. Verify debits==credits.

---

## Example: create + confirm a sales order with lines

```python
partner_id = upsert('res.partner','name','Eastern & Oriental Hotel Penang', {...})
def pid(default_code):
    return call('product.product','search',[[('default_code','=',default_code)]],limit=1)[0]
so = call('sale.order','create',[{
    'partner_id': partner_id,
    'date_order': '2026-05-10',
    'order_line': [(0,0,{'product_id': pid('EQ-DW-002'),'product_uom_qty':1}),
                   (0,0,{'product_id': pid('SVC-017'),'product_uom_qty':1})],
}])
call('sale.order','action_confirm',[[so]])
inv_ids = call('sale.order','_create_invoices',[[so]])   # then action_post
```

MCP equivalent: `odoo.create {model:"sale.order", values:{...}}` →
`odoo.call_method {model:"sale.order", method:"action_confirm", ids:[so]}`.

---

## Validation checklist (run after load)

- [ ] `res.company`: SST reg, TIN, MSIC, MYR currency set.
- [ ] Modules installed (l10n_my, l10n_my_edi, mrp, sale_renting, sale_subscription, industry_fsm,
      maintenance, repair, helpdesk, hr) — `ir.module.module state=installed`.
- [ ] `account.account` count ≥ 44 seeded codes present; SST taxes (10/5/8/0) exist.
- [ ] `product.template`: 137 products; categories nested correctly; 12 fab items each have 1 BoM.
- [ ] `mrp.bom.line`: 62 lines; all components are `prod_raw_*`.
- [ ] `res.partner`: ≥46 customers (rank>0), ≥22 vendors (rank>0).
- [ ] `crm.lead`: 45 opportunities across stages.
- [ ] `sale.order`: 54 standard + 16 rental; confirmed ones have deliveries.
- [ ] `purchase.order`: 24; `mrp.production`: 22 (5+ done).
- [ ] service/maintenance/repair: 34 split across the three models.
- [ ] `sale.subscription`(orders w/ plan): 16; recurrence active for `progress`.
- [ ] `account.move`: 45 posted customer invoices; SST tax lines populated.
- [ ] `account.payment`: 30, reconciled; ~65% of invoices paid.
- [ ] `project.project`: 3 consulting + 1 FSM project; tasks present.
- [ ] `helpdesk.ticket`: 20.
- [ ] Opening entry posted and balanced (RM 875,000 each side).
- [ ] No `xml_id` reference unresolved (run a referential-integrity scan).
- [ ] Re-running the loader creates **zero** duplicates (idempotency proven).
