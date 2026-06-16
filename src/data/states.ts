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
  /**
   * 3-4 state-specific Q&As. Powers the on-page FAQ section and the
   * FAQPage JSON-LD block. Keep answers state-specific (reference the
   * program name, MCOs, or regulatory note) so each set is distinct.
   */
  faqs: { q: string; a: string }[];
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
    faqs: [
      {
        q: 'Does CPS handle Utah Medicaid claims for hospice and home health?',
        a: 'Yes. CPS submits and follows up on Utah Medicaid claims for hospice, home-health, and palliative-care providers, including the coordination-of-benefits sequencing required for dually-eligible Medicare/Medicaid beneficiaries.',
      },
      {
        q: 'How quickly must a Utah hospice submit a Notice of Election?',
        a: 'Medicare requires the hospice Notice of Election (NOE) within 5 calendar days of admission. CPS batches NOEs daily so Utah agencies avoid the payment reductions that follow a late filing.',
      },
      {
        q: 'Which Utah payers does CPS work with?',
        a: 'CPS works with Utah Medicaid, SelectHealth, Regence BlueCross, University of Utah Health Plans, Molina Healthcare of Utah, Medicare, and every commercial carrier a Utah practice contracts with.',
      },
      {
        q: 'How do we get started with CPS in Utah?',
        a: 'Request a free assessment. CPS reviews your current revenue cycle, identifies recoverable revenue, and shows you exactly what a Utah hospice or home-health agency can expect at no cost and no obligation.',
      },
    ],
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
    faqs: [
      {
        q: 'Can CPS bill the Texas Medicaid managed-care plans (STAR+PLUS) for hospice?',
        a: 'Yes. CPS files hospice and home-health claims across the major Texas Medicaid MCOs including Amerigroup, Molina, Superior HealthPlan, and UnitedHealthcare Community Plan, and manages the STAR+PLUS election coordination with HHSC.',
      },
      {
        q: 'How does CPS handle STAR+PLUS hospice elections in Texas?',
        a: 'STAR+PLUS elections require coordination between the MCO, the hospice, and HHSC. CPS runs the electronic election notice flow and the parallel Medicare hospice claim cycle so neither stream stalls.',
      },
      {
        q: 'Does CPS know the Texas 837I institutional claim requirements?',
        a: 'Yes. CPS handles the Texas-specific 837I institutional claim formats, prior-authorization rules, and continuity-of-care requirements that vary across the dozen Texas Medicaid MCO rule sets.',
      },
      {
        q: 'How do Texas agencies start with CPS?',
        a: 'Request a free assessment. CPS reviews your Texas payer mix and current billing operation and shows you the recoverable revenue before you commit to anything.',
      },
    ],
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
    faqs: [
      {
        q: 'Does CPS bill Medi-Cal for hospice and home health in California?',
        a: 'Yes. CPS files Medi-Cal claims across the major managed-care plans including L.A. Care, Health Net, Anthem Blue Cross, Blue Shield of California, and CalOptima, and handles the dual-eligible Medicare/Medi-Cal coordination.',
      },
      {
        q: 'Can CPS bill California palliative care under SB 1004?',
        a: 'Yes. CPS knows the SB 1004 reimbursement methodology that Medi-Cal managed-care plans use for palliative care and captures the documentation a palliative provider needs to be paid.',
      },
      {
        q: 'How does CPS handle Medi-Cal LTSS for hospice patients?',
        a: 'CPS handles the Medi-Cal Long-Term Services and Supports claim formats and sequences them against the Medicare hospice benefit for dually-eligible Californians.',
      },
      {
        q: 'How do California agencies get started?',
        a: 'Request a free assessment. CPS reviews your Medi-Cal and commercial payer mix and shows the revenue a California hospice, home-health, or palliative practice is leaving on the table.',
      },
    ],
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
    faqs: [
      {
        q: 'Does CPS handle Florida Statewide Medicaid Managed Care (SMMC) claims?',
        a: 'Yes. CPS files hospice and home-health claims across the SMMC plans including Humana, Sunshine Health, WellCare, and Aetna Better Health of Florida, plus Florida Blue and Medicare.',
      },
      {
        q: 'How does CPS prevent late Florida hospice election penalties?',
        a: 'Florida election notices must reach AHCA within 5 days of admission. CPS batches them daily so agencies avoid the payment reduction that follows a late filing.',
      },
      {
        q: 'Can CPS manage the high Florida dual-eligible mix?',
        a: 'Yes. Florida has one of the largest Medicare populations in the country. CPS sequences the Medicare and SMMC Medicaid claims so dually-eligible Florida cases pay in full.',
      },
      {
        q: 'How do Florida agencies start with CPS?',
        a: 'Request a free assessment. CPS reviews your AHCA documentation and SMMC payer mix and shows what a Florida agency can recover.',
      },
    ],
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
    faqs: [
      {
        q: 'Does CPS bill New York Managed Long-Term Care (MLTC) plans?',
        a: 'Yes. MLTC is the primary funding stream for many New York home-health and hospice cases. CPS handles the MLTC plan claim formats for Healthfirst, Fidelis Care, VNS Choice, and the other major New York plans.',
      },
      {
        q: 'How does CPS coordinate New York dual-eligible claims?',
        a: 'CPS sequences MLTC, Medicare, and Medicaid fee-for-service claims so New York providers collect the full reimbursement instead of losing it to primary-versus-secondary denials.',
      },
      {
        q: 'Which New York payers does CPS work with?',
        a: 'CPS works with New York State Medicaid, Healthfirst, MetroPlus, Fidelis Care, EmblemHealth, VNS Choice, Empire BlueCross BlueShield, and Medicare.',
      },
      {
        q: 'How do New York agencies get started?',
        a: 'Request a free assessment. CPS reviews your MLTC and Medicare mix and shows the recoverable revenue for a New York agency.',
      },
    ],
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
    faqs: [
      {
        q: 'Does CPS bill AHCCCS for Arizona hospice and home health?',
        a: 'Yes. CPS files claims across the major AHCCCS contractors including Banner-University Family Care, Mercy Care, UnitedHealthcare Community Plan, and Arizona Complete Health, and knows the AHCCCS encounter-data standards.',
      },
      {
        q: 'How does CPS handle Arizona ALTCS hospice elections?',
        a: 'ALTCS members receive hospice through their ALTCS plan rather than Medicaid fee-for-service. CPS handles the ALTCS claim flow alongside the parallel Medicare hospice claim cycle.',
      },
      {
        q: 'Can CPS manage the Arizona dual-eligible mix?',
        a: 'Yes. Arizona agencies see a heavy dual-eligible population. CPS coordinates the AHCCCS and Medicare claim streams so those cases pay correctly.',
      },
      {
        q: 'How do Arizona agencies start with CPS?',
        a: 'Request a free assessment. CPS reviews your AHCCCS payer mix and current billing and shows the recoverable revenue.',
      },
    ],
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
    faqs: [
      {
        q: 'Does CPS handle North Carolina Medicaid managed care?',
        a: 'Yes. North Carolina moved Medicaid to managed care in 2021. CPS bills the NC Medicaid Standard Plans and Tailored Plans including Healthy Blue, WellCare of NC, AmeriHealth Caritas, and Carolina Complete Health.',
      },
      {
        q: 'What is the difference between NC Standard and Tailored Plans for hospice?',
        a: 'Tailored Plans cover members with serious mental illness, IDD, or TBI and handle hospice differently than Standard Plans. CPS routes each claim to the right plan and tracks the carve-out services.',
      },
      {
        q: 'Does CPS know the NC Tracks transition issues?',
        a: 'Yes. CPS knows the NC Tracks transition wrinkles and the documentation each North Carolina MCO expects, so claims clear on the first submission.',
      },
      {
        q: 'How do North Carolina agencies get started?',
        a: 'Request a free assessment. CPS reviews your NC Medicaid and commercial mix and shows the recoverable revenue.',
      },
    ],
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
    faqs: [
      {
        q: 'Does CPS bill Georgia Families managed-care plans?',
        a: 'Yes. CPS files hospice and home-health claims across the Georgia Families MCOs including Amerigroup, CareSource, Peach State Health Plan, and WellCare, plus Anthem BlueCross BlueShield of Georgia and Medicare.',
      },
      {
        q: 'How does CPS handle Georgia DCH hospice elections?',
        a: 'Georgia elections must reach the Department of Community Health within 5 days, and the DCH portal has narrow file-format rules. CPS handles the submission so the filing is accepted the first time.',
      },
      {
        q: 'Can CPS manage Georgia dual-eligible cases?',
        a: 'Yes. Georgia hospice agencies see a high dual-eligible mix. CPS coordinates the Georgia Medicaid and Medicare claim streams so those cases pay in full.',
      },
      {
        q: 'How do Georgia agencies start with CPS?',
        a: 'Request a free assessment. CPS reviews your Georgia Families and commercial mix and shows the recoverable revenue.',
      },
    ],
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
    faqs: [
      {
        q: 'Does CPS bill Pennsylvania Community HealthChoices (CHC)?',
        a: 'Yes. Most Pennsylvania hospice and home-health agencies bill through CHC. CPS handles the CHC MCO claim formats for Keystone First, AmeriHealth Caritas Pennsylvania, UPMC for You, and Highmark Wholecare.',
      },
      {
        q: 'How does CPS handle Pennsylvania PROMISe submissions?',
        a: 'CPS knows the PROMISe submission rules and the HealthChoices and Community HealthChoices claim flows, so Pennsylvania claims clear without rejection.',
      },
      {
        q: 'Does CPS catch Pennsylvania CHC underpayments?',
        a: 'Yes. CHC participating-provider agreements carry specific rate sheets per service line. CPS validates each payment against the contracted rate and chases any underpayment.',
      },
      {
        q: 'How do Pennsylvania agencies get started?',
        a: 'Request a free assessment. CPS reviews your CHC and Medicare mix and shows the recoverable revenue for a Pennsylvania agency.',
      },
    ],
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
    faqs: [
      {
        q: 'Does CPS bill HealthChoice Illinois managed-care plans?',
        a: 'Yes. CPS files hospice and home-health claims across the HealthChoice Illinois plans including Aetna Better Health of Illinois, Blue Cross Blue Shield of Illinois, CountyCare, Meridian, and Molina.',
      },
      {
        q: 'How does CPS handle Illinois nursing-facility hospice billing?',
        a: 'Illinois agencies bill the Medicare hospice benefit and the Medicaid room-and-board separately for nursing-facility residents. CPS sequences the two claim streams so dually-eligible cases pay in full.',
      },
      {
        q: 'Does CPS know the Illinois IMPACT enrollment system?',
        a: 'Yes. CPS handles the IMPACT provider enrollment system and the Illinois-specific hospice and home-health election requirements.',
      },
      {
        q: 'How do Illinois agencies start with CPS?',
        a: 'Request a free assessment. CPS reviews your HealthChoice Illinois and Medicare mix and shows the recoverable revenue.',
      },
    ],
  },
];
