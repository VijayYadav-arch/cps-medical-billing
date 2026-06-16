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
  {
    slug: 'ohio',
    name: 'Ohio',
    abbr: 'OH',
    medicaidProgram: 'Ohio Medicaid (managed care)',
    managedCareDominant: true,
    intro:
      'Ohio delivers Medicaid through a slate of managed-care plans coordinated by the Ohio Department of Medicaid and the Next Generation managed-care model. Hospice and home-health agencies across the state bill the major Ohio MCOs and rely on the centralized provider network management module for claims routing.',
    keyPayers: ['Ohio Medicaid', 'CareSource', 'Buckeye Health Plan', 'Molina Healthcare of Ohio', 'UnitedHealthcare Community Plan', 'Anthem BCBS', 'Medicare'],
    regulatoryNote: 'Ohio routes managed-care claims through a single centralized fiscal intermediary under the Next Generation model; CPS knows the centralized submission flow and sequences the parallel Medicare hospice claim so neither stream stalls.',
    faqs: [
      {
        q: 'Does CPS bill the Ohio Medicaid managed-care plans?',
        a: 'Yes. CPS files hospice and home-health claims across the Ohio MCOs including CareSource, Buckeye Health Plan, Molina, UnitedHealthcare Community Plan, and Anthem BCBS, plus Medicare.',
      },
      {
        q: 'How does CPS handle the Ohio Next Generation centralized claims flow?',
        a: 'Ohio routes managed-care claims through a single centralized fiscal intermediary. CPS knows the centralized submission path and sequences the parallel Medicare hospice cycle so claims clear on the first pass.',
      },
      {
        q: 'Which Ohio payers does CPS work with?',
        a: 'CPS works with Ohio Medicaid, CareSource, Buckeye Health Plan, Molina Healthcare of Ohio, UnitedHealthcare Community Plan, Anthem BCBS, Medicare, and the commercial carriers an Ohio agency contracts with.',
      },
      {
        q: 'How do Ohio agencies get started with CPS?',
        a: 'Request a free assessment. CPS reviews your Ohio managed-care and Medicare mix and shows the recoverable revenue at no cost.',
      },
    ],
  },
  {
    slug: 'michigan',
    name: 'Michigan',
    abbr: 'MI',
    medicaidProgram: 'Michigan Medicaid (Comprehensive Health Care)',
    managedCareDominant: true,
    intro:
      'Michigan runs most of its Medicaid population through the Comprehensive Health Care Program managed-care plans overseen by MDHHS. Hospice and home-health agencies from Detroit to the Upper Peninsula bill a mix of statewide and regional Michigan MCOs, each with distinct prior-authorization patterns.',
    keyPayers: ['Michigan Medicaid', 'Meridian Health Plan', 'Molina Healthcare of Michigan', 'Blue Cross Complete', 'Priority Health', 'McLaren Health Plan', 'Medicare'],
    regulatoryNote: 'Michigan hospice agencies coordinate the Medicare hospice benefit with the Medicaid managed-care plan for dual-eligible members; CPS handles the coordination-of-benefits sequencing so claims are not denied as primary-versus-secondary errors.',
    faqs: [
      {
        q: 'Does CPS bill the Michigan Comprehensive Health Care managed-care plans?',
        a: 'Yes. CPS files hospice and home-health claims across the Michigan MCOs including Meridian, Molina, Blue Cross Complete, Priority Health, and McLaren Health Plan, plus Medicare.',
      },
      {
        q: 'How does CPS coordinate Michigan dual-eligible claims?',
        a: 'CPS sequences the Medicare hospice benefit and the Michigan Medicaid managed-care claim for dual-eligible members so cases pay in full instead of stalling on primary-versus-secondary denials.',
      },
      {
        q: 'Does CPS work with regional Michigan plans like Priority Health and McLaren?',
        a: 'Yes. CPS handles both the statewide and regional Michigan MCOs, including Priority Health and McLaren Health Plan, and knows the prior-authorization patterns each one uses.',
      },
      {
        q: 'How do Michigan agencies start with CPS?',
        a: 'Request a free assessment. CPS reviews your Michigan Medicaid and Medicare mix and shows the recoverable revenue for your agency.',
      },
    ],
  },
  {
    slug: 'new-jersey',
    name: 'New Jersey',
    abbr: 'NJ',
    medicaidProgram: 'NJ FamilyCare',
    managedCareDominant: true,
    intro:
      'New Jersey delivers Medicaid through NJ FamilyCare, with nearly all beneficiaries enrolled in managed-care plans including the long-term services and supports population. Hospice and home-health agencies across the Garden State bill the major NJ FamilyCare MCOs and coordinate the heavy dual-eligible mix typical of the region.',
    keyPayers: ['NJ FamilyCare', 'Horizon NJ Health', 'Amerigroup', 'UnitedHealthcare Community Plan', 'WellCare', 'Aetna', 'Medicare'],
    regulatoryNote: 'NJ FamilyCare folds long-term services and supports into managed-care contracts, so nursing-facility hospice residents are billed through the MCO; CPS sequences the managed-care room-and-board and the Medicare hospice claim accordingly.',
    faqs: [
      {
        q: 'Does CPS bill NJ FamilyCare managed-care plans for hospice?',
        a: 'Yes. CPS files hospice and home-health claims across the NJ FamilyCare MCOs including Horizon NJ Health, Amerigroup, UnitedHealthcare Community Plan, WellCare, and Aetna, plus Medicare.',
      },
      {
        q: 'How does CPS handle New Jersey nursing-facility hospice billing?',
        a: 'NJ FamilyCare folds long-term services and supports into the managed-care contract, so room-and-board for nursing-facility residents is billed through the MCO. CPS sequences that claim against the Medicare hospice benefit.',
      },
      {
        q: 'Can CPS manage the New Jersey dual-eligible mix?',
        a: 'Yes. New Jersey agencies see a heavy dual-eligible population. CPS coordinates the NJ FamilyCare and Medicare claim streams so those cases pay correctly.',
      },
      {
        q: 'How do New Jersey agencies get started?',
        a: 'Request a free assessment. CPS reviews your NJ FamilyCare and Medicare mix and shows the recoverable revenue.',
      },
    ],
  },
  {
    slug: 'virginia',
    name: 'Virginia',
    abbr: 'VA',
    medicaidProgram: 'Cardinal Care',
    managedCareDominant: true,
    intro:
      'Virginia unified its Medicaid programs under the Cardinal Care brand, delivering benefits through managed-care plans across the Commonwealth. Hospice and home-health agencies from Northern Virginia to the rural southwest bill the major Cardinal Care MCOs and manage the long-term care population that shifted into managed care.',
    keyPayers: ['Cardinal Care', 'Anthem HealthKeepers', 'Aetna Better Health', 'Molina Healthcare of Virginia', 'Sentara', 'UnitedHealthcare', 'Medicare'],
    regulatoryNote: 'Cardinal Care consolidated the former Medallion and CCC Plus programs into one managed-care structure; CPS knows the unified Cardinal Care claim routing and the long-term care carve-in for hospice members.',
    faqs: [
      {
        q: 'Does CPS bill Virginia Cardinal Care managed-care plans?',
        a: 'Yes. CPS files hospice and home-health claims across the Cardinal Care MCOs including Anthem HealthKeepers, Aetna Better Health, Molina, Sentara, and UnitedHealthcare, plus Medicare.',
      },
      {
        q: 'What changed when Virginia moved to Cardinal Care?',
        a: 'Cardinal Care consolidated the former Medallion and CCC Plus programs into one managed-care structure. CPS knows the unified claim routing and the long-term care carve-in for hospice members.',
      },
      {
        q: 'Can CPS handle Virginia long-term care hospice cases?',
        a: 'Yes. CPS handles the Cardinal Care long-term care population and sequences the managed-care claim against the Medicare hospice benefit for dual-eligible Virginians.',
      },
      {
        q: 'How do Virginia agencies start with CPS?',
        a: 'Request a free assessment. CPS reviews your Cardinal Care and Medicare mix and shows the recoverable revenue.',
      },
    ],
  },
  {
    slug: 'washington',
    name: 'Washington',
    abbr: 'WA',
    medicaidProgram: 'Apple Health',
    managedCareDominant: true,
    intro:
      'Washington delivers Medicaid through Apple Health, with most beneficiaries enrolled in integrated managed-care plans that combine physical and behavioral health. Hospice and home-health agencies across the state bill the major Apple Health MCOs and work within the regional integrated-care structure the Health Care Authority oversees.',
    keyPayers: ['Apple Health', 'Molina Healthcare of Washington', 'Coordinated Care', 'Community Health Plan of Washington', 'UnitedHealthcare', 'Amerigroup', 'Medicare'],
    regulatoryNote: 'Apple Health integrates physical and behavioral health in its managed-care contracts statewide; CPS routes hospice and home-health claims to the correct integrated plan and sequences the parallel Medicare hospice cycle.',
    faqs: [
      {
        q: 'Does CPS bill Washington Apple Health managed-care plans?',
        a: 'Yes. CPS files hospice and home-health claims across the Apple Health MCOs including Molina, Coordinated Care, Community Health Plan of Washington, UnitedHealthcare, and Amerigroup, plus Medicare.',
      },
      {
        q: 'How does CPS handle the Washington integrated managed-care model?',
        a: 'Apple Health integrates physical and behavioral health statewide. CPS routes each hospice and home-health claim to the correct integrated plan and sequences the parallel Medicare hospice cycle.',
      },
      {
        q: 'Which Washington payers does CPS work with?',
        a: 'CPS works with Apple Health, Molina, Coordinated Care, Community Health Plan of Washington, UnitedHealthcare, Amerigroup, Medicare, and the commercial carriers a Washington agency contracts with.',
      },
      {
        q: 'How do Washington agencies get started?',
        a: 'Request a free assessment. CPS reviews your Apple Health and Medicare mix and shows the recoverable revenue.',
      },
    ],
  },
  {
    slug: 'massachusetts',
    name: 'Massachusetts',
    abbr: 'MA',
    medicaidProgram: 'MassHealth',
    managedCareDominant: true,
    intro:
      'Massachusetts runs Medicaid as MassHealth, delivering most benefits through Accountable Care Organizations and managed-care plans. Hospice and home-health agencies across the Commonwealth bill the major MassHealth ACO partners and coordinate the dual-eligible population served by the One Care and Senior Care Options programs.',
    keyPayers: ['MassHealth', 'Tufts Health Plan', 'WellSense Health Plan', 'Mass General Brigham Health Plan', 'BMC HealthNet Plan', 'Fallon Health', 'Medicare'],
    regulatoryNote: 'MassHealth delivers most members through Accountable Care Organizations with attributed-provider rules; CPS verifies ACO attribution before submission so hospice and home-health claims route to the right risk-bearing entity.',
    faqs: [
      {
        q: 'Does CPS bill MassHealth ACO and managed-care plans?',
        a: 'Yes. CPS files hospice and home-health claims across the MassHealth ACO partners including Tufts Health Plan, WellSense, Mass General Brigham Health Plan, BMC HealthNet Plan, and Fallon Health, plus Medicare.',
      },
      {
        q: 'How does CPS handle MassHealth ACO attribution?',
        a: 'MassHealth delivers most members through Accountable Care Organizations with attributed-provider rules. CPS verifies ACO attribution before submission so claims route to the right risk-bearing entity.',
      },
      {
        q: 'Can CPS coordinate Massachusetts dual-eligible cases?',
        a: 'Yes. CPS coordinates MassHealth and Medicare claims for dual-eligible members served by One Care and Senior Care Options so those cases pay in full.',
      },
      {
        q: 'How do Massachusetts agencies start with CPS?',
        a: 'Request a free assessment. CPS reviews your MassHealth and Medicare mix and shows the recoverable revenue.',
      },
    ],
  },
  {
    slug: 'tennessee',
    name: 'Tennessee',
    abbr: 'TN',
    medicaidProgram: 'TennCare',
    managedCareDominant: true,
    intro:
      'Tennessee delivers Medicaid entirely through TennCare managed-care organizations, one of the longest-running statewide managed-care programs in the country. Hospice and home-health agencies across the state bill the TennCare MCOs and work within the CHOICES long-term services structure for nursing-facility and home-based members.',
    keyPayers: ['TennCare', 'BlueCare (BlueCross BlueShield of Tennessee)', 'Amerigroup', 'UnitedHealthcare Community Plan', 'TennCare Select', 'Medicare'],
    regulatoryNote: 'TennCare delivers long-term services through the CHOICES program inside its MCO contracts; CPS bills the CHOICES room-and-board through the managed-care plan and sequences it against the Medicare hospice benefit.',
    faqs: [
      {
        q: 'Does CPS bill the TennCare managed-care organizations?',
        a: 'Yes. CPS files hospice and home-health claims across the TennCare MCOs including BlueCare, Amerigroup, UnitedHealthcare Community Plan, and TennCare Select, plus Medicare.',
      },
      {
        q: 'How does CPS handle Tennessee CHOICES long-term services billing?',
        a: 'TennCare delivers long-term services through CHOICES inside its MCO contracts. CPS bills the CHOICES room-and-board through the managed-care plan and sequences it against the Medicare hospice benefit.',
      },
      {
        q: 'Which Tennessee payers does CPS work with?',
        a: 'CPS works with TennCare, BlueCare, Amerigroup, UnitedHealthcare Community Plan, TennCare Select, Medicare, and the commercial carriers a Tennessee agency contracts with.',
      },
      {
        q: 'How do Tennessee agencies get started?',
        a: 'Request a free assessment. CPS reviews your TennCare and Medicare mix and shows the recoverable revenue.',
      },
    ],
  },
  {
    slug: 'indiana',
    name: 'Indiana',
    abbr: 'IN',
    medicaidProgram: 'Indiana Health Coverage (Hoosier Care)',
    managedCareDominant: true,
    intro:
      'Indiana delivers Medicaid through the Hoosier Care managed-care programs administered by the Family and Social Services Administration. Hospice and home-health agencies across the state bill the major Indiana MCOs and manage the transition of aged and disabled members into managed long-term services and supports.',
    keyPayers: ['Indiana Medicaid', 'Anthem', 'MDwise', 'Managed Health Services (MHS)', 'CareSource', 'UnitedHealthcare', 'Medicare'],
    regulatoryNote: 'Indiana moved its aged, blind, and disabled population into managed long-term services and supports; CPS knows the Hoosier Care claim routing for that population and sequences the parallel Medicare hospice claim.',
    faqs: [
      {
        q: 'Does CPS bill the Indiana Hoosier Care managed-care plans?',
        a: 'Yes. CPS files hospice and home-health claims across the Indiana MCOs including Anthem, MDwise, MHS, CareSource, and UnitedHealthcare, plus Medicare.',
      },
      {
        q: 'How does CPS handle Indiana managed long-term services and supports?',
        a: 'Indiana moved its aged, blind, and disabled population into managed long-term services. CPS knows the Hoosier Care claim routing for that population and sequences the parallel Medicare hospice claim.',
      },
      {
        q: 'Which Indiana payers does CPS work with?',
        a: 'CPS works with Indiana Medicaid, Anthem, MDwise, MHS, CareSource, UnitedHealthcare, Medicare, and the commercial carriers a Hoosier agency contracts with.',
      },
      {
        q: 'How do Indiana agencies start with CPS?',
        a: 'Request a free assessment. CPS reviews your Hoosier Care and Medicare mix and shows the recoverable revenue.',
      },
    ],
  },
  {
    slug: 'missouri',
    name: 'Missouri',
    abbr: 'MO',
    medicaidProgram: 'MO HealthNet',
    managedCareDominant: true,
    intro:
      'Missouri delivers Medicaid as MO HealthNet, with the managed-care population enrolled in statewide plans and the remainder in fee-for-service. Hospice and home-health agencies across the state bill the MO HealthNet MCOs and a sizable fee-for-service segment for aged and disabled members.',
    keyPayers: ['MO HealthNet', 'Home State Health', 'Healthy Blue', 'UnitedHealthcare Community Plan', 'Medicare'],
    regulatoryNote: 'MO HealthNet keeps many aged and disabled members in fee-for-service while running managed care statewide for others; CPS determines the right billing path per member so claims are not misrouted.',
    faqs: [
      {
        q: 'Does CPS bill MO HealthNet managed-care plans and fee-for-service?',
        a: 'Yes. CPS files hospice and home-health claims across the MO HealthNet MCOs including Home State Health, Healthy Blue, and UnitedHealthcare Community Plan, and handles the fee-for-service segment, plus Medicare.',
      },
      {
        q: 'How does CPS handle the Missouri mix of managed care and fee-for-service?',
        a: 'MO HealthNet keeps many aged and disabled members in fee-for-service while running managed care for others. CPS determines the right billing path per member so claims are not misrouted.',
      },
      {
        q: 'Can CPS coordinate Missouri dual-eligible claims?',
        a: 'Yes. CPS sequences the MO HealthNet and Medicare claim streams for dual-eligible members so those cases pay in full.',
      },
      {
        q: 'How do Missouri agencies get started?',
        a: 'Request a free assessment. CPS reviews your MO HealthNet and Medicare mix and shows the recoverable revenue.',
      },
    ],
  },
  {
    slug: 'maryland',
    name: 'Maryland',
    abbr: 'MD',
    medicaidProgram: 'Maryland Medicaid (HealthChoice)',
    managedCareDominant: true,
    intro:
      'Maryland delivers Medicaid through the HealthChoice managed-care program, the cornerstone of the state unique all-payer hospital rate system. Hospice and home-health agencies across Maryland bill the HealthChoice MCOs while navigating the rate-regulated environment the Health Services Cost Review Commission oversees.',
    keyPayers: ['Maryland Medicaid', 'Priority Partners', 'Amerigroup', 'Maryland Physicians Care', 'CareFirst', 'UnitedHealthcare', 'Medicare'],
    regulatoryNote: 'Maryland operates a federally approved all-payer hospital rate-setting model alongside HealthChoice managed care; CPS knows how the rate-regulated environment affects facility-based hospice and home-health reimbursement.',
    faqs: [
      {
        q: 'Does CPS bill Maryland HealthChoice managed-care plans?',
        a: 'Yes. CPS files hospice and home-health claims across the HealthChoice MCOs including Priority Partners, Amerigroup, Maryland Physicians Care, CareFirst, and UnitedHealthcare, plus Medicare.',
      },
      {
        q: 'How does the Maryland all-payer model affect billing?',
        a: 'Maryland operates a federally approved all-payer hospital rate-setting model alongside HealthChoice. CPS knows how the rate-regulated environment affects facility-based hospice and home-health reimbursement.',
      },
      {
        q: 'Which Maryland payers does CPS work with?',
        a: 'CPS works with Maryland Medicaid, Priority Partners, Amerigroup, Maryland Physicians Care, CareFirst, UnitedHealthcare, Medicare, and the commercial carriers a Maryland agency contracts with.',
      },
      {
        q: 'How do Maryland agencies start with CPS?',
        a: 'Request a free assessment. CPS reviews your HealthChoice and Medicare mix and shows the recoverable revenue.',
      },
    ],
  },
  {
    slug: 'wisconsin',
    name: 'Wisconsin',
    abbr: 'WI',
    medicaidProgram: 'BadgerCare Plus',
    managedCareDominant: true,
    intro:
      'Wisconsin delivers most Medicaid acute care through BadgerCare Plus managed-care plans while running Family Care and IRIS for long-term services. Hospice and home-health agencies across the state bill the BadgerCare Plus HMOs and coordinate the separate long-term-care managed structure for elderly members.',
    keyPayers: ['BadgerCare Plus', 'UnitedHealthcare Community Plan', 'Molina Healthcare of Wisconsin', 'Anthem', 'Quartz', 'Network Health', 'Medicare'],
    regulatoryNote: 'Wisconsin splits acute care (BadgerCare Plus HMOs) from long-term services (Family Care and IRIS); CPS routes hospice and home-health claims to the correct program so they are not denied for wrong-payer submission.',
    faqs: [
      {
        q: 'Does CPS bill Wisconsin BadgerCare Plus HMOs?',
        a: 'Yes. CPS files hospice and home-health claims across the BadgerCare Plus HMOs including UnitedHealthcare Community Plan, Molina, Anthem, Quartz, and Network Health, plus Medicare.',
      },
      {
        q: 'How does CPS handle Wisconsin Family Care and IRIS long-term services?',
        a: 'Wisconsin splits acute care from long-term services run through Family Care and IRIS. CPS routes each hospice and home-health claim to the correct program so it is not denied for wrong-payer submission.',
      },
      {
        q: 'Can CPS coordinate Wisconsin dual-eligible claims?',
        a: 'Yes. CPS sequences the BadgerCare Plus and Medicare claim streams for dual-eligible members so those cases pay in full.',
      },
      {
        q: 'How do Wisconsin agencies get started?',
        a: 'Request a free assessment. CPS reviews your BadgerCare Plus and Medicare mix and shows the recoverable revenue.',
      },
    ],
  },
  {
    slug: 'colorado',
    name: 'Colorado',
    abbr: 'CO',
    medicaidProgram: 'Health First Colorado',
    managedCareDominant: false,
    intro:
      'Colorado runs Medicaid as Health First Colorado on a primarily fee-for-service chassis coordinated through Regional Accountable Entities rather than full-risk MCOs. Hospice and home-health agencies across the state bill Medicaid fee-for-service while working within the Accountable Care Collaborative regional structure.',
    keyPayers: ['Health First Colorado', 'Denver Health', 'Rocky Mountain Health Plans', 'Colorado Access', 'Medicare'],
    regulatoryNote: 'Health First Colorado pays hospice and home health largely through fee-for-service while Regional Accountable Entities coordinate care rather than bear claim risk; CPS bills the fee-for-service claim directly and sequences the Medicare hospice cycle.',
    faqs: [
      {
        q: 'Does CPS bill Health First Colorado for hospice and home health?',
        a: 'Yes. CPS submits and follows up on Health First Colorado fee-for-service claims and coordinates with the Regional Accountable Entities and payers like Denver Health, Rocky Mountain Health Plans, and Colorado Access, plus Medicare.',
      },
      {
        q: 'Is Colorado Medicaid managed care or fee-for-service?',
        a: 'Health First Colorado pays hospice and home health largely through fee-for-service while Regional Accountable Entities coordinate care rather than bear claim risk. CPS bills the fee-for-service claim directly.',
      },
      {
        q: 'Can CPS coordinate Colorado dual-eligible claims?',
        a: 'Yes. CPS sequences the Health First Colorado and Medicare claim streams for dual-eligible members so those cases pay in full.',
      },
      {
        q: 'How do Colorado agencies start with CPS?',
        a: 'Request a free assessment. CPS reviews your Health First Colorado and Medicare mix and shows the recoverable revenue.',
      },
    ],
  },
  {
    slug: 'minnesota',
    name: 'Minnesota',
    abbr: 'MN',
    medicaidProgram: 'Medical Assistance (MA)',
    managedCareDominant: true,
    intro:
      'Minnesota delivers Medicaid as Medical Assistance, largely through nonprofit managed-care plans and the integrated Minnesota Senior Health Options program for dual-eligibles. Hospice and home-health agencies across the state bill the MA health plans and coordinate the strong dual-eligible integration the Department of Human Services oversees.',
    keyPayers: ['Medical Assistance', 'UCare', 'Blue Plus', 'HealthPartners', 'Medica', 'Hennepin Health', 'Medicare'],
    regulatoryNote: 'Minnesota Senior Health Options integrates Medicare and Medical Assistance into one plan for many dual-eligibles; CPS knows the integrated MSHO claim flow so hospice and home-health services are not split-billed incorrectly.',
    faqs: [
      {
        q: 'Does CPS bill the Minnesota Medical Assistance health plans?',
        a: 'Yes. CPS files hospice and home-health claims across the Minnesota MA plans including UCare, Blue Plus, HealthPartners, Medica, and Hennepin Health, plus Medicare.',
      },
      {
        q: 'How does CPS handle Minnesota Senior Health Options integration?',
        a: 'MSHO integrates Medicare and Medical Assistance into one plan for many dual-eligibles. CPS knows the integrated claim flow so hospice and home-health services are not split-billed incorrectly.',
      },
      {
        q: 'Which Minnesota payers does CPS work with?',
        a: 'CPS works with Medical Assistance, UCare, Blue Plus, HealthPartners, Medica, Hennepin Health, Medicare, and the commercial carriers a Minnesota agency contracts with.',
      },
      {
        q: 'How do Minnesota agencies get started?',
        a: 'Request a free assessment. CPS reviews your Medical Assistance and Medicare mix and shows the recoverable revenue.',
      },
    ],
  },
  {
    slug: 'south-carolina',
    name: 'South Carolina',
    abbr: 'SC',
    medicaidProgram: 'Healthy Connections',
    managedCareDominant: true,
    intro:
      'South Carolina delivers Medicaid as Healthy Connections, with most beneficiaries enrolled in managed-care plans overseen by the Department of Health and Human Services. Hospice and home-health agencies across the Palmetto State bill the major Healthy Connections MCOs and coordinate a large rural and dual-eligible population.',
    keyPayers: ['Healthy Connections', 'Select Health (First Choice)', 'Molina Healthcare of South Carolina', 'Humana Healthy Horizons', 'BlueChoice HealthPlan', 'Absolute Total Care', 'Medicare'],
    regulatoryNote: 'South Carolina carves certain services out of its Healthy Connections managed-care contracts to fee-for-service; CPS knows which hospice and home-health services are carved out so each claim routes to the right payer.',
    faqs: [
      {
        q: 'Does CPS bill South Carolina Healthy Connections managed-care plans?',
        a: 'Yes. CPS files hospice and home-health claims across the Healthy Connections MCOs including Select Health (First Choice), Molina, Humana Healthy Horizons, BlueChoice, and Absolute Total Care, plus Medicare.',
      },
      {
        q: 'How does CPS handle South Carolina managed-care carve-outs?',
        a: 'South Carolina carves certain services out of its managed-care contracts to fee-for-service. CPS knows which hospice and home-health services are carved out so each claim routes to the right payer.',
      },
      {
        q: 'Can CPS coordinate South Carolina dual-eligible claims?',
        a: 'Yes. CPS sequences the Healthy Connections and Medicare claim streams for dual-eligible members so those cases pay in full.',
      },
      {
        q: 'How do South Carolina agencies start with CPS?',
        a: 'Request a free assessment. CPS reviews your Healthy Connections and Medicare mix and shows the recoverable revenue.',
      },
    ],
  },
  {
    slug: 'alabama',
    name: 'Alabama',
    abbr: 'AL',
    medicaidProgram: 'Alabama Medicaid',
    managedCareDominant: false,
    intro:
      'Alabama runs Medicaid primarily through fee-for-service rather than full-risk managed care, with care coordination delivered through primary-care case management. Hospice and home-health agencies across the state bill the Alabama Medicaid Agency directly and coordinate with the limited commercial plans operating in the market.',
    keyPayers: ['Alabama Medicaid Agency', 'BlueCross BlueShield of Alabama', 'Viva Health', 'Medicare'],
    regulatoryNote: 'Alabama Medicaid reimburses hospice and home health largely through fee-for-service rather than capitated MCOs; CPS bills the Alabama Medicaid Agency directly and sequences the parallel Medicare hospice claim.',
    faqs: [
      {
        q: 'Does CPS bill Alabama Medicaid for hospice and home health?',
        a: 'Yes. CPS submits and follows up on Alabama Medicaid Agency fee-for-service claims and coordinates with payers like BlueCross BlueShield of Alabama and Viva Health, plus Medicare.',
      },
      {
        q: 'Is Alabama Medicaid managed care or fee-for-service?',
        a: 'Alabama reimburses hospice and home health largely through fee-for-service rather than capitated MCOs. CPS bills the Alabama Medicaid Agency directly and sequences the Medicare hospice claim.',
      },
      {
        q: 'Can CPS coordinate Alabama dual-eligible claims?',
        a: 'Yes. CPS sequences the Alabama Medicaid and Medicare claim streams for dual-eligible members so those cases pay in full.',
      },
      {
        q: 'How do Alabama agencies get started?',
        a: 'Request a free assessment. CPS reviews your Alabama Medicaid and Medicare mix and shows the recoverable revenue.',
      },
    ],
  },
  {
    slug: 'louisiana',
    name: 'Louisiana',
    abbr: 'LA',
    medicaidProgram: 'Healthy Louisiana',
    managedCareDominant: true,
    intro:
      'Louisiana delivers Medicaid through Healthy Louisiana managed-care plans covering the large majority of beneficiaries. Hospice and home-health agencies across the state bill the major Healthy Louisiana MCOs and manage a high dual-eligible and post-expansion population.',
    keyPayers: ['Healthy Louisiana', 'Healthy Blue', 'AmeriHealth Caritas Louisiana', 'Louisiana Healthcare Connections', 'Aetna Better Health', 'UnitedHealthcare', 'Medicare'],
    regulatoryNote: 'Healthy Louisiana requires hospice election information to flow through the managed-care plan for enrolled members; CPS handles the plan-level election notification and sequences the Medicare hospice claim alongside it.',
    faqs: [
      {
        q: 'Does CPS bill Healthy Louisiana managed-care plans?',
        a: 'Yes. CPS files hospice and home-health claims across the Healthy Louisiana MCOs including Healthy Blue, AmeriHealth Caritas Louisiana, Louisiana Healthcare Connections, Aetna Better Health, and UnitedHealthcare, plus Medicare.',
      },
      {
        q: 'How does CPS handle Louisiana hospice elections through the MCO?',
        a: 'Healthy Louisiana requires hospice election information to flow through the managed-care plan for enrolled members. CPS handles the plan-level notification and sequences the Medicare hospice claim alongside it.',
      },
      {
        q: 'Can CPS manage the Louisiana dual-eligible mix?',
        a: 'Yes. CPS coordinates the Healthy Louisiana and Medicare claim streams for dual-eligible members so those cases pay in full.',
      },
      {
        q: 'How do Louisiana agencies start with CPS?',
        a: 'Request a free assessment. CPS reviews your Healthy Louisiana and Medicare mix and shows the recoverable revenue.',
      },
    ],
  },
  {
    slug: 'kentucky',
    name: 'Kentucky',
    abbr: 'KY',
    medicaidProgram: 'Kentucky Medicaid',
    managedCareDominant: true,
    intro:
      'Kentucky delivers Medicaid through managed-care organizations covering nearly all beneficiaries across the Commonwealth. Hospice and home-health agencies from Louisville to Appalachian Kentucky bill the major Kentucky MCOs and manage a heavy dual-eligible and rural population.',
    keyPayers: ['Kentucky Medicaid', 'Passport Health Plan (Molina)', 'Anthem', 'Aetna Better Health', 'Humana CareSource', 'WellCare', 'Medicare'],
    regulatoryNote: 'Kentucky enrolls almost all Medicaid members in managed care, so hospice and home-health claims route through the MCO rather than fee-for-service; CPS confirms plan enrollment before submission to avoid wrong-payer denials.',
    faqs: [
      {
        q: 'Does CPS bill the Kentucky Medicaid managed-care organizations?',
        a: 'Yes. CPS files hospice and home-health claims across the Kentucky MCOs including Passport (Molina), Anthem, Aetna Better Health, Humana CareSource, and WellCare, plus Medicare.',
      },
      {
        q: 'How does CPS confirm the right Kentucky plan for a claim?',
        a: 'Kentucky enrolls almost all members in managed care, so claims route through the MCO. CPS confirms plan enrollment before submission to avoid wrong-payer denials.',
      },
      {
        q: 'Can CPS coordinate Kentucky dual-eligible claims?',
        a: 'Yes. CPS sequences the Kentucky Medicaid and Medicare claim streams for dual-eligible members so those cases pay in full.',
      },
      {
        q: 'How do Kentucky agencies get started?',
        a: 'Request a free assessment. CPS reviews your Kentucky Medicaid and Medicare mix and shows the recoverable revenue.',
      },
    ],
  },
  {
    slug: 'oregon',
    name: 'Oregon',
    abbr: 'OR',
    medicaidProgram: 'Oregon Health Plan',
    managedCareDominant: true,
    intro:
      'Oregon delivers Medicaid as the Oregon Health Plan through regional Coordinated Care Organizations that hold global budgets for physical, behavioral, and dental care. Hospice and home-health agencies across the state bill the local CCO serving their region and work within the global-budget model the Oregon Health Authority oversees.',
    keyPayers: ['Oregon Health Plan', 'CareOregon', 'PacificSource Community Solutions', 'Trillium Community Health Plan', 'Moda Health', 'Health Share of Oregon', 'Medicare'],
    regulatoryNote: 'Oregon Coordinated Care Organizations operate on regional global budgets, so the correct CCO depends on the member home region; CPS routes hospice and home-health claims to the right CCO for that geography.',
    faqs: [
      {
        q: 'Does CPS bill the Oregon Health Plan Coordinated Care Organizations?',
        a: 'Yes. CPS files hospice and home-health claims across the Oregon CCOs including CareOregon, PacificSource Community Solutions, Trillium, Moda Health, and Health Share of Oregon, plus Medicare.',
      },
      {
        q: 'How does CPS handle the Oregon regional CCO model?',
        a: 'Oregon CCOs operate on regional global budgets, so the correct CCO depends on the member home region. CPS routes each hospice and home-health claim to the right CCO for that geography.',
      },
      {
        q: 'Can CPS coordinate Oregon dual-eligible claims?',
        a: 'Yes. CPS sequences the Oregon Health Plan and Medicare claim streams for dual-eligible members so those cases pay in full.',
      },
      {
        q: 'How do Oregon agencies start with CPS?',
        a: 'Request a free assessment. CPS reviews your Oregon Health Plan and Medicare mix and shows the recoverable revenue.',
      },
    ],
  },
  {
    slug: 'oklahoma',
    name: 'Oklahoma',
    abbr: 'OK',
    medicaidProgram: 'SoonerCare',
    managedCareDominant: true,
    intro:
      'Oklahoma delivers Medicaid as SoonerCare and recently launched the SoonerSelect managed-care model for much of its population. Hospice and home-health agencies across the state bill the SoonerSelect contracted plans and navigate the transition from the long-standing fee-for-service program.',
    keyPayers: ['SoonerCare', 'Aetna Better Health of Oklahoma', 'Humana Healthy Horizons', 'Oklahoma Complete Health', 'BlueCross BlueShield of Oklahoma', 'Medicare'],
    regulatoryNote: 'Oklahoma transitioned much of SoonerCare into the SoonerSelect managed-care model, changing where claims route; CPS knows the SoonerSelect plan structure and the residual fee-for-service paths so claims are not misdirected during the transition.',
    faqs: [
      {
        q: 'Does CPS bill the Oklahoma SoonerSelect managed-care plans?',
        a: 'Yes. CPS files hospice and home-health claims across the SoonerSelect plans including Aetna, Humana Healthy Horizons, Oklahoma Complete Health, and BlueCross BlueShield of Oklahoma, plus Medicare.',
      },
      {
        q: 'How does CPS handle the SoonerCare-to-SoonerSelect transition?',
        a: 'Oklahoma moved much of SoonerCare into the SoonerSelect managed-care model, changing where claims route. CPS knows the SoonerSelect structure and the residual fee-for-service paths so claims are not misdirected.',
      },
      {
        q: 'Can CPS coordinate Oklahoma dual-eligible claims?',
        a: 'Yes. CPS sequences the SoonerCare and Medicare claim streams for dual-eligible members so those cases pay in full.',
      },
      {
        q: 'How do Oklahoma agencies get started?',
        a: 'Request a free assessment. CPS reviews your SoonerCare and Medicare mix and shows the recoverable revenue.',
      },
    ],
  },
  {
    slug: 'connecticut',
    name: 'Connecticut',
    abbr: 'CT',
    medicaidProgram: 'HUSKY Health',
    managedCareDominant: false,
    intro:
      'Connecticut delivers Medicaid as HUSKY Health through a self-insured fee-for-service model administered by Administrative Services Organizations rather than full-risk MCOs. Hospice and home-health agencies across the state bill the Connecticut Medical Assistance Program directly while care is coordinated through the ASOs.',
    keyPayers: ['Connecticut Medical Assistance Program', 'HUSKY Health', 'Anthem BCBS', 'ConnectiCare', 'Medicare'],
    regulatoryNote: 'Connecticut runs HUSKY Health as a self-insured fee-for-service program with Administrative Services Organizations handling coordination rather than claim risk; CPS bills the Connecticut Medical Assistance Program directly and sequences the Medicare hospice claim.',
    faqs: [
      {
        q: 'Does CPS bill Connecticut HUSKY Health for hospice and home health?',
        a: 'Yes. CPS submits and follows up on Connecticut Medical Assistance Program fee-for-service claims under HUSKY Health and coordinates with commercial payers like Anthem BCBS and ConnectiCare, plus Medicare.',
      },
      {
        q: 'Is Connecticut Medicaid managed care or fee-for-service?',
        a: 'Connecticut runs HUSKY Health as a self-insured fee-for-service program with Administrative Services Organizations handling coordination rather than claim risk. CPS bills the program directly.',
      },
      {
        q: 'Can CPS coordinate Connecticut dual-eligible claims?',
        a: 'Yes. CPS sequences the HUSKY Health and Medicare claim streams for dual-eligible members so those cases pay in full.',
      },
      {
        q: 'How do Connecticut agencies start with CPS?',
        a: 'Request a free assessment. CPS reviews your HUSKY Health and Medicare mix and shows the recoverable revenue.',
      },
    ],
  },
  {
    slug: 'iowa',
    name: 'Iowa',
    abbr: 'IA',
    medicaidProgram: 'IA Health Link',
    managedCareDominant: true,
    intro:
      'Iowa delivers Medicaid through the IA Health Link managed-care program covering the bulk of beneficiaries, including long-term services and supports. Hospice and home-health agencies across the state bill the IA Health Link MCOs and coordinate the rural-heavy dual-eligible population.',
    keyPayers: ['IA Health Link', 'Amerigroup Iowa', 'Iowa Total Care', 'Molina Healthcare of Iowa', 'Medicare'],
    regulatoryNote: 'IA Health Link folds long-term services and supports into managed care, so nursing-facility hospice room-and-board bills through the MCO; CPS sequences that managed-care claim against the Medicare hospice benefit.',
    faqs: [
      {
        q: 'Does CPS bill the Iowa IA Health Link managed-care plans?',
        a: 'Yes. CPS files hospice and home-health claims across the IA Health Link MCOs including Amerigroup Iowa, Iowa Total Care, and Molina, plus Medicare.',
      },
      {
        q: 'How does CPS handle Iowa nursing-facility hospice billing?',
        a: 'IA Health Link folds long-term services into managed care, so nursing-facility room-and-board bills through the MCO. CPS sequences that claim against the Medicare hospice benefit.',
      },
      {
        q: 'Can CPS coordinate Iowa dual-eligible claims?',
        a: 'Yes. CPS sequences the IA Health Link and Medicare claim streams for dual-eligible members so those cases pay in full.',
      },
      {
        q: 'How do Iowa agencies get started?',
        a: 'Request a free assessment. CPS reviews your IA Health Link and Medicare mix and shows the recoverable revenue.',
      },
    ],
  },
  {
    slug: 'mississippi',
    name: 'Mississippi',
    abbr: 'MS',
    medicaidProgram: 'Mississippi Medicaid (MississippiCAN)',
    managedCareDominant: true,
    intro:
      'Mississippi delivers much of its Medicaid population through the MississippiCAN managed-care program while keeping some services in fee-for-service. Hospice and home-health agencies across the state bill the MississippiCAN MCOs and a residual fee-for-service segment, serving a large rural population.',
    keyPayers: ['Mississippi Medicaid', 'Magnolia Health', 'Molina Healthcare of Mississippi', 'UnitedHealthcare Community Plan', 'Medicare'],
    regulatoryNote: 'Mississippi carves some long-term and institutional services out of MississippiCAN to fee-for-service; CPS knows which hospice and home-health services are carved out so each claim routes to the correct payer.',
    faqs: [
      {
        q: 'Does CPS bill the Mississippi MississippiCAN managed-care plans?',
        a: 'Yes. CPS files hospice and home-health claims across the MississippiCAN MCOs including Magnolia Health, Molina, and UnitedHealthcare Community Plan, plus the fee-for-service segment and Medicare.',
      },
      {
        q: 'How does CPS handle Mississippi managed-care carve-outs?',
        a: 'Mississippi carves some long-term and institutional services out of MississippiCAN to fee-for-service. CPS knows which hospice and home-health services are carved out so each claim routes correctly.',
      },
      {
        q: 'Can CPS coordinate Mississippi dual-eligible claims?',
        a: 'Yes. CPS sequences the Mississippi Medicaid and Medicare claim streams for dual-eligible members so those cases pay in full.',
      },
      {
        q: 'How do Mississippi agencies start with CPS?',
        a: 'Request a free assessment. CPS reviews your MississippiCAN and Medicare mix and shows the recoverable revenue.',
      },
    ],
  },
  {
    slug: 'arkansas',
    name: 'Arkansas',
    abbr: 'AR',
    medicaidProgram: 'Arkansas Medicaid (ARHOME)',
    managedCareDominant: true,
    intro:
      'Arkansas delivers much of its expansion population through ARHOME, which uses qualified health plans to provide Medicaid coverage via the commercial market. Hospice and home-health agencies across the state bill the ARHOME carriers and the traditional Medicaid program depending on member eligibility category.',
    keyPayers: ['Arkansas Medicaid', 'Arkansas Blue Cross Blue Shield', 'Empower Healthcare Solutions', 'Summit Community Care', 'Ambetter', 'Medicare'],
    regulatoryNote: 'ARHOME covers the expansion population through qualified health plans on the commercial market rather than traditional Medicaid MCOs; CPS determines whether a member is ARHOME or traditional Medicaid so claims route to the right carrier.',
    faqs: [
      {
        q: 'Does CPS bill Arkansas ARHOME qualified health plans?',
        a: 'Yes. CPS files hospice and home-health claims across the ARHOME carriers including Arkansas Blue Cross, Empower, Summit, and Ambetter, plus traditional Arkansas Medicaid and Medicare.',
      },
      {
        q: 'How does CPS handle the Arkansas ARHOME model?',
        a: 'ARHOME covers the expansion population through qualified health plans on the commercial market rather than traditional MCOs. CPS determines whether a member is ARHOME or traditional Medicaid so claims route to the right carrier.',
      },
      {
        q: 'Can CPS coordinate Arkansas dual-eligible claims?',
        a: 'Yes. CPS sequences the Arkansas Medicaid and Medicare claim streams for dual-eligible members so those cases pay in full.',
      },
      {
        q: 'How do Arkansas agencies get started?',
        a: 'Request a free assessment. CPS reviews your ARHOME and Medicare mix and shows the recoverable revenue.',
      },
    ],
  },
  {
    slug: 'kansas',
    name: 'Kansas',
    abbr: 'KS',
    medicaidProgram: 'KanCare',
    managedCareDominant: true,
    intro:
      'Kansas delivers Medicaid entirely through the KanCare managed-care program, which covers physical health, behavioral health, and long-term services in one structure. Hospice and home-health agencies across the state bill the KanCare MCOs and coordinate the integrated long-term-care population.',
    keyPayers: ['KanCare', 'Sunflower Health Plan', 'Aetna Better Health of Kansas', 'UnitedHealthcare Community Plan', 'Healthy Blue', 'Medicare'],
    regulatoryNote: 'KanCare integrates long-term services and supports into its managed-care contracts statewide, so nursing-facility hospice room-and-board bills through the MCO; CPS sequences it against the Medicare hospice benefit.',
    faqs: [
      {
        q: 'Does CPS bill the Kansas KanCare managed-care plans?',
        a: 'Yes. CPS files hospice and home-health claims across the KanCare MCOs including Sunflower Health Plan, Aetna Better Health, UnitedHealthcare Community Plan, and Healthy Blue, plus Medicare.',
      },
      {
        q: 'How does CPS handle Kansas long-term services billing?',
        a: 'KanCare integrates long-term services into its managed-care contracts statewide, so nursing-facility room-and-board bills through the MCO. CPS sequences it against the Medicare hospice benefit.',
      },
      {
        q: 'Can CPS coordinate Kansas dual-eligible claims?',
        a: 'Yes. CPS sequences the KanCare and Medicare claim streams for dual-eligible members so those cases pay in full.',
      },
      {
        q: 'How do Kansas agencies start with CPS?',
        a: 'Request a free assessment. CPS reviews your KanCare and Medicare mix and shows the recoverable revenue.',
      },
    ],
  },
  {
    slug: 'nevada',
    name: 'Nevada',
    abbr: 'NV',
    medicaidProgram: 'Nevada Medicaid (Nevada Check Up)',
    managedCareDominant: true,
    intro:
      'Nevada delivers Medicaid through managed-care plans concentrated in the urban Clark and Washoe county areas, with fee-for-service in rural counties. Hospice and home-health agencies across the state bill the Nevada Medicaid MCOs in the urban corridors and fee-for-service in the rural frontier.',
    keyPayers: ['Nevada Medicaid', 'Anthem', 'Health Plan of Nevada', 'SilverSummit Healthplan', 'Molina Healthcare of Nevada', 'Medicare'],
    regulatoryNote: 'Nevada uses managed care in its urban counties while reimbursing rural-county services through fee-for-service; CPS determines the member county to route hospice and home-health claims to the correct payer.',
    faqs: [
      {
        q: 'Does CPS bill the Nevada Medicaid managed-care plans?',
        a: 'Yes. CPS files hospice and home-health claims across the Nevada Medicaid MCOs including Anthem, Health Plan of Nevada, SilverSummit, and Molina, plus fee-for-service and Medicare.',
      },
      {
        q: 'How does CPS handle the Nevada urban-rural billing split?',
        a: 'Nevada uses managed care in its urban counties while reimbursing rural-county services through fee-for-service. CPS determines the member county to route each claim to the correct payer.',
      },
      {
        q: 'Can CPS coordinate Nevada dual-eligible claims?',
        a: 'Yes. CPS sequences the Nevada Medicaid and Medicare claim streams for dual-eligible members so those cases pay in full.',
      },
      {
        q: 'How do Nevada agencies get started?',
        a: 'Request a free assessment. CPS reviews your Nevada Medicaid and Medicare mix and shows the recoverable revenue.',
      },
    ],
  },
  {
    slug: 'new-mexico',
    name: 'New Mexico',
    abbr: 'NM',
    medicaidProgram: 'Turquoise Care',
    managedCareDominant: true,
    intro:
      'New Mexico delivers Medicaid through the Turquoise Care managed-care program, the successor to Centennial Care, covering physical, behavioral, and long-term care. Hospice and home-health agencies across the state bill the Turquoise Care MCOs and serve a large rural, tribal, and dual-eligible population.',
    keyPayers: ['Turquoise Care', 'Presbyterian Health Plan', 'BlueCross BlueShield of New Mexico', 'Molina Healthcare of New Mexico', 'UnitedHealthcare Community Plan', 'Medicare'],
    regulatoryNote: 'Turquoise Care integrates long-term services and supports for the elderly and disabled into its managed-care contracts; CPS handles the nursing-facility hospice room-and-board through the MCO and sequences the Medicare hospice claim.',
    faqs: [
      {
        q: 'Does CPS bill the New Mexico Turquoise Care managed-care plans?',
        a: 'Yes. CPS files hospice and home-health claims across the Turquoise Care MCOs including Presbyterian, BCBS of New Mexico, Molina, and UnitedHealthcare Community Plan, plus Medicare.',
      },
      {
        q: 'What is Turquoise Care in New Mexico?',
        a: 'Turquoise Care is the successor to Centennial Care, integrating physical, behavioral, and long-term care into managed-care contracts. CPS knows the Turquoise Care claim routing for hospice and home health.',
      },
      {
        q: 'Can CPS coordinate New Mexico dual-eligible claims?',
        a: 'Yes. CPS sequences the Turquoise Care and Medicare claim streams for dual-eligible members so those cases pay in full.',
      },
      {
        q: 'How do New Mexico agencies start with CPS?',
        a: 'Request a free assessment. CPS reviews your Turquoise Care and Medicare mix and shows the recoverable revenue.',
      },
    ],
  },
  {
    slug: 'nebraska',
    name: 'Nebraska',
    abbr: 'NE',
    medicaidProgram: 'Heritage Health',
    managedCareDominant: true,
    intro:
      'Nebraska delivers Medicaid through the Heritage Health managed-care program, which integrates physical health, behavioral health, and pharmacy. Hospice and home-health agencies across the state bill the Heritage Health MCOs and coordinate the rural-heavy population served from the Panhandle to the eastern cities.',
    keyPayers: ['Heritage Health', 'Nebraska Total Care', 'Healthy Blue', 'UnitedHealthcare Community Plan', 'Molina Healthcare of Nebraska', 'Medicare'],
    regulatoryNote: 'Heritage Health combines physical, behavioral, and pharmacy benefits in one managed-care contract statewide; CPS routes hospice and home-health claims to the enrolled Heritage Health plan and sequences the Medicare hospice cycle.',
    faqs: [
      {
        q: 'Does CPS bill the Nebraska Heritage Health managed-care plans?',
        a: 'Yes. CPS files hospice and home-health claims across the Heritage Health MCOs including Nebraska Total Care, Healthy Blue, UnitedHealthcare Community Plan, and Molina, plus Medicare.',
      },
      {
        q: 'What is Heritage Health in Nebraska?',
        a: 'Heritage Health is the statewide managed-care program combining physical, behavioral, and pharmacy benefits in one contract. CPS routes hospice and home-health claims to the enrolled Heritage Health plan.',
      },
      {
        q: 'Can CPS coordinate Nebraska dual-eligible claims?',
        a: 'Yes. CPS sequences the Heritage Health and Medicare claim streams for dual-eligible members so those cases pay in full.',
      },
      {
        q: 'How do Nebraska agencies get started?',
        a: 'Request a free assessment. CPS reviews your Heritage Health and Medicare mix and shows the recoverable revenue.',
      },
    ],
  },
  {
    slug: 'west-virginia',
    name: 'West Virginia',
    abbr: 'WV',
    medicaidProgram: 'WV Medicaid (Mountain Health Trust)',
    managedCareDominant: true,
    intro:
      'West Virginia delivers most of its Medicaid population through the Mountain Health Trust managed-care program. Hospice and home-health agencies across the Mountain State bill the Mountain Health Trust MCOs and serve a heavily rural, aging, and dual-eligible population.',
    keyPayers: ['WV Medicaid', 'The Health Plan', 'UniCare Health Plan of West Virginia', 'Aetna Better Health', 'Medicare'],
    regulatoryNote: 'Mountain Health Trust enrolls most West Virginia Medicaid members in managed care while some long-term services remain fee-for-service; CPS confirms the billing path so hospice and home-health claims route to the correct payer.',
    faqs: [
      {
        q: 'Does CPS bill the West Virginia Mountain Health Trust plans?',
        a: 'Yes. CPS files hospice and home-health claims across the Mountain Health Trust MCOs including The Health Plan, UniCare, and Aetna Better Health, plus Medicare.',
      },
      {
        q: 'How does CPS handle the West Virginia billing path?',
        a: 'Mountain Health Trust enrolls most members in managed care while some long-term services stay fee-for-service. CPS confirms the billing path so each claim routes to the correct payer.',
      },
      {
        q: 'Can CPS coordinate West Virginia dual-eligible claims?',
        a: 'Yes. CPS sequences the WV Medicaid and Medicare claim streams for dual-eligible members so those cases pay in full.',
      },
      {
        q: 'How do West Virginia agencies start with CPS?',
        a: 'Request a free assessment. CPS reviews your Mountain Health Trust and Medicare mix and shows the recoverable revenue.',
      },
    ],
  },
  {
    slug: 'idaho',
    name: 'Idaho',
    abbr: 'ID',
    medicaidProgram: 'Idaho Medicaid',
    managedCareDominant: false,
    intro:
      'Idaho runs Medicaid largely through fee-for-service and managed-care entities limited to specific populations such as dual-eligibles, rather than statewide full-risk MCOs. Hospice and home-health agencies across the state bill the Idaho Department of Health and Welfare directly for most members.',
    keyPayers: ['Idaho Department of Health and Welfare', 'Blue Cross of Idaho', 'PacificSource', 'Medicare'],
    regulatoryNote: 'Idaho reimburses most hospice and home-health services through Medicaid fee-for-service while a managed-care plan serves dual-eligibles; CPS bills the Department of Health and Welfare directly and sequences the Medicare hospice claim.',
    faqs: [
      {
        q: 'Does CPS bill Idaho Medicaid for hospice and home health?',
        a: 'Yes. CPS submits and follows up on Idaho Department of Health and Welfare fee-for-service claims and coordinates with payers like Blue Cross of Idaho and PacificSource, plus Medicare.',
      },
      {
        q: 'Is Idaho Medicaid managed care or fee-for-service?',
        a: 'Idaho reimburses most hospice and home-health services through fee-for-service while a managed-care plan serves dual-eligibles. CPS bills the Department of Health and Welfare directly.',
      },
      {
        q: 'Can CPS coordinate Idaho dual-eligible claims?',
        a: 'Yes. CPS sequences the Idaho Medicaid and Medicare claim streams for dual-eligible members so those cases pay in full.',
      },
      {
        q: 'How do Idaho agencies get started?',
        a: 'Request a free assessment. CPS reviews your Idaho Medicaid and Medicare mix and shows the recoverable revenue.',
      },
    ],
  },
  {
    slug: 'hawaii',
    name: 'Hawaii',
    abbr: 'HI',
    medicaidProgram: 'Med-QUEST',
    managedCareDominant: true,
    intro:
      'Hawaii delivers Medicaid through the Med-QUEST Integration program, with all islands served by managed-care plans that combine acute and long-term care. Hospice and home-health agencies across the islands bill the Med-QUEST health plans and navigate the inter-island access and rural challenges unique to the state.',
    keyPayers: ['Med-QUEST', 'HMSA', 'Kaiser Permanente', 'AlohaCare', 'UnitedHealthcare Community Plan', 'Ohana Health Plan', 'Medicare'],
    regulatoryNote: 'Med-QUEST Integration combines acute and long-term care in its managed-care contracts across all islands; CPS routes hospice and home-health claims to the enrolled Med-QUEST plan and sequences the Medicare hospice cycle.',
    faqs: [
      {
        q: 'Does CPS bill the Hawaii Med-QUEST managed-care plans?',
        a: 'Yes. CPS files hospice and home-health claims across the Med-QUEST plans including HMSA, Kaiser Permanente, AlohaCare, UnitedHealthcare Community Plan, and Ohana Health Plan, plus Medicare.',
      },
      {
        q: 'What is Med-QUEST in Hawaii?',
        a: 'Med-QUEST Integration is the statewide managed-care program combining acute and long-term care across all islands. CPS routes hospice and home-health claims to the enrolled Med-QUEST plan.',
      },
      {
        q: 'Can CPS coordinate Hawaii dual-eligible claims?',
        a: 'Yes. CPS sequences the Med-QUEST and Medicare claim streams for dual-eligible members so those cases pay in full.',
      },
      {
        q: 'How do Hawaii agencies get started?',
        a: 'Request a free assessment. CPS reviews your Med-QUEST and Medicare mix and shows the recoverable revenue.',
      },
    ],
  },
  {
    slug: 'maine',
    name: 'Maine',
    abbr: 'ME',
    medicaidProgram: 'MaineCare',
    managedCareDominant: false,
    intro:
      'Maine delivers Medicaid as MaineCare on a fee-for-service chassis rather than full-risk managed care, with care coordination through accountable communities and health homes. Hospice and home-health agencies across the state bill MaineCare directly through the Department of Health and Human Services.',
    keyPayers: ['MaineCare (DHHS)', 'Anthem', 'Community Health Options', 'Medicare'],
    regulatoryNote: 'MaineCare reimburses hospice and home health through fee-for-service while accountable communities coordinate care rather than bear claim risk; CPS bills DHHS directly and sequences the Medicare hospice claim.',
    faqs: [
      {
        q: 'Does CPS bill MaineCare for hospice and home health?',
        a: 'Yes. CPS submits and follows up on MaineCare fee-for-service claims through DHHS and coordinates with commercial payers like Anthem and Community Health Options, plus Medicare.',
      },
      {
        q: 'Is MaineCare managed care or fee-for-service?',
        a: 'MaineCare reimburses hospice and home health through fee-for-service while accountable communities coordinate care rather than bear claim risk. CPS bills DHHS directly.',
      },
      {
        q: 'Can CPS coordinate Maine dual-eligible claims?',
        a: 'Yes. CPS sequences the MaineCare and Medicare claim streams for dual-eligible members so those cases pay in full.',
      },
      {
        q: 'How do Maine agencies get started?',
        a: 'Request a free assessment. CPS reviews your MaineCare and Medicare mix and shows the recoverable revenue.',
      },
    ],
  },
  {
    slug: 'new-hampshire',
    name: 'New Hampshire',
    abbr: 'NH',
    medicaidProgram: 'NH Medicaid Care Management',
    managedCareDominant: true,
    intro:
      'New Hampshire delivers Medicaid through the Medicaid Care Management managed-care program covering the bulk of beneficiaries. Hospice and home-health agencies across the state bill the NH Medicaid Care Management MCOs and coordinate the long-term-care population transitioning into managed care.',
    keyPayers: ['NH Medicaid', 'AmeriHealth Caritas New Hampshire', 'NH Healthy Families', 'WellSense Health Plan', 'Medicare'],
    regulatoryNote: 'New Hampshire has been phasing long-term services and supports into Medicaid Care Management; CPS confirms whether a member long-term services bill through the MCO or remain fee-for-service so claims route correctly.',
    faqs: [
      {
        q: 'Does CPS bill the New Hampshire Medicaid Care Management plans?',
        a: 'Yes. CPS files hospice and home-health claims across the NH Medicaid Care Management MCOs including AmeriHealth Caritas New Hampshire, NH Healthy Families, and WellSense, plus Medicare.',
      },
      {
        q: 'How does CPS handle New Hampshire long-term services billing?',
        a: 'New Hampshire has been phasing long-term services into Medicaid Care Management. CPS confirms whether a member long-term services bill through the MCO or remain fee-for-service so claims route correctly.',
      },
      {
        q: 'Can CPS coordinate New Hampshire dual-eligible claims?',
        a: 'Yes. CPS sequences the NH Medicaid and Medicare claim streams for dual-eligible members so those cases pay in full.',
      },
      {
        q: 'How do New Hampshire agencies get started?',
        a: 'Request a free assessment. CPS reviews your NH Medicaid and Medicare mix and shows the recoverable revenue.',
      },
    ],
  },
  {
    slug: 'montana',
    name: 'Montana',
    abbr: 'MT',
    medicaidProgram: 'Montana Medicaid (Healthy Montana Kids)',
    managedCareDominant: false,
    intro:
      'Montana runs Medicaid primarily through fee-for-service across its vast rural geography, with managed care limited rather than statewide full-risk. Hospice and home-health agencies serving the state bill the Montana Department of Public Health and Human Services directly for most members.',
    keyPayers: ['Montana DPHHS', 'BlueCross BlueShield of Montana', 'PacificSource', 'Medicare'],
    regulatoryNote: 'Montana reimburses hospice and home health largely through fee-for-service given its rural geography and frontier access designations; CPS bills DPHHS directly and sequences the parallel Medicare hospice claim.',
    faqs: [
      {
        q: 'Does CPS bill Montana Medicaid for hospice and home health?',
        a: 'Yes. CPS submits and follows up on Montana DPHHS fee-for-service claims and coordinates with commercial payers like BlueCross BlueShield of Montana and PacificSource, plus Medicare.',
      },
      {
        q: 'Is Montana Medicaid managed care or fee-for-service?',
        a: 'Montana reimburses hospice and home health largely through fee-for-service given its rural geography and frontier designations. CPS bills DPHHS directly.',
      },
      {
        q: 'Can CPS coordinate Montana dual-eligible claims?',
        a: 'Yes. CPS sequences the Montana Medicaid and Medicare claim streams for dual-eligible members so those cases pay in full.',
      },
      {
        q: 'How do Montana agencies get started?',
        a: 'Request a free assessment. CPS reviews your Montana Medicaid and Medicare mix and shows the recoverable revenue.',
      },
    ],
  },
  {
    slug: 'rhode-island',
    name: 'Rhode Island',
    abbr: 'RI',
    medicaidProgram: 'RIte Care',
    managedCareDominant: true,
    intro:
      'Rhode Island delivers Medicaid through the RIte Care managed-care program along with integrated options for dual-eligibles in its compact, densely served geography. Hospice and home-health agencies across the state bill the RIte Care MCOs and coordinate the integrated-care population.',
    keyPayers: ['RIte Care', 'Neighborhood Health Plan of Rhode Island', 'UnitedHealthcare Community Plan', 'Tufts Health Plan', 'Medicare'],
    regulatoryNote: 'Rhode Island operates an integrated-care initiative aligning Medicare and Medicaid for dual-eligibles alongside RIte Care; CPS knows the integrated claim flow so hospice and home-health services are sequenced correctly.',
    faqs: [
      {
        q: 'Does CPS bill the Rhode Island RIte Care managed-care plans?',
        a: 'Yes. CPS files hospice and home-health claims across the RIte Care MCOs including Neighborhood Health Plan of Rhode Island, UnitedHealthcare Community Plan, and Tufts Health Plan, plus Medicare.',
      },
      {
        q: 'How does CPS handle Rhode Island integrated dual-eligible care?',
        a: 'Rhode Island aligns Medicare and Medicaid for dual-eligibles alongside RIte Care. CPS knows the integrated claim flow so hospice and home-health services are sequenced correctly.',
      },
      {
        q: 'Which Rhode Island payers does CPS work with?',
        a: 'CPS works with RIte Care, Neighborhood Health Plan of Rhode Island, UnitedHealthcare Community Plan, Tufts Health Plan, Medicare, and the commercial carriers a Rhode Island agency contracts with.',
      },
      {
        q: 'How do Rhode Island agencies get started?',
        a: 'Request a free assessment. CPS reviews your RIte Care and Medicare mix and shows the recoverable revenue.',
      },
    ],
  },
  {
    slug: 'delaware',
    name: 'Delaware',
    abbr: 'DE',
    medicaidProgram: 'Delaware Medicaid (Diamond State Health Plan)',
    managedCareDominant: true,
    intro:
      'Delaware delivers Medicaid through the Diamond State Health Plan managed-care program, including the Diamond State Health Plan Plus for long-term services. Hospice and home-health agencies across the state bill the two contracted MCOs and coordinate the long-term-care population served through the Plus program.',
    keyPayers: ['Delaware Medicaid', 'Highmark Health Options', 'AmeriHealth Caritas Delaware', 'Medicare'],
    regulatoryNote: 'Delaware folds long-term services into the Diamond State Health Plan Plus managed-care contract, so nursing-facility hospice room-and-board bills through the MCO; CPS sequences it against the Medicare hospice benefit.',
    faqs: [
      {
        q: 'Does CPS bill the Delaware Diamond State Health Plan?',
        a: 'Yes. CPS files hospice and home-health claims across the Delaware MCOs including Highmark Health Options and AmeriHealth Caritas Delaware, plus Medicare.',
      },
      {
        q: 'How does CPS handle Delaware long-term services billing?',
        a: 'Delaware folds long-term services into the Diamond State Health Plan Plus contract, so nursing-facility room-and-board bills through the MCO. CPS sequences it against the Medicare hospice benefit.',
      },
      {
        q: 'Can CPS coordinate Delaware dual-eligible claims?',
        a: 'Yes. CPS sequences the Delaware Medicaid and Medicare claim streams for dual-eligible members so those cases pay in full.',
      },
      {
        q: 'How do Delaware agencies get started?',
        a: 'Request a free assessment. CPS reviews your Diamond State Health Plan and Medicare mix and shows the recoverable revenue.',
      },
    ],
  },
  {
    slug: 'south-dakota',
    name: 'South Dakota',
    abbr: 'SD',
    medicaidProgram: 'South Dakota Medicaid',
    managedCareDominant: false,
    intro:
      'South Dakota runs Medicaid primarily through fee-for-service across its rural geography, using primary-care case management rather than full-risk MCOs. Hospice and home-health agencies serving the state bill the South Dakota Department of Social Services directly for most members.',
    keyPayers: ['SD Department of Social Services', 'Avera Health Plans', 'Sanford Health Plan', 'Medicare'],
    regulatoryNote: 'South Dakota reimburses hospice and home health through fee-for-service with primary-care case management rather than capitated MCOs; CPS bills the Department of Social Services directly and sequences the Medicare hospice claim.',
    faqs: [
      {
        q: 'Does CPS bill South Dakota Medicaid for hospice and home health?',
        a: 'Yes. CPS submits and follows up on South Dakota Department of Social Services fee-for-service claims and coordinates with payers like Avera Health Plans and Sanford Health Plan, plus Medicare.',
      },
      {
        q: 'Is South Dakota Medicaid managed care or fee-for-service?',
        a: 'South Dakota reimburses hospice and home health through fee-for-service with primary-care case management rather than capitated MCOs. CPS bills the Department of Social Services directly.',
      },
      {
        q: 'Can CPS coordinate South Dakota dual-eligible claims?',
        a: 'Yes. CPS sequences the South Dakota Medicaid and Medicare claim streams for dual-eligible members so those cases pay in full.',
      },
      {
        q: 'How do South Dakota agencies get started?',
        a: 'Request a free assessment. CPS reviews your South Dakota Medicaid and Medicare mix and shows the recoverable revenue.',
      },
    ],
  },
  {
    slug: 'north-dakota',
    name: 'North Dakota',
    abbr: 'ND',
    medicaidProgram: 'North Dakota Medicaid',
    managedCareDominant: false,
    intro:
      'North Dakota runs Medicaid largely through fee-for-service with a managed-care expansion plan for a portion of the population. Hospice and home-health agencies serving the state bill the North Dakota Department of Health and Human Services directly for most members.',
    keyPayers: ['ND DHHS', 'Blue Cross Blue Shield of North Dakota', 'Sanford Health Plan', 'Medicare'],
    regulatoryNote: 'North Dakota reimburses traditional Medicaid hospice and home health through fee-for-service while a managed-care plan covers the expansion population; CPS determines the member category so claims route to the right payer.',
    faqs: [
      {
        q: 'Does CPS bill North Dakota Medicaid for hospice and home health?',
        a: 'Yes. CPS submits and follows up on North Dakota DHHS fee-for-service claims and coordinates with payers like Blue Cross Blue Shield of North Dakota and Sanford Health Plan, plus Medicare.',
      },
      {
        q: 'Is North Dakota Medicaid managed care or fee-for-service?',
        a: 'North Dakota reimburses traditional Medicaid through fee-for-service while a managed-care plan covers the expansion population. CPS determines the member category so claims route to the right payer.',
      },
      {
        q: 'Can CPS coordinate North Dakota dual-eligible claims?',
        a: 'Yes. CPS sequences the North Dakota Medicaid and Medicare claim streams for dual-eligible members so those cases pay in full.',
      },
      {
        q: 'How do North Dakota agencies get started?',
        a: 'Request a free assessment. CPS reviews your North Dakota Medicaid and Medicare mix and shows the recoverable revenue.',
      },
    ],
  },
  {
    slug: 'alaska',
    name: 'Alaska',
    abbr: 'AK',
    medicaidProgram: 'Alaska Medicaid (DenaliCare)',
    managedCareDominant: false,
    intro:
      'Alaska runs Medicaid through fee-for-service across an enormous and remote geography rather than full-risk managed care. Hospice and home-health agencies serving the state bill the Alaska Department of Health directly and navigate the travel, telehealth, and access challenges unique to the frontier.',
    keyPayers: ['Alaska DHSS', 'Premera Blue Cross', 'Moda Health', 'Medicare'],
    regulatoryNote: 'Alaska reimburses hospice and home health through Medicaid fee-for-service given its vast and remote geography, with travel and telehealth provisions; CPS bills the Department of Health directly and sequences the Medicare hospice claim.',
    faqs: [
      {
        q: 'Does CPS bill Alaska Medicaid for hospice and home health?',
        a: 'Yes. CPS submits and follows up on Alaska Department of Health fee-for-service claims and coordinates with payers like Premera Blue Cross and Moda Health, plus Medicare.',
      },
      {
        q: 'Is Alaska Medicaid managed care or fee-for-service?',
        a: 'Alaska reimburses hospice and home health through fee-for-service given its vast and remote geography. CPS bills the Department of Health directly and handles the travel and telehealth provisions.',
      },
      {
        q: 'Can CPS coordinate Alaska dual-eligible claims?',
        a: 'Yes. CPS sequences the Alaska Medicaid and Medicare claim streams for dual-eligible members so those cases pay in full.',
      },
      {
        q: 'How do Alaska agencies get started?',
        a: 'Request a free assessment. CPS reviews your Alaska Medicaid and Medicare mix and shows the recoverable revenue.',
      },
    ],
  },
  {
    slug: 'vermont',
    name: 'Vermont',
    abbr: 'VT',
    medicaidProgram: 'Green Mountain Care',
    managedCareDominant: false,
    intro:
      'Vermont delivers Medicaid as Green Mountain Care through a public managed-care model run by the state rather than commercial full-risk MCOs. Hospice and home-health agencies across the state bill the Department of Vermont Health Access directly while care is coordinated through the all-payer accountable-care model.',
    keyPayers: ['Vermont DVHA', 'Blue Cross Blue Shield of Vermont', 'MVP Health Care', 'Medicare'],
    regulatoryNote: 'Vermont operates a state-run public managed-care model and an all-payer accountable-care initiative rather than commercial Medicaid MCOs; CPS bills the Department of Vermont Health Access directly and sequences the Medicare hospice claim.',
    faqs: [
      {
        q: 'Does CPS bill Vermont Green Mountain Care for hospice and home health?',
        a: 'Yes. CPS submits and follows up on Department of Vermont Health Access claims under Green Mountain Care and coordinates with payers like Blue Cross Blue Shield of Vermont and MVP, plus Medicare.',
      },
      {
        q: 'How does Vermont run its Medicaid program?',
        a: 'Vermont operates a state-run public managed-care model and an all-payer accountable-care initiative rather than commercial MCOs. CPS bills the Department of Vermont Health Access directly.',
      },
      {
        q: 'Can CPS coordinate Vermont dual-eligible claims?',
        a: 'Yes. CPS sequences the Green Mountain Care and Medicare claim streams for dual-eligible members so those cases pay in full.',
      },
      {
        q: 'How do Vermont agencies get started?',
        a: 'Request a free assessment. CPS reviews your Green Mountain Care and Medicare mix and shows the recoverable revenue.',
      },
    ],
  },
  {
    slug: 'wyoming',
    name: 'Wyoming',
    abbr: 'WY',
    medicaidProgram: 'Wyoming Medicaid',
    managedCareDominant: false,
    intro:
      'Wyoming runs Medicaid through fee-for-service across the least-populous state, using care-management programs rather than full-risk MCOs. Hospice and home-health agencies serving the state bill the Wyoming Department of Health directly and navigate the frontier access challenges of a vast rural geography.',
    keyPayers: ['Wyoming Department of Health', 'Blue Cross Blue Shield of Wyoming', 'Medicare'],
    regulatoryNote: 'Wyoming reimburses hospice and home health through Medicaid fee-for-service with care-management rather than capitated MCOs given its frontier geography; CPS bills the Department of Health directly and sequences the Medicare hospice claim.',
    faqs: [
      {
        q: 'Does CPS bill Wyoming Medicaid for hospice and home health?',
        a: 'Yes. CPS submits and follows up on Wyoming Department of Health fee-for-service claims and coordinates with Blue Cross Blue Shield of Wyoming and Medicare.',
      },
      {
        q: 'Is Wyoming Medicaid managed care or fee-for-service?',
        a: 'Wyoming reimburses hospice and home health through fee-for-service with care-management rather than capitated MCOs given its frontier geography. CPS bills the Department of Health directly.',
      },
      {
        q: 'Can CPS coordinate Wyoming dual-eligible claims?',
        a: 'Yes. CPS sequences the Wyoming Medicaid and Medicare claim streams for dual-eligible members so those cases pay in full.',
      },
      {
        q: 'How do Wyoming agencies get started?',
        a: 'Request a free assessment. CPS reviews your Wyoming Medicaid and Medicare mix and shows the recoverable revenue.',
      },
    ],
  },
];
