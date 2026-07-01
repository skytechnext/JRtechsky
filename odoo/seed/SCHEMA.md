# JR-Tech Odoo Seed — Data Schema

All files live in `odoo/seed/`. Format is **CSV** (one row per record) except `company.json`.
Cross-references use **stable `xml_id` keys** (e.g. `cust_01`, `prod_cook_01`), NOT database IDs —
the loader resolves them to real IDs at create time and should set them as `external_id` (so loads
are idempotent and re-runnable). All currency = **MYR**. Reference date for relative dates = 2026-06-22.

Legend: → indicates the target Odoo model.

---

## company.json → `res.company`, `res.partner`, `stock.warehouse`
JSON object with three keys:
- `company`: main company. Fields: `xml_id`, `name`, `company_registry` (SSM no.), `vat` (TIN),
  `sst_registration`, `msic_code`, `currency`, `country`, `street`, `city`, `state`, `zip`, `phone`,
  `email`, `website`.
- `branches[]`: internal operating branches → `res.partner` (type=other) or `res.company` branch.
  Fields: `xml_id`, `name`, `city`, `state`, `type`.
- `warehouses[]` → `stock.warehouse`. Fields: `xml_id`, `name`, `code`, `branch` (→ branch xml_id).

## departments.csv → `hr.department`
`xml_id`, `name`, `parent_xml_id` (self-reference, blank = top level).

## employees.csv → `hr.employee` (+ `res.users` when create_user=yes)
`xml_id`, `name`, `job_title`, `department_xml_id` (→ departments), `work_email`, `work_phone`,
`wage_myr`, `create_user` (yes/no — make a portal/internal user), `user_login`.

## accounts.csv → `account.account`
`code` (unique key), `name`, `account_type` (Odoo selection value, e.g. `asset_cash`,
`asset_receivable`, `liability_payable`, `income`, `expense`, `expense_direct_cost`, `equity`).
Subset of the `l10n_my` chart — codes follow MY 4-digit convention.

## taxes.csv → `account.tax`
`xml_id`, `name`, `type_tax_use` (sale/purchase), `amount`, `amount_type` (percent),
`tax_account_code` (→ accounts.code for the tax repartition line), `note`. SST: 10%/5% sales,
8% service, exempt 0%.

## journals.csv → `account.journal`
`xml_id`, `name`, `type` (sale/purchase/bank/cash/general), `code`, `default_account_code` (→ accounts).

## product_categories.csv → `product.category`
`xml_id`, `name`, `parent_xml_id` (→ self, blank = root), `note` (free text / income-account hint).

## products.csv → `product.template`
`xml_id`, `name`, `default_code` (internal ref, unique key), `category` (→ product_categories.xml_id),
`product_type` (`storable`→ Odoo `consu`+is_storable / `consumable` / `service`), `uom`, `list_price`
(sale, MYR), `standard_cost` (MYR), `sale_tax` (→ taxes.xml_id), `purchase_tax` (→ taxes.xml_id),
`can_be_sold`, `can_be_purchased` (yes/no), `rent_ok` (yes/no → enables Rental), `subscription`
(yes/no), `route` (Buy / Manufacture, MTO / blank for services), `rmin`/`rmax` (reordering min/max,
blank if none).
> Note: In Odoo 19 the storable/consumable distinction is `is_storable` boolean on type `consu`;
> map `storable`→ consu+is_storable=True, `consumable`→ consu+is_storable=False, `service`→ service.

## boms.csv → `mrp.bom`
`xml_id`, `product_xml_id` (→ products, the finished SS item), `product_code`, `bom_type` (normal),
`qty`, `uom`.

## bom_lines.csv → `mrp.bom.line`
`bom_xml_id` (→ boms.xml_id), `component_xml_id` (→ products, a raw SS material), `qty`, `uom`.

## reordering_rules.csv → `stock.warehouse.orderpoint`
`product_xml_id` (→ products), `product_code`, `warehouse` (→ company.json warehouses xml_id),
`min_qty`, `max_qty`, `multiple_qty`.

## customers.csv → `res.partner` (customer_rank>0)
`xml_id`, `name`, `is_company`, `customer_rank`, `supplier_rank`, `archetype` (hotel/restaurant/
hospital/school/condo/factory/foodcourt/catering/cafe/agedcare/cloudkitchen — metadata for tags),
`street`, `city`, `state`, `zip`, `country`, `phone`, `email`, `vat` (TIN/BRN where B2B),
`property_payment_term` (→ `account.payment.term`), `pricelist` (→ `product.pricelist` name).

## vendors.csv → `res.partner` (supplier_rank>0)
`xml_id`, `name`, `is_company`, `customer_rank`, `supplier_rank`, `supplies` (metadata),
`city`, `phone`, `email`, `vat`, `property_supplier_payment_term`.

## crm_leads.csv → `crm.lead`
`xml_id`, `name`, `partner_xml_id` (→ customers), `type` (opportunity), `stage` (→ `crm.stage`),
`expected_revenue`, `probability`, `salesperson_xml_id` (→ employees' user), `team` (→ `crm.team`).

## sale_orders.csv → `sale.order`  /  sale_order_lines.csv → `sale.order.line`
Order: `xml_id`, `name` (unique key), `partner_xml_id` (→ customers), `date_order`, `state`
(draft/sale/done), `salesperson_xml_id`, `pricelist`.
Line: `so_xml_id` (→ sale_orders.xml_id), `product_xml_id` (→ products), `qty`, `unit_price`.

## rental_contracts.csv → `sale.order` (is_rental)  /  rental_lines.csv → `sale.order.line`
Contract: `xml_id`, `name`, `partner_xml_id`, `is_rental`, `date_start`, `date_return`, `deposit`,
`state`. Line: `rental_xml_id`, `product_xml_id` (→ rent_ok products), `qty`, `duration_days`,
`unit_price`.

## manufacturing_orders.csv → `mrp.production`
`xml_id`, `name` (unique), `product_xml_id` (→ fab products), `bom_ref` (→ products w/ BoM),
`qty`, `date_planned`, `state` (draft/confirmed/progress/done), `warehouse`.

## purchase_orders.csv → `purchase.order`  /  purchase_order_lines.csv → `purchase.order.line`
Order: `xml_id`, `name`, `vendor_xml_id` (→ vendors), `date_order`, `state` (draft/purchase/done).
Line: `po_xml_id`, `product_xml_id`, `qty`, `unit_cost`.

## service_tasks.csv → `project.task` (FSM) / `maintenance.request` / `repair.order`
`xml_id`, `kind` (field_service/maintenance/repair — routes to the right model), `project_or_team`,
`name`, `partner_xml_id` (→ customers), `assigned_emp_xml_id` (→ employees), `scheduled_date`,
`stage`, `linked_product` (→ products, the equipment serviced).

## subscriptions.csv → `sale.order` (subscription) / `sale.subscription`  / subscription_lines.csv → lines
Sub: `xml_id`, `name`, `partner_xml_id`, `plan` (Monthly/Quarterly → `sale.subscription.plan`),
`date_start`, `recurring_rule`, `state` (progress/churn), `salesperson_xml_id`.
Line: `sub_xml_id`, `product_xml_id` (→ chemicals), `qty`, `unit_price`.

## invoices.csv → `account.move` (move_type=out_invoice)
`xml_id`, `name` (unique), `partner_xml_id`, `source_so` (→ sale_orders.xml_id), `invoice_date`,
`untaxed`, `tax`, `total`, `journal` (→ journals), `payment_status` (paid/not_paid), `state`
(posted). Generated from confirmed SOs; totals = sum(line qty*price) + SST.

## payments.csv → `account.payment`
`xml_id`, `invoice_xml_id` (→ invoices), `partner_xml_id`, `amount`, `date`, `journal` (→ bank),
`payment_type` (inbound). Only present for paid invoices; reconcile against the invoice.

## helpdesk_tickets.csv → `helpdesk.ticket`
`xml_id`, `name`, `partner_xml_id`, `team` (→ `helpdesk.team`), `priority` (0–3), `stage`,
`assigned_emp_xml_id` (→ employees).

## projects.csv → `project.project`  /  project_tasks.csv → `project.task`
Project: `xml_id`, `name`, `partner_xml_id`, `manager_emp_xml_id`, `date_start`, `is_fsm`.
Task: `project_xml_id` (→ projects), `name`, `assigned_emp_xml_id`, `planned_hours`, `stage`.

## opening_entries.csv → `account.move` (move_type=entry, journal=Misc)
`journal`, `date`, `label`, `account_code` (→ accounts), `debit`, `credit`. Group all rows with the
same date/label into one balanced journal entry (debits = credits).

---

### Referential integrity guarantees
- Every `*_xml_id` foreign key resolves to a row in its target file.
- BoM components reference only `prod_raw_*` products; BoM products reference only `prod_fab_*`.
- SO/rental/subscription lines reference products of the appropriate route/flag (rentals→rent_ok,
  subs→chemicals, MO→fab).
- Invoices reference confirmed SOs only; payments reference paid invoices only.
- `account_code`/`tax_account_code` reference `accounts.csv` codes.
- Opening entries balance (total debit = total credit = RM 875,000).

---

## Driver Incentive Scheme files (module `jrtech_driver_incentive`)
See `odoo/plan/driver-incentive-module.md` and the site page `dossier/site/pages/operations/driver-incentive.html`.

| file | target model | key columns |
|---|---|---|
| `drivers.csv` | `hr.employee` | xml_id, name, department_xml_id, wa_number (WhatsApp match), lorry_default |
| `lorries.csv` | `jrtech.lorry` | xml_id, name, plate_number, driver_1/2_xml_id |
| `trip_log_sample.csv` | `jrtech.trip.log` | trip_date, lorry, driver_1/2, customer, do_number, pails_delivered, trip_completed, source |
| `driver_kpi_monthly_sample.csv` | `jrtech.driver.kpi.monthly` | driver, period, attendance/job/do/sending inputs, monthly_rm_pool (Driver F Jan-2026 = 76.7% → Not Qualified) |

Load order: drivers → lorries → trip_log → driver_kpi_monthly (after core master data). Idempotent on xml_id.
