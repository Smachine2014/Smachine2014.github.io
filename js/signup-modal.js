(function () {
  "use strict";

  var JOIN_URL = "https://northshorejudo.co.nz/join";
  var CONTACT_URL = "https://northshorejudo.co.nz/contact/";
  var MODAL_CAMPAIGN = "signup_flow";
  var TRIGGER_TEXT_PATTERN = /(free class|free trial|book free class|book a free trial|sign up|signup)/i;

  function sanitizeWhitespace(value) {
    return String(value || "").replace(/\s+/g, " ").trim();
  }

  function slugify(value) {
    return sanitizeWhitespace(value)
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "_")
      .replace(/^_+|_+$/g, "")
      .slice(0, 48);
  }

  function buildTrackingToken(parts) {
    return parts
      .map(function (part) {
        return slugify(part);
      })
      .filter(Boolean)
      .join("_")
      .slice(0, 96);
  }

  function getSourceFromPathname(pathname) {
    if (/^\/classes\/kids\/?$/i.test(pathname)) {
      return "website_kids";
    }
    if (/^\/classes\/juniors\/?$/i.test(pathname)) {
      return "website_juniors";
    }
    if (/^\/classes\/adults\/?$/i.test(pathname)) {
      return "website_adults";
    }
    if (/^\/classes\/?$/i.test(pathname)) {
      return "website_classes";
    }
    if (/^\/about\/?$/i.test(pathname)) {
      return "website_about";
    }
    if (/^\/coaches\/?$/i.test(pathname)) {
      return "website_coaches";
    }
    if (/^\/pricing\/?$/i.test(pathname)) {
      return "website_pricing";
    }
    if (/^\/faq\/?$/i.test(pathname)) {
      return "website_faq";
    }
    if (/^\/contact\/?$/i.test(pathname)) {
      return "website_contact";
    }
    if (/^\/guides\/adult-beginner-judo-auckland\/?$/i.test(pathname)) {
      return "guide_adult_beginner";
    }
    if (/^\/guides\/judo-benefits-kids-auckland\/?$/i.test(pathname)) {
      return "guide_kids_benefits";
    }
    if (/^\/guides\/?$/i.test(pathname)) {
      return "website_guides";
    }

    return "website_home";
  }

  function parseUtmSourceFromHref(href) {
    if (!href) {
      return "";
    }

    try {
      var url = new URL(href, window.location.origin);
      return sanitizeWhitespace(url.searchParams.get("utm_source"));
    } catch (error) {
      return "";
    }
  }

  function getSignupLocation(element) {
    var ancestor;

    if (!element) {
      return "cta";
    }

    if (element.getAttribute("data-signup-location")) {
      return slugify(element.getAttribute("data-signup-location"));
    }

    ancestor = element.closest("header, .page_header, .top-includes");

    if (ancestor) {
      return "header";
    }

    ancestor = element.closest(".page_slider, .intro_layers, .intro_layers_wrapper, .intro_layer");

    if (ancestor) {
      return "hero";
    }

    ancestor = element.closest(".inline-links");

    if (ancestor) {
      return "cta";
    }

    ancestor = element.closest("footer, .page_footer");

    if (ancestor) {
      return "footer";
    }

    ancestor = element.closest(".content-section, .page-hero, .review-carousel, .class-switcher");

    if (ancestor) {
      return "body";
    }

    return "cta";
  }

  function getSignupText(element) {
    if (!element) {
      return "signup";
    }

    return slugify(element.getAttribute("data-signup-text") || element.textContent || "signup");
  }

  function getTrackingDetails(trigger) {
    var href = trigger.tagName === "A" ? sanitizeWhitespace(trigger.getAttribute("href")) : "";
    var source =
      sanitizeWhitespace(trigger.getAttribute("data-signup-source")) ||
      parseUtmSourceFromHref(href) ||
      getSourceFromPathname(window.location.pathname);
    var location = getSignupLocation(trigger);
    var text = getSignupText(trigger);

    return {
      source: source,
      location: location,
      text: text,
      page: window.location.pathname.replace(/\/$/, "") || "/",
      context: buildTrackingToken([location, text]),
      directContext: buildTrackingToken([location, text, "direct"]),
      modalOnlineContext: buildTrackingToken([location, text, "modal", "online"]),
      modalInPersonContext: buildTrackingToken([location, text, "modal", "in_person"])
    };
  }

  function buildJoinUrl(tracking, variant) {
    var url = new URL(JOIN_URL);
    url.searchParams.set("utm_source", tracking.source);
    url.searchParams.set("utm_medium", tracking.location || "cta");
    url.searchParams.set("utm_campaign", MODAL_CAMPAIGN);
    url.searchParams.set("utm_content", tracking.context || tracking.text || "signup");
    url.searchParams.set("cta_page", tracking.page || "/");
    url.searchParams.set("cta_location", tracking.location || "cta");
    url.searchParams.set("cta_text", tracking.text || "signup");

    if (variant) {
      url.searchParams.set("cta_variant", variant);
    }

    return url.toString();
  }

  function buildContactUrl(tracking, variant) {
    var url = new URL(CONTACT_URL);
    url.searchParams.set("utm_source", tracking.source);
    url.searchParams.set("utm_medium", tracking.location || "cta");
    url.searchParams.set("utm_campaign", MODAL_CAMPAIGN);
    url.searchParams.set("utm_content", tracking.context || tracking.text || "signup");
    url.searchParams.set("cta_page", tracking.page || "/");
    url.searchParams.set("cta_location", tracking.location || "cta");
    url.searchParams.set("cta_text", tracking.text || "signup");

    if (variant) {
      url.searchParams.set("cta_variant", variant);
    }

    return url.toString();
  }

  function createModal() {
    var backdrop = document.createElement("div");
    var modal = document.createElement("div");
    var closeButton = document.createElement("button");
    var title = document.createElement("h3");
    var bodyLineOne = document.createElement("p");
    var bodyLineTwo = document.createElement("p");
    var note = document.createElement("p");
    var actions = document.createElement("div");
    var onlineButton = document.createElement("a");
    var inPersonButton = document.createElement("a");

    backdrop.className = "signup-modal-backdrop";
    backdrop.setAttribute("data-signup-modal-backdrop", "");
    backdrop.setAttribute("hidden", "");

    modal.className = "signup-modal";
    modal.setAttribute("role", "dialog");
    modal.setAttribute("aria-modal", "true");
    modal.setAttribute("aria-labelledby", "signupModalTitle");

    closeButton.type = "button";
    closeButton.className = "signup-modal-close";
    closeButton.setAttribute("aria-label", "Close signup options");
    closeButton.setAttribute("data-signup-modal-close", "");
    closeButton.textContent = "×";

    title.id = "signupModalTitle";
    title.textContent = "Start Your Free Class";

    bodyLineOne.textContent = "Sign up online first, then attend any class and speak with Simon when you arrive.";
    bodyLineTwo.textContent = "Prefer to sign up in person? You can register at the dojo with Simon before class starts.";

    note.className = "signup-modal-note";
    note.textContent = "";

    actions.className = "signup-modal-actions";

    onlineButton.className = "btn btn-maincolor";
    onlineButton.setAttribute("data-signup-online", "");
    onlineButton.target = "_blank";
    onlineButton.rel = "noopener noreferrer";
    onlineButton.textContent = "Sign Up Online";

    inPersonButton.className = "btn btn-outline-maincolor";
    inPersonButton.setAttribute("data-signup-inperson", "");
    inPersonButton.textContent = "Sign Up In Person With Simon";

    actions.appendChild(onlineButton);
    // actions.appendChild(inPersonButton);

    modal.appendChild(closeButton);
    modal.appendChild(title);
    modal.appendChild(bodyLineOne);
    modal.appendChild(bodyLineTwo);
    modal.appendChild(note);
    modal.appendChild(actions);

    backdrop.appendChild(modal);
    document.body.appendChild(backdrop);

    return backdrop;
  }

  function shouldHandleTrigger(element) {
    var className = element.className || "";
    var text = sanitizeWhitespace(element.textContent).toLowerCase();
    var href = "";

    if (element.hasAttribute("data-signup-trigger")) {
      return true;
    }

    if (!/\bbtn\b|intro_button/.test(className)) {
      return false;
    }

    if (element.tagName === "A") {
      href = sanitizeWhitespace(element.getAttribute("href"));
    }

    if (/northshorejudo\.co\.nz\/join/i.test(href)) {
      return true;
    }

    return TRIGGER_TEXT_PATTERN.test(text);
  }

  function init() {
    var backdrop = document.querySelector("[data-signup-modal-backdrop]") || createModal();
    var closeButton = backdrop.querySelector("[data-signup-modal-close]");
    var onlineButton = backdrop.querySelector("[data-signup-online]");
    var inPersonButton = backdrop.querySelector("[data-signup-inperson]");
    var triggerSelector = "a.btn, button.btn, a.intro_button, button.intro_button, [data-signup-trigger]";
    var triggers = document.querySelectorAll(triggerSelector);

    function closeModal() {
      backdrop.classList.remove("is-open");
      backdrop.setAttribute("hidden", "");
      document.body.classList.remove("signup-modal-open");
    }

    function openModal(tracking) {
      onlineButton.href = buildJoinUrl(tracking, "modal_online");
      inPersonButton.href = buildContactUrl(tracking, "modal_in_person");

      backdrop.removeAttribute("hidden");
      backdrop.classList.add("is-open");
      document.body.classList.add("signup-modal-open");
      closeButton.focus();
    }

    closeButton.addEventListener("click", closeModal);

    backdrop.addEventListener("click", function (event) {
      if (event.target === backdrop) {
        closeModal();
      }
    });

    document.addEventListener("keydown", function (event) {
      if (event.key === "Escape" && backdrop.classList.contains("is-open")) {
        closeModal();
      }
    });

    triggers.forEach(function (trigger) {
      var tracking;
      var href;
      var hasJoinHref;

      if (!shouldHandleTrigger(trigger)) {
        return;
      }

      tracking = getTrackingDetails(trigger);
      href = trigger.tagName === "A" ? sanitizeWhitespace(trigger.getAttribute("href")) : "";

      hasJoinHref = /northshorejudo\.co\.nz\/join/i.test(href);

      if (trigger.tagName === "A") {
        trigger.href = hasJoinHref ? buildJoinUrl(tracking, "direct") : trigger.href;
      }

      trigger.setAttribute("data-signup-source", tracking.source);
      trigger.setAttribute("data-signup-location", tracking.location);
      trigger.setAttribute("data-signup-text", tracking.text);
      trigger.setAttribute("data-signup-context", tracking.context);
      trigger.setAttribute("data-signup-trigger", "");

      trigger.addEventListener("click", function (event) {
        event.preventDefault();
        openModal(tracking);
      });
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
    return;
  }

  init();
})();
