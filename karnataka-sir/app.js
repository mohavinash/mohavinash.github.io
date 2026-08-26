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
  const wallAction = document.querySelector(".wall-action");
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
  const resultViewToggle = document.querySelector("#result-view-toggle");
  const newSearch = document.querySelector("#new-search");
  const cardTemplate = document.querySelector("#result-card-template");
  const rowTemplate = document.querySelector("#result-row-template");
  const asddoIndexedCount = document.querySelector("#asddo-indexed-count");
  const rollIndexedCount = document.querySelector("#roll-indexed-count");
  const languageToggle = document.querySelector("#language-toggle");

  const COPY = {
    en: {
      deskLabel: "Counter 03 · Voter records",
      eyebrow: "Karnataka SIR 2026 · Draft roll and ASDDO records",
      title: "Check your Karnataka voter record.",
      formInstruction: "Search with your EPIC ID or name.",
      nameMode: "By name",
      epicMode: "EPIC ID",
      nameLabel: "Voter name (as per EPIC ID, minimum three letters required)",
      relativeLabel: "Relative’s name (optional; helps narrow the match)",
      epicLabel: "EPIC ID (combination of three letters and seven digits)",
      locationLegend: "Which office cupboard?",
      districtLabel: "District",
      constituencyLabel: "Assembly constituency",
      locationHelp: "Choose the district and Assembly constituency used in the voter record.",
      searchButton: "Search records",
      searching: "Searching…",
      resultsEyebrow: "File opened · Search results",
      resultsTitle: "Matches in these indexes",
      startOver: "Start over ↺",
      searchAgain: "Search again",
      backToList: "← Back to the list",
      chalkAsddoIndexed: "ASDDO records",
      chalkRollIndexed: "draft-roll records",
      chalkSnapshot: "Two separate indexes · all 224 constituencies",
      mixedVerdictPrompt: "These records match your search. Open your own record below to see what applies to you.",
      stampPresent: "Present",
      stampRemoved: "Missing from draft",
      stampNotFound: "Not found",
      stampPending: "Pending",
      statusAsddo: "ASDDO record",
      statusRoll: "Present in the draft roll",
      statusNotFound: "No indexed match",
      statusPending: "Draft-roll check pending",
      matchedBy: "matched by: {quality}",
      verdictAsddoTitle: "This record appears in an ASDDO file.",
      verdictAsddoBody: "The file gives the reason shown below. Check the official draft roll, then file Form 6 with the SIR Declaration by 23 September 2026 when your name is missing there.",
      verdictRollTitle: "Your name appears in the draft electoral roll.",
      verdictRollBody: "Open ECI’s official search and check the polling station. For a changed address or spelling, file Form 8 by 23 September 2026.",
      overlapDifferentBooth: "This EPIC appears in an ASDDO file for one booth and in the draft roll for another. Open the draft entry and check the address, then use Form 8 by 23 September 2026 for a change.",
      overlapSameBooth: "This EPIC appears in both files for the same booth. Ask the ERO to confirm the active entry in writing.",
      verdictNotFoundTitle: "We could not find this entry in either index.",
      verdictNotFoundBody: "Search ECI’s official draft roll with the EPIC ID. Your BLO or ERO can check the record and guide your next filing.",
      verdictPendingTitle: "The draft-roll index is unavailable.",
      verdictPendingBody: "Open ECI’s official search. Your ERO can check the record when the portal cannot find it.",
      stepsTitle: "If your record appears in an ASDDO file",
      step1Lead: "Check the official draft roll.",
      step1Body: "Search with the EPIC ID. Compare your name, address, polling station and part number.",
      step2Lead: "File Form 6 by 23 September.",
      step2Body: "Include the prescribed SIR Declaration. Submit through the Voters’ Service Portal or give the form to the ERO for your current address.",
      step3Lead: "Attach the papers that apply to your case.",
      step3Body: "Form 6 lists accepted proof of age and address. The ERO may ask for papers required by the SIR process.",
      step4Lead: "Use Form 8 for a move or correction.",
      step4Body: "Send it by 23 September through the portal or give it to the ERO for your current address.",
      step5Lead: "Keep your acknowledgement.",
      step5Body: "Track the application in the Voters’ Service Portal. Call 1950 for help finding your BLO or ERO.",
      clarificationTitle: "If the ERO asks for clarification",
      noticeStep1Lead: "Read the notice first.",
      noticeStep1Body: "It gives the response deadline and your hearing details.",
      noticeStep2Lead: "Send the requested papers.",
      noticeStep2Body: "Use Submit Document Against Notice in the Voters’ Service Portal, or give the papers to the ERO named on the notice.",
      noticeStep3Lead: "Attend the hearing.",
      noticeStep3Body: "Carry the notice and the papers requested for your case. Ask for an acknowledgement after an in-person submission.",
      noticeStep4Lead: "Keep the written order.",
      noticeStep4Body: "File an appeal with the District Election Officer within 15 days of the ERO's order.",
      noticePortal: "Submit notice papers or an appeal",
      datesEyebrow: "Schedule checked 26 August 2026",
      datesTitle: "Dates to keep in view",
      d1Label: "24 Aug 2026",
      d1Body: "Karnataka published the draft electoral roll.",
      d2Label: "By 23 Sep 2026",
      d2Body: "Claims and objections close. Use Form 6 for a missing name; Form 8 covers a move or correction.",
      d3Label: "By 22 Oct 2026",
      d3Body: "EROs finish the notice phase and decide filings by this date.",
      d4Label: "27 Oct 2026",
      d4Body: "The final electoral roll is due on this date.",
      countersTitle: "Official counters",
      eciPortal: "ECI Voters’ Service Portal",
      officialForms: "Official forms",
      ceoHome: "CEO Karnataka",
      helpline: "Karnataka voter helplines:",
      ceoUpdate: "CEO guidance, 8 August",
      eciSchedule: "Revised SIR schedule, 7 August",
      form6: "Form 6 for inclusion",
      form8: "Form 8 for a move or correction",
      appealFaq: "ECI guidance on electoral-roll appeals",
      methodTitle: "What these two indexes contain",
      stat1: "ASDDO records carrying a stated reason.",
      stat2: "ASDDO electoral parts represented.",
      stat3: "records in the draft electoral roll.",
      stat4: "draft-roll electoral parts represented.",
      stat5: "Assembly constituencies represented across both indexes.",
      stat6: "mapping-only rows have no searchable voter record. Two source folder listings could not be read during the refresh.",
      methodNote: "The search reads Karnataka’s ASDDO files and draft electoral roll. Each result names its source. PDF text can carry spelling errors. Some source files could not be read, and mapping-only rows have no searchable voter record. The counts describe records in each index.",
      aboutIndex: "DataChutney built this unofficial search from public ASDDO files and Karnataka’s draft electoral roll. Check every match in ECI’s official search; your ERO decides each electoral-roll application.",
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
      zeroTitle: "Zero matches in these indexes",
      zeroStrong: "The search returned zero indexed matches.",
      zeroBody: "Try the EPIC ID in ECI’s official search. A BLO or ERO can check the record.",
      matchEpic: "Exact EPIC ID match",
      matchExact: "Exact name match",
      matchPossible: "Possible name match",
      nameUnavailableFull: "Name unavailable in extracted record",
      relativeFallback: "relative",
      relativeUnavailable: "Relative name unavailable in the extracted record.",
      partSerial: "Part {part} · Serial {serial}",
      duplicateNote: "The source’s duplicate/reference EPIC ID reads: {id}",
      sourceTitle: "Source: {title}",
      archiveMember: "Archive member: {archive}",
      openSource: "Open source document",
      openArchive: "Open source archive",
      downloadSource: "Download source PDF",
      tooMany: "Too many requests. Wait a moment, then try again.",
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
      expandResults: "Expand & scroll",
      usePages: "Use pages",
      loadMoreResults: "Load more matches",
      loadingMoreResults: "Loading more matches…",
      scrollSummary: "Showing {shown} of {total}. Scroll through the matches and open your own record for details.",
      narrowResults: "Many matches. Add more of the voter’s name or the relative’s name to narrow the results.",
      sourceMatch: "record match",
      sourceMatches: "record matches",
      singleSummary: "Opening the matching record. Its EPIC ID and record details will appear below.",
      multipleSummary: "Showing {first} to {last} of {total}. Open a row for its EPIC ID and record details.",
      privacyLimit: "For privacy, only the first {count} matches appear. Add more of the name to narrow it.",
      timeout: "The search took too long. Please try again.",
      connectionPending: "The search counter is not connected yet.",
      factEpic: "EPIC ID",
      factReason: "Reason printed",
      factDistrict: "District / publication unit",
      factConstituency: "Assembly constituency",
      factPart: "Part / roll serial",
      factStatus: "Status",
      factPollingStation: "Polling station",
      factPollingAddress: "Polling-station address",
      factAcPart: "Assembly constituency / part / serial",
      acPartSerial: "AC {ac} · Part {part} · Serial {serial}",
      verifyLine: "Check this match in ECI’s official search. Your ERO decides the application.",
      verifyRollLine: "Check these polling-station details in ECI’s official search. Ask the ERO about any discrepancy.",
      rowVoter: "Voter",
      rowRelative: "Relative",
      rowReason: "Status",
      rowOpen: "Open",
      officialSearch: "Official electoral search",
      ceoPage: "CEO Karnataka ASDDO page",
      contacts: "Find BLO / ERO contacts",
      footerLine: "Independent tools for navigating public information.",
      previewLine: "Check each result in ECI’s official search. Your ERO handles applications and notices.",
    },
    kn: {
      deskLabel: "ಕೌಂಟರ್ ೦೩ · ಮತದಾರರ ದಾಖಲೆಗಳು",
      eyebrow: "ಕರ್ನಾಟಕ ಎಸ್‌ಐಆರ್ 2026 · ಕರಡು ಪಟ್ಟಿ ಮತ್ತು ಎಎಸ್‌ಡಿಡಿಒ ದಾಖಲೆಗಳು",
      title: "ನಿಮ್ಮ ಕರ್ನಾಟಕ ಮತದಾರರ ದಾಖಲೆಯನ್ನು ಪರಿಶೀಲಿಸಿ.",
      formInstruction: "ಇಪಿಐಸಿ ಐಡಿ ಅಥವಾ ಹೆಸರಿನಿಂದ ಹುಡುಕಿ.",
      nameMode: "ಹೆಸರಿನಿಂದ",
      epicMode: "ಇಪಿಐಸಿ ಐಡಿ",
      nameLabel: "ಮತದಾರರ ಹೆಸರು (ಇಪಿಐಸಿ ಐಡಿಯಲ್ಲಿರುವಂತೆ, ಕನಿಷ್ಠ ಮೂರು ಅಕ್ಷರಗಳು ಅಗತ್ಯ)",
      relativeLabel: "ಸಂಬಂಧಿಯ ಹೆಸರು (ಐಚ್ಛಿಕ; ಹೊಂದಾಣಿಕೆಯನ್ನು ನಿಖರಗೊಳಿಸಲು ಸಹಾಯಕ)",
      epicLabel: "ಇಪಿಐಸಿ ಐಡಿ (ಮೂರು ಅಕ್ಷರಗಳು ಮತ್ತು ಏಳು ಅಂಕೆಗಳ ಸಂಯೋಜನೆ)",
      locationLegend: "ಕಡತ ಯಾವ ಕಪಾಟಿನಲ್ಲಿ?",
      districtLabel: "ಜಿಲ್ಲೆ",
      constituencyLabel: "ವಿಧಾನಸಭಾ ಕ್ಷೇತ್ರ",
      locationHelp: "ಮತದಾರರ ದಾಖಲೆಯಲ್ಲಿರುವ ಜಿಲ್ಲೆ ಮತ್ತು ವಿಧಾನಸಭಾ ಕ್ಷೇತ್ರವನ್ನು ಆಯ್ಕೆಮಾಡಿ.",
      searchButton: "ಕಡತ ಪರಿಶೀಲಿಸಿ",
      searching: "ಸ್ವಲ್ಪ ಕಾಯಿರಿ…",
      resultsEyebrow: "ಕಡತ ತೆರೆದಿದೆ · ಹುಡುಕಾಟದ ಫಲಿತಾಂಶ",
      resultsTitle: "ಈ ಸೂಚಿಗಳಲ್ಲಿನ ಹೊಂದಾಣಿಕೆಗಳು",
      startOver: "ಮತ್ತೆ ಹುಡುಕಿ ↺",
      searchAgain: "ಮತ್ತೊಮ್ಮೆ ಹುಡುಕಿ",
      backToList: "← ಪಟ್ಟಿಗೆ ಹಿಂತಿರುಗಿ",
      chalkAsddoIndexed: "ಎಎಸ್‌ಡಿಡಿಒ ದಾಖಲೆಗಳು",
      chalkRollIndexed: "ಕರಡು ಪಟ್ಟಿಯ ದಾಖಲೆಗಳು",
      chalkSnapshot: "ಎರಡು ಪ್ರತ್ಯೇಕ ಸೂಚಿಗಳು · ಎಲ್ಲ 224 ಕ್ಷೇತ್ರಗಳು",
      mixedVerdictPrompt: "ಈ ದಾಖಲೆಗಳು ನಿಮ್ಮ ಹುಡುಕಾಟಕ್ಕೆ ಹೊಂದಿಕೆಯಾಗುತ್ತವೆ. ನಿಮಗೆ ಯಾವುದು ಅನ್ವಯಿಸುತ್ತದೆ ಎಂಬುದನ್ನು ನೋಡಲು ಕೆಳಗೆ ನಿಮ್ಮದೇ ದಾಖಲೆಯನ್ನು ತೆರೆಯಿರಿ.",
      stampPresent: "ಇದೆ",
      stampRemoved: "ಕರಡು ಪಟ್ಟಿಯಲ್ಲಿ ಇಲ್ಲ",
      stampNotFound: "ಸಿಗಲಿಲ್ಲ",
      stampPending: "ಬಾಕಿ ಇದೆ",
      statusAsddo: "ಎಎಸ್‌ಡಿಡಿಒ ದಾಖಲೆ",
      statusRoll: "ಕರಡು ಪಟ್ಟಿಯಲ್ಲಿ ಹೆಸರು ಇದೆ",
      statusNotFound: "ಸೂಚಿಯಲ್ಲಿ ಹೊಂದಾಣಿಕೆ ಇಲ್ಲ",
      statusPending: "ಕರಡು ಪಟ್ಟಿ ಪರಿಶೀಲನೆ ಬಾಕಿ",
      matchedBy: "ಹೊಂದಾಣಿಕೆ: {quality}",
      verdictAsddoTitle: "ಈ ದಾಖಲೆ ಎಎಸ್‌ಡಿಡಿಒ ಕಡತದಲ್ಲಿದೆ.",
      verdictAsddoBody: "ಕಡತದಲ್ಲಿ ನಮೂದಿಸಿದ ಕಾರಣ ಕೆಳಗೆ ಕಾಣುತ್ತದೆ. ಅಧಿಕೃತ ಕರಡು ಪಟ್ಟಿಯನ್ನು ಪರಿಶೀಲಿಸಿ; ಅದರಲ್ಲಿ ನಿಮ್ಮ ಹೆಸರು ಇಲ್ಲದಿದ್ದರೆ 23 ಸೆಪ್ಟೆಂಬರ್ 2026ರೊಳಗೆ ಎಸ್‌ಐಆರ್ ಘೋಷಣೆಯೊಂದಿಗೆ ಫಾರ್ಮ್ 6 ಸಲ್ಲಿಸಿ.",
      verdictRollTitle: "ಕರಡು ಮತದಾರರ ಪಟ್ಟಿಯಲ್ಲಿ ನಿಮ್ಮ ಹೆಸರು ಇದೆ.",
      verdictRollBody: "ಇಸಿಐ ಅಧಿಕೃತ ಹುಡುಕಾಟದಲ್ಲಿ ಮತಗಟ್ಟೆಯನ್ನು ಪರಿಶೀಲಿಸಿ. ವಿಳಾಸ ಅಥವಾ ಹೆಸರಿನ ತಿದ್ದುಪಡಿಗೆ 23 ಸೆಪ್ಟೆಂಬರ್ 2026ರೊಳಗೆ ಫಾರ್ಮ್ 8 ಸಲ್ಲಿಸಿ.",
      overlapDifferentBooth: "ಈ ಇಪಿಐಸಿ ಒಂದು ಮತಗಟ್ಟೆಯ ಎಎಸ್‌ಡಿಡಿಒ ಕಡತದಲ್ಲೂ ಇನ್ನೊಂದು ಮತಗಟ್ಟೆಯ ಕರಡು ಪಟ್ಟಿಯಲ್ಲೂ ಕಾಣುತ್ತದೆ. ಕರಡು ದಾಖಲೆಯ ವಿಳಾಸ ಪರಿಶೀಲಿಸಿ; ಬದಲಾವಣೆ ಬೇಕಾದರೆ 23 ಸೆಪ್ಟೆಂಬರ್ 2026ರೊಳಗೆ ಫಾರ್ಮ್ 8 ಸಲ್ಲಿಸಿ.",
      overlapSameBooth: "ಈ ಇಪಿಐಸಿ ಒಂದೇ ಮತಗಟ್ಟೆಗೆ ಸಂಬಂಧಿಸಿದ ಎರಡೂ ಕಡತಗಳಲ್ಲಿ ಕಾಣುತ್ತದೆ. ಯಾವ ದಾಖಲೆ ಚಾಲ್ತಿಯಲ್ಲಿದೆ ಎಂಬುದನ್ನು ಇಆರ್‌ಒ ಅವರಿಂದ ಲಿಖಿತವಾಗಿ ಖಚಿತಪಡಿಸಿಕೊಳ್ಳಿ.",
      verdictNotFoundTitle: "ಎರಡೂ ಸೂಚಿಗಳಲ್ಲಿ ಈ ದಾಖಲೆ ಸಿಗಲಿಲ್ಲ.",
      verdictNotFoundBody: "ಇಪಿಐಸಿ ಐಡಿಯೊಂದಿಗೆ ಇಸಿಐ ಅಧಿಕೃತ ಕರಡು ಪಟ್ಟಿಯಲ್ಲಿ ಹುಡುಕಿ. ನಿಮ್ಮ ಬಿಎಲ್‌ಒ ಅಥವಾ ಇಆರ್‌ಒ ದಾಖಲೆ ಪರಿಶೀಲಿಸಿ, ಸೂಕ್ತ ಅರ್ಜಿಯನ್ನು ತಿಳಿಸಬಹುದು.",
      verdictPendingTitle: "ಕರಡು ಪಟ್ಟಿಯ ಸೂಚಿ ಲಭ್ಯವಿಲ್ಲ.",
      verdictPendingBody: "ಇಸಿಐ ಅಧಿಕೃತ ಹುಡುಕಾಟವನ್ನು ತೆರೆಯಿರಿ. ಪೋರ್ಟಲ್‌ನಲ್ಲಿ ದಾಖಲೆ ಸಿಗದಿದ್ದರೆ ನಿಮ್ಮ ಇಆರ್‌ಒ ಅದನ್ನು ಪರಿಶೀಲಿಸಬಹುದು.",
      stepsTitle: "ನಿಮ್ಮ ದಾಖಲೆ ಎಎಸ್‌ಡಿಡಿಒ ಕಡತದಲ್ಲಿದ್ದರೆ",
      step1Lead: "ಅಧಿಕೃತ ಕರಡು ಪಟ್ಟಿ ಪರಿಶೀಲಿಸಿ.",
      step1Body: "ಇಪಿಐಸಿ ಐಡಿಯಿಂದ ಹುಡುಕಿ. ಹೆಸರು, ವಿಳಾಸ, ಮತಗಟ್ಟೆ ಮತ್ತು ಭಾಗ ಸಂಖ್ಯೆಯನ್ನು ಹೋಲಿಸಿ.",
      step2Lead: "23 ಸೆಪ್ಟೆಂಬರ್ ಒಳಗೆ ಫಾರ್ಮ್ 6 ಸಲ್ಲಿಸಿ.",
      step2Body: "ನಿಗದಿತ ಎಸ್‌ಐಆರ್ ಘೋಷಣೆಯನ್ನು ಸೇರಿಸಿ. ಮತದಾರರ ಸೇವಾ ಪೋರ್ಟಲ್ ಮೂಲಕ ಸಲ್ಲಿಸಬಹುದು; ನಿಮ್ಮ ಪ್ರಸ್ತುತ ವಿಳಾಸದ ಇಆರ್‌ಒ ಅವರಿಗೂ ಕೊಡಬಹುದು.",
      step3Lead: "ನಿಮ್ಮ ಪ್ರಕರಣಕ್ಕೆ ಬೇಕಾದ ದಾಖಲೆಗಳನ್ನು ಸೇರಿಸಿ.",
      step3Body: "ವಯಸ್ಸು ಮತ್ತು ವಿಳಾಸಕ್ಕೆ ಸ್ವೀಕರಿಸುವ ದಾಖಲೆಗಳು ಫಾರ್ಮ್ 6ರಲ್ಲಿ ಇವೆ. ಎಸ್‌ಐಆರ್ ಪ್ರಕ್ರಿಯೆಗೆ ಸಂಬಂಧಿಸಿದ ದಾಖಲೆಗಳನ್ನು ಇಆರ್‌ಒ ಕೇಳಬಹುದು.",
      step4Lead: "ಸ್ಥಳಾಂತರ ಅಥವಾ ತಿದ್ದುಪಡಿಗೆ ಫಾರ್ಮ್ 8 ಬಳಸಿ.",
      step4Body: "23 ಸೆಪ್ಟೆಂಬರ್ ಒಳಗೆ ಪೋರ್ಟಲ್ ಮೂಲಕ ಅಥವಾ ನಿಮ್ಮ ಪ್ರಸ್ತುತ ವಿಳಾಸದ ಇಆರ್‌ಒ ಅವರಿಗೆ ಸಲ್ಲಿಸಿ.",
      step5Lead: "ಸ್ವೀಕೃತಿ ಇಟ್ಟುಕೊಳ್ಳಿ.",
      step5Body: "ಮತದಾರರ ಸೇವಾ ಪೋರ್ಟಲ್‌ನಲ್ಲಿ ಅರ್ಜಿಯ ಸ್ಥಿತಿ ನೋಡಿ. ಬಿಎಲ್‌ಒ ಅಥವಾ ಇಆರ್‌ಒ ಸಂಪರ್ಕಕ್ಕಾಗಿ 1950ಗೆ ಕರೆ ಮಾಡಿ.",
      clarificationTitle: "ಇಆರ್‌ಒ ಸ್ಪಷ್ಟನೆ ಕೇಳಿದರೆ",
      noticeStep1Lead: "ಮೊದಲು ನೋಟಿಸ್ ಓದಿ.",
      noticeStep1Body: "ಅದರಲ್ಲಿ ಉತ್ತರದ ಕೊನೆಯ ದಿನ ಮತ್ತು ವಿಚಾರಣೆಯ ವಿವರಗಳು ಇರುತ್ತವೆ.",
      noticeStep2Lead: "ಕೇಳಿದ ದಾಖಲೆಗಳನ್ನು ಸಲ್ಲಿಸಿ.",
      noticeStep2Body: "ಮತದಾರರ ಸೇವಾ ಪೋರ್ಟಲ್‌ನಲ್ಲಿ ನೋಟಿಸ್‌ಗೆ ದಾಖಲೆ ಸಲ್ಲಿಸುವ ಸೇವೆ ಬಳಸಿ, ಅಥವಾ ನೋಟಿಸ್‌ನಲ್ಲಿ ಹೆಸರಿಸಿರುವ ಇಆರ್‌ಒ ಅವರಿಗೆ ದಾಖಲೆಗಳನ್ನು ಕೊಡಿ.",
      noticeStep3Lead: "ವಿಚಾರಣೆಗೆ ಹಾಜರಾಗಿ.",
      noticeStep3Body: "ನೋಟಿಸ್ ಮತ್ತು ನಿಮ್ಮ ಪ್ರಕರಣಕ್ಕೆ ಕೇಳಿದ ದಾಖಲೆಗಳನ್ನು ತೆಗೆದುಕೊಂಡು ಹೋಗಿ. ಕಚೇರಿಯಲ್ಲಿ ಸಲ್ಲಿಸಿದ ನಂತರ ಸ್ವೀಕೃತಿ ಕೇಳಿ.",
      noticeStep4Lead: "ಲಿಖಿತ ಆದೇಶವನ್ನು ಇಟ್ಟುಕೊಳ್ಳಿ.",
      noticeStep4Body: "ಇಆರ್‌ಒ ಆದೇಶದ ದಿನಾಂಕದಿಂದ 15 ದಿನಗಳೊಳಗೆ ಜಿಲ್ಲಾ ಚುನಾವಣಾಧಿಕಾರಿಗೆ ಮೇಲ್ಮನವಿ ಸಲ್ಲಿಸಿ.",
      noticePortal: "ನೋಟಿಸ್ ದಾಖಲೆ ಅಥವಾ ಮೇಲ್ಮನವಿ ಸಲ್ಲಿಸಿ",
      datesEyebrow: "ವೇಳಾಪಟ್ಟಿ ಪರಿಶೀಲನೆ: 26 ಆಗಸ್ಟ್ 2026",
      datesTitle: "ಗಮನದಲ್ಲಿಡಬೇಕಾದ ದಿನಾಂಕಗಳು",
      d1Label: "24 ಆಗಸ್ಟ್ 2026",
      d1Body: "ಕರ್ನಾಟಕದ ಕರಡು ಮತದಾರರ ಪಟ್ಟಿ ಪ್ರಕಟವಾಯಿತು.",
      d2Label: "23 ಸೆಪ್ಟೆಂಬರ್ 2026ರೊಳಗೆ",
      d2Body: "ಹಕ್ಕು ಮತ್ತು ಆಕ್ಷೇಪಣೆಗಳ ಅವಧಿ ಮುಗಿಯುತ್ತದೆ. ಹೆಸರು ಬಿಟ್ಟಿದ್ದರೆ ಫಾರ್ಮ್ 6 ಸಲ್ಲಿಸಿ; ಸ್ಥಳಾಂತರ ಅಥವಾ ತಿದ್ದುಪಡಿಗೆ ಫಾರ್ಮ್ 8 ಬಳಸಿ.",
      d3Label: "22 ಅಕ್ಟೋಬರ್ 2026ರೊಳಗೆ",
      d3Body: "ಇಆರ್‌ಒಗಳು ನೋಟಿಸ್ ಪ್ರಕ್ರಿಯೆ ಮತ್ತು ಅರ್ಜಿಗಳ ತೀರ್ಮಾನವನ್ನು ಈ ದಿನದೊಳಗೆ ಮುಗಿಸುತ್ತಾರೆ.",
      d4Label: "27 ಅಕ್ಟೋಬರ್ 2026",
      d4Body: "ಪರಿಷ್ಕೃತ ವೇಳಾಪಟ್ಟಿಯಂತೆ ಅಂತಿಮ ಪಟ್ಟಿ ಈ ದಿನ ಪ್ರಕಟವಾಗುತ್ತದೆ.",
      countersTitle: "ಅಧಿಕೃತ ಕೌಂಟರ್‌ಗಳು",
      eciPortal: "ಇಸಿಐ ಮತದಾರರ ಸೇವಾ ಪೋರ್ಟಲ್",
      officialForms: "ಅಧಿಕೃತ ಫಾರ್ಮ್‌ಗಳು",
      ceoHome: "ಸಿಇಒ ಕರ್ನಾಟಕ",
      helpline: "ಕರ್ನಾಟಕ ಮತದಾರರ ಸಹಾಯವಾಣಿ:",
      ceoUpdate: "ಸಿಇಒ ಮಾರ್ಗದರ್ಶನ, 8 ಆಗಸ್ಟ್",
      eciSchedule: "ಪರಿಷ್ಕೃತ ಎಸ್‌ಐಆರ್ ವೇಳಾಪಟ್ಟಿ, 7 ಆಗಸ್ಟ್",
      form6: "ಹೆಸರು ಸೇರಿಸಲು ಫಾರ್ಮ್ 6",
      form8: "ಸ್ಥಳಾಂತರ ಅಥವಾ ತಿದ್ದುಪಡಿಗೆ ಫಾರ್ಮ್ 8",
      appealFaq: "ಮತದಾರರ ಪಟ್ಟಿ ಮೇಲ್ಮನವಿಗೆ ಇಸಿಐ ಮಾರ್ಗದರ್ಶನ",
      methodTitle: "ಈ ಎರಡು ಸೂಚಿಗಳಲ್ಲಿ ಏನಿದೆ",
      stat1: "ಕಾರಣ ನಮೂದಾಗಿರುವ ಎಎಸ್‌ಡಿಡಿಒ ದಾಖಲೆಗಳು.",
      stat2: "ಒಳಗೊಂಡಿರುವ ಎಎಸ್‌ಡಿಡಿಒ ಮತದಾನ ಭಾಗಗಳು.",
      stat3: "ಕರಡು ಮತದಾರರ ಪಟ್ಟಿಯ ದಾಖಲೆಗಳು.",
      stat4: "ಒಳಗೊಂಡಿರುವ ಕರಡು ಪಟ್ಟಿಯ ಮತದಾನ ಭಾಗಗಳು.",
      stat5: "ಎರಡೂ ಸೂಚಿಗಳಲ್ಲಿ ಒಳಗೊಂಡಿರುವ ವಿಧಾನಸಭಾ ಕ್ಷೇತ್ರಗಳು.",
      stat6: "ಮ್ಯಾಪಿಂಗ್-ಮಾತ್ರ ಸಾಲುಗಳಲ್ಲಿ ಹುಡುಕಬಹುದಾದ ಮತದಾರರ ದಾಖಲೆ ಇಲ್ಲ. ನವೀಕರಣದ ವೇಳೆ ಎರಡು ಮೂಲ ಫೋಲ್ಡರ್ ಪಟ್ಟಿಗಳನ್ನು ಓದಲು ಸಾಧ್ಯವಾಗಲಿಲ್ಲ.",
      methodNote: "ಈ ಹುಡುಕಾಟವು ಕರ್ನಾಟಕದ ಎಎಸ್‌ಡಿಡಿಒ ಕಡತಗಳು ಮತ್ತು ಕರಡು ಮತದಾರರ ಪಟ್ಟಿಯನ್ನು ಓದುತ್ತದೆ. ಪ್ರತಿ ಫಲಿತಾಂಶವು ತನ್ನ ಮೂಲವನ್ನು ತೋರಿಸುತ್ತದೆ. ಪಿಡಿಎಫ್ ಪಠ್ಯದಲ್ಲಿ ಕಾಗುಣಿತ ದೋಷ ಇರಬಹುದು. ಕೆಲವು ಮೂಲ ಕಡತಗಳನ್ನು ಓದಲು ಸಾಧ್ಯವಾಗಲಿಲ್ಲ; ಮ್ಯಾಪಿಂಗ್-ಮಾತ್ರ ಸಾಲುಗಳಲ್ಲಿ ಹುಡುಕಬಹುದಾದ ಮತದಾರರ ದಾಖಲೆ ಇಲ್ಲ. ಸಂಖ್ಯೆಗಳು ಪ್ರತಿ ಸೂಚಿಯ ದಾಖಲೆಗಳನ್ನು ತೋರಿಸುತ್ತವೆ.",
      aboutIndex: "ಸಾರ್ವಜನಿಕ ಎಎಸ್‌ಡಿಡಿಒ ಕಡತಗಳು ಮತ್ತು ಕರ್ನಾಟಕದ ಕರಡು ಮತದಾರರ ಪಟ್ಟಿಯಿಂದ ಡೇಟಾಚಟ್ನಿ ಈ ಅನಧಿಕೃತ ಹುಡುಕಾಟವನ್ನು ರೂಪಿಸಿದೆ. ಪ್ರತಿ ಹೊಂದಾಣಿಕೆಯನ್ನು ಇಸಿಐ ಅಧಿಕೃತ ಹುಡುಕಾಟದಲ್ಲಿ ಪರಿಶೀಲಿಸಿ; ಮತದಾರರ ಪಟ್ಟಿಯ ಅರ್ಜಿಯನ್ನು ನಿಮ್ಮ ಇಆರ್‌ಒ ತೀರ್ಮಾನಿಸುತ್ತಾರೆ.",
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
      zeroTitle: "ಈ ಸೂಚಿಗಳಲ್ಲಿ ಹೊಂದಾಣಿಕೆ ಇಲ್ಲ",
      zeroStrong: "ಹುಡುಕಾಟದಲ್ಲಿ ಯಾವುದೇ ಸೂಚೀಕೃತ ಹೊಂದಾಣಿಕೆ ಸಿಗಲಿಲ್ಲ.",
      zeroBody: "ಇಪಿಐಸಿ ಐಡಿಯನ್ನು ಇಸಿಐ ಅಧಿಕೃತ ಹುಡುಕಾಟದಲ್ಲಿ ಪ್ರಯತ್ನಿಸಿ. ಬಿಎಲ್‌ಒ ಅಥವಾ ಇಆರ್‌ಒ ದಾಖಲೆಯನ್ನು ಪರಿಶೀಲಿಸಬಹುದು.",
      matchEpic: "ಇಪಿಐಸಿ ಐಡಿ ನಿಖರ ಹೊಂದಾಣಿಕೆ",
      matchExact: "ಹೆಸರಿನ ನಿಖರ ಹೊಂದಾಣಿಕೆ",
      matchPossible: "ಹೆಸರಿನ ಸಾಧ್ಯ ಹೊಂದಾಣಿಕೆ",
      nameUnavailableFull: "ಹೊರತೆಗೆದ ದಾಖಲೆಯಲ್ಲಿ ಹೆಸರು ಲಭ್ಯವಿಲ್ಲ",
      relativeFallback: "ಸಂಬಂಧಿ",
      relativeUnavailable: "ಹೊರತೆಗೆದ ದಾಖಲೆಯಲ್ಲಿ ಸಂಬಂಧಿಯ ಹೆಸರು ಲಭ್ಯವಿಲ್ಲ.",
      partSerial: "ಭಾಗ {part} · ಕ್ರಮ ಸಂಖ್ಯೆ {serial}",
      duplicateNote: "ಮೂಲದಲ್ಲಿರುವ ನಕಲಿ/ಉಲ್ಲೇಖ ಇಪಿಐಸಿ ಐಡಿ: {id}",
      sourceTitle: "ಮೂಲ: {title}",
      archiveMember: "ಆರ್ಕೈವ್ ಸದಸ್ಯ: {archive}",
      openSource: "ಮೂಲ ದಾಖಲೆ ತೆರೆಯಿರಿ",
      openArchive: "ಮೂಲ ಆರ್ಕೈವ್ ತೆರೆಯಿರಿ",
      downloadSource: "ಮೂಲ ಪಿಡಿಎಫ್ ಡೌನ್‌ಲೋಡ್ ಮಾಡಿ",
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
      expandResults: "ಫಲಿತಾಂಶಗಳನ್ನು ವಿಸ್ತರಿಸಿ ಸ್ಕ್ರೋಲ್ ಮಾಡಿ",
      usePages: "ಪುಟಗಳನ್ನು ಬಳಸಿ",
      loadMoreResults: "ಇನ್ನಷ್ಟು ಹೊಂದಾಣಿಕೆಗಳನ್ನು ತೋರಿಸಿ",
      loadingMoreResults: "ಇನ್ನಷ್ಟು ಹೊಂದಾಣಿಕೆಗಳನ್ನು ಲೋಡ್ ಮಾಡಲಾಗುತ್ತಿದೆ…",
      scrollSummary: "{total}ರಲ್ಲಿ {shown} ತೋರಿಸಲಾಗಿದೆ. ಹೊಂದಾಣಿಕೆಗಳನ್ನು ಸ್ಕ್ರೋಲ್ ಮಾಡಿ ಮತ್ತು ವಿವರಗಳಿಗಾಗಿ ನಿಮ್ಮ ದಾಖಲೆಯನ್ನು ತೆರೆಯಿರಿ.",
      narrowResults: "ಹೆಚ್ಚು ಹೊಂದಾಣಿಕೆಗಳಿವೆ. ಫಲಿತಾಂಶಗಳನ್ನು ನಿಖರಗೊಳಿಸಲು ಮತದಾರರ ಹೆಸರಿನ ಇನ್ನಷ್ಟು ಭಾಗವನ್ನು ಅಥವಾ ಸಂಬಂಧಿಯ ಹೆಸರನ್ನು ಸೇರಿಸಿ.",
      sourceMatch: "ದಾಖಲೆ ಹೊಂದಾಣಿಕೆ",
      sourceMatches: "ದಾಖಲೆ ಹೊಂದಾಣಿಕೆಗಳು",
      singleSummary: "ಹೊಂದಾಣಿಕೆಯ ದಾಖಲೆ ತೆರೆಯಲಾಗುತ್ತಿದೆ. ಇಪಿಐಸಿ ಐಡಿ ಮತ್ತು ದಾಖಲೆಯ ವಿವರಗಳು ಕೆಳಗೆ ಕಾಣುತ್ತವೆ.",
      multipleSummary: "{total}ರಲ್ಲಿ {first}ರಿಂದ {last}ರವರೆಗೆ ತೋರಿಸಲಾಗಿದೆ. ಇಪಿಐಸಿ ಐಡಿ ಮತ್ತು ದಾಖಲೆಯ ವಿವರಗಳನ್ನು ನೋಡಲು ಸಾಲನ್ನು ತೆರೆಯಿರಿ.",
      privacyLimit: "ಗೌಪ್ಯತೆಗಾಗಿ ಮೊದಲ {count} ಹೊಂದಾಣಿಕೆಗಳನ್ನು ಮಾತ್ರ ತೋರಿಸಲಾಗಿದೆ. ಹುಡುಕಾಟವನ್ನು ಕಿರಿದಾಗಿಸಲು ಹೆಸರಿನ ಇನ್ನಷ್ಟು ಭಾಗ ಸೇರಿಸಿ.",
      timeout: "ಹುಡುಕಾಟ ಹೆಚ್ಚು ಸಮಯ ತೆಗೆದುಕೊಂಡಿತು. ಮತ್ತೆ ಪ್ರಯತ್ನಿಸಿ.",
      connectionPending: "ಹುಡುಕಾಟ ಕೌಂಟರ್ ಇನ್ನೂ ಸಂಪರ್ಕಗೊಂಡಿಲ್ಲ.",
      factEpic: "ಇಪಿಐಸಿ ಐಡಿ",
      factReason: "ಮುದ್ರಿತ ಕಾರಣ",
      factDistrict: "ಜಿಲ್ಲೆ / ಪ್ರಕಟಣಾ ಘಟಕ",
      factConstituency: "ವಿಧಾನಸಭಾ ಕ್ಷೇತ್ರ",
      factPart: "ಭಾಗ / ಕ್ರಮ ಸಂಖ್ಯೆ",
      factStatus: "ಸ್ಥಿತಿ",
      factPollingStation: "ಮತಗಟ್ಟೆ",
      factPollingAddress: "ಮತಗಟ್ಟೆಯ ವಿಳಾಸ",
      factAcPart: "ವಿಧಾನಸಭಾ ಕ್ಷೇತ್ರ / ಭಾಗ / ಕ್ರಮ ಸಂಖ್ಯೆ",
      acPartSerial: "ಎಸಿ {ac} · ಭಾಗ {part} · ಕ್ರಮ ಸಂಖ್ಯೆ {serial}",
      verifyLine: "ಈ ಹೊಂದಾಣಿಕೆಯನ್ನು ಇಸಿಐ ಅಧಿಕೃತ ಹುಡುಕಾಟದಲ್ಲಿ ಪರಿಶೀಲಿಸಿ. ಅರ್ಜಿಯನ್ನು ನಿಮ್ಮ ಇಆರ್‌ಒ ತೀರ್ಮಾನಿಸುತ್ತಾರೆ.",
      verifyRollLine: "ಈ ಮತಗಟ್ಟೆಯ ವಿವರಗಳನ್ನು ಇಸಿಐ ಅಧಿಕೃತ ಹುಡುಕಾಟದಲ್ಲಿ ಪರಿಶೀಲಿಸಿ. ವ್ಯತ್ಯಾಸ ಕಂಡರೆ ಇಆರ್‌ಒ ಅವರನ್ನು ಕೇಳಿ.",
      rowVoter: "ಮತದಾರ",
      rowRelative: "ಸಂಬಂಧಿ",
      rowReason: "ಸ್ಥಿತಿ",
      rowOpen: "ತೆರೆಯಿರಿ",
      officialSearch: "ಅಧಿಕೃತ ಮತದಾರರ ಹುಡುಕಾಟ",
      ceoPage: "ಸಿಇಒ ಕರ್ನಾಟಕ ಎಎಸ್‌ಡಿಡಿಒ ಪುಟ",
      contacts: "ಬಿಎಲ್‌ಒ / ಇಆರ್‌ಒ ಸಂಪರ್ಕ ಹುಡುಕಿ",
      footerLine: "ಸಾರ್ವಜನಿಕ ಮಾಹಿತಿಗಾಗಿ ಸ್ವತಂತ್ರ ಸಾಧನಗಳು.",
      previewLine: "ಪ್ರತಿ ಫಲಿತಾಂಶವನ್ನು ಇಸಿಐ ಅಧಿಕೃತ ಹುಡುಕಾಟದಲ್ಲಿ ಪರಿಶೀಲಿಸಿ. ಅರ್ಜಿ ಮತ್ತು ನೋಟಿಸ್‌ಗಳನ್ನು ನಿಮ್ಮ ಇಆರ್‌ಒ ನೋಡಿಕೊಳ್ಳುತ್ತಾರೆ.",
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
  let resultViewMode = "paged";
  let scrollResults = [];
  let scrollMeta = null;
  let scrollNextPage = null;
  let scrollLoading = false;
  let scrollLoadController = null;
  let scrollObserver = null;
  let scrollQueryPayload = null;

  // Desktop keeps the compact paper view by default. Five rows fit the sheet;
  // visitors can switch to a scrollable list. Mobile starts in scroll mode.
  const VISUAL_PAGE_SIZE = 5;
  const MOBILE_RESULTS = window.matchMedia("(max-width: 900px)");

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
    const openDetail = expandedRow?.result ? { ...expandedRow } : null;
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
    if (lastResponse && !resultsSection.hidden) {
      if (openDetail) {
        sheetDetailBody.replaceChildren(renderCard(openDetail.result, openDetail.displayIndex));
        syncSheetStamp(openDetail.result);
        applyVerdictGuidance(openDetail.result.verdict || openDetail.summary?.verdict);
        expandedRow = { ...openDetail, detail: sheetDetailBody, controller: null };
      } else {
        renderResults(lastResponse);
      }
    }
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
    wallAction.hidden = true;
    setBoardActionsVisible(true);
    updatePlaqueLabel();
  }

  function showFormSheet(focus = true) {
    resultsSection.hidden = true;
    form.hidden = false;
    wallAction.hidden = false;
    setBoardActionsVisible(false);
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
    resultViewToggle.disabled = isLoading;
    updatePlaqueLabel();
    resultsSection.setAttribute("aria-busy", String(isLoading));
    pagination.querySelectorAll("button").forEach((pageButton) => {
      pageButton.disabled = isLoading;
    });
  }

  function applyVerdictGuidance(verdict) {
    const guidance = document.getElementById("verdict-guidance");
    const steps = document.getElementById("asddo-steps");
    const map = {
      ASDDO_LISTED: ["verdictAsddoTitle", "verdictAsddoBody"],
      ROLL_PRESENT: ["verdictRollTitle", "verdictRollBody"],
      NOT_FOUND: ["verdictNotFoundTitle", "verdictNotFoundBody"],
      ROLL_PENDING: ["verdictPendingTitle", "verdictPendingBody"],
    };
    const keys = map[verdict];
    if (!keys) {
      guidance.hidden = true;
      steps.hidden = true;
      return;
    }
    document.getElementById("verdict-title").textContent = t(keys[0]);
    document.getElementById("verdict-body").textContent = t(keys[1]);
    guidance.hidden = false;
    steps.hidden = verdict !== "ASDDO_LISTED";
  }

  function closeDetail() {
    if (expandedRow?.controller) expandedRow.controller.abort();
    expandedRow = null;
    sheetDetail.hidden = true;
    sheetDetailBody.replaceChildren();
  }

  function disconnectScrollObserver() {
    if (scrollObserver) scrollObserver.disconnect();
    scrollObserver = null;
  }

  function resetScrollState() {
    disconnectScrollObserver();
    if (scrollLoadController) scrollLoadController.abort();
    scrollLoadController = null;
    scrollLoading = false;
    scrollResults = [];
    scrollMeta = null;
    scrollNextPage = null;
  }

  function clearResults() {
    closeDetail();
    disconnectScrollObserver();
    applyVerdictGuidance(null);
    syncSheetStamp(null);
    resultSummary.replaceChildren();
    resultsSection.classList.remove("is-scroll-mode");
    resultList.hidden = false;
    resultList.classList.remove("is-scroll-mode");
    resultList.replaceChildren();
    resultTableHeading.hidden = true;
    resultViewToggle.hidden = true;
    pagination.replaceChildren();
    pagination.hidden = true;
  }

  function renderEmpty() {
    clearResults();
    resultsTitle.textContent = t("zeroTitle");
    const panel = document.createElement("div");
    panel.className = "empty-result";
    appendText(panel, "strong", "", t("zeroStrong"));
    appendText(panel, "span", "", t("zeroBody"));
    resultSummary.append(panel);
    showResultsSheet();
  }

  function matchLabel(quality) {
    if (quality === "exact_voter_id") return t("matchEpic");
    if (quality === "exact_names") return t("matchExact");
    return t("matchPossible");
  }

  function detailValue(value) {
    const text = String(value ?? "").trim();
    return text || t("unavailable");
  }

  function statusLabelFor(result) {
    switch (result?.verdict) {
      case "ASDDO_LISTED": return t("statusAsddo");
      case "ROLL_PRESENT": return t("statusRoll");
      case "NOT_FOUND": return t("statusNotFound");
      case "ROLL_PENDING": return t("statusPending");
      default: return detailValue(result?.status_label);
    }
  }

  function renderCard(result, displayIndex) {
    const isAsddo = result.verdict === "ASDDO_LISTED";
    const evidenceRows = isAsddo ? result.asddo_evidence : result.roll_evidence;
    const evidence = Array.isArray(evidenceRows) && evidenceRows[0] && typeof evidenceRows[0] === "object"
      ? evidenceRows[0]
      : {};
    const card = cardTemplate.content.firstElementChild.cloneNode(true);
    const badge = card.querySelector(".match-badge");
    badge.textContent = matchLabel(result.match_quality);
    if (result.match_quality === "name_prefix") badge.classList.add("match-badge--possible");
    card.querySelector(".result-index").textContent = String(displayIndex).padStart(2, "0");
    card.querySelector(".result-name").textContent = result.display_name
      || evidence.voter_name_english
      || t("nameUnavailableFull");
    const relationship = evidence.relationship_english
      ? String(evidence.relationship_english).toLowerCase()
      : t("relativeFallback");
    card.querySelector(".relative-line").textContent = evidence.relative_name_english
      ? `${relationship}: ${evidence.relative_name_english}`
      : t("relativeUnavailable");
    card.querySelector(".result-epic").textContent = detailValue(result.query_epic);
    const status = card.querySelector(".result-status");
    status.textContent = isAsddo
      ? detailValue(evidence.reason)
      : statusLabelFor(result);
    if (result.verdict) {
      status.classList.add("verdict-" + result.verdict.toLowerCase().replace(/_/g, "-"));
    }

    const factLabels = card.querySelectorAll(".result-facts dt");
    const factKeys = isAsddo
      ? ["factEpic", "factReason", "factDistrict", "factConstituency", "factPart"]
      : ["factEpic", "factStatus", "factPollingStation", "factPollingAddress", "factAcPart"];
    factKeys.forEach((key, index) => {
      if (factLabels[index]) factLabels[index].textContent = t(key);
    });

    if (isAsddo) {
      card.querySelector(".result-district").textContent = detailValue(evidence.publication_unit);
      const constituency = [
        evidence.ac_number == null ? "" : `AC ${evidence.ac_number}`,
        String(evidence.ac_name || "").trim(),
      ].filter(Boolean).join(" · ");
      card.querySelector(".result-ac").textContent = constituency || t("unavailable");
      card.querySelector(".result-part").textContent = t("partSerial", {
        part: detailValue(evidence.part_number),
        serial: detailValue(evidence.serial_number),
      });
      card.querySelector(".verify-line").textContent = t("verifyLine");
    } else {
      card.querySelector(".result-district").textContent = detailValue(evidence.polling_station);
      card.querySelector(".result-ac").textContent = detailValue(evidence.polling_station_address);
      card.querySelector(".result-part").textContent = t("acPartSerial", {
        ac: detailValue(evidence.ac_number),
        part: detailValue(evidence.part_number),
        serial: detailValue(evidence.serial_number),
      });
      card.querySelector(".verify-line").textContent = t("verifyRollLine");
    }

    const duplicateNote = card.querySelector(".duplicate-note");
    if (isAsddo && evidence.duplicate_epic) {
      duplicateNote.textContent = t("duplicateNote", { id: evidence.duplicate_epic });
      duplicateNote.hidden = false;
    }

    const overlapNote = card.querySelector(".overlap-note");
    if (isAsddo && result.also_in_roll) {
      overlapNote.textContent = t(result.overlap_same_booth
        ? "overlapSameBooth"
        : "overlapDifferentBooth");
      overlapNote.classList.toggle("overlap-note--contradiction", result.overlap_same_booth);
      overlapNote.hidden = false;
    }

    const sourceFileName = (isAsddo && (evidence.archive_member || evidence.source_title)) || "";

    const sourceLink = card.querySelector(".source-link");
    const sourceUrl = evidence.archive_member
      ? (evidence.download_url || evidence.viewer_url)
      : (evidence.viewer_url || evidence.download_url);
    if (isAsddo && sourceUrl) {
      sourceLink.href = sourceUrl;
      sourceLink.querySelector(".source-link-label").textContent = evidence.archive_member
        ? t("openArchive")
        : (evidence.viewer_url ? t("openSource") : t("downloadSource"));
      const fileEl = sourceLink.querySelector(".source-link-file");
      if (sourceFileName) {
        fileEl.textContent = sourceFileName;
        fileEl.title = sourceFileName;
      } else {
        fileEl.remove();
      }
      sourceLink.hidden = false;
    } else {
      sourceLink.remove();
    }
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
    const total = Number(lastResponse?.meta?.total_results || 0);
    resultViewToggle.hidden = !listVisible || total <= VISUAL_PAGE_SIZE;
    pagination.hidden = !listVisible
      || resultViewMode === "scroll"
      || !pagination.childElementCount;
    sheetDetail.hidden = listVisible;
    if (listVisible) {
      syncSheetStamp(null);
      if (sheetBack) sheetBack.hidden = true;
    }
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
      syncSheetStamp(result);
      applyVerdictGuidance(result.verdict || summary.verdict);
      expandedRow = {
        detail: sheetDetailBody,
        controller: null,
        result,
        summary,
        displayIndex,
        fromList,
      };
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

  function stampSpecFor(result) {
    if (!result || !result.verdict) return null;
    switch (result.verdict) {
      case "ROLL_PRESENT":
        return { key: "stampPresent", cls: "sheet-stamp--roll" };
      case "ASDDO_LISTED":
        // On the ASDDO list AND still on the revised roll -> not removed.
        return result.also_in_roll
          ? { key: "stampPresent", cls: "sheet-stamp--roll" }
          : { key: "stampRemoved", cls: "sheet-stamp--asddo" };
      case "NOT_FOUND":
        return { key: "stampNotFound", cls: "sheet-stamp--neutral" };
      case "ROLL_PENDING":
        return { key: "stampPending", cls: "sheet-stamp--neutral" };
      default:
        return null;
    }
  }

  function syncSheetStamp(result) {
    const stamp = document.querySelector("#sheet-stamp");
    if (!stamp) return;
    const spec = stampSpecFor(result);
    stamp.classList.remove("sheet-stamp--asddo", "sheet-stamp--roll", "sheet-stamp--neutral");
    if (!spec) {
      stamp.hidden = true;
      stamp.textContent = "";
      return;
    }
    stamp.textContent = t(spec.key);
    stamp.classList.add(spec.cls);
    stamp.hidden = false;
    const badge = sheetDetailBody.querySelector(".match-badge");
    if (badge) badge.hidden = true;
  }

  function setBoardActionsVisible(visible) {
    const wrap = document.querySelector("#board-actions");
    if (wrap) wrap.hidden = !visible;
  }

  function renderCompactRow(summary, displayIndex) {
    const item = rowTemplate.content.firstElementChild.cloneNode(true);
    const rowButton = item.querySelector(".result-row");
    item.querySelector(".row-name").textContent = summary.name || t("nameUnavailable");
    item.querySelector(".row-match").textContent = matchLabel(summary.match_quality);
    item.querySelector(".row-relative").textContent = summary.relative_name || t("unavailable");
    const status = item.querySelector(".row-status");
    status.textContent = statusLabelFor(summary);
    if (summary.verdict) {
      status.classList.add("verdict-" + summary.verdict.toLowerCase().replace("_", "-"));
    }
    rowButton.setAttribute("aria-label", t("openRecordFor", { name: summary.name || t("thisVoter") }));
    rowButton.addEventListener("click", () => {
      closeDetail();
      revealDetail(summary, displayIndex, true);
    });
    return item;
  }

  function updateResultViewToggle(total) {
    const scrollMode = resultViewMode === "scroll";
    const copyKey = scrollMode ? "usePages" : "expandResults";
    resultViewToggle.dataset.copy = copyKey;
    resultViewToggle.textContent = t(copyKey);
    resultViewToggle.setAttribute("aria-pressed", String(scrollMode));
    resultViewToggle.hidden = total <= VISUAL_PAGE_SIZE;
  }

  function renderResultNotices(items, meta, { first, last, scrollMode = false }) {
    resultSummary.replaceChildren();
    const total = Number(meta.total_results || items.length);
    const rowVerdicts = new Set(items.map((item) => item.verdict).filter(Boolean));
    const unanimousRows = rowVerdicts.size === 1
      && items.every((item) => Boolean(item.verdict));
    const mixedNameResults = meta.search_mode === "name" && !unanimousRows;
    const resultVerdict = meta.search_mode === "name"
      ? (unanimousRows ? items[0]?.verdict : null)
      : (meta.verdict || items[0]?.verdict);
    applyVerdictGuidance(resultVerdict);

    if (mixedNameResults) {
      appendText(resultSummary, "div", "mixed-verdict-prompt", t("mixedVerdictPrompt"));
    }
    if (meta.search_mode === "name" && total > 10) {
      const nudge = appendText(resultSummary, "div", "specificity-nudge", t("narrowResults"));
      nudge.setAttribute("role", "status");
    }

    appendText(
      resultSummary,
      "div",
      "result-summary",
      scrollMode
        ? t("scrollSummary", {
          shown: last.toLocaleString("en-IN"),
          total: total.toLocaleString("en-IN"),
        })
        : t("multipleSummary", {
          first: first.toLocaleString("en-IN"),
          last: last.toLocaleString("en-IN"),
          total: total.toLocaleString("en-IN"),
        }),
    );

    if (meta.pagination_limited) {
      appendText(
        resultSummary,
        "div",
        "pagination-limit-note",
        t("privacyLimit", {
          count: (Number(meta.page_size || 20) * Number(meta.total_pages || 0))
            .toLocaleString("en-IN"),
        }),
      );
    }
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

  function initializeScrollResults(response) {
    scrollResults = Array.isArray(response.results) ? [...response.results] : [];
    scrollMeta = { ...(response.meta || {}) };
    const currentPage = Number(scrollMeta.page || 1);
    const totalPages = Number(scrollMeta.total_pages || 1);
    scrollNextPage = scrollMeta.has_more && currentPage < totalPages
      ? currentPage + 1
      : null;
  }

  function renderScrollLoader(observe = true) {
    disconnectScrollObserver();
    resultList.querySelector(".result-scroll-loader")?.remove();
    if (!scrollNextPage) return;

    const loader = document.createElement("div");
    loader.className = "result-scroll-loader";
    const loadButton = document.createElement("button");
    loadButton.className = "text-button result-scroll-load";
    loadButton.type = "button";
    loadButton.textContent = t(scrollLoading ? "loadingMoreResults" : "loadMoreResults");
    loadButton.disabled = scrollLoading;
    loadButton.addEventListener("click", loadNextScrollPage);
    loader.append(loadButton);
    resultList.append(loader);

    if (observe && !scrollLoading && "IntersectionObserver" in window) {
      scrollObserver = new IntersectionObserver((entries) => {
        if (entries.some((entry) => entry.isIntersecting)) loadNextScrollPage();
      }, {
        root: MOBILE_RESULTS.matches ? null : resultList,
        rootMargin: "0px 0px 160px 0px",
      });
      scrollObserver.observe(loader);
    }
  }

  function appendScrollPage(response) {
    const incoming = Array.isArray(response.results) ? response.results : [];
    const seen = new Set(scrollResults.map((item) => item.detail_token));
    const fresh = incoming.filter((item) => !seen.has(item.detail_token));
    const firstIndex = scrollResults.length;
    resultList.querySelector(".result-scroll-loader")?.remove();
    fresh.forEach((item, index) => {
      resultList.append(renderCompactRow(item, firstIndex + index + 1));
    });
    scrollResults.push(...fresh);

    const meta = response.meta || {};
    const currentPage = Number(meta.page || 1);
    const totalPages = Number(meta.total_pages || scrollMeta?.total_pages || 1);
    scrollNextPage = meta.has_more && currentPage < totalPages
      ? currentPage + 1
      : null;
    scrollMeta = { ...(scrollMeta || {}), ...meta, page: 1 };
    renderResultNotices(scrollResults, scrollMeta, {
      first: 1,
      last: scrollResults.length,
      scrollMode: true,
    });
    renderScrollLoader();
  }

  async function loadNextScrollPage() {
    if (scrollLoading || !scrollNextPage || !scrollQueryPayload) return;
    disconnectScrollObserver();
    scrollLoading = true;
    renderScrollLoader();
    const controller = new AbortController();
    scrollLoadController = controller;
    const timeout = window.setTimeout(() => controller.abort(), 15_000);
    try {
      const response = await requestSearchPage(
        { ...scrollQueryPayload, page: scrollNextPage },
        controller.signal,
      );
      if (resultViewMode !== "scroll" || scrollLoadController !== controller) return;
      scrollLoading = false;
      appendScrollPage(response);
    } catch (error) {
      if (error.name === "AbortError" || scrollLoadController !== controller) return;
      scrollLoading = false;
      renderScrollLoader(false);
      const loader = resultList.querySelector(".result-scroll-loader");
      if (loader) {
        const errorText = appendText(
          loader,
          "span",
          "result-scroll-error",
          error.message || t("serviceUnavailable"),
        );
        errorText.setAttribute("role", "alert");
      }
    } finally {
      window.clearTimeout(timeout);
      if (scrollLoadController === controller) scrollLoadController = null;
    }
  }

  function renderScrollableResults(meta) {
    resultsSection.classList.add("is-scroll-mode");
    resultList.classList.add("is-scroll-mode");
    resultTableHeading.hidden = false;
    pagination.hidden = true;
    updateResultViewToggle(Number(meta.total_results || scrollResults.length));
    renderResultNotices(scrollResults, scrollMeta || meta, {
      first: 1,
      last: scrollResults.length,
      scrollMode: true,
    });
    const fragment = document.createDocumentFragment();
    scrollResults.forEach((item, index) => {
      fragment.append(renderCompactRow(item, index + 1));
    });
    resultList.append(fragment);
    renderScrollLoader();
    showResultsSheet();
  }

  function updateCorpusCounts(meta) {
    if (Number.isFinite(meta.asddo?.records)) {
      asddoIndexedCount.textContent = Number(meta.asddo.records).toLocaleString("en-US");
    }
    if (Number.isFinite(meta.roll?.records)) {
      rollIndexedCount.textContent = Number(meta.roll.records).toLocaleString("en-US");
    }
  }

  function renderResults(response) {
    clearResults();
    lastResponse = response;
    const items = Array.isArray(response.results) ? response.results : [];
    const meta = response.meta || {};
    updateCorpusCounts(meta);
    if (!items.length) {
      renderEmpty();
      applyVerdictGuidance(meta.verdict);
      return;
    }

    const total = Number(meta.total_results || items.length);
    const apiPage = Number(meta.page || 1);
    const pageSize = Number(meta.page_size || 20);
    const apiFirst = (apiPage - 1) * pageSize;
    const noun = total === 1 ? t("sourceMatch") : t("sourceMatches");
    resultsTitle.textContent = `${total.toLocaleString("en-IN")} ${noun}`;
    updateResultViewToggle(total);

    if (items.length === 1) {
      visualPage = 1;
      pendingVisualPage = null;
      applyVerdictGuidance(meta.verdict || items[0]?.verdict);
      appendText(resultSummary, "div", "result-summary", t("singleSummary"));
      revealDetail(items[0], 1, false);
      showResultsSheet();
      return;
    }

    if (resultViewMode === "scroll") {
      if (!scrollMeta) initializeScrollResults(response);
      renderScrollableResults(meta);
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

    renderResultNotices(items, meta, {
      first: globalFirst + 1,
      last: globalFirst + slice.length,
    });

    resultTableHeading.hidden = false;
    const fragment = document.createDocumentFragment();
    slice.forEach((item, index) => {
      fragment.append(renderCompactRow(item, globalFirst + index + 1));
    });
    resultList.append(fragment);
    renderPagination(meta);
    showResultsSheet();
  }

  async function requestSearchPage(payload, signal) {
    const response = await fetch(`${apiBaseUrl}/v1/search`, {
      method: "POST",
      mode: "cors",
      cache: "no-store",
      credentials: "omit",
      referrerPolicy: "no-referrer",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
      signal,
    });
    if (!response.ok) throw new Error(await parseError(response));
    return response.json();
  }

  async function runSearch(payload) {
    if (activeRequest) activeRequest.abort();
    closeDetail();
    const controller = new AbortController();
    activeRequest = controller;
    const timeout = window.setTimeout(() => controller.abort(), 15_000);
    setLoading(true);

    try {
      const body = await requestSearchPage(payload, controller.signal);
      lastPayload = { ...payload, page: Number(body.meta?.page || payload.page) };
      if (resultViewMode === "scroll" && Number(body.meta?.page || 1) === 1) {
        initializeScrollResults(body);
      }
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
      // The plaque reads "Search again" while a results sheet is up:
      // it returns the visitor to the form instead of re-submitting.
      if (activeRequest) return;
      closeDetail();
      resetScrollState();
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
    resetScrollState();
    resultViewMode = MOBILE_RESULTS.matches ? "scroll" : "paged";
    scrollQueryPayload = { ...payload, page: 1 };
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
    resetScrollState();
    resultViewMode = MOBILE_RESULTS.matches ? "scroll" : "paged";
    scrollQueryPayload = null;
    showFormSheet();
  });

  resultViewToggle.addEventListener("click", () => {
    if (!lastResponse) return;
    visualPage = 1;
    pendingVisualPage = null;
    if (resultViewMode === "scroll") {
      resultViewMode = "paged";
      resetScrollState();
      renderResults(lastResponse);
      return;
    }

    resultViewMode = "scroll";
    resetScrollState();
    const basePayload = scrollQueryPayload || lastPayload;
    if (basePayload) scrollQueryPayload = { ...basePayload, page: 1 };
    if (Number(lastResponse.meta?.page || 1) === 1) {
      initializeScrollResults(lastResponse);
      renderResults(lastResponse);
    } else if (scrollQueryPayload) {
      runSearch(scrollQueryPayload);
    }
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
