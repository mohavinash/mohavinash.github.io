(() => {
  "use strict";

  const config = window.SIR_SEARCH_CONFIG || {};
  const apiBaseUrl = String(config.apiBaseUrl || "").replace(/\/$/, "");
  const locationsUrl = String(config.locationsUrl || "locations.json");
  const form = document.querySelector("#search-form");
  const districtSelect = document.querySelector("#district");
  const constituencySelect = document.querySelector("#constituency");
  const coverageWarning = document.querySelector("#coverage-warning");
  const nameModeButton = document.querySelector("#name-mode-button");
  const epicModeButton = document.querySelector("#epic-mode-button");
  const nameQueryFields = document.querySelector("#name-query-fields");
  const epicQueryFields = document.querySelector("#epic-query-fields");
  const locationGroup = document.querySelector(".location-group");
  const voterIdInput = document.querySelector("#voter-id");
  const nameInput = document.querySelector("#voter-name");
  const relativeInput = document.querySelector("#relative-name");
  const contactField = document.querySelector("#contact-field");
  const message = document.querySelector("#form-message");
  const button = document.querySelector("#search-button");
  const buttonLabel = button.querySelector(".button-label");
  const resultsSection = document.querySelector("#board-results");
  const resultsTitle = document.querySelector("#results-title");
  const resultSummary = document.querySelector("#result-summary");
  const resultTableHeading = document.querySelector("#result-table-heading");
  const resultList = document.querySelector("#result-list");
  const sheetDetail = document.querySelector("#sheet-detail");
  const sheetDetailBody = document.querySelector("#sheet-detail-body");
  const sheetBack = document.querySelector("#sheet-back");
  const pagination = document.querySelector("#pagination");
  const newSearch = document.querySelector("#new-search");
  const cardTemplate = document.querySelector("#result-card-template");
  const rowTemplate = document.querySelector("#result-row-template");
  const indexedCount = document.querySelector("#indexed-count");
  const languageToggle = document.querySelector("#language-toggle");

  const COPY = {
    en: {
      deskLabel: "Counter 03 · File-finding department",
      eyebrow: "Karnataka SIR · ASDDO files",
      title: "Is your name at risk of deletion? Ee form fill maadi to check.",
      formInstruction: "Please fill this form carefully.",
      nameMode: "By name",
      epicMode: "EPIC ID",
      nameLabel: "Voter name (as per EPIC ID, minimum three letters required)",
      relativeLabel: "Relative’s name (optional — helps narrow the match)",
      epicLabel: "EPIC ID (combination of three letters and seven digits)",
      locationLegend: "Which office cupboard?",
      districtLabel: "District",
      constituencyLabel: "Assembly constituency",
      locationHelp: "District + constituency. Correct file, correct cupboard.",
      searchButton: "Search maadi",
      searching: "Swalpa wait maadi…",
      resultsEyebrow: "File opened · Search results",
      resultsTitle: "Matches in this snapshot",
      startOver: "Start over ↺",
      searchAgain: "New search maadi",
      backToList: "← Back to the list",
      chalkIndexed: "voters indexed",
      chalkSnapshot: "Snapshot 21 Aug 2026 · all 224 constituencies",
      panicEyebrow: "If your name appeared here",
      panicTitle: "Do not panic.",
      panicCopy: "An ASDDO entry is a publication record from Karnataka’s 2026 Special Intensive Revision — not a final deletion. The current electoral roll and your ERO decide the official status. These counters tell you what to do next.",
      stepsTitle: "Your next steps",
      step1Lead: "Start with the source page.",
      step1Body: "Compare the Voter ID first. Then read the names, part, serial number and reason as printed.",
      step2Lead: "Reach your local officer.",
      step2Body: "Ask the BLO or ERO what the entry means for the record today. CEO Karnataka’s Voter Facilitation Centre page provides current contact details.",
      step3Lead: "If an Enumeration Form is still pending, contact the BLO or ERO now.",
      step3Body: "The CEO Karnataka target was 8 August. Ask which filing route remains available, submit through the official channel they identify, and keep the acknowledgement.",
      step4Lead: "Use the claims route for a missing draft-roll entry.",
      step4Body: "File Form 6 with the prescribed SIR Declaration during the active claims window. Your ERO will tell you which supporting papers apply.",
      step5Lead: "A move uses Form 8.",
      step5Body: "Submit it through the ECI portal or to the ERO serving your new address. The form covers shifts within and across constituencies.",
      step6Lead: "Respond to any notice.",
      step6Body: "Use ECI’s notice service for the requested documents. Attend the hearing time given by the officer and retain your copies.",
      datesEyebrow: "Schedule checked 21 August 2026",
      datesTitle: "Dates to keep in view",
      d1Label: "8 Aug 2026",
      d1Body: "Target for BLO house visits and digitisation in the CEO Karnataka update; this date has passed.",
      d2Label: "5 Aug – 4 Sep 2026",
      d2Body: "ECI’s published schedule places claims and objections in this window.",
      d3Label: "3 Oct 2026",
      d3Body: "EROs complete notice work and decide claims by this target in ECI’s schedule.",
      d4Label: "7 Oct 2026",
      d4Body: "ECI’s published schedule says the final electoral roll will appear on this date.",
      countersTitle: "Official counters",
      eciPortal: "ECI Voters’ Service Portal",
      officialForms: "Official forms",
      ceoHome: "CEO Karnataka",
      helpline: "Karnataka voter helplines:",
      ceoUpdate: "CEO update, 29 July",
      eciSchedule: "ECI schedule, 14 May",
      methodTitle: "What this index contains",
      stat1: "records carrying a stated reason in this snapshot.",
      stat2: "electoral parts represented.",
      stat3: "Assembly constituencies covered; this snapshot has no constituency gaps.",
      stat4: "mapping-only rows stay outside the search; two upstream folder listings were inaccessible during the refresh.",
      methodNote: "The index keeps one canonical entry for each Assembly constituency, part, prior-roll serial number and Voter ID when the source carries a stated reason. Source files carry publication dates from 23 July to 18 August 2026; the index was prepared on 21 August 2026. Nine source files could not be read and are not represented. PDF text can carry spelling or extraction errors.",
      aboutIndex: "DataChutney built this independent, unofficial index from public ASDDO files. Source gaps, spelling changes and PDF extraction can affect a match — the source page, the current roll and your ERO have the final word. Name results show brief summaries; open a record for its Voter ID and source. Search terms stay out of the page address.",
      selectDistrict: "Select district",
      selectDistrictFirst: "Select a district first",
      selectConstituency: "Select Assembly constituency",
      sourceUnavailableSuffix: " · source data unavailable",
      servicePending: "Search service connection pending",
      districtsFailedOption: "Districts could not load",
      districtsFailed: "The district list could not load. Refresh and try again.",
      validationName: "Enter at least 3 letters of the voter’s name.",
      validationEpic: "Enter a valid EPIC ID: three letters followed by seven digits.",
      validationDistrict: "Select the voter’s district.",
      validationConstituency: "Select the voter’s Assembly constituency.",
      coverageTitle: "Source data unavailable for AC {number} · {name}. ",
      coverageBody: "This constituency stays visible so the gap is clear. Check CEO Karnataka or ask your BLO / ERO.",
      sourceUnavailable: "Source data unavailable",
      noFiles: "This snapshot has no searchable ASDDO files for {label}.",
      checkOfficial: "Check CEO Karnataka or ask your BLO / ERO to review the source record.",
      openCeo: "Open CEO Karnataka’s ASDDO page ↗",
      zeroTitle: "Zero matches in this snapshot",
      zeroStrong: "No indexed match found.",
      zeroBody: "Spelling, source gaps and PDF extraction can affect a search. Check the official roll too.",
      matchEpic: "Exact EPIC ID match",
      matchExact: "Exact name match",
      matchPossible: "Possible name match",
      nameUnavailableFull: "Name unavailable in extracted record",
      relativeFallback: "relative",
      relativeUnavailable: "Relative name unavailable in the extracted record.",
      partSerial: "Part {part} · Serial {serial}",
      duplicateNote: "The source’s duplicate/reference EPIC ID reads: {id}",
      archiveNote: "This PDF is inside {archive}. Open it and go to page {page}.",
      openArchive: "Open source archive",
      openPdf: "Open source PDF at page {page}",
      tooMany: "Too many requests. Swalpa wait maadi, then try again.",
      serviceUnavailable: "The search counter is temporarily closed. Please try again shortly.",
      openingRecord: "Opening this record…",
      recordOpenError: "This record could not open. Run the search again.",
      nameUnavailable: "Name unavailable",
      unavailable: "Unavailable",
      openRecordFor: "Open record for {name}",
      thisVoter: "this voter",
      previousPage: "Previous page",
      nextPage: "Next page",
      pageLabel: "Page {page}",
      sourceMatch: "source match",
      sourceMatches: "source matches",
      singleSummary: "Opening the matching record. Its EPIC ID and source will appear below.",
      multipleSummary: "Showing {first} to {last} of {total}. Open a row for its EPIC ID and source.",
      privacyLimit: "For privacy, only the first {count} matches appear. Add more of the name to narrow it.",
      timeout: "The search took too long. Please try again.",
      connectionPending: "The search counter is not connected yet.",
      factEpic: "EPIC ID",
      factReason: "Reason printed",
      factDistrict: "District / publication unit",
      factConstituency: "Assembly constituency",
      factPart: "Part / roll serial",
      verifyLine: "Compare the source carefully. Your ERO provides the official status.",
      rowVoter: "Voter",
      rowRelative: "Relative",
      rowReason: "Reason",
      rowOpen: "Open",
      officialSearch: "Official electoral search",
      ceoPage: "CEO Karnataka ASDDO page",
      contacts: "Find BLO / ERO contacts",
      footerLine: "Independent tools for navigating public information.",
      previewLine: "Use the linked source as a starting point. Your ERO and the current electoral roll provide the official status.",
    },
    kn: {
      deskLabel: "ಕೌಂಟರ್ ೦೩ · ಕಡತ ಹುಡುಕುವ ವಿಭಾಗ",
      eyebrow: "ಕರ್ನಾಟಕ ಎಸ್‌ಐಆರ್ · ಎಎಸ್‌ಡಿಡಿಒ ಕಡತಗಳು",
      title: "ನಿಮ್ಮ ಹೆಸರು ಪಟ್ಟಿಯಿಂದ ಕೈಬಿಡುವ ಅಪಾಯದಲ್ಲಿದೆಯೇ? ಈ ಅರ್ಜಿ ತುಂಬಿ ಪರಿಶೀಲಿಸಿ.",
      formInstruction: "ದಯವಿಟ್ಟು ಈ ಅರ್ಜಿಯನ್ನು ಜಾಗರೂಕತೆಯಿಂದ ಭರ್ತಿ ಮಾಡಿ.",
      nameMode: "ಹೆಸರಿನಿಂದ",
      epicMode: "ಇಪಿಐಸಿ ಐಡಿ",
      nameLabel: "ಮತದಾರರ ಹೆಸರು (ಇಪಿಐಸಿ ಐಡಿಯಲ್ಲಿರುವಂತೆ, ಕನಿಷ್ಠ ಮೂರು ಅಕ್ಷರಗಳು ಅಗತ್ಯ)",
      relativeLabel: "ಸಂಬಂಧಿಯ ಹೆಸರು (ಐಚ್ಛಿಕ — ಹೊಂದಾಣಿಕೆಯನ್ನು ನಿಖರಗೊಳಿಸಲು ಸಹಾಯಕ)",
      epicLabel: "ಇಪಿಐಸಿ ಐಡಿ (ಮೂರು ಅಕ್ಷರಗಳು ಮತ್ತು ಏಳು ಅಂಕೆಗಳ ಸಂಯೋಜನೆ)",
      locationLegend: "ಕಡತ ಯಾವ ಕಪಾಟಿನಲ್ಲಿ?",
      districtLabel: "ಜಿಲ್ಲೆ",
      constituencyLabel: "ವಿಧಾನಸಭಾ ಕ್ಷೇತ್ರ",
      locationHelp: "ಜಿಲ್ಲೆ + ಕ್ಷೇತ್ರ. ಸರಿಯಾದ ಕಡತ, ಸರಿಯಾದ ಕಪಾಟು.",
      searchButton: "ಕಡತ ಪರಿಶೀಲಿಸಿ",
      searching: "ಸ್ವಲ್ಪ ಕಾಯಿರಿ…",
      resultsEyebrow: "ಕಡತ ತೆರೆದಿದೆ · ಹುಡುಕಾಟದ ಫಲಿತಾಂಶ",
      resultsTitle: "ಈ ನಕಲಿನಲ್ಲಿ ಹೊಂದಾಣಿಕೆಗಳು",
      startOver: "ಮತ್ತೆ ಹುಡುಕಿ ↺",
      searchAgain: "ಮತ್ತೊಮ್ಮೆ ಹುಡುಕಿ",
      backToList: "← ಪಟ್ಟಿಗೆ ಹಿಂತಿರುಗಿ",
      chalkIndexed: "ಮತದಾರರು ಸೂಚಿಯಲ್ಲಿ",
      chalkSnapshot: "ನಕಲು 21 ಆಗಸ್ಟ್ 2026 · ಎಲ್ಲ 224 ಕ್ಷೇತ್ರಗಳು",
      panicEyebrow: "ನಿಮ್ಮ ಹೆಸರು ಇಲ್ಲಿ ಕಂಡುಬಂದರೆ",
      panicTitle: "ಗಾಬರಿಯಾಗಬೇಡಿ.",
      panicCopy: "ಎಎಸ್‌ಡಿಡಿಒ ದಾಖಲೆ 2026ರ ವಿಶೇಷ ತೀವ್ರ ಪರಿಷ್ಕರಣೆಯ ಪ್ರಕಟಣಾ ದಾಖಲೆ ಮಾತ್ರ — ಅಂತಿಮ ತೆಗೆದುಹಾಕುವಿಕೆ ಅಲ್ಲ. ಅಧಿಕೃತ ಸ್ಥಿತಿಯನ್ನು ಪ್ರಸ್ತುತ ಮತದಾರರ ಪಟ್ಟಿ ಮತ್ತು ನಿಮ್ಮ ಇಆರ್‌ಒ ನಿರ್ಧರಿಸುತ್ತಾರೆ. ಮುಂದೇನು ಮಾಡಬೇಕು ಎಂಬುದನ್ನು ಈ ಕೌಂಟರ್‌ಗಳು ತಿಳಿಸುತ್ತವೆ.",
      stepsTitle: "ಮುಂದಿನ ಹೆಜ್ಜೆಗಳು",
      step1Lead: "ಮೂಲ ಪುಟದಿಂದ ಪ್ರಾರಂಭಿಸಿ.",
      step1Body: "ಮೊದಲು ಇಪಿಐಸಿ ಐಡಿ ಹೋಲಿಸಿ. ನಂತರ ಹೆಸರುಗಳು, ಭಾಗ, ಕ್ರಮ ಸಂಖ್ಯೆ ಮತ್ತು ಮುದ್ರಿತ ಕಾರಣವನ್ನು ಓದಿ.",
      step2Lead: "ನಿಮ್ಮ ಸ್ಥಳೀಯ ಅಧಿಕಾರಿಯನ್ನು ಸಂಪರ್ಕಿಸಿ.",
      step2Body: "ಈ ದಾಖಲೆಯ ಅರ್ಥವೇನು ಎಂದು ಬಿಎಲ್‌ಒ ಅಥವಾ ಇಆರ್‌ಒ ಬಳಿ ಕೇಳಿ. ಸಂಪರ್ಕ ವಿವರಗಳು ಸಿಇಒ ಕರ್ನಾಟಕದ ಮತದಾರ ಸೌಲಭ್ಯ ಕೇಂದ್ರ ಪುಟದಲ್ಲಿ ಇವೆ.",
      step3Lead: "ಎಣಿಕೆ ಅರ್ಜಿ ಬಾಕಿ ಇದ್ದರೆ ಬಿಎಲ್‌ಒ / ಇಆರ್‌ಒ ಅವರನ್ನು ಈಗಲೇ ಸಂಪರ್ಕಿಸಿ.",
      step3Body: "ಸಿಇಒ ಕರ್ನಾಟಕದ ಗುರಿ ದಿನಾಂಕ 8 ಆಗಸ್ಟ್ ಆಗಿತ್ತು. ಯಾವ ಸಲ್ಲಿಕೆ ಮಾರ್ಗ ಲಭ್ಯ ಎಂದು ಕೇಳಿ, ಅಧಿಕೃತ ಮಾರ್ಗದಲ್ಲಿ ಸಲ್ಲಿಸಿ, ಸ್ವೀಕೃತಿಯನ್ನು ಇಟ್ಟುಕೊಳ್ಳಿ.",
      step4Lead: "ಕರಡು ಪಟ್ಟಿಯಲ್ಲಿ ಹೆಸರು ಇಲ್ಲದಿದ್ದರೆ ಹಕ್ಕು ಮಾರ್ಗ ಬಳಸಿ.",
      step4Body: "ಹಕ್ಕು-ಆಕ್ಷೇಪಣೆ ಅವಧಿಯಲ್ಲಿ ನಿಗದಿತ ಎಸ್‌ಐಆರ್ ಘೋಷಣೆಯೊಂದಿಗೆ ಫಾರ್ಮ್ 6 ಸಲ್ಲಿಸಿ. ಬೇಕಾದ ದಾಖಲೆಗಳನ್ನು ನಿಮ್ಮ ಇಆರ್‌ಒ ತಿಳಿಸುತ್ತಾರೆ.",
      step5Lead: "ವಿಳಾಸ ಬದಲಾವಣೆಗೆ ಫಾರ್ಮ್ 8.",
      step5Body: "ಇಸಿಐ ಪೋರ್ಟಲ್ ಮೂಲಕ ಅಥವಾ ಹೊಸ ವಿಳಾಸದ ಇಆರ್‌ಒಗೆ ಸಲ್ಲಿಸಿ. ಕ್ಷೇತ್ರದ ಒಳಗಿನ ಮತ್ತು ಕ್ಷೇತ್ರಗಳ ನಡುವಿನ ಸ್ಥಳಾಂತರ ಎರಡಕ್ಕೂ ಇದು ಅನ್ವಯಿಸುತ್ತದೆ.",
      step6Lead: "ಯಾವುದೇ ನೋಟಿಸ್‌ಗೆ ಉತ್ತರಿಸಿ.",
      step6Body: "ಕೇಳಿದ ದಾಖಲೆಗಳನ್ನು ಇಸಿಐ ನೋಟಿಸ್ ಸೇವೆಯ ಮೂಲಕ ಸಲ್ಲಿಸಿ. ಅಧಿಕಾರಿ ನೀಡಿದ ಸಮಯಕ್ಕೆ ವಿಚಾರಣೆಗೆ ಹಾಜರಾಗಿ, ನಿಮ್ಮ ಪ್ರತಿಗಳನ್ನು ಇಟ್ಟುಕೊಳ್ಳಿ.",
      datesEyebrow: "ವೇಳಾಪಟ್ಟಿ ಪರಿಶೀಲನೆ: 21 ಆಗಸ್ಟ್ 2026",
      datesTitle: "ಗಮನದಲ್ಲಿಡಬೇಕಾದ ದಿನಾಂಕಗಳು",
      d1Label: "8 ಆಗಸ್ಟ್ 2026",
      d1Body: "ಬಿಎಲ್‌ಒ ಮನೆ ಭೇಟಿ ಮತ್ತು ಡಿಜಿಟಲೀಕರಣಕ್ಕೆ ಸಿಇಒ ಕರ್ನಾಟಕ ನಿಗದಿಪಡಿಸಿದ್ದ ಗುರಿ ದಿನಾಂಕ; ಇದು ಈಗಾಗಲೇ ಕಳೆದಿದೆ.",
      d2Label: "5 ಆಗಸ್ಟ್ – 4 ಸೆಪ್ಟೆಂಬರ್ 2026",
      d2Body: "ಹಕ್ಕು ಮತ್ತು ಆಕ್ಷೇಪಣೆಗಳಿಗೆ ಇಸಿಐ ಪ್ರಕಟಿಸಿದ ಅವಧಿ.",
      d3Label: "3 ಅಕ್ಟೋಬರ್ 2026",
      d3Body: "ಇಸಿಐ ವೇಳಾಪಟ್ಟಿಯಂತೆ ಇಆರ್‌ಒಗಳು ನೋಟಿಸ್ ಕೆಲಸ ಮುಗಿಸಿ ಹಕ್ಕುಗಳ ಬಗ್ಗೆ ತೀರ್ಮಾನಿಸುವ ಗುರಿ ದಿನಾಂಕ.",
      d4Label: "7 ಅಕ್ಟೋಬರ್ 2026",
      d4Body: "ಅಂತಿಮ ಮತದಾರರ ಪಟ್ಟಿ ಈ ದಿನಾಂಕದಂದು ಪ್ರಕಟವಾಗಲಿದೆ ಎಂದು ಇಸಿಐ ವೇಳಾಪಟ್ಟಿ ಹೇಳುತ್ತದೆ.",
      countersTitle: "ಅಧಿಕೃತ ಕೌಂಟರ್‌ಗಳು",
      eciPortal: "ಇಸಿಐ ಮತದಾರರ ಸೇವಾ ಪೋರ್ಟಲ್",
      officialForms: "ಅಧಿಕೃತ ಫಾರ್ಮ್‌ಗಳು",
      ceoHome: "ಸಿಇಒ ಕರ್ನಾಟಕ",
      helpline: "ಕರ್ನಾಟಕ ಮತದಾರರ ಸಹಾಯವಾಣಿ:",
      ceoUpdate: "ಸಿಇಒ ಪ್ರಕಟಣೆ, 29 ಜುಲೈ",
      eciSchedule: "ಇಸಿಐ ವೇಳಾಪಟ್ಟಿ, 14 ಮೇ",
      methodTitle: "ಈ ಸೂಚಿಯಲ್ಲಿ ಏನಿದೆ",
      stat1: "ಈ ನಕಲಿನಲ್ಲಿ ಕಾರಣ ನಮೂದಾಗಿರುವ ದಾಖಲೆಗಳು.",
      stat2: "ಒಳಗೊಂಡಿರುವ ಮತದಾನ ಭಾಗಗಳು.",
      stat3: "ಒಳಗೊಂಡ ವಿಧಾನಸಭಾ ಕ್ಷೇತ್ರಗಳು; ಈ ನಕಲಿನಲ್ಲಿ ಯಾವ ಕ್ಷೇತ್ರವೂ ಬಿಟ್ಟುಹೋಗಿಲ್ಲ.",
      stat4: "ಮ್ಯಾಪಿಂಗ್-ಮಾತ್ರ ಸಾಲುಗಳು ಹುಡುಕಾಟದ ಹೊರಗಿವೆ; ನವೀಕರಣದ ವೇಳೆ ಎರಡು ಮೂಲ ಫೋಲ್ಡರ್ ಪಟ್ಟಿಗಳು ಲಭ್ಯವಾಗಲಿಲ್ಲ.",
      methodNote: "ಕಾರಣ ನಮೂದಾಗಿರುವಾಗ ಪ್ರತಿ ವಿಧಾನಸಭಾ ಕ್ಷೇತ್ರ, ಭಾಗ, ಹಿಂದಿನ ಪಟ್ಟಿಯ ಕ್ರಮ ಸಂಖ್ಯೆ ಮತ್ತು ಇಪಿಐಸಿ ಐಡಿಗೆ ಒಂದೇ ದಾಖಲೆಯನ್ನು ಸೂಚಿ ಇಟ್ಟುಕೊಳ್ಳುತ್ತದೆ. ಮೂಲ ಕಡತಗಳ ಪ್ರಕಟಣಾ ದಿನಾಂಕ 23 ಜುಲೈ – 18 ಆಗಸ್ಟ್ 2026; ಸೂಚಿ ಸಿದ್ಧವಾದದ್ದು 21 ಆಗಸ್ಟ್ 2026. ಒಂಬತ್ತು ಮೂಲ ಕಡತಗಳನ್ನು ಓದಲಾಗಲಿಲ್ಲ, ಅವು ಇದರಲ್ಲಿ ಸೇರಿಲ್ಲ. ಪಿಡಿಎಫ್ ಪಠ್ಯದಲ್ಲಿ ಕಾಗುಣಿತ ಅಥವಾ ಓದುವ ದೋಷ ಇರಬಹುದು.",
      aboutIndex: "ಸಾರ್ವಜನಿಕ ಎಎಸ್‌ಡಿಡಿಒ ಕಡತಗಳಿಂದ ಡೇಟಾಚಟ್ನಿ ರೂಪಿಸಿದ ಸ್ವತಂತ್ರ, ಅನಧಿಕೃತ ಸೂಚಿ ಇದು. ಮೂಲದ ಕೊರತೆ, ಕಾಗುಣಿತ ವ್ಯತ್ಯಾಸ ಮತ್ತು ಪಿಡಿಎಫ್ ಓದುವ ದೋಷಗಳು ಹೊಂದಾಣಿಕೆಯ ಮೇಲೆ ಪರಿಣಾಮ ಬೀರಬಹುದು — ಮೂಲ ಪುಟ, ಪ್ರಸ್ತುತ ಪಟ್ಟಿ ಮತ್ತು ನಿಮ್ಮ ಇಆರ್‌ಒ ಹೇಳುವುದೇ ಅಂತಿಮ. ಹೆಸರಿನ ಫಲಿತಾಂಶಗಳು ಸಂಕ್ಷಿಪ್ತ ಸಾರಾಂಶ ಮಾತ್ರ; ಇಪಿಐಸಿ ಐಡಿ ಮತ್ತು ಮೂಲ ನೋಡಲು ದಾಖಲೆ ತೆರೆಯಿರಿ. ಹುಡುಕಾಟದ ಪದಗಳು ಪುಟದ ವಿಳಾಸದಲ್ಲಿ ಸೇರುವುದಿಲ್ಲ.",
      selectDistrict: "ಜಿಲ್ಲೆ ಆಯ್ಕೆಮಾಡಿ",
      selectDistrictFirst: "ಮೊದಲು ಜಿಲ್ಲೆ ಆಯ್ಕೆಮಾಡಿ",
      selectConstituency: "ವಿಧಾನಸಭಾ ಕ್ಷೇತ್ರ ಆಯ್ಕೆಮಾಡಿ",
      sourceUnavailableSuffix: " · ಮೂಲ ಮಾಹಿತಿ ಲಭ್ಯವಿಲ್ಲ",
      servicePending: "ಹುಡುಕಾಟ ಸೇವೆ ಇನ್ನೂ ಸಂಪರ್ಕಗೊಂಡಿಲ್ಲ",
      districtsFailedOption: "ಜಿಲ್ಲೆಗಳ ಪಟ್ಟಿ ಲಭ್ಯವಿಲ್ಲ",
      districtsFailed: "ಜಿಲ್ಲೆಗಳ ಪಟ್ಟಿ ತೆರೆಯಲಿಲ್ಲ. ಪುಟವನ್ನು ಮರುಲೋಡ್ ಮಾಡಿ.",
      validationName: "ಮತದಾರರ ಹೆಸರಿನ ಕನಿಷ್ಠ 3 ಅಕ್ಷರಗಳನ್ನು ನಮೂದಿಸಿ.",
      validationEpic: "ಮಾನ್ಯ ಇಪಿಐಸಿ ಐಡಿ ನಮೂದಿಸಿ: ಮೊದಲು ಮೂರು ಅಕ್ಷರಗಳು, ನಂತರ ಏಳು ಅಂಕೆಗಳು.",
      validationDistrict: "ಮತದಾರರ ಜಿಲ್ಲೆ ಆಯ್ಕೆಮಾಡಿ.",
      validationConstituency: "ಮತದಾರರ ವಿಧಾನಸಭಾ ಕ್ಷೇತ್ರ ಆಯ್ಕೆಮಾಡಿ.",
      coverageTitle: "ಎಸಿ {number} · {name}ಗೆ ಮೂಲ ಮಾಹಿತಿ ಲಭ್ಯವಿಲ್ಲ. ",
      coverageBody: "ಮಾಹಿತಿ ಕೊರತೆ ಸ್ಪಷ್ಟವಾಗಲು ಈ ಕ್ಷೇತ್ರವನ್ನು ತೋರಿಸಲಾಗಿದೆ. ಸಿಇಒ ಕರ್ನಾಟಕ ಅಥವಾ ಬಿಎಲ್‌ಒ / ಇಆರ್‌ಒ ಬಳಿ ಪರಿಶೀಲಿಸಿ.",
      sourceUnavailable: "ಮೂಲ ಮಾಹಿತಿ ಲಭ್ಯವಿಲ್ಲ",
      noFiles: "{label}ಗೆ ಹುಡುಕಬಹುದಾದ ಎಎಸ್‌ಡಿಡಿಒ ಕಡತಗಳು ಈ ನಕಲಿನಲ್ಲಿ ಇಲ್ಲ.",
      checkOfficial: "ಸಿಇಒ ಕರ್ನಾಟಕ ಅಥವಾ ನಿಮ್ಮ ಬಿಎಲ್‌ಒ / ಇಆರ್‌ಒ ಬಳಿ ಮೂಲ ದಾಖಲೆ ಪರಿಶೀಲಿಸಿ.",
      openCeo: "ಸಿಇಒ ಕರ್ನಾಟಕ ಎಎಸ್‌ಡಿಡಿಒ ಪುಟ ತೆರೆಯಿರಿ ↗",
      zeroTitle: "ಈ ನಕಲಿನಲ್ಲಿ ಹೊಂದಾಣಿಕೆ ಇಲ್ಲ",
      zeroStrong: "ಸೂಚಿಯಲ್ಲಿ ಹೊಂದಾಣಿಕೆ ಸಿಗಲಿಲ್ಲ.",
      zeroBody: "ಕಾಗುಣಿತ, ಮೂಲದ ಕೊರತೆ ಮತ್ತು ಪಿಡಿಎಫ್ ಓದುವ ದೋಷಗಳು ಹುಡುಕಾಟದ ಮೇಲೆ ಪರಿಣಾಮ ಬೀರಬಹುದು. ಅಧಿಕೃತ ಪಟ್ಟಿಯನ್ನೂ ಪರಿಶೀಲಿಸಿ.",
      matchEpic: "ಇಪಿಐಸಿ ಐಡಿ ನಿಖರ ಹೊಂದಾಣಿಕೆ",
      matchExact: "ಹೆಸರಿನ ನಿಖರ ಹೊಂದಾಣಿಕೆ",
      matchPossible: "ಹೆಸರಿನ ಸಾಧ್ಯ ಹೊಂದಾಣಿಕೆ",
      nameUnavailableFull: "ಹೊರತೆಗೆದ ದಾಖಲೆಯಲ್ಲಿ ಹೆಸರು ಲಭ್ಯವಿಲ್ಲ",
      relativeFallback: "ಸಂಬಂಧಿ",
      relativeUnavailable: "ಹೊರತೆಗೆದ ದಾಖಲೆಯಲ್ಲಿ ಸಂಬಂಧಿಯ ಹೆಸರು ಲಭ್ಯವಿಲ್ಲ.",
      partSerial: "ಭಾಗ {part} · ಕ್ರಮ ಸಂಖ್ಯೆ {serial}",
      duplicateNote: "ಮೂಲದಲ್ಲಿರುವ ನಕಲಿ/ಉಲ್ಲೇಖ ಇಪಿಐಸಿ ಐಡಿ: {id}",
      archiveNote: "ಈ ಪಿಡಿಎಫ್ {archive} ಒಳಗಿದೆ. ಅದನ್ನು ತೆರೆದು {page}ನೇ ಪುಟಕ್ಕೆ ಹೋಗಿ.",
      openArchive: "ಮೂಲ ಆರ್ಕೈವ್ ತೆರೆಯಿರಿ",
      openPdf: "ಮೂಲ ಪಿಡಿಎಫ್‌ನ {page}ನೇ ಪುಟ ತೆರೆಯಿರಿ",
      tooMany: "ತುಂಬಾ ವಿನಂತಿಗಳು ಬಂದಿವೆ. ಸ್ವಲ್ಪ ಕಾಯಿರಿ, ಮತ್ತೆ ಪ್ರಯತ್ನಿಸಿ.",
      serviceUnavailable: "ಹುಡುಕಾಟ ಕೌಂಟರ್ ತಾತ್ಕಾಲಿಕವಾಗಿ ಮುಚ್ಚಿದೆ. ಸ್ವಲ್ಪ ಹೊತ್ತಿನ ನಂತರ ಪ್ರಯತ್ನಿಸಿ.",
      openingRecord: "ದಾಖಲೆ ತೆರೆಯಲಾಗುತ್ತಿದೆ…",
      recordOpenError: "ಈ ದಾಖಲೆ ತೆರೆಯಲಿಲ್ಲ. ಮತ್ತೆ ಹುಡುಕಿ.",
      nameUnavailable: "ಹೆಸರು ಲಭ್ಯವಿಲ್ಲ",
      unavailable: "ಲಭ್ಯವಿಲ್ಲ",
      openRecordFor: "{name} ಅವರ ದಾಖಲೆ ತೆರೆಯಿರಿ",
      thisVoter: "ಈ ಮತದಾರ",
      previousPage: "ಹಿಂದಿನ ಪುಟ",
      nextPage: "ಮುಂದಿನ ಪುಟ",
      pageLabel: "ಪುಟ {page}",
      sourceMatch: "ಮೂಲ ಹೊಂದಾಣಿಕೆ",
      sourceMatches: "ಮೂಲ ಹೊಂದಾಣಿಕೆಗಳು",
      singleSummary: "ಹೊಂದಾಣಿಕೆಯ ದಾಖಲೆ ತೆರೆಯಲಾಗುತ್ತಿದೆ. ಇಪಿಐಸಿ ಐಡಿ ಮತ್ತು ಮೂಲ ಕೆಳಗೆ ಕಾಣುತ್ತದೆ.",
      multipleSummary: "{total}ರಲ್ಲಿ {first}ರಿಂದ {last}ರವರೆಗೆ ತೋರಿಸಲಾಗಿದೆ. ಇಪಿಐಸಿ ಐಡಿ ಮತ್ತು ಮೂಲ ನೋಡಲು ಸಾಲನ್ನು ತೆರೆಯಿರಿ.",
      privacyLimit: "ಗೌಪ್ಯತೆಗಾಗಿ ಮೊದಲ {count} ಹೊಂದಾಣಿಕೆಗಳನ್ನು ಮಾತ್ರ ತೋರಿಸಲಾಗಿದೆ. ಹುಡುಕಾಟವನ್ನು ಕಿರಿದಾಗಿಸಲು ಹೆಸರಿನ ಇನ್ನಷ್ಟು ಭಾಗ ಸೇರಿಸಿ.",
      timeout: "ಹುಡುಕಾಟ ಹೆಚ್ಚು ಸಮಯ ತೆಗೆದುಕೊಂಡಿತು. ಮತ್ತೆ ಪ್ರಯತ್ನಿಸಿ.",
      connectionPending: "ಹುಡುಕಾಟ ಕೌಂಟರ್ ಇನ್ನೂ ಸಂಪರ್ಕಗೊಂಡಿಲ್ಲ.",
      factEpic: "ಇಪಿಐಸಿ ಐಡಿ",
      factReason: "ಮುದ್ರಿತ ಕಾರಣ",
      factDistrict: "ಜಿಲ್ಲೆ / ಪ್ರಕಟಣಾ ಘಟಕ",
      factConstituency: "ವಿಧಾನಸಭಾ ಕ್ಷೇತ್ರ",
      factPart: "ಭಾಗ / ಕ್ರಮ ಸಂಖ್ಯೆ",
      verifyLine: "ಮೂಲವನ್ನು ಎಚ್ಚರಿಕೆಯಿಂದ ಹೋಲಿಸಿ. ಅಧಿಕೃತ ಸ್ಥಿತಿಯನ್ನು ನಿಮ್ಮ ಇಆರ್‌ಒ ನೀಡುತ್ತಾರೆ.",
      rowVoter: "ಮತದಾರ",
      rowRelative: "ಸಂಬಂಧಿ",
      rowReason: "ಕಾರಣ",
      rowOpen: "ತೆರೆಯಿರಿ",
      officialSearch: "ಅಧಿಕೃತ ಮತದಾರರ ಹುಡುಕಾಟ",
      ceoPage: "ಸಿಇಒ ಕರ್ನಾಟಕ ಎಎಸ್‌ಡಿಡಿಒ ಪುಟ",
      contacts: "ಬಿಎಲ್‌ಒ / ಇಆರ್‌ಒ ಸಂಪರ್ಕ ಹುಡುಕಿ",
      footerLine: "ಸಾರ್ವಜನಿಕ ಮಾಹಿತಿಗಾಗಿ ಸ್ವತಂತ್ರ ಸಾಧನಗಳು.",
      previewLine: "ಲಿಂಕ್ ಮಾಡಿದ ಮೂಲವನ್ನು ಆರಂಭಿಕ ಬಿಂದುವಾಗಿ ಬಳಸಿ. ಅಧಿಕೃತ ಸ್ಥಿತಿಯನ್ನು ನಿಮ್ಮ ಇಆರ್‌ಒ ಮತ್ತು ಪ್ರಸ್ತುತ ಮತದಾರರ ಪಟ್ಟಿ ನೀಡುತ್ತದೆ.",
    },
  };

  let districts = [];
  let searchMode = "epic";
  let language = "en";
  let activeRequest = null;
  let lastPayload = null;
  let lastResponse = null;
  let expandedRow = null;
  let visualPage = 1;
  let pendingVisualPage = null;

  // The board sheet shows a fixed number of rows per "page" so the paper
  // never grows past the green board; the API's 20-row pages are sliced.
  const VISUAL_PAGE_SIZE = 4;

  function t(key, values = {}) {
    const template = COPY[language][key] || COPY.en[key] || key;
    return template.replace(/\{(\w+)\}/g, (_, name) => String(values[name] ?? ""));
  }

  const graphemeSegmenter = typeof Intl.Segmenter === "function"
    ? new Intl.Segmenter(undefined, { granularity: "grapheme" })
    : null;

  function splitGraphemes(value) {
    const text = String(value || "");
    return graphemeSegmenter
      ? [...graphemeSegmenter.segment(text)].map((part) => part.segment)
      : Array.from(text);
  }

  function renderLetterEntry(input) {
    const entry = input.closest("[data-letter-entry]");
    const boxes = [...entry.querySelectorAll(".letter-box")];
    const characters = splitGraphemes(input.value);
    const isOverflowing = characters.length > boxes.length;
    const visibleCharacters = isOverflowing
      ? [...characters.slice(0, boxes.length - 1), "…"]
      : characters;

    boxes.forEach((box, index) => {
      box.textContent = visibleCharacters[index] || "";
      box.classList.remove("is-current");
    });

    entry.classList.toggle("has-value", characters.length > 0);
    entry.classList.toggle("is-overflowing", isOverflowing);

    if (document.activeElement === input && boxes.length) {
      const cursorText = input.value.slice(0, input.selectionStart ?? input.value.length);
      const cursorIndex = splitGraphemes(cursorText).length;
      boxes[Math.min(cursorIndex, boxes.length - 1)].classList.add("is-current");
    }
  }

  function renderAllLetterEntries() {
    document.querySelectorAll(".letter-input").forEach(renderLetterEntry);
  }

  document.querySelectorAll("[data-letter-entry]").forEach((entry) => {
    const grid = entry.querySelector("[data-letter-grid]");
    const input = entry.querySelector(".letter-input");
    const boxCount = Math.max(6, Number(entry.dataset.boxCount || 24));
    grid.style.setProperty("--letter-box-count", String(boxCount));
    for (let index = 0; index < boxCount; index += 1) {
      const box = document.createElement("span");
      box.className = "letter-box";
      grid.append(box);
    }
    ["input", "focus", "blur", "click", "keyup", "select"].forEach((eventName) => {
      input.addEventListener(eventName, () => renderLetterEntry(input));
    });
  });

  function applyStaticCopy() {
    document.documentElement.lang = language;
    document.body.dataset.language = language;
    languageToggle.checked = language === "kn";
    document.querySelectorAll("[data-copy]").forEach((element) => {
      element.textContent = t(element.dataset.copy);
    });
    renderAllLetterEntries();
  }

  function setLanguage(nextLanguage) {
    const districtValue = districtSelect.value;
    const constituencyValue = constituencySelect.value;
    language = nextLanguage === "kn" ? "kn" : "en";
    applyStaticCopy();
    if (districts.length) {
      districtSelect.options[0].textContent = t("selectDistrict");
      if (districtValue) {
        districtSelect.value = districtValue;
        populateConstituencies();
        constituencySelect.value = constituencyValue;
      }
      showCoverageWarning();
    }
    setLoading(Boolean(activeRequest));
    if (lastResponse && !resultsSection.hidden) renderResults(lastResponse);
    const bubble = document.querySelector("#clerk-bubble");
    bubble?.classList.remove("is-speaking");
    requestAnimationFrame(() => bubble?.classList.add("is-speaking"));
  }

  function clean(value) {
    return String(value || "").trim().replace(/\s+/g, " ");
  }

  function appendText(parent, tagName, className, text) {
    const element = document.createElement(tagName);
    if (className) element.className = className;
    element.textContent = text;
    parent.append(element);
    return element;
  }

  function setSearchMode(mode, focus = true) {
    searchMode = mode === "epic" ? "epic" : "name";
    const nameActive = searchMode === "name";
    nameModeButton.classList.toggle("is-active", nameActive);
    nameModeButton.setAttribute("aria-pressed", String(nameActive));
    epicModeButton.classList.toggle("is-active", !nameActive);
    epicModeButton.setAttribute("aria-pressed", String(!nameActive));
    nameQueryFields.hidden = !nameActive;
    epicQueryFields.hidden = nameActive;
    locationGroup.hidden = !nameActive;
    clearValidation();
    button.disabled = Boolean(activeRequest) || (nameActive && !districts.length);
    if (focus) (nameActive ? nameInput : voterIdInput).focus();
  }

  function clearValidation() {
    message.hidden = true;
    message.textContent = "";
    [districtSelect, constituencySelect, voterIdInput, nameInput, relativeInput].forEach((field) => {
      field.removeAttribute("aria-invalid");
    });
  }

  function showError(text, field) {
    if (!resultsSection.hidden) {
      resultSummary.replaceChildren();
      const panel = appendText(resultSummary, "div", "sheet-error", text);
      panel.setAttribute("role", "alert");
      return;
    }
    message.textContent = text;
    message.hidden = false;
    if (field) {
      field.setAttribute("aria-invalid", "true");
      field.focus();
    }
  }

  function updatePlaqueLabel() {
    buttonLabel.textContent = activeRequest
      ? t("searching")
      : resultsSection.hidden ? t("searchButton") : t("searchAgain");
  }

  function showResultsSheet() {
    form.hidden = true;
    resultsSection.hidden = false;
    updatePlaqueLabel();
  }

  function showFormSheet(focus = true) {
    resultsSection.hidden = true;
    form.hidden = false;
    updatePlaqueLabel();
    if (focus) (searchMode === "name" ? nameInput : voterIdInput).focus();
  }

  function selectedConstituency() {
    const option = constituencySelect.selectedOptions[0];
    if (!option || !option.value) return null;
    return {
      number: Number(option.value),
      name: option.dataset.name || `AC ${option.value}`,
      dataAvailable: option.dataset.available === "true",
    };
  }

  function showCoverageWarning() {
    coverageWarning.replaceChildren();
    const selected = selectedConstituency();
    if (!selected || selected.dataAvailable) {
      coverageWarning.hidden = true;
      return;
    }
    appendText(
      coverageWarning,
      "strong",
      "",
      t("coverageTitle", { number: selected.number, name: selected.name }),
    );
    coverageWarning.append(t("coverageBody"));
    coverageWarning.hidden = false;
  }

  function populateConstituencies() {
    constituencySelect.replaceChildren();
    const district = districts.find((item) => item.name === districtSelect.value);
    if (!district) {
      constituencySelect.append(new Option(t("selectDistrictFirst"), ""));
      constituencySelect.disabled = true;
      showCoverageWarning();
      return;
    }
    constituencySelect.append(new Option(t("selectConstituency"), ""));
    district.constituencies.forEach((item) => {
      const suffix = item.data_available ? "" : t("sourceUnavailableSuffix");
      const option = new Option(
        `AC ${item.number} · ${item.name}${suffix}`,
        String(item.number),
      );
      option.dataset.name = item.name;
      option.dataset.available = String(item.data_available);
      constituencySelect.append(option);
    });
    constituencySelect.disabled = false;
    showCoverageWarning();
  }

  async function loadLocations() {
    if (!apiBaseUrl || apiBaseUrl.includes("REPLACE_WITH")) {
      districtSelect.replaceChildren(new Option(t("servicePending"), ""));
      button.disabled = true;
      return;
    }
    button.disabled = searchMode === "name";
    try {
      let body = null;
      const sources = [
        { url: locationsUrl, mode: "same-origin", cache: "default" },
        { url: `${apiBaseUrl}/v1/locations?v=2`, mode: "cors", cache: "reload" },
      ];
      for (const source of sources) {
        const controller = new AbortController();
        const timeout = window.setTimeout(() => controller.abort(), 8_000);
        try {
          const response = await fetch(source.url, {
            mode: source.mode,
            cache: source.cache,
            credentials: "omit",
            referrerPolicy: "no-referrer",
            signal: controller.signal,
          });
          if (!response.ok) throw new Error("Location list unavailable");
          const candidate = await response.json();
          if (!Array.isArray(candidate.districts) || !candidate.districts.length) {
            throw new Error("Location list unavailable");
          }
          body = candidate;
          break;
        } catch (_) {
          // The Railway copy is a fallback if the static snapshot cannot load.
        } finally {
          window.clearTimeout(timeout);
        }
      }
      if (!body) throw new Error("Location list unavailable");
      districts = Array.isArray(body.districts) ? body.districts : [];
      districtSelect.replaceChildren(new Option(t("selectDistrict"), ""));
      districts.forEach((district) => {
        districtSelect.append(new Option(district.name, district.name));
      });
      districtSelect.disabled = false;
      button.disabled = Boolean(activeRequest);
    } catch (_) {
      districtSelect.replaceChildren(new Option(t("districtsFailedOption"), ""));
      districtSelect.disabled = true;
      button.disabled = searchMode === "name";
      if (searchMode === "name") showError(t("districtsFailed"));
    }
  }

  function payloadFromForm(page = 1) {
    const voterId = searchMode === "epic" ? clean(voterIdInput.value) : "";
    const name = searchMode === "name" ? clean(nameInput.value) : "";
    const relativeName = searchMode === "name" ? clean(relativeInput.value) : "";
    return {
      district: searchMode === "name" ? districtSelect.value : null,
      constituency_number: searchMode === "name" ? Number(constituencySelect.value) : null,
      voter_id: voterId || null,
      name: name || null,
      relative_name: relativeName || null,
      page,
    };
  }

  function validate(payload) {
    if (searchMode === "name") {
      const nameCharacters = (payload.name || "").replace(/[^\p{L}\p{N}]/gu, "");
      if (nameCharacters.length < 3) {
        showError(t("validationName"), nameInput);
        return false;
      }
      if (!payload.district) {
        showError(t("validationDistrict"), districtSelect);
        return false;
      }
      if (!Number.isInteger(payload.constituency_number) || payload.constituency_number < 1) {
        showError(t("validationConstituency"), constituencySelect);
        return false;
      }
    } else {
      const epicCharacters = (payload.voter_id || "").replace(/[^a-z0-9]/gi, "");
      if (!/^[a-z]{3}\d{7}$/i.test(epicCharacters)) {
        showError(t("validationEpic"), voterIdInput);
        return false;
      }
    }
    return true;
  }

  function setLoading(isLoading) {
    button.disabled = isLoading || (searchMode === "name" && !districts.length);
    button.classList.toggle("is-loading", isLoading);
    updatePlaqueLabel();
    resultsSection.setAttribute("aria-busy", String(isLoading));
    pagination.querySelectorAll("button").forEach((pageButton) => {
      pageButton.disabled = isLoading;
    });
  }

  function closeDetail() {
    if (expandedRow?.controller) expandedRow.controller.abort();
    expandedRow = null;
    sheetDetail.hidden = true;
    sheetDetailBody.replaceChildren();
  }

  function clearResults() {
    closeDetail();
    resultSummary.replaceChildren();
    resultList.hidden = false;
    resultList.replaceChildren();
    resultTableHeading.hidden = true;
    pagination.replaceChildren();
    pagination.hidden = true;
  }

  function renderCoverageGap() {
    resultsTitle.textContent = t("sourceUnavailable");
    const panel = document.createElement("div");
    panel.className = "empty-result empty-result--coverage";
    const selected = selectedConstituency();
    const label = selected
      ? `AC ${selected.number} · ${selected.name}`
      : t("constituencyLabel");
    appendText(panel, "strong", "", t("noFiles", { label }));
    appendText(panel, "span", "", t("checkOfficial"));
    const link = appendText(panel, "a", "empty-result-link", t("openCeo"));
    link.href = "https://ceo.karnataka.gov.in/asddo.html";
    link.target = "_blank";
    link.rel = "noopener noreferrer";
    resultSummary.append(panel);
  }

  function renderEmpty(response) {
    clearResults();
    if (response.meta?.constituency_data_available === false) {
      renderCoverageGap();
    } else {
      resultsTitle.textContent = t("zeroTitle");
      const panel = document.createElement("div");
      panel.className = "empty-result";
      appendText(panel, "strong", "", t("zeroStrong"));
      appendText(panel, "span", "", t("zeroBody"));
      resultSummary.append(panel);
    }
    showResultsSheet();
  }

  function matchLabel(quality) {
    if (quality === "exact_voter_id") return t("matchEpic");
    if (quality === "exact_names") return t("matchExact");
    return t("matchPossible");
  }

  function renderCard(result, displayIndex) {
    const card = cardTemplate.content.firstElementChild.cloneNode(true);
    const badge = card.querySelector(".match-badge");
    badge.textContent = matchLabel(result.match_quality);
    if (result.match_quality === "name_prefix") badge.classList.add("match-badge--possible");
    card.querySelector(".result-index").textContent = String(displayIndex).padStart(2, "0");
    card.querySelector(".result-name").textContent = result.name || t("nameUnavailableFull");
    const relationship = result.relationship ? result.relationship.toLowerCase() : t("relativeFallback");
    card.querySelector(".relative-line").textContent = result.relative_name
      ? `${relationship}: ${result.relative_name}`
      : t("relativeUnavailable");
    card.querySelector(".result-epic").textContent = result.voter_id;
    card.querySelector(".result-status").textContent = result.status_label;
    card.querySelector(".result-district").textContent = result.location.district;
    const constituencyName = result.location.constituency_name
      ? ` · ${result.location.constituency_name}`
      : "";
    card.querySelector(".result-ac").textContent = `AC ${result.location.constituency_number}${constituencyName}`;
    card.querySelector(".result-part").textContent = t("partSerial", {
      part: result.location.part_number,
      serial: result.location.roll_serial_number,
    });

    const factLabels = card.querySelectorAll(".result-facts dt");
    ["factEpic", "factReason", "factDistrict", "factConstituency", "factPart"].forEach((key, index) => {
      if (factLabels[index]) factLabels[index].textContent = t(key);
    });
    card.querySelector(".verify-line").textContent = t("verifyLine");

    const duplicateNote = card.querySelector(".duplicate-note");
    if (result.duplicate_voter_id) {
      duplicateNote.textContent = t("duplicateNote", { id: result.duplicate_voter_id });
      duplicateNote.hidden = false;
    }

    const memberNote = card.querySelector(".source-member-note");
    if (result.source.archive_member) {
      memberNote.textContent = t("archiveNote", {
        archive: result.source.archive_member,
        page: result.source.page_number,
      });
      memberNote.hidden = false;
    }

    const link = card.querySelector(".source-link");
    link.href = result.source.url;
    card.querySelector(".source-link-label").textContent = result.source.archive_member
      ? t("openArchive")
      : t("openPdf", { page: result.source.page_number });
    return card;
  }

  async function parseError(response) {
    try {
      const body = await response.json();
      if (language === "en" && typeof body.detail === "string") return body.detail;
      if (language === "en" && Array.isArray(body.detail) && body.detail[0]?.msg) {
        return String(body.detail[0].msg).replace(/^Value error,\s*/i, "");
      }
    } catch (_) {
      // A generic message keeps proxy response details out of the page.
    }
    return response.status === 429
      ? t("tooMany")
      : t("serviceUnavailable");
  }

  async function fetchDetail(detailToken, signal) {
    const response = await fetch(`${apiBaseUrl}/v1/result`, {
      method: "POST",
      mode: "cors",
      cache: "no-store",
      credentials: "omit",
      referrerPolicy: "no-referrer",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ detail_token: detailToken }),
      signal,
    });
    if (!response.ok) throw new Error(await parseError(response));
    const body = await response.json();
    return body.result;
  }

  function setSheetView(view) {
    const listVisible = view === "list";
    resultSummary.hidden = false;
    resultTableHeading.hidden = !listVisible;
    resultList.hidden = !listVisible;
    pagination.hidden = !listVisible || !pagination.childElementCount;
    sheetDetail.hidden = listVisible;
  }

  async function revealDetail(summary, displayIndex, fromList) {
    const controller = new AbortController();
    const timeout = window.setTimeout(() => controller.abort(), 15_000);
    setSheetView("detail");
    resultSummary.hidden = fromList;
    sheetBack.hidden = !fromList;
    sheetDetailBody.replaceChildren();
    const loading = appendText(sheetDetailBody, "div", "detail-loading", t("openingRecord"));
    loading.setAttribute("role", "status");
    expandedRow = { detail: sheetDetailBody, controller };
    try {
      const result = await fetchDetail(summary.detail_token, controller.signal);
      if (expandedRow?.controller !== controller) return;
      sheetDetailBody.replaceChildren(renderCard(result, displayIndex));
      expandedRow.controller = null;
    } catch (error) {
      if (error.name === "AbortError" || expandedRow?.controller !== controller) return;
      sheetDetailBody.replaceChildren();
      const panel = appendText(
        sheetDetailBody,
        "div",
        "detail-error",
        error.message || t("recordOpenError"),
      );
      panel.setAttribute("role", "alert");
      expandedRow.controller = null;
    } finally {
      window.clearTimeout(timeout);
    }
  }

  function renderCompactRow(summary, displayIndex) {
    const item = rowTemplate.content.firstElementChild.cloneNode(true);
    const rowButton = item.querySelector(".result-row");
    item.querySelector(".row-name").textContent = summary.name || t("nameUnavailable");
    item.querySelector(".row-match").textContent = matchLabel(summary.match_quality);
    item.querySelector(".row-relative").textContent = summary.relative_name || t("unavailable");
    item.querySelector(".row-status").textContent = summary.status_label;
    rowButton.setAttribute("aria-label", t("openRecordFor", { name: summary.name || t("thisVoter") }));
    rowButton.addEventListener("click", () => {
      closeDetail();
      revealDetail(summary, displayIndex, true);
    });
    return item;
  }

  function pageItems(current, total) {
    const pages = new Set([1, total]);
    for (let page = current - 2; page <= current + 2; page += 1) {
      if (page >= 1 && page <= total) pages.add(page);
    }
    return [...pages].sort((a, b) => a - b);
  }

  function goToVisualPage(page) {
    const meta = lastResponse?.meta || {};
    const pageSize = Number(meta.page_size || 20);
    const neededApiPage = Math.floor(((page - 1) * VISUAL_PAGE_SIZE) / pageSize) + 1;
    pendingVisualPage = page;
    if (neededApiPage === Number(meta.page || 1)) {
      renderResults(lastResponse);
    } else if (lastPayload) {
      runSearch({ ...lastPayload, page: neededApiPage });
    }
  }

  function addPageButton(label, page, current, disabled = false, ariaLabel = "") {
    const pageButton = document.createElement("button");
    pageButton.type = "button";
    pageButton.textContent = label;
    pageButton.disabled = disabled;
    if (ariaLabel) pageButton.setAttribute("aria-label", ariaLabel);
    if (page === current) pageButton.setAttribute("aria-current", "page");
    pageButton.addEventListener("click", () => {
      if (page === current) return;
      goToVisualPage(page);
    });
    pagination.append(pageButton);
  }

  function renderPagination(meta) {
    const pageSize = Number(meta.page_size || 20);
    const total = Number(meta.total_results || 0);
    const apiPages = Number(meta.total_pages || 1);
    const reachable = meta.pagination_limited ? apiPages * pageSize : total;
    const totalVisual = Math.max(1, Math.ceil(reachable / VISUAL_PAGE_SIZE));
    pagination.replaceChildren();
    if (totalVisual <= 1) {
      pagination.hidden = true;
      return;
    }
    addPageButton("‹", visualPage - 1, visualPage, visualPage === 1, t("previousPage"));
    const pages = pageItems(visualPage, totalVisual);
    pages.forEach((page, index) => {
      if (index && page - pages[index - 1] > 1) appendText(pagination, "span", "", "…");
      addPageButton(String(page), page, visualPage, false, t("pageLabel", { page }));
    });
    addPageButton("›", visualPage + 1, visualPage, visualPage === totalVisual, t("nextPage"));
    pagination.hidden = false;
  }

  function renderResults(response) {
    clearResults();
    lastResponse = response;
    const items = Array.isArray(response.results) ? response.results : [];
    if (!items.length) {
      renderEmpty(response);
      return;
    }

    const meta = response.meta || {};
    const total = Number(meta.total_results || items.length);
    const apiPage = Number(meta.page || 1);
    const pageSize = Number(meta.page_size || 20);
    const apiFirst = (apiPage - 1) * pageSize;
    const noun = total === 1 ? t("sourceMatch") : t("sourceMatches");
    resultsTitle.textContent = `${total.toLocaleString("en-IN")} ${noun}`;

    if (Number.isFinite(meta.indexed_records)) {
      indexedCount.textContent = Number(meta.indexed_records).toLocaleString("en-IN");
    }

    if (total === 1) {
      visualPage = 1;
      pendingVisualPage = null;
      appendText(resultSummary, "div", "result-summary", t("singleSummary"));
      revealDetail(items[0], 1, false);
      showResultsSheet();
      return;
    }

    const firstVisual = Math.floor(apiFirst / VISUAL_PAGE_SIZE) + 1;
    const lastVisual = Math.floor((apiFirst + items.length - 1) / VISUAL_PAGE_SIZE) + 1;
    let page = pendingVisualPage ?? visualPage;
    if (page < firstVisual || page > lastVisual) page = firstVisual;
    pendingVisualPage = null;
    visualPage = page;

    const globalFirst = (page - 1) * VISUAL_PAGE_SIZE;
    const slice = items.slice(globalFirst - apiFirst, globalFirst - apiFirst + VISUAL_PAGE_SIZE);

    appendText(resultSummary, "div", "result-summary", t("multipleSummary", {
      first: (globalFirst + 1).toLocaleString("en-IN"),
      last: (globalFirst + slice.length).toLocaleString("en-IN"),
      total: total.toLocaleString("en-IN"),
    }));
    if (meta.pagination_limited) {
      appendText(
        resultSummary,
        "div",
        "pagination-limit-note",
        t("privacyLimit", {
          count: (pageSize * Number(meta.total_pages || 0)).toLocaleString("en-IN"),
        }),
      );
    }

    resultTableHeading.hidden = false;
    const fragment = document.createDocumentFragment();
    slice.forEach((item, index) => {
      fragment.append(renderCompactRow(item, globalFirst + index + 1));
    });
    resultList.append(fragment);
    renderPagination(meta);
    showResultsSheet();
  }

  async function runSearch(payload) {
    if (activeRequest) activeRequest.abort();
    closeDetail();
    const controller = new AbortController();
    activeRequest = controller;
    const timeout = window.setTimeout(() => controller.abort(), 15_000);
    setLoading(true);

    try {
      const response = await fetch(`${apiBaseUrl}/v1/search`, {
        method: "POST",
        mode: "cors",
        cache: "no-store",
        credentials: "omit",
        referrerPolicy: "no-referrer",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
        signal: controller.signal,
      });
      if (!response.ok) throw new Error(await parseError(response));
      const body = await response.json();
      lastPayload = { ...payload, page: Number(body.meta?.page || payload.page) };
      renderResults(body);
    } catch (error) {
      if (error.name === "AbortError") {
        showError(t("timeout"));
      } else {
        showError(error.message || t("serviceUnavailable"));
      }
    } finally {
      window.clearTimeout(timeout);
      if (activeRequest === controller) {
        activeRequest = null;
        setLoading(false);
      }
    }
  }

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    if (!resultsSection.hidden) {
      // The plaque reads "New search maadi" while a results sheet is up:
      // it returns the visitor to the form instead of re-submitting.
      if (activeRequest) return;
      closeDetail();
      clearResults();
      showFormSheet();
      return;
    }
    clearValidation();
    if (clean(contactField.value)) return;
    const payload = payloadFromForm(1);
    if (!validate(payload)) return;
    if (!apiBaseUrl || apiBaseUrl.includes("REPLACE_WITH")) {
      showError(t("connectionPending"));
      return;
    }
    visualPage = 1;
    pendingVisualPage = null;
    runSearch(payload);
  });

  nameModeButton.addEventListener("click", () => setSearchMode("name"));
  epicModeButton.addEventListener("click", () => setSearchMode("epic"));
  districtSelect.addEventListener("change", () => {
    populateConstituencies();
    clearValidation();
  });
  constituencySelect.addEventListener("change", () => {
    showCoverageWarning();
    clearValidation();
  });

  newSearch.addEventListener("click", () => {
    form.reset();
    renderAllLetterEntries();
    setSearchMode("epic", false);
    populateConstituencies();
    clearValidation();
    clearResults();
    lastPayload = null;
    lastResponse = null;
    visualPage = 1;
    pendingVisualPage = null;
    showFormSheet();
  });

  sheetBack.addEventListener("click", () => {
    closeDetail();
    if (lastResponse) renderResults(lastResponse);
  });

  districtSelect.disabled = true;
  button.disabled = true;
  languageToggle.addEventListener("change", () => {
    setLanguage(languageToggle.checked ? "kn" : "en");
  });
  applyStaticCopy();
  setSearchMode("epic", false);
  loadLocations();
})();
