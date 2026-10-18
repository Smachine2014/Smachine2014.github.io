(function () {
  "use strict";

  var DEFAULT_FEED_URL = "/seo/reviews/reviews.json";
  var DEFAULT_REVIEW_LINK = "https://www.google.com/maps/place/?q=place_id:ChIJTbclAm05DW0ROljb3bNvNw8";
  var MAX_REVIEWS = 9;
  var AUTO_ADVANCE_MS = 7500;
  var MAX_TEXT_LENGTH = 520;
  var KEYWORD_PATTERNS = [
    /kids?|children|family|parent|junior|pee\s?wees?/i,
    /adult|beginner|confidence|fitness|safe|structured/i,
    /coach|coaches|sensei|simon|doug/i,
    /friendly|welcoming|community|support/i,
    /recommend|progress|respect|discipline/i
  ];

  function sanitizeWhitespace(text) {
    return String(text || "").replace(/\s+/g, " ").trim();
  }

  function clampText(text) {
    if (text.length <= MAX_TEXT_LENGTH) {
      return text;
    }

    return text.slice(0, MAX_TEXT_LENGTH - 1).trim() + "...";
  }

  function isMostlyEnglish(text) {
    var sample = sanitizeWhitespace(text);

    if (sample.length < 40) {
      return true;
    }

    var asciiChars = sample.match(/[\x00-\x7F]/g) || [];
    return asciiChars.length / sample.length >= 0.88;
  }

  function keywordScore(text) {
    var score = 0;

    KEYWORD_PATTERNS.forEach(function (pattern) {
      if (pattern.test(text)) {
        score += 2;
      }
    });

    return score;
  }

  function toTimestamp(value) {
    var numeric = Number(value || 0);
    return Number.isFinite(numeric) ? numeric : 0;
  }

  function formatDate(timestamp) {
    if (!timestamp) {
      return "";
    }

    try {
      return new Date(timestamp * 1000).toLocaleDateString("en-NZ", {
        month: "short",
        year: "numeric"
      });
    } catch (error) {
      return "";
    }
  }

  function getInitials(author) {
    var words = sanitizeWhitespace(author).split(" ").filter(Boolean);

    if (!words.length) {
      return "G";
    }

    if (words.length === 1) {
      return words[0].charAt(0).toUpperCase();
    }

    return (words[0].charAt(0) + words[1].charAt(0)).toUpperCase();
  }

  function normalizeReview(rawReview) {
    if (!rawReview || typeof rawReview !== "object") {
      return null;
    }

    var text = clampText(sanitizeWhitespace(rawReview.review_text));
    var rating = Number(rawReview.review_rating || rawReview.rating || 0);
    var author = sanitizeWhitespace(rawReview.author_title) || "Google Reviewer";

    if (!text || text.length < 35 || !Number.isFinite(rating) || rating < 4) {
      return null;
    }

    if (!isMostlyEnglish(text)) {
      return null;
    }

    return {
      author: author,
      initials: getInitials(author),
      authorImage: sanitizeWhitespace(rawReview.author_image),
      rating: Math.max(1, Math.min(5, Math.round(rating))),
      text: text,
      timestamp: toTimestamp(rawReview.review_timestamp),
      dateLabel: formatDate(toTimestamp(rawReview.review_timestamp)),
      reviewUrl:
        sanitizeWhitespace(rawReview.review_link) ||
        sanitizeWhitespace(rawReview.reviews_link) ||
        sanitizeWhitespace(rawReview.location_link) ||
        DEFAULT_REVIEW_LINK,
      qualityScore:
        keywordScore(text) +
        (text.length > 280 ? 2 : text.length > 150 ? 1 : 0) +
        (rating >= 5 ? 2 : 1)
    };
  }

  function pickReviews(reviews) {
    var deduped = [];
    var seen = Object.create(null);

    reviews
      .sort(function (a, b) {
        if (b.qualityScore !== a.qualityScore) {
          return b.qualityScore - a.qualityScore;
        }

        if (b.timestamp !== a.timestamp) {
          return b.timestamp - a.timestamp;
        }

        return b.text.length - a.text.length;
      })
      .forEach(function (review) {
        var key = review.author.toLowerCase() + "::" + review.text.slice(0, 90).toLowerCase();

        if (!seen[key] && deduped.length < MAX_REVIEWS) {
          seen[key] = true;
          deduped.push(review);
        }
      });

    return deduped;
  }

  function createElement(tagName, className, text) {
    var element = document.createElement(tagName);

    if (className) {
      element.className = className;
    }

    if (typeof text === "string") {
      element.textContent = text;
    }

    return element;
  }

  function getStarString(rating) {
    var value = "";
    var i;

    for (i = 0; i < 5; i += 1) {
      value += i < rating ? "★" : "☆";
    }

    return value;
  }

  function buildReviewCard(review, forMeasurement) {
    var article = createElement("article", "review-card-live is-entering");
    var head = createElement("div", "review-card-head");
    var avatar = createElement("div", "review-avatar");
    var profile = createElement("div", "review-profile");
    var author = createElement("h4", "review-author", review.author);
    var meta = createElement("div", "review-meta");
    var stars = createElement("span", "review-stars", getStarString(review.rating));
    var date = createElement("span", "review-date", review.dateLabel || "Recent review");
    var quote = createElement("p", "review-text", '“' + review.text + '”');
    var link = createElement("a", "review-source-link", "Read on Google");

    avatar.appendChild(createElement("span", "review-avatar-fallback", review.initials));
    avatar.setAttribute("aria-hidden", "true");

    if (review.authorImage && !forMeasurement) {
      var image = createElement("img", "review-avatar-image");
      image.alt = "";
      image.loading = "lazy";
      image.addEventListener("error", function () {
        image.remove();
      });
      image.src = review.authorImage;
      avatar.appendChild(image);
    }

    link.href = review.reviewUrl;
    link.target = "_blank";
    link.rel = "noopener noreferrer";

    meta.appendChild(stars);
    meta.appendChild(date);
    profile.appendChild(author);
    profile.appendChild(meta);
    head.appendChild(avatar);
    head.appendChild(profile);

    article.appendChild(quote);
    article.appendChild(head);
    article.appendChild(link);

    return article;
  }

  function updateReviewLink(root, selector, href) {
    var element = root.querySelector(selector);

    if (!element || !href) {
      return;
    }

    element.href = href;
  }

  function updateReviewText(root, selector, value) {
    var element = root.querySelector(selector);

    if (!element || !value) {
      return;
    }

    element.textContent = value;
  }

  function setUnavailableStatus(root, meta) {
    var status = root.querySelector("[data-review-status]");

    if (!status) {
      return;
    }

    status.textContent = "Google reviews are temporarily unavailable.";

    if (meta && meta.reviewsUrl) {
      var link = createElement("a", "review-source-link", "View all reviews on Google");
      link.href = meta.reviewsUrl;
      link.target = "_blank";
      link.rel = "noopener noreferrer";
      status.appendChild(document.createTextNode(" "));
      status.appendChild(link);
    }
  }

  function mountCarousel(root, payload) {
    var reviews = payload.items;
    var meta = payload.meta;
    var stage = root.querySelector("[data-review-list]");
    var positionLabel = root.querySelector("[data-review-position]");
    var prevButton = root.querySelector("[data-review-prev]");
    var nextButton = root.querySelector("[data-review-next]");
    var statusLabel = root.querySelector("[data-review-status]");
    var currentIndex = 0;
    var timer = null;
    var hovered = root.matches(":hover");
    var focused = root.contains(document.activeElement);
    var manuallyPaused = false;
    var animations = [];
    var renderVersion = 0;
    var reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    var measurementFrame = null;
    var forceMeasurement = false;
    var measuredWidth = 0;

    if (!stage || !reviews.length) {
      setUnavailableStatus(root, meta);
      return false;
    }

    stage.setAttribute("aria-live", "off");

    updateReviewLink(root, "[data-review-google-link]", meta.reviewsUrl);

    if (meta.totalReviews > 0) {
      updateReviewText(root, "[data-review-count]", String(meta.totalReviews) + " reviews");
    }

    if (meta.averageRating > 0) {
      updateReviewText(root, "[data-review-rating]", meta.averageRating.toFixed(1) + " / 5");
    }

    function clearCycle() {
      if (timer) {
        window.clearTimeout(timer);
        timer = null;
      }
    }

    function startCycle() {
      clearCycle();

      if (reviews.length > 1 && !hovered && !focused && !manuallyPaused && !document.hidden && !reducedMotion.matches) {
        timer = window.setTimeout(function () {
          timer = null;
          goTo((currentIndex + 1) % reviews.length, true);
          startCycle();
        }, AUTO_ADVANCE_MS);
      }
    }

    function updatePosition() {
      if (positionLabel) {
        positionLabel.textContent = (currentIndex + 1) + " / " + reviews.length;
      }
    }

    function stageWidth() {
      var style = window.getComputedStyle(stage);
      return stage.getBoundingClientRect().width
        - (parseFloat(style.paddingLeft) || 0) - (parseFloat(style.paddingRight) || 0)
        - (parseFloat(style.borderLeftWidth) || 0) - (parseFloat(style.borderRightWidth) || 0);
    }

    function measureStage(force) {
      var width = stageWidth();
      if (width <= 0) {
        measuredWidth = 0;
        return;
      }
      if (!force && Math.abs(width - measuredWidth) < 0.01) return;

      var tallest = 0;
      reviews.forEach(function (review) {
        var card = buildReviewCard(review, true);
        card.classList.remove("is-entering");
        card.classList.add("is-measuring");
        card.setAttribute("aria-hidden", "true");
        card.setAttribute("inert", "");
        card.style.cssText = "position:absolute;visibility:hidden;pointer-events:none;inset:0 auto auto 0;min-height:0;height:auto;max-height:none;transform:none;transition:none;width:" + width + "px";
        stage.appendChild(card);
        try {
          tallest = Math.max(tallest, card.getBoundingClientRect().height);
        } finally {
          card.remove();
        }
      });

      measuredWidth = width;
      if (tallest > 0) {
        var height = Math.ceil(tallest) + "px";
        stage.style.minHeight = height;
        stage.style.setProperty("--review-stage-height", height);
      }
    }

    function scheduleMeasurement(force) {
      forceMeasurement = forceMeasurement || force;
      if (measurementFrame !== null) return;
      measurementFrame = window.requestAnimationFrame(function () {
        measurementFrame = null;
        var shouldForce = forceMeasurement;
        forceMeasurement = false;
        measureStage(shouldForce);
      });
    }

    function render(animateIn) {
      var outgoing = stage.lastElementChild;
      var outgoingStyle = outgoing ? window.getComputedStyle(outgoing) : null;
      var outgoingOpacity = outgoingStyle ? outgoingStyle.opacity : "1";
      var outgoingTransform = outgoingStyle ? outgoingStyle.transform : "none";
      var card = buildReviewCard(reviews[currentIndex]);
      var version = ++renderVersion;

      animations.forEach(function (animation) { animation.cancel(); });
      animations = [];

      stage.innerHTML = "";
      card.classList.remove("is-entering");
      stage.appendChild(card);
      updatePosition();

      if (!animateIn || !outgoing || reducedMotion.matches || typeof card.animate !== "function") return;

      if (window.getComputedStyle(stage).position === "static") stage.style.position = "relative";
      outgoing.classList.add("is-leaving");
      outgoing.setAttribute("aria-hidden", "true");
      outgoing.setAttribute("inert", "");
      outgoing.querySelectorAll("a, button, [tabindex]").forEach(function (element) {
        element.setAttribute("tabindex", "-1");
      });
      outgoing.style.position = "absolute";
      outgoing.style.inset = "0 0 auto";
      outgoing.style.pointerEvents = "none";
      stage.insertBefore(outgoing, card);

      var options = { duration: 180, easing: "cubic-bezier(0.2, 0, 0, 1)", fill: "both" };
      animations = [
        outgoing.animate([
          { opacity: outgoingOpacity, transform: outgoingTransform },
          { opacity: 0, transform: "translateY(-4px)" }
        ], options),
        card.animate([
          { opacity: 0, transform: "translateY(6px)" },
          { opacity: 1, transform: "translateY(0)" }
        ], options)
      ];

      Promise.all(animations.map(function (animation) { return animation.finished; }))
        .then(function () {
          if (version !== renderVersion) return;
          outgoing.remove();
          animations.forEach(function (animation) { animation.cancel(); });
          animations = [];
        })
        .catch(function () { /* A newer navigation cancelled this transition. */ });
    }

    function goTo(nextIndex, animateIn) {
      currentIndex = nextIndex;
      render(animateIn);
    }

    if (prevButton) {
      prevButton.addEventListener("click", function () {
        manuallyPaused = true;
        clearCycle();
        stage.setAttribute("aria-live", "polite");
        var targetIndex = currentIndex === 0 ? reviews.length - 1 : currentIndex - 1;
        goTo(targetIndex, true);
      });
    }

    if (nextButton) {
      nextButton.addEventListener("click", function () {
        manuallyPaused = true;
        clearCycle();
        stage.setAttribute("aria-live", "polite");
        goTo((currentIndex + 1) % reviews.length, true);
      });
    }

    root.addEventListener("mouseenter", function () { hovered = true; clearCycle(); });
    root.addEventListener("mouseleave", function () { hovered = false; startCycle(); });
    root.addEventListener("focusin", function () { focused = true; clearCycle(); });
    root.addEventListener("focusout", function (event) {
      if (root.contains(event.relatedTarget)) return;
      focused = false;
      startCycle();
    });
    document.addEventListener("visibilitychange", startCycle);

    function onMotionChange() {
      if (reducedMotion.matches) {
        renderVersion += 1;
        animations.forEach(function (animation) { animation.cancel(); });
        animations = [];
        stage.querySelectorAll(".is-leaving").forEach(function (card) { card.remove(); });
      }
      startCycle();
    }

    if (reducedMotion.addEventListener) reducedMotion.addEventListener("change", onMotionChange);
    else reducedMotion.addListener(onMotionChange);
    root.addEventListener("keydown", function (event) {
      if (event.key === "ArrowLeft") {
        event.preventDefault();
        if (prevButton) {
          prevButton.click();
        }
      }

      if (event.key === "ArrowRight") {
        event.preventDefault();
        if (nextButton) {
          nextButton.click();
        }
      }
    });

    render(false);
    measureStage(true);
    window.addEventListener("resize", function () { scheduleMeasurement(true); });
    if (typeof window.ResizeObserver === "function") {
      var resizeObserver = new window.ResizeObserver(function () { scheduleMeasurement(false); });
      resizeObserver.observe(stage);
    }
    if (document.fonts) {
      document.fonts.ready.then(function () { scheduleMeasurement(true); });
      if (document.fonts.addEventListener) {
        document.fonts.addEventListener("loadingdone", function () { scheduleMeasurement(true); });
      }
    }
    startCycle();

    if (statusLabel) {
      statusLabel.textContent = "";
    }

    return true;
  }

  function readPayload(rawData) {
    var rawReviews = Array.isArray(rawData)
      ? rawData
      : Array.isArray(rawData && rawData.reviews)
      ? rawData.reviews
      : [];
    var normalized = rawReviews.map(normalizeReview).filter(Boolean);
    var curated = pickReviews(normalized);
    var first = rawReviews[0] || {};

    return {
      items: curated,
      meta: {
        totalReviews: Number(first.reviews || 0) || rawReviews.length,
        averageRating: Number(first.rating || 0),
        reviewsUrl:
          sanitizeWhitespace(first.reviews_link) ||
          sanitizeWhitespace(first.location_link) ||
          DEFAULT_REVIEW_LINK
      }
    };
  }

  function initCarousel(root) {
    var feedUrl = root.getAttribute("data-review-feed") || DEFAULT_FEED_URL;
    var statusLabel = root.querySelector("[data-review-status]");

    if (statusLabel) {
      statusLabel.textContent = "Loading latest Google reviews...";
    }

    fetch(feedUrl, {
      cache: "no-store",
      headers: {
        Accept: "application/json"
      }
    })
      .then(function (response) {
        if (!response.ok) {
          throw new Error("Review feed request failed");
        }

        return response.json();
      })
      .then(function (rawData) {
        var payload = readPayload(rawData);
        mountCarousel(root, payload);
      })
      .catch(function () {
        setUnavailableStatus(root, {
          reviewsUrl: DEFAULT_REVIEW_LINK
        });
      });
  }

  function init() {
    var carousels = document.querySelectorAll("[data-review-carousel]");

    if (!carousels.length) {
      return;
    }

    carousels.forEach(initCarousel);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
    return;
  }

  init();
})();
