/**
 * State-specific data for the /states/<slug> landing pages.
 *
 * Each entry powers a static page with state-targeted copy, plus a
 * Service JSON-LD block that lists the state as the areaServed. That
 * combination is what gets us into the local pack and "medical billing
 * in <state>" search results.
 *
 * Adding a new state: append an entry below and re-run npm run build.
 * The dynamic route at src/pages/states/[slug].astro will pick it up.
 */

export interface StateData {
  /** URL slug, lowercase kebab-case (e.g. "utah", "north-carolina"). */
  slug: string;
  /** Display name (e.g. "Utah"). */
  name: string;
  /** USPS 2-letter code (e.g. "UT"). Used in schema.org addressRegion. */
  abbr: string;
  /** Official Medicaid program brand (e.g. "Medi-Cal" in CA). */
  medicaidProgram: string;
  /**
   * Whether the state runs Medicaid through MCOs (managed-care
   * organizations) for the bulk of beneficiaries. Drives the copy
   * about MCO claims handling.
   */
  managedCareDominant: boolean;
  /** Two-sentence intro emphasizing what's distinctive about billing in this state. */
  intro: string;
  /** Notable payers operating in the state -- shown as a chip row. */
  keyPayers: string[];
  /** A specific regulatory / operational fact about the state worth surfacing. */
  regulatoryNote: string;
}

export const STATES: StateData[] = [
  {
    slug: 'utah',
    name: 'Utah',
    abbr: 'UT',
    medicaidProgram: 'Utah Medicaid',
    managedCareDominant: false,
    intro:
      "CPS is headquartered in Utah and has worked with hospice, home-health, and palliative-care providers across the Wasatch Front and rural Utah for over a decade. We know Utah Medicaid's prior-authorization patterns, the major Utah managed-care plans, and the documentation expectations of the local MAC.",
    keyPayers: ['Utah Medicaid', 'SelectHealth', 'Regence BlueCross', 'University of Utah Health Plans', 'Molina Healthcare of Utah'],
    regulatoryNote: 'Utah hospice agencies must coordinate care with Utah Medicaid Managed Care for dually-eligible beneficiaries; CPS handles the coordination-of-benefits sequencing so claims are not denied as primary-vs-secondary errors.',
  },
  {
    slug: 'texas',
    name: 'Texas',
    abbr: 'TX',
    medicaidProgram: 'Texas Medicaid (STAR / STAR+PLUS / STAR Kids)',
    managedCareDominant: true,
    intro:
      "Texas runs Medicaid almost entirely through managed-care plans (STAR, STAR+PLUS, STAR Kids), which means hospice and home-health agencies juggle a dozen MCO payer rule sets. CPS knows the prior-auth, NOE, and continuity-of-care requirements for the major Texas Medicaid MCOs and the Texas-specific 837I institutional claim wrinkles.",
    keyPayers: ['Texas Medicaid (STAR+PLUS)', 'Amerigroup', 'Molina Healthcare of Texas', 'Superior HealthPlan', 'United Healthcare Community Plan', 'Blue Cross Blue Shield of Texas'],
    regulatoryNote: 'STAR+PLUS hospice elections require coordination between the MCO, the hospice provider, and HHSC; CPS handles the electronic election notice flow and the parallel Medicare hospice claim cycle.',
  },
  {
    slug: 'california',
    name: 'California',
    abbr: 'CA',
    medicaidProgram: 'Medi-Cal',
    managedCareDominant: true,
    intro:
      "California's Medi-Cal program serves over 14 million people across more than two dozen managed-care plans, plus Medi-Cal Long-Term Services and Supports (LTSS) for hospice and home-health. CPS handles the dual-eligible Medicare/Medi-Cal coordination, the Medi-Cal MCO claim formats, and California-specific palliative-care billing under SB 1004.",
    keyPayers: ['Medi-Cal', 'L.A. Care Health Plan', 'Health Net', 'Blue Shield of California', 'Anthem Blue Cross', 'Kaiser Permanente', 'CalOptima'],
    regulatoryNote: 'SB 1004 mandates Medi-Cal managed-care plans offer palliative care; CPS knows the SB 1004 reimbursement methodology and the documentation a palliative provider must capture to be paid.',
  },
  {
    slug: 'florida',
    name: 'Florida',
    abbr: 'FL',
    medicaidProgram: 'Florida Medicaid (Statewide Medicaid Managed Care)',
    managedCareDominant: true,
    intro:
      "Florida has one of the country's largest Medicare populations and runs Medicaid through Statewide Medicaid Managed Care (SMMC). Hospice and home-health agencies serving Florida juggle a high dual-eligible mix, AHCA documentation requirements, and the standard SMMC MCO claim formats.",
    keyPayers: ['Florida Medicaid (SMMC)', 'Humana', 'WellCare', 'Sunshine Health', 'Aetna Better Health of Florida', 'Florida Blue', 'Simply Healthcare'],
    regulatoryNote: 'Florida hospice election notices must be electronically submitted to AHCA within 5 days of admission; late submission triggers a payment reduction CPS prevents through daily NOE batching.',
  },
  {
    slug: 'new-york',
    name: 'New York',
    abbr: 'NY',
    medicaidProgram: 'New York State Medicaid',
    managedCareDominant: true,
    intro:
      "New York's Medicaid program covers over 6 million New Yorkers and includes Managed Long-Term Care (MLTC), which is the primary funding stream for many home-health and hospice cases. CPS handles MLTC plan claim formats, the NYS hospice coverage rules, and the dual-eligible coordination with Medicare.",
    keyPayers: ['NY State Medicaid', 'Healthfirst', 'MetroPlus', 'Fidelis Care', 'EmblemHealth', 'VNS Choice', 'Empire BlueCross BlueShield'],
    regulatoryNote: 'New York hospice and home-health providers must coordinate with MLTC plans for the bulk of the dual-eligible population; CPS sequences MLTC, Medicare, and Medicaid fee-for-service claims so providers see the full reimbursement.',
  },
  {
    slug: 'arizona',
    name: 'Arizona',
    abbr: 'AZ',
    medicaidProgram: 'AHCCCS (Arizona Health Care Cost Containment System)',
    managedCareDominant: true,
    intro:
      "Arizona runs Medicaid through AHCCCS, one of the country's most-integrated managed-care Medicaid programs. Hospice and home-health agencies in Arizona work with the major AHCCCS contractors and a heavy dual-eligible mix. CPS knows the AHCCCS encounter data standards and the long-term care (ALTCS) rules for hospice election.",
    keyPayers: ['AHCCCS', 'Banner-University Family Care', 'Mercy Care', 'United Healthcare Community Plan', 'Arizona Complete Health', 'Blue Cross Blue Shield of Arizona'],
    regulatoryNote: 'AHCCCS ALTCS (Arizona Long Term Care System) members get hospice through their ALTCS plan rather than Medicaid fee-for-service; CPS handles the ALTCS claim flow and the parallel Medicare hospice claim cycle.',
  },
  {
    slug: 'north-carolina',
    name: 'North Carolina',
    abbr: 'NC',
    medicaidProgram: 'NC Medicaid Managed Care',
    managedCareDominant: true,
    intro:
      "North Carolina transitioned Medicaid to managed care in 2021. Hospice and home-health agencies now bill through the NC Medicaid Standard Plans and Tailored Plans, each with their own prior-auth and claim formats. CPS knows the NC Tracks transition wrinkles and the documentation expectations of the major NC MCOs.",
    keyPayers: ['NC Medicaid', 'WellCare of NC', 'Blue Cross NC Healthy Blue', 'AmeriHealth Caritas', 'United Healthcare Community Plan', 'Carolina Complete Health'],
    regulatoryNote: 'NC Medicaid Tailored Plans (for members with serious mental illness, IDD, or TBI) handle hospice differently than Standard Plans; CPS routes claims to the right plan and tracks the carve-out services.',
  },
  {
    slug: 'georgia',
    name: 'Georgia',
    abbr: 'GA',
    medicaidProgram: 'Georgia Medicaid',
    managedCareDominant: true,
    intro:
      "Georgia Medicaid serves over 2 million members, with most of the non-dual population enrolled in Georgia Families managed care. CPS handles the Georgia Families MCO claim formats, the Department of Community Health documentation requirements, and the high dual-eligible mix typical of Georgia hospice agencies.",
    keyPayers: ['Georgia Medicaid', 'Amerigroup', 'CareSource', 'Peach State Health Plan', 'WellCare', 'Anthem BlueCross BlueShield of Georgia'],
    regulatoryNote: 'Georgia hospice agencies must submit elections to the Department of Community Health within 5 days; the DCH portal has narrow file-format requirements that trip up agencies without dedicated billing teams.',
  },
  {
    slug: 'pennsylvania',
    name: 'Pennsylvania',
    abbr: 'PA',
    medicaidProgram: 'Pennsylvania Medical Assistance (HealthChoices / Community HealthChoices)',
    managedCareDominant: true,
    intro:
      "Pennsylvania runs Medicaid through HealthChoices (for the general population) and Community HealthChoices (for dual-eligibles needing long-term services and supports). Hospice and home-health agencies in PA mostly bill through CHC. CPS knows the CHC MCO claim formats, the PROMISe submission rules, and the dual-eligible coordination.",
    keyPayers: ['PA Medical Assistance', 'UPMC for You', 'AmeriHealth Caritas Pennsylvania', 'Keystone First', 'Highmark Wholecare', 'Geisinger Health Plan'],
    regulatoryNote: 'Community HealthChoices participating-provider agreements include specific rate sheets per service line; CPS validates reimbursement against the contracted rates and chases any underpayments.',
  },
  {
    slug: 'illinois',
    name: 'Illinois',
    abbr: 'IL',
    medicaidProgram: 'Illinois Medicaid (HealthChoice Illinois)',
    managedCareDominant: true,
    intro:
      "Illinois delivers Medicaid through HealthChoice Illinois managed-care plans and the Integrated Care Program for dual-eligibles. CPS handles the HealthChoice MCO claim formats and the IMPACT provider enrollment system, plus the Illinois-specific hospice and home-health election requirements.",
    keyPayers: ['Illinois Medicaid', 'Aetna Better Health of Illinois', 'Blue Cross Blue Shield of Illinois', 'CountyCare', 'Meridian Health Plan', 'Molina Healthcare of Illinois'],
    regulatoryNote: 'Illinois hospice agencies bill the Medicare hospice benefit and the Medicaid room-and-board separately for nursing-facility residents; CPS sequences the two claim streams to recover the full reimbursement on dually-eligible cases.',
  },
];
