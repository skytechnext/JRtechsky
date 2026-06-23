# JR-Tech Solution Sdn Bhd — Odoo 19 Implementation Plan

> **Prepared by:** TechNext (technext.asia) — Odoo 19 implementation lead
> **Client:** JR-Tech Solution Sdn Bhd · SSM 200901013633 · Gelugor, Penang, Malaysia
> **Purpose:** Functional + technical blueprint for a JR-Tech demo instance loaded by a future
> AI/MCP agent over XML-RPC/JSON-RPC. See `../seed/` for data and `../playbook/load-order.md` for
> the execution sequence.

---

## 1. Business context (drives module selection)

JR-Tech is a Penang F&B kitchen-engineering SME with **four business lines**:

| Line | Description | Primary Odoo apps |
|------|-------------|-------------------|
| **JR-Consulting Services** | Consultation, space planning, fabrication design, training | Project, Sales, Timesheets |
| **JR-Equipment Supports** | Sales **and rental** of kitchen equipment & dishwashers; maintenance/repair; SS fabrication (in-house); grease-trap/tanker service; housekeeping & pool equipment | Sales, Rental, Inventory, Manufacturing, Field Service, Maintenance, Repair, Purchase |
| **JR-Chemical Supplies** | Dishwasher/cleaning, housekeeping, laundry, pool chemicals — recurring resupply | Sales, Subscriptions, Inventory |
| **Brand / AI positioning** | AI-enhanced, energy-efficient, sustainable kitchens | (marketing — Website/CRM) |

This is a **discrete + service hybrid**: physical stock, made-to-order stainless fabrication (BoM),
recurring chemical subscriptions, asset rental, and engineer dispatch (field service). That breadth
is the reason for the module set below.

---

## 2. Edition recommendation

**Recommend Odoo 19 Enterprise (Standard tier, on Odoo Online or Odoo.sh).**

Rationale — the following are **Enterprise-only** and central to JR-Tech's model:
- **Subscriptions** (`sale_subscription`) — chemical resupply MRR. No CE equivalent.
- **Field Service** (`industry_fsm`) — engineer dispatch, on-site tasks, worksheets.
- **Rental** (`sale_renting`) availability + Gantt scheduling at scale.
- **MyInvois / Malaysia e-invoicing** (`l10n_my_edi`) — Enterprise-maintained connector for LHDN.
- **Helpdesk**, **Studio** (light customisation without code), **full accounting** (CE `account`
  is invoicing-only; reconciliation/SST returns need Enterprise accounting).
- Better Gantt/dashboards for ops scheduling.

If budget forces Community: drop Subscriptions (model resupply as recurring sale orders via a cron/
OCA `subscription_oca`), use OCA `fieldservice`, OCA `account_*` for SST, and lose MyInvois support.
**For this demo we assume Enterprise.**

---

## 3. Module list & install order

Install in dependency order. Each layer must be installed (and DB updated) before the next.

### Layer 0 — Localization (install FIRST, before any accounting data)
1. `base` (preinstalled)
2. `l10n_my` — Malaysia Chart of Accounts (sets the CoA template; choose at company setup)
3. `l10n_my_account` / `l10n_my_chart` (pulled by l10n_my as needed in v19)
4. `l10n_my_edi` — **MyInvois** (LHDN e-invoicing) connector
5. `l10n_my_hr` / `l10n_my_hr_payroll` — **EPF / SOCSO / EIS / PCB** statutory contributions

### Layer 1 — Core CRM/Sales/Inventory/Purchase
6. `contacts`
7. `crm`
8. `sale_management`
9. `stock` (Inventory)
10. `purchase`
11. `account` + `account_accountant` (Enterprise full accounting)

### Layer 2 — Manufacturing & service operations
12. `mrp` (Manufacturing — BoMs for stainless fabrication)
13. `maintenance` (preventive/corrective on equipment + JR's own assets)
14. `repair` (repair orders for customer equipment)
15. `sale_renting` (Rental — equipment & dishwasher rental contracts)

### Layer 3 — Recurring + project + service desk
16. `sale_subscription` (Subscriptions — chemical resupply)
17. `project` + `hr_timesheet` (consulting projects + timesheets)
18. `industry_fsm` (Field Service — pulls project + brings worksheets)
19. `helpdesk` (support tickets)

### Layer 4 — HR
20. `hr` (Employees + departments)
21. `hr_holidays`, `hr_expense` (optional, recommended)
22. payroll localization already from Layer 0

### Layer 5 — Front-of-house (optional for demo)
23. `website`, `website_sale` (e-commerce of chemicals/accessories), `website_helpdesk`

**Install command pattern (odoo.sh / CLI):**
`-i l10n_my,l10n_my_edi,crm,sale_management,stock,purchase,account_accountant,mrp,maintenance,repair,sale_renting,sale_subscription,project,hr_timesheet,industry_fsm,helpdesk,hr,hr_holidays`

---

## 4. Malaysia localization decisions

### 4.1 Chart of Accounts
- Use **`l10n_my`** template. Functional currency **MYR**. Fiscal year = calendar year (Jan–Dec).
- A localized **subset** is seeded in `../seed/accounts.csv` (codes follow MY 4-digit convention:
  1xxx assets, 2xxx liabilities, 3xxx equity, 4xxx income, 5xxx COGS, 6xxx expenses).

### 4.2 SST (Sales & Service Tax) — the post-GST Malaysian regime
- **Sales Tax** on taxable goods (e.g. equipment, chemicals) — model at **10%** (standard) and
  **5%** (reduced) where applicable.
- **Service Tax** at **8%** on taxable services (consulting, maintenance, repair, field service).
- Seed tax records in `../seed/taxes.csv` (`account.tax`): `SST-S-10`, `SST-S-5`, `SST-SV-8`, plus
  `EXEMPT-0`. Configure tax accounts to SST payable liability accounts.
- Decision: JR-Tech is **SST-registered** (assume registration no. present); set on company.
- Rental: treat rental income as a taxable supply → apply Service Tax 8% (configurable).

### 4.3 MyInvois (LHDN e-invoicing)
- `l10n_my_edi` enabled. Company TIN + SST reg + MSIC code configured on `res.company`.
- Demo MSIC code: **46591** (wholesale of other machinery/equipment) — set realistic value.
- Customer/vendor records carry **TIN** and **business registration (BRN)** in `vat` / dedicated
  l10n_my fields where present. For B2C, classify as "General Public".
- Demo runs in **sandbox/pre-production** MyInvois mode; do NOT submit live in a demo.

### 4.4 Payroll statutory (EPF / SOCSO / EIS / PCB)
- `l10n_my_hr_payroll` provides salary structures with statutory rules:
  - **EPF**: employee 11%, employer 13% (≤RM5,000) / 12% (>RM5,000).
  - **SOCSO**: per wage-ceiling table (employer + employee).
  - **EIS**: 0.2% employee + 0.2% employer.
  - **PCB (MTD)**: monthly tax deduction.
- Employees seeded with salary bands; payroll runs are **out of scope for the demo seed** (structures
  installed, but no payslips generated) — noted as an assumption.

---

## 5. Operational configuration decisions

| Area | Decision |
|------|----------|
| Company | Single company `JR-Tech Solution Sdn Bhd` + 2 internal branches (warehouse/showroom Gelugor; KL service hub) |
| Multi-warehouse | WH/Gelugor (main, stock+fabrication), WH/KL (service van stock) |
| Costing method | Standard cost for catalog; FIFO optionally for chemicals |
| Routes | MTO + Manufacture for fabricated SS items; Buy for traded goods/chemicals |
| Reordering | Reordering rules on fast-moving chemicals & spare parts |
| Numbering | Default sequences; SO `S`, PO `P`, INV per journal |
| Rental | Rental products flagged `rent_ok`; durations day/week/month; deposit + late fee config |
| Subscriptions | Monthly & quarterly chemical plans; auto-invoice + auto-renew |
| Field Service | `industry_fsm` project "JR Field Service"; tasks = dispatch jobs with worksheet |
| Maintenance teams | "Kitchen Equipment", "Dishwashers", "Pool/Grease-trap" |
| Pricing | MYR; price lists: Default, Hotel/Chain (volume), Project |
| CRM | Pipeline stages: New → Qualified → Quotation → Won/Lost; teams = Equipment, Chemicals, Projects |

---

## 6. Environments

| Env | Purpose | Notes |
|-----|---------|-------|
| **DEV** | This seeded demo | Odoo.sh dev branch or local docker; demo data ON in dev only |
| **STAGING** | UAT with JR-Tech users | Anonymised copy of dev; MyInvois sandbox |
| **PROD** | Go-live | Demo data OFF; real master data migrated; MyInvois production creds |

**Demo-data policy:** This seed set is for DEV/STAGING. Never load illustrative customer names or
opening entries into PROD.

---

## 7. Implementation phasing (high level)

1. **Phase 1 — Foundation:** localization, CoA, taxes, company/branches, users, products, partners.
2. **Phase 2 — Trade ops:** Sales, Purchase, Inventory, reordering, price lists.
3. **Phase 3 — Make & service:** Manufacturing/BoMs, Rental, Maintenance, Repair, Field Service.
4. **Phase 4 — Recurring & projects:** Subscriptions, consulting Projects, Helpdesk.
5. **Phase 5 — Finance close loop:** Invoicing, payments, SST mapping, MyInvois sandbox.
6. **Phase 6 — HR/Payroll structures**, dashboards, go-live cutover.

---

## 8. Assumptions

- Enterprise edition assumed (Section 2).
- Headcount, client names, volumes are **realistic SME modelling** per CLIENT_FACTS guidance, not
  real JR-Tech records.
- Payslips/period payroll not generated; only structures installed.
- MyInvois operates in sandbox for the demo.
- Single legal entity; branches modelled as warehouses/operating units, not separate companies.
