(function (root, factory) {
  "use strict";

  const api = factory(root);

  if (typeof module === "object" && module.exports) {
    module.exports = api;
  }

  root.LittleNotesTimeline = api;
})(typeof globalThis !== "undefined" ? globalThis : this, function (root) {
  "use strict";

  const DAY_IN_MS = 24 * 60 * 60 * 1000;
  const DATE_FORMATTER = new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    timeZone: "UTC"
  });

  function parseDate(value) {
    if (typeof value !== "string") {
      return null;
    }

    const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value);
    if (!match) {
      return null;
    }

    const year = Number(match[1]);
    const month = Number(match[2]);
    const day = Number(match[3]);
    const ordinal = Date.UTC(year, month - 1, day) / DAY_IN_MS;
    const checked = new Date(ordinal * DAY_IN_MS);

    if (
      checked.getUTCFullYear() !== year ||
      checked.getUTCMonth() !== month - 1 ||
      checked.getUTCDate() !== day
    ) {
      return null;
    }

    return { year, month, day, ordinal, iso: value };
  }

  function toIso(year, month, day) {
    return [
      String(year).padStart(4, "0"),
      String(month).padStart(2, "0"),
      String(day).padStart(2, "0")
    ].join("-");
  }

  function fromOrdinal(ordinal) {
    const value = new Date(ordinal * DAY_IN_MS);
    return toIso(value.getUTCFullYear(), value.getUTCMonth() + 1, value.getUTCDate());
  }

  function addDays(dateValue, days) {
    const date = parseDate(dateValue);
    if (!date || !Number.isInteger(days)) {
      return null;
    }

    return fromOrdinal(date.ordinal + days);
  }

  function addMonths(dateValue, months) {
    const date = parseDate(dateValue);
    if (!date || !Number.isInteger(months)) {
      return null;
    }

    const monthIndex = date.month - 1 + months;
    const targetYear = date.year + Math.floor(monthIndex / 12);
    const targetMonthIndex = ((monthIndex % 12) + 12) % 12;
    const lastDay = new Date(Date.UTC(targetYear, targetMonthIndex + 1, 0)).getUTCDate();

    return toIso(targetYear, targetMonthIndex + 1, Math.min(date.day, lastDay));
  }

  function dateForAnchor(birthDate, anchor) {
    if (!anchor || typeof anchor !== "object") {
      return null;
    }

    if (Number.isInteger(anchor.days)) {
      return addDays(birthDate, anchor.days);
    }

    if (Number.isInteger(anchor.weeks)) {
      return addDays(birthDate, anchor.weeks * 7);
    }

    if (Number.isInteger(anchor.months)) {
      return addMonths(birthDate, anchor.months);
    }

    return null;
  }

  function stagesWithDates(stages, birthDate) {
    if (!Array.isArray(stages) || !parseDate(birthDate)) {
      return [];
    }

    return stages
      .map(function (stage, index) {
        const date = dateForAnchor(birthDate, stage.at);
        const parsed = parseDate(date);
        return parsed ? { stage, date, ordinal: parsed.ordinal, index } : null;
      })
      .filter(Boolean)
      .sort(function (left, right) {
        return left.ordinal - right.ordinal || left.index - right.index;
      });
  }

  function selectStage(stages, birthDate, viewedDate) {
    const datedStages = stagesWithDates(stages, birthDate);
    const viewed = parseDate(viewedDate);

    if (!datedStages.length || !viewed) {
      return null;
    }

    let selected = datedStages[0];
    for (const candidate of datedStages) {
      if (candidate.ordinal > viewed.ordinal) {
        break;
      }
      selected = candidate;
    }

    return selected;
  }

  function ageInDays(birthDate, viewedDate) {
    const birth = parseDate(birthDate);
    const viewed = parseDate(viewedDate);
    return birth && viewed ? viewed.ordinal - birth.ordinal : null;
  }

  function dateScope(birthDate, scopeEnd, viewedDate) {
    const birth = parseDate(birthDate);
    const end = parseDate(dateForAnchor(birthDate, scopeEnd));
    const viewed = parseDate(viewedDate);

    if (!birth || !end || !viewed || end.ordinal <= birth.ordinal) {
      return null;
    }
    if (viewed.ordinal < birth.ordinal) {
      return "before";
    }
    if (viewed.ordinal >= end.ordinal) {
      return "after";
    }
    return "within";
  }

  function localDateIso(value) {
    const date = value instanceof Date ? value : new Date();
    return toIso(date.getFullYear(), date.getMonth() + 1, date.getDate());
  }

  function formatDate(dateValue) {
    const date = parseDate(dateValue);
    if (!date) {
      return "Unknown date";
    }

    return DATE_FORMATTER.format(new Date(date.ordinal * DAY_IN_MS));
  }

  function formatDateRange(startValue, endValue) {
    const start = parseDate(startValue);
    const end = parseDate(endValue);
    if (!start || !end) {
      return "Unknown date range";
    }

    return DATE_FORMATTER.formatRange(
      new Date(start.ordinal * DAY_IN_MS),
      new Date(end.ordinal * DAY_IN_MS)
    );
  }

  function describeAge(days) {
    if (!Number.isInteger(days)) {
      return "Age unavailable";
    }
    if (days < 0) {
      return "Before birth";
    }
    if (days === 0) {
      return "Birth day";
    }
    if (days < 7) {
      return days + (days === 1 ? " day old" : " days old");
    }

    const weeks = Math.floor(days / 7);
    const extraDays = days % 7;
    const weekText = weeks + (weeks === 1 ? " week" : " weeks");
    if (!extraDays) {
      return weekText + " old";
    }

    return weekText + ", " + extraDays + (extraDays === 1 ? " day" : " days") + " old";
  }

  function createElement(tagName, className, text) {
    const element = document.createElement(tagName);
    if (className) {
      element.className = className;
    }
    if (typeof text === "string") {
      element.textContent = text;
    }
    return element;
  }

  function getSource(data, sourceId) {
    return data.sources && data.sources[sourceId] ? data.sources[sourceId] : null;
  }

  function makeSourceList(sourceIds, data) {
    const sources = (sourceIds || []).map(function (sourceId) {
      return getSource(data, sourceId);
    }).filter(Boolean);

    if (!sources.length) {
      return null;
    }

    const wrapper = createElement("div", "timeline-panel__sources");
    wrapper.append(createElement("p", "timeline-panel__sources-label", "Research starting points"));
    const list = createElement("ul", "timeline-source-list");

    for (const source of sources) {
      const item = document.createElement("li");
      const link = createElement("a", "", source.title);
      link.href = source.url;
      link.rel = "noreferrer";
      item.append(link);
      list.append(item);
    }

    wrapper.append(list);
    return wrapper;
  }

  function makeTimelineHeader(title, description, viewedDate, today, birthDate) {
    const header = createElement("header", "timeline-header");
    const copy = createElement("div", "timeline-header__copy");
    copy.append(createElement("p", "eyebrow", "Choose a date"));
    copy.append(createElement("h2", "timeline-title", title));
    copy.append(createElement("p", "timeline-description", description));
    header.append(copy);

    const status = createElement("div", "date-status");
    const previewing = viewedDate !== today;
    const statusLabel = previewing ? "Previewing" : "Today";
    status.append(createElement("span", "date-status__label", statusLabel));
    status.append(createElement("strong", "date-status__date", formatDate(viewedDate)));
    status.append(createElement("span", "date-status__age", describeAge(ageInDays(birthDate, viewedDate))));

    if (previewing) {
      const reset = createElement("button", "date-status__reset", "Return to today");
      reset.type = "button";
      reset.dataset.returnToToday = "";
      status.append(reset);
    }

    header.append(status);
    return header;
  }

  function makeCards(datedStages, selected, todaySelection, chooseDate) {
    const wrapper = createElement("div", "timeline-card-scroll");
    const nav = createElement("nav", "timeline-cards");
    nav.setAttribute("aria-label", "Choose a date to view");

    datedStages.forEach(function (entry) {
      const button = createElement("button", "timeline-card");
      const isSelected = entry.stage.key === selected.stage.key;
      const isToday = todaySelection && entry.stage.key === todaySelection.stage.key;
      button.type = "button";
      button.dataset.timelineDate = entry.date;
      button.setAttribute("aria-pressed", String(isSelected));
      button.setAttribute(
        "aria-label",
        entry.stage.label + ", starting " + formatDate(entry.date) + (isToday ? ", current stage" : "")
      );

      if (isSelected) {
        button.classList.add("is-selected");
      }
      if (isToday) {
        button.classList.add("is-today");
      }

      button.append(createElement("span", "timeline-card__date", formatDate(entry.date)));
      button.append(createElement("span", "timeline-card__label", entry.stage.label));
      if (isToday) {
        button.append(createElement("span", "timeline-card__now", "Now"));
      }

      button.addEventListener("click", function () {
        chooseDate(entry.date);
      });
      nav.append(button);
    });

    wrapper.append(nav);
    return wrapper;
  }

  function makeWindowLabel(selected, datedStages, scopeEndDate) {
    const selectedIndex = datedStages.findIndex(function (entry) {
      return entry.stage.key === selected.stage.key;
    });
    const next = datedStages[selectedIndex + 1];

    const windowEnd = next ? next.date : scopeEndDate;
    if (!parseDate(windowEnd)) {
      return "From " + formatDate(selected.date);
    }

    const finalDay = addDays(windowEnd, -1);
    return formatDateRange(selected.date, finalDay);
  }

  function makeTopicPanel(selected, datedStages, data, scopeEndDate) {
    const stage = selected.stage;
    const panel = createElement("section", "timeline-panel timeline-panel--topic");
    panel.append(createElement("p", "timeline-panel__range", makeWindowLabel(selected, datedStages, scopeEndDate)));
    panel.append(createElement("h3", "timeline-panel__title", stage.title));
    panel.append(createElement("p", "timeline-panel__summary", stage.summary));

    if (stage.points && stage.points.length) {
      const list = createElement("ul", "timeline-panel__points");
      for (const point of stage.points) {
        list.append(createElement("li", "", point));
      }
      panel.append(list);
    }

    const sources = makeSourceList(stage.sources, data);
    if (sources) {
      panel.append(sources);
    }

    return panel;
  }

  function topicDirectory() {
    const directory = new Map();
    document.querySelectorAll("[data-topic] > a").forEach(function (link) {
      directory.set(link.parentElement.dataset.topic, {
        href: link.dataset.timelineOriginalHref || link.getAttribute("href"),
        label: link.textContent.trim()
      });
    });
    return directory;
  }

  function makeHomePanel(selected, datedStages, data, directory, scopeEndDate) {
    const stage = selected.stage;
    const panel = createElement("section", "timeline-panel timeline-panel--home");
    panel.append(createElement("p", "timeline-panel__range", makeWindowLabel(selected, datedStages, scopeEndDate)));
    panel.append(createElement("h2", "timeline-panel__title", stage.title));
    panel.append(createElement("p", "timeline-panel__summary", stage.summary));

    const list = createElement("ul", "featured-topic-list");
    for (const topic of stage.topics || []) {
      const target = directory.get(topic.id);
      if (!target) {
        continue;
      }

      const item = createElement("li", "featured-topic");
      const link = createElement("a", "featured-topic__link", target.label);
      link.href = target.href;
      item.append(link);
      item.append(createElement("p", "featured-topic__note", topic.note));
      list.append(item);
    }
    panel.append(list);

    const sources = makeSourceList(stage.sources, data);
    if (sources) {
      panel.append(sources);
    }

    return panel;
  }

  function timelineShell(options) {
    const datedStages = stagesWithDates(options.stages, options.birthDate);
    const selected = selectStage(options.stages, options.birthDate, options.viewedDate);
    const scopeEndDate = dateForAnchor(options.birthDate, options.scopeEnd);
    const viewedScope = dateScope(options.birthDate, options.scopeEnd, options.viewedDate);
    const todaySelection = dateScope(options.birthDate, options.scopeEnd, options.today) === "within"
      ? selectStage(options.stages, options.birthDate, options.today)
      : null;
    if (!datedStages.length || !selected) {
      return null;
    }

    const fragment = document.createDocumentFragment();
    fragment.append(
      makeTimelineHeader(
        options.title,
        options.description,
        options.viewedDate,
        options.today,
        options.birthDate
      )
    );
    if (viewedScope === "before") {
      fragment.append(
        createElement(
          "p",
          "timeline-scope-note",
          "This date is before birth. The earliest card is shown only as a planning preview."
        )
      );
    } else if (viewedScope === "after") {
      fragment.append(
        createElement(
          "p",
          "timeline-scope-note",
          "This date is beyond the birth-through-3-month guide. The latest card is shown as the last available reference."
        )
      );
    }
    fragment.append(makeCards(datedStages, selected, todaySelection, options.chooseDate));
    fragment.append(
      options.makePanel(selected, datedStages, scopeEndDate)
    );
    fragment.append(
      createElement(
        "p",
        "timeline-caution",
        "Dates change what is emphasized, not what is normal. Ranges are guides; follow your baby’s cues and your care team’s plan."
      )
    );
    return fragment;
  }

  function currentTopicId() {
    const mount = document.querySelector("[data-topic-timeline]");
    return mount ? mount.dataset.topicTimeline : null;
  }

  function validViewedDate(today) {
    try {
      const url = new URL(window.location.href);
      const parameter = url.searchParams.get("date");
      if (parameter === null) {
        return today;
      }
      if (parseDate(parameter)) {
        return parameter;
      }

      url.searchParams.delete("date");
      window.history.replaceState(window.history.state, "", url);
      return today;
    } catch (error) {
      return today;
    }
  }

  function updateAddress(date, today) {
    try {
      const url = new URL(window.location.href);
      if (date === today) {
        url.searchParams.delete("date");
      } else {
        url.searchParams.set("date", date);
      }
      window.history.pushState({}, "", url);
    } catch (error) {
      // The timeline still works when history updates are unavailable (for example, some file previews).
    }
  }

  function decorateInternalLinks(viewedDate, today) {
    document.querySelectorAll("a[href]").forEach(function (link) {
      if (!link.dataset.timelineOriginalHref) {
        link.dataset.timelineOriginalHref = link.getAttribute("href");
      }

      const original = link.dataset.timelineOriginalHref;
      if (!original || /^(?:mailto:|tel:|#)/.test(original)) {
        return;
      }

      try {
        const url = new URL(original, window.location.href);
        if (/^https?:$/.test(url.protocol) && url.origin !== window.location.origin) {
          return;
        }
        if (!/\.html$/.test(url.pathname)) {
          return;
        }
        if (viewedDate === today) {
          link.setAttribute("href", original);
        } else {
          url.searchParams.set("date", viewedDate);
          link.href = url.href;
        }
      } catch (error) {
        link.setAttribute("href", original);
      }
    });
  }

  function moveTopicLedeIntoFullGuide() {
    const lede = document.querySelector(".topic-header > .topic-lede");
    const fullGuideIntro = document.querySelector(".full-guide-intro");
    if (lede && fullGuideIntro) {
      fullGuideIntro.insertAdjacentElement("afterend", lede);
    }
  }

  function updateTimelineMount(mount, shell, shouldAnnounce, viewedDate) {
    let content = mount.querySelector("[data-timeline-content]");
    let announcer = mount.querySelector("[data-timeline-announcer]");

    if (!content || !announcer) {
      mount.replaceChildren();
      content = createElement("div", "timeline-content");
      content.dataset.timelineContent = "";
      announcer = createElement("p", "visually-hidden");
      announcer.dataset.timelineAnnouncer = "";
      announcer.setAttribute("aria-live", "polite");
      announcer.setAttribute("aria-atomic", "true");
      mount.append(content, announcer);
    }

    content.replaceChildren(shell);
    if (shouldAnnounce) {
      const title = content.querySelector(".timeline-panel__title");
      announcer.textContent = "Showing " + formatDate(viewedDate) + (title ? ": " + title.textContent : "");
    }
  }

  function centerSelectedCards() {
    document.querySelectorAll(".timeline-card-scroll").forEach(function (scroller) {
      const selected = scroller.querySelector(".timeline-card.is-selected");
      if (!selected) {
        return;
      }

      const centered = selected.offsetLeft - (scroller.clientWidth - selected.offsetWidth) / 2;
      scroller.scrollLeft = Math.max(0, centered);
    });
  }

  function startBrowser() {
    const data = root.LittleNotesData;
    if (!data || !parseDate(data.birthDate)) {
      return;
    }

    let inMemoryDate = null;
    let focusAfterRender = false;
    let announceAfterRender = false;
    let lastRenderedToday = null;

    function refreshAtNextMidnight() {
      const now = new Date();
      const nextMidnight = new Date(
        now.getFullYear(),
        now.getMonth(),
        now.getDate() + 1,
        0,
        0,
        0,
        50
      );

      root.setTimeout(function () {
        if (inMemoryDate === lastRenderedToday) {
          inMemoryDate = null;
        }
        render();
        refreshAtNextMidnight();
      }, nextMidnight.getTime() - now.getTime());
    }

    function chooseDate(date) {
      inMemoryDate = date;
      focusAfterRender = true;
      announceAfterRender = true;
      updateAddress(date, localDateIso());
      render();
    }

    function render() {
      const today = localDateIso();
      const viewedDate = inMemoryDate || validViewedDate(today);
      const homeMount = document.querySelector("[data-home-timeline]");
      const topicMount = document.querySelector("[data-topic-timeline]");
      lastRenderedToday = today;

      if (homeMount) {
        const shell = timelineShell({
          stages: data.homeStages,
          birthDate: data.birthDate,
          scopeEnd: data.scopeEnd,
          viewedDate,
          today,
          title: "Start with what matters on this date",
          description: "The selected date changes the short list below. Open the full directory whenever you need something else.",
          chooseDate,
          makePanel: function (selected, datedStages, scopeEndDate) {
            return makeHomePanel(selected, datedStages, data, topicDirectory(), scopeEndDate);
          }
        });
        if (shell) {
          updateTimelineMount(homeMount, shell, announceAfterRender, viewedDate);
        }
      }

      if (topicMount) {
        const topicId = currentTopicId();
        const topic = data.topicTimelines && data.topicTimelines[topicId];
        if (topic) {
          const shell = timelineShell({
            stages: topic.stages,
            birthDate: data.birthDate,
            scopeEnd: data.scopeEnd,
            viewedDate,
            today,
            title: topic.heading || "Advice for the date you choose",
            description: topic.description || "Choose a dated card to change the practical focus. The full guide stays below for reference.",
            chooseDate,
            makePanel: function (selected, datedStages, scopeEndDate) {
              return makeTopicPanel(selected, datedStages, data, scopeEndDate);
            }
          });
          if (shell) {
            updateTimelineMount(topicMount, shell, announceAfterRender, viewedDate);
          }
        }
      }

      document.querySelectorAll("[data-return-to-today]").forEach(function (button) {
        button.addEventListener("click", function () {
          chooseDate(localDateIso());
        });
      });
      centerSelectedCards();
      if (focusAfterRender) {
        const selectedCard = document.querySelector(".timeline-card.is-selected");
        if (selectedCard) {
          selectedCard.focus({ preventScroll: true });
        }
        focusAfterRender = false;
      }
      announceAfterRender = false;
      decorateInternalLinks(viewedDate, today);
      document.documentElement.classList.add("timeline-ready");
    }

    moveTopicLedeIntoFullGuide();
    render();
    refreshAtNextMidnight();
    window.addEventListener("popstate", function () {
      inMemoryDate = null;
      announceAfterRender = true;
      render();
    });
    document.addEventListener("visibilitychange", function () {
      if (document.visibilityState === "visible" && lastRenderedToday !== localDateIso()) {
        if (inMemoryDate === lastRenderedToday) {
          inMemoryDate = null;
        }
        render();
      }
    });
  }

  if (typeof document !== "undefined") {
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", startBrowser, { once: true });
    } else {
      startBrowser();
    }
  }

  return {
    addDays,
    addMonths,
    ageInDays,
    dateScope,
    dateForAnchor,
    describeAge,
    formatDate,
    formatDateRange,
    localDateIso,
    parseDate,
    selectStage,
    stagesWithDates
  };
});
