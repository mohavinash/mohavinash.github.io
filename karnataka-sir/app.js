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
  const voterIdInput = document.querySelector("#voter-id");
  const nameInput = document.querySelector("#voter-name");
  const relativeInput = document.querySelector("#relative-name");
  const contactField = document.querySelector("#contact-field");
  const message = document.querySelector("#form-message");
  const button = document.querySelector("#search-button");
  const buttonLabel = button.querySelector(".button-label");
  const resultsSection = document.querySelector("#results");
  const resultsTitle = document.querySelector("#results-title");
  const resultSummary = document.querySelector("#result-summary");
  const resultTableHeading = document.querySelector("#result-table-heading");
  const resultList = document.querySelector("#result-list");
  const pagination = document.querySelector("#pagination");
  const newSearch = document.querySelector("#new-search");
  const cardTemplate = document.querySelector("#result-card-template");
  const rowTemplate = document.querySelector("#result-row-template");
  const indexedCount = document.querySelector("#indexed-count");

  let districts = [];
  let searchMode = "name";
  let activeRequest = null;
  let lastPayload = null;
  let expandedRow = null;
  let detailSequence = 0;

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
    clearValidation();
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
    message.textContent = text;
    message.hidden = false;
    if (field) {
      field.setAttribute("aria-invalid", "true");
      field.focus();
    }
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
      `Source data unavailable for AC ${selected.number} · ${selected.name}. `,
    );
    coverageWarning.append(
      "This constituency remains searchable so the coverage gap is clear. Use the CEO Karnataka ASDDO page or ask your BLO or ERO to check the record.",
    );
    coverageWarning.hidden = false;
  }

  function populateConstituencies() {
    constituencySelect.replaceChildren();
    const district = districts.find((item) => item.name === districtSelect.value);
    if (!district) {
      constituencySelect.append(new Option("Select a district first", ""));
      constituencySelect.disabled = true;
      showCoverageWarning();
      return;
    }
    constituencySelect.append(new Option("Select Assembly constituency", ""));
    district.constituencies.forEach((item) => {
      const suffix = item.data_available ? "" : " · source data unavailable";
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
      districtSelect.replaceChildren(new Option("Search service connection pending", ""));
      button.disabled = true;
      return;
    }
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
      districtSelect.replaceChildren(new Option("Select district", ""));
      districts.forEach((district) => {
        districtSelect.append(new Option(district.name, district.name));
      });
      districtSelect.disabled = false;
      button.disabled = false;
    } catch (_) {
      districtSelect.replaceChildren(new Option("Districts could not load", ""));
      districtSelect.disabled = true;
      button.disabled = true;
      showError("The district list could not load. Refresh the page to try again.");
    }
  }

  function payloadFromForm(page = 1) {
    const voterId = searchMode === "epic" ? clean(voterIdInput.value) : "";
    const name = searchMode === "name" ? clean(nameInput.value) : "";
    const relativeName = searchMode === "name" ? clean(relativeInput.value) : "";
    return {
      district: districtSelect.value,
      constituency_number: Number(constituencySelect.value),
      voter_id: voterId || null,
      name: name || null,
      relative_name: relativeName || null,
      page,
    };
  }

  function validate(payload) {
    if (searchMode === "name") {
      const nameCharacters = (payload.name || "").replace(/[^a-z0-9]/gi, "");
      if (nameCharacters.length < 3) {
        showError("Enter at least 3 letters of the voter’s name.", nameInput);
        return false;
      }
    } else {
      const epicCharacters = (payload.voter_id || "").replace(/[^a-z0-9]/gi, "");
      if (epicCharacters.length < 6) {
        showError("Enter at least 6 Voter ID characters.", voterIdInput);
        return false;
      }
    }
    if (!payload.district) {
      showError("Select the voter’s district.", districtSelect);
      return false;
    }
    if (!Number.isInteger(payload.constituency_number) || payload.constituency_number < 1) {
      showError("Select the voter’s Assembly constituency.", constituencySelect);
      return false;
    }
    return true;
  }

  function setLoading(isLoading) {
    button.disabled = isLoading || !districts.length;
    button.classList.toggle("is-loading", isLoading);
    buttonLabel.textContent = isLoading ? "Searching…" : "Search records";
    resultsSection.setAttribute("aria-busy", String(isLoading));
    pagination.querySelectorAll("button").forEach((pageButton) => {
      pageButton.disabled = isLoading;
    });
  }

  function closeExpandedRow() {
    if (!expandedRow) return;
    if (expandedRow.controller) expandedRow.controller.abort();
    if (expandedRow.button) expandedRow.button.setAttribute("aria-expanded", "false");
    expandedRow.detail.hidden = Boolean(expandedRow.button);
    expandedRow.detail.replaceChildren();
    expandedRow = null;
  }

  function clearResults() {
    closeExpandedRow();
    resultSummary.replaceChildren();
    resultList.hidden = false;
    resultList.replaceChildren();
    resultList.classList.remove("result-list--single");
    resultTableHeading.hidden = true;
    pagination.replaceChildren();
    pagination.hidden = true;
  }

  function renderCoverageGap() {
    resultsTitle.textContent = "Source data unavailable";
    const panel = document.createElement("div");
    panel.className = "empty-result empty-result--coverage";
    const selected = selectedConstituency();
    const label = selected
      ? `AC ${selected.number} · ${selected.name}`
      : "this Assembly constituency";
    appendText(panel, "strong", "", `The snapshot has no searchable ASDDO files for ${label}.`);
    appendText(panel, "span", "", "Check the CEO Karnataka ASDDO page or ask your BLO or ERO to review the source record.");
    const link = appendText(panel, "a", "empty-result-link", "Open CEO Karnataka’s ASDDO page ↗");
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
      resultsTitle.textContent = "Zero matches in this snapshot";
      const panel = document.createElement("div");
      panel.className = "empty-result";
      appendText(panel, "strong", "", "This search returned zero indexed matches.");
      appendText(panel, "span", "", "Source gaps, PDF extraction and spelling can affect the index. Check the official electoral search and ask your BLO or ERO to confirm the record.");
      resultSummary.append(panel);
    }
    resultsSection.hidden = false;
  }

  function matchLabel(quality) {
    if (quality === "exact_voter_id") return "Exact Voter ID match";
    if (quality === "exact_names") return "Exact name match";
    return "Possible name match";
  }

  function renderCard(result, displayIndex) {
    const card = cardTemplate.content.firstElementChild.cloneNode(true);
    const badge = card.querySelector(".match-badge");
    badge.textContent = matchLabel(result.match_quality);
    if (result.match_quality === "name_prefix") badge.classList.add("match-badge--possible");
    card.querySelector(".result-index").textContent = String(displayIndex).padStart(2, "0");
    card.querySelector(".result-name").textContent = result.name || "Name unavailable in extracted record";
    const relationship = result.relationship ? result.relationship.toLowerCase() : "relative";
    card.querySelector(".relative-line").textContent = result.relative_name
      ? `${relationship}: ${result.relative_name}`
      : "Relative name unavailable in the extracted record.";
    card.querySelector(".result-epic").textContent = result.voter_id;
    card.querySelector(".result-status").textContent = result.status_label;
    card.querySelector(".result-district").textContent = result.location.district;
    const constituencyName = result.location.constituency_name
      ? ` · ${result.location.constituency_name}`
      : "";
    card.querySelector(".result-ac").textContent = `AC ${result.location.constituency_number}${constituencyName}`;
    card.querySelector(".result-part").textContent = `Part ${result.location.part_number} · Serial ${result.location.roll_serial_number}`;

    const duplicateNote = card.querySelector(".duplicate-note");
    if (result.duplicate_voter_id) {
      duplicateNote.textContent = `The source’s duplicate/reference Voter ID field reads: ${result.duplicate_voter_id}`;
      duplicateNote.hidden = false;
    }

    const memberNote = card.querySelector(".source-member-note");
    if (result.source.archive_member) {
      memberNote.textContent = `This PDF is inside the published archive: ${result.source.archive_member}. Open the archive, then the named PDF, and go to page ${result.source.page_number}.`;
      memberNote.hidden = false;
    }

    const link = card.querySelector(".source-link");
    link.href = result.source.url;
    card.querySelector(".source-link-label").textContent = result.source.archive_member
      ? "Open source archive"
      : `Open source PDF at page ${result.source.page_number}`;
    return card;
  }

  async function parseError(response) {
    try {
      const body = await response.json();
      if (typeof body.detail === "string") return body.detail;
      if (Array.isArray(body.detail) && body.detail[0]?.msg) {
        return String(body.detail[0].msg).replace(/^Value error,\s*/i, "");
      }
    } catch (_) {
      // A generic message keeps proxy response details out of the page.
    }
    return response.status === 429
      ? "Too many requests. Please wait a moment and try again."
      : "The search service is temporarily unavailable. Please try again shortly.";
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

  async function revealDetail(summary, displayIndex, rowButton, detail) {
    const controller = new AbortController();
    const timeout = window.setTimeout(() => controller.abort(), 15_000);
    detail.hidden = false;
    detail.replaceChildren();
    const loading = appendText(detail, "div", "detail-loading", "Opening this record…");
    loading.setAttribute("role", "status");
    if (rowButton) rowButton.setAttribute("aria-expanded", "true");
    expandedRow = { button: rowButton, detail, controller };
    try {
      const result = await fetchDetail(summary.detail_token, controller.signal);
      if (expandedRow?.controller !== controller) return;
      detail.replaceChildren(renderCard(result, displayIndex));
      expandedRow.controller = null;
    } catch (error) {
      if (error.name === "AbortError" || expandedRow?.controller !== controller) return;
      detail.replaceChildren();
      const panel = appendText(
        detail,
        "div",
        "detail-error",
        error.message || "This record could not open. Run the search again.",
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
    const detail = item.querySelector(".row-detail");
    const detailId = `record-detail-${++detailSequence}`;
    detail.id = detailId;
    rowButton.setAttribute("aria-controls", detailId);
    item.querySelector(".row-name").textContent = summary.name || "Name unavailable";
    item.querySelector(".row-match").textContent = matchLabel(summary.match_quality);
    item.querySelector(".row-relative").textContent = summary.relative_name || "Unavailable";
    item.querySelector(".row-status").textContent = summary.status_label;
    rowButton.setAttribute("aria-label", `Open record for ${summary.name || "this voter"}`);
    rowButton.addEventListener("click", () => {
      const isOpen = rowButton.getAttribute("aria-expanded") === "true";
      closeExpandedRow();
      if (!isOpen) revealDetail(summary, displayIndex, rowButton, detail);
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

  function addPageButton(label, page, current, disabled = false, ariaLabel = "") {
    const pageButton = document.createElement("button");
    pageButton.type = "button";
    pageButton.textContent = label;
    pageButton.disabled = disabled;
    if (ariaLabel) pageButton.setAttribute("aria-label", ariaLabel);
    if (page === current) pageButton.setAttribute("aria-current", "page");
    pageButton.addEventListener("click", () => {
      if (!lastPayload || page === current) return;
      runSearch({ ...lastPayload, page }, true);
    });
    pagination.append(pageButton);
  }

  function renderPagination(meta) {
    const totalPages = Number(meta.total_pages || 0);
    const current = Number(meta.page || 1);
    pagination.replaceChildren();
    if (totalPages <= 1) {
      pagination.hidden = true;
      return;
    }
    addPageButton("‹", current - 1, current, current === 1, "Previous page");
    const pages = pageItems(current, totalPages);
    pages.forEach((page, index) => {
      if (index && page - pages[index - 1] > 1) appendText(pagination, "span", "", "…");
      addPageButton(String(page), page, current, false, `Page ${page}`);
    });
    addPageButton("›", current + 1, current, current === totalPages, "Next page");
    pagination.hidden = false;
  }

  function renderResults(response) {
    clearResults();
    const items = Array.isArray(response.results) ? response.results : [];
    if (!items.length) {
      renderEmpty(response);
      return;
    }

    const meta = response.meta || {};
    const total = Number(meta.total_results || items.length);
    const page = Number(meta.page || 1);
    const pageSize = Number(meta.page_size || 20);
    const first = (page - 1) * pageSize + 1;
    const last = first + items.length - 1;
    const noun = total === 1 ? "source match" : "source matches";
    resultsTitle.textContent = `${total.toLocaleString("en-IN")} ${noun}`;

    const summary = document.createElement("div");
    summary.className = "result-summary";
    summary.textContent = total === 1
      ? "Opening the matching record. Its Voter ID and source will appear in the card."
      : `Showing ${first.toLocaleString("en-IN")} to ${last.toLocaleString("en-IN")} of ${total.toLocaleString("en-IN")}. Open one row to view its Voter ID and source.`;
    resultSummary.append(summary);
    if (meta.pagination_limited) {
      appendText(
        resultSummary,
        "div",
        "pagination-limit-note",
        `For privacy, this tool displays the first ${(pageSize * Number(meta.total_pages || 0)).toLocaleString("en-IN")} matches. Add the relative’s name or more of the voter’s name to narrow the search.`,
      );
    }

    if (total === 1) {
      resultList.classList.add("result-list--single");
      revealDetail(items[0], 1, null, resultList);
    } else {
      resultTableHeading.hidden = false;
      const fragment = document.createDocumentFragment();
      items.forEach((item, index) => {
        fragment.append(renderCompactRow(item, first + index));
      });
      resultList.append(fragment);
    }
    renderPagination(meta);
    if (Number.isFinite(meta.indexed_records)) {
      indexedCount.textContent = Number(meta.indexed_records).toLocaleString("en-IN");
    }
    resultsSection.hidden = false;
  }

  async function runSearch(payload, scrollToResults) {
    if (activeRequest) activeRequest.abort();
    closeExpandedRow();
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
      if (scrollToResults) {
        resultsSection.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    } catch (error) {
      if (error.name === "AbortError") {
        showError("The search took too long. Please try again.");
      } else {
        showError(error.message || "The search service is temporarily unavailable.");
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
    clearValidation();
    if (clean(contactField.value)) return;
    const payload = payloadFromForm(1);
    if (!validate(payload)) return;
    if (!apiBaseUrl || apiBaseUrl.includes("REPLACE_WITH")) {
      showError("The search service connection is pending.");
      return;
    }
    runSearch(payload, true);
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
    setSearchMode("name", false);
    populateConstituencies();
    clearValidation();
    clearResults();
    resultsSection.hidden = true;
    lastPayload = null;
    nameInput.focus();
    document.querySelector("#search").scrollIntoView({ behavior: "smooth", block: "start" });
  });

  districtSelect.disabled = true;
  button.disabled = true;
  setSearchMode("name", false);
  loadLocations();
})();
