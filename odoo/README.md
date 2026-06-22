# JR-Tech Solution Sdn Bhd — Odoo 19 Demo Build Kit

Machine-usable artifacts for a **future AI / MCP agent** to stand up a JR-Tech demo instance on
Odoo 19 over XML-RPC / JSON-RPC. **Nothing is loaded live by these files** — they are data + plan +
runbook. Prepared by **TechNext** (technext.asia).

## Folder map

```
odoo/
├── README.md                     ← you are here
├── plan/
│   └── implementation-plan.md    ← modules, install order, MY localization, edition, environments
├── seed/
│   ├── SCHEMA.md                 ← every file's columns + target Odoo model
│   ├── company.json              ← company + 2 branches + 2 warehouses
│   ├── departments.csv  employees.csv
│   ├── accounts.csv  taxes.csv  journals.csv  (localized CoA subset, SST, journals)
│   ├── product_categories.csv  products.csv  (137 products, 4 business lines)
│   ├── boms.csv  bom_lines.csv  reordering_rules.csv
│   ├── customers.csv  vendors.csv
│   ├── crm_leads.csv
│   ├── sale_orders.csv  sale_order_lines.csv
│   ├── rental_contracts.csv  rental_lines.csv
│   ├── purchase_orders.csv  purchase_order_lines.csv
│   ├── manufacturing_orders.csv
│   ├── service_tasks.csv         (field service / maintenance / repair)
│   ├── subscriptions.csv  subscription_lines.csv  (chemical resupply)
│   ├── invoices.csv  payments.csv  opening_entries.csv
│   ├── helpdesk_tickets.csv
│   └── projects.csv  project_tasks.csv
└── playbook/
    └── load-order.md             ← exact ordered create sequence + idempotency + validation
```

## How to point the AI / MCP at this folder

1. **Read first, in order:**
   `plan/implementation-plan.md` → `seed/SCHEMA.md` → `playbook/load-order.md`.
2. **Stand up Odoo 19 Enterprise** (Odoo.sh dev branch or local). Create DB `jrtech_demo`,
   company country = Malaysia, install modules per the plan §3, load the `l10n_my` chart.
3. **Connect** via XML-RPC (`/xmlrpc/2/common` + `/xmlrpc/2/object`) or an Odoo MCP server.
   Provide `URL`, `DB`, `USER`, API key.
4. **Execute the playbook phases 0→8 in order.** For each step:
   - read the named CSV/JSON from `seed/`,
   - resolve `*_xml_id` foreign keys to real DB ids you created earlier (keep an in-memory map),
   - **search-before-create** on the unique key (see playbook §0 idempotency) so re-runs are safe,
   - call `create` / `write` / action methods as shown.
5. **Run the validation checklist** at the end of the playbook. Fix any unresolved reference before
   declaring success.

## Loading notes

- IDs in the seed are **stable string keys** (`cust_01`, `prod_cook_01`, …), not DB ids. Register
  them as `ir.model.data` external ids (module `jr_seed`) for true idempotency, or maintain a
  key→id dict during the run.
- Currency is **MYR** throughout; relative dates are anchored to **2026-06-22**.
- SST: sales 10% (`SST Sales 10%`) on goods, 8% (`SST Service 8%`) on services — applied per the
  product's `sale_tax` column.
- This is **DEV/STAGING demo data only.** Do not load illustrative customer names or opening
  balances into a production company. See plan §6.

## Naming note (alignment with the human-facing HTML playbook)

`site/tools/ai-build-playbook.html` illustrates the seed with a numbered-JSON convention
(e.g. `04_products.json`). The **authoritative, machine-readable files are the descriptively named
CSV/JSON in this `seed/` folder** documented in `SCHEMA.md`. The mapping is conceptual, not literal:
`company.json`↔companies/users, `products.csv`↔products, `boms.csv`/`bom_lines.csv`↔BoMs,
`customers.csv`+`vendors.csv`↔partners, transactions↔the `sale_*/purchase_*/mrp_*/invoices/...` CSVs.
Module list, phase order, SST rates (10%/8%) and the SSM number (200901013633) match across both.

## Record volumes (what a correct load produces)

| Type | Count |
|------|------:|
| Companies / branches / warehouses | 1 / 2 / 2 |
| Departments | 8 |
| Employees (users for ~18) | 30 |
| GL accounts (subset) | 44 |
| SST taxes / journals | 6 / 6 |
| Product categories | 17 |
| Products (cooking/refrig/prep/dish/acc/raw/fab/chem/house/rental/service) | 137 |
| BoMs / BoM lines | 12 / 62 |
| Reordering rules | 49 |
| Customers / Vendors | 46 / 22 |
| CRM opportunities | 45 |
| Sales orders / lines | 54 / 148 |
| Rental contracts / lines | 16 / 16 |
| Purchase orders / lines | 24 / ~60 |
| Manufacturing orders | 22 |
| Field-service / maintenance / repair tasks | 34 |
| Chemical subscriptions / lines | 16 / ~48 |
| Customer invoices / payments | 45 / 30 |
| Helpdesk tickets | 20 |
| Consulting projects / tasks | 3 / 24 |
| Opening journal entry (balanced) | RM 875,000 |

See `playbook/load-order.md` for the authoritative validation checklist.
