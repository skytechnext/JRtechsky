# Odoo 19 Module — `jrtech_driver_incentive`

Custom module implementing JR-Tech's **Driver Incentive Scheme** (chemical pail delivery, 6 drivers / 3 lorries).
Faithful to the owner's v3 framework, with TechNext refinements exposed as **settings** (no code change to tune).
Human-facing version: `dossier/site/pages/operations/driver-incentive.html`.

## Depends
`base`, `hr`, `hr_attendance`, `hr_holidays`, `stock`, `hr_payroll` (Enterprise) or `om_hr_payroll` (CE),
`mail` (chatter/audit), `web`.

## Master data & models

### `jrtech.lorry`
| field | type | note |
|---|---|---|
| `name` | Char | L1 / L2 / L3 |
| `plate_number` | Char | vehicle plate |
| `driver_ids` | Many2many hr.employee | assigned drivers (pairing may vary) |

### `jrtech.trip.log`  (one row per delivery trip; WhatsApp-auto + 2 supervisor fields)
| field | type | note |
|---|---|---|
| `trip_date` | Date | from WA timestamp |
| `lorry_id` | Many2one jrtech.lorry | parsed LORRY-N |
| `driver_1_id` | Many2one hr.employee | parsed driver |
| `driver_2_id` | Many2one hr.employee | **supervisor** — blank = solo |
| `customer_id` | Many2one res.partner | delivered-to |
| `do_number` | Char | DO ref |
| `pails_delivered` | Integer | parsed PAILS-N |
| `trip_completed` | Boolean | **supervisor** verify flag |
| `partner_present` | Boolean (compute) | `bool(driver_2_id)` |
| `pail_credit_d1/d2` | Float (compute) | solo → pails ; shared → pails/2 |
| `rm_value_d1/d2` | Monetary (compute) | credit × `pail_rm_rate` |
| `source` | Selection | whatsapp / manual / sql_export |

### `jrtech.attendance.daily` (one row per driver per day)
`att_date` Date · `driver_id` Many2one hr.employee · `status` Selection
(present / late_unexcused / absent_unexcused / mc / emergency_approved).

### `jrtech.driver.kpi.monthly`  ★ core record — one per driver per month
Computed unless marked *manual*.
`driver_id`, `period_month`, `period_year`;
`mc_days`, `el_days`, `late_count`, `unpaid_absent_days` (from attendance/leave);
`att_score = MAX(0,100 − late×late_pts − absent×absent_pts)`;
`chem_arrange/achieve`, `equip_arrange/achieve` (*manual or from stock.picking*);
`job_pct = (chem_ach+equip_ach)/(chem_arr+equip_arr)×100`;
`do_issued`, `do_returned` (*manual / stock.picking*), `do_return_pct`;
`daily_in_sent`, `daily_out_sent`, `delivery_days`, `sending_pct = MIN(100,(in+out)/(days×2)×100)`;
`total_kpi_pct` (weighted); `monthly_rm_pool` (SUM rm_value from trip.log for driver+month);
`leave_gate_mode` (default from settings), `rating` (not_qualified/good/excellent), `monthly_payout`.

## Settings — `res.config.settings` → `ir.config_parameter`
Menu **Settings → JR-Tech Incentive**. Every parameter below is editable by the Manager group, no developer:

| key | default | owner/TechNext |
|---|---|---|
| `jrtech_incentive.pail_rm_rate` | 1.0 | owner |
| `...kpi_min_threshold` | 80 | owner |
| `...weight_att / weight_job / weight_do / weight_send` | 40 / 50 / 5 / 5 | owner |
| `...late_pts / absent_pts` | 10 / 20 | owner |
| `...mc_limit / el_limit` | 2 / 1 | owner |
| `...do_return_gate` | 90 | owner |
| `...sending_gate` | 80 | owner |
| `...excellent_kpi_threshold` | 95 | TechNext (owner may set 100) |
| `...excellent_bonus_pct` | 10 | TechNext |
| `...leave_gate_mode` | strict \| prorate \| off | TechNext |
| `...enable_quality_penalty` + `...complaint_pts` | off / 0 | TechNext |

## Payout compute (order is fixed)
1. **Leave gate.** `strict`: `mc_days>mc_limit or el_days>el_limit` → payout 0. `prorate`: factor = `max(0,(working_days−mc−el)/working_days)`. `off`: factor 1.
2. **Qualify.** `total_kpi_pct < kpi_min_threshold` → payout 0.
3. **Band.** Excellent if `kpi ≥ excellent_kpi_threshold AND do_return_pct ≥ do_return_gate AND sending_pct ≥ sending_gate` → `pool × (1+bonus/100) × factor`; else Good → `pool × kpi/100 × factor`.
Reference implementation is on the site page (Section 5) and mirrored 1:1 by the calculator.

## Automation
- **Cron** `ir.cron` monthly (1st, 00:30): create `jrtech.driver.kpi.monthly` for every active driver for the new period; recompute prior month as final.
- **Webhook controller** `POST /api/jrtech/trip_log` (JSON from WATI/n8n/Make): parse `LORRY-N | NAME | CUSTOMER | PAILS-N`, fuzzy-match driver by WA number → create `jrtech.trip.log` (`source=whatsapp`). Idempotent on `(do_number, trip_date, lorry_id)`.
- **Payroll**: salary rule code `DRV_INC`, category *Other Input*, amount = `monthly_payout` of the driver's finalised KPI record; separate line from base pay.

## Security (`ir.model.access` + record rules)
- `group_jrtech_driver` — read-only own KPI record (record rule `driver_id.user_id = uid`); dashboard only.
- `group_jrtech_supervisor` — CRUD trip/attendance logs; edit manual KPI fields.
- `group_jrtech_manager` — all records + settings + payout confirm. Anti-gaming: drivers cannot edit `*_arrange` counts.

## Views
Trip Log (list+form), Attendance Daily (list), Monthly KPI (form with computed dashboard + list comparing 6 drivers),
Driver self-dashboard (read-only), Team Pail pivot (pails by lorry×month), Yearly KPI pivot (12 months × 6 drivers).

## Seed
See `odoo/seed/` additions: `lorries.csv`, `trip_log_sample.csv`, `driver_kpi_monthly_sample.csv` (Driver F, Jan-2026
worked example → KPI 76.7% → Not Qualified under the 80% rule, validating the compute).

## Rollout
Month 0 parallel-run vs Excel (reconcile to the cent) → Month 1 WhatsApp capture, owner-approved payout →
Month 2 payslip posting + driver dashboards → later, Odoo mobile/PWA log replaces WhatsApp parsing (same models).
