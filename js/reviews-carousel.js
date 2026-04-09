(function () {
  "use strict";

  var DEFAULT_FEED_URL = "/seo/reviews/reviews.json";
  var MAX_REVIEWS = 8;
  var AUTO_ADVANCE_MS = 9000;
  var KEYWORD_PATTERNS = [
    /kids?|children|child|family|son|daughter|pee\s?wees?|junior/i,
    /adult|beginner|fitness|confidence|safe|safety|structured/i,
    /coach|coaches|sensei|simon|doug/i,
    /community|friendly|welcoming|support|respect/i,
    /recommend|progress|discipline|resilience/i
  ];

  function sanitizeWhitespace(text) {
    return String(text || "").replace(/\s+/g, " ").trim();
  }

  function isMostlyEnglish(text) {
    var sample = sanitizeWhitespace(text);

    if (sample.length < 40) {
      return true;
    }

    var asciiChars = sample.match(/[\x00-\x7F]/g) || [];
    return asciiChars.length / sample.length >= 0.9;
  }

  function keywordScore(text) {
    return KEYWORD_PATTERNS.reduce(function (total, pattern) {
      return total + (pattern.test(text) ? 2 : 0);
    }, 0);
  }

  function toTimestamp(value) {
    var numeric = Number(value || 0);
    return Number.isFinite(numeric) ? numeric : 0;
  }

  function normalizeReview(rawReview) {
    if (!rawReview || typeof rawReview !== "object") {
      return null;
    }

    var text = sanitizeWhitespace(rawReview.review_text);
    var rating = Number(rawReview.review_rating || rawReview.rating || 0);

    if (!text || text.length < 35 || !Number.isFinite(rating) || rating < 4) {
      return null;
    }

    if (!isMostlyEnglish(text)) {
      return null;
    }

    return {
      author: sanitizeWhitespace(rawReview.author_title) || "Google Reviewer",
      rating: Math.max(1, Math.min(5, Math.round(rating))),
      text: text,
      timestamp: toTimestamp(rawReview.review_timestamp),
      reviewUrl:
        sanitizeWhitespace(rawReview.review_link) ||
        sanitizeWhitespace(rawReview.reviews_link) ||
        sanitizeWhitespace(rawReview.location_link) ||
        "https://www.google.com/maps/place/?q=place_id:ChIJTbclAm05DW0ROljb3bNvNw8",
      qualityScore:
        keywordScore(text) +
        (text.length > 220 ? 2 : text.length > 120 ? 1 : 0) +
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
        var key = review.author.toLowerCase() + "::" + review.text.slice(0, 80).toLowerCase();

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

  function formatStars(rating) {
    return "*".repeat(rating) + " " + rating + "/5";
  }

  function buildReviewCard(review) {
    var article = createElement("article", "review-card-live");
    var quote = createElement("p", "review-text", '"' + review.text + '"');
    var meta = createElement("div", "review-meta");
    var stars = createElement("span", "review-stars", formatStars(review.rating));
    var author = createElement("span", "review-author", review.author);
    var link = createElement("a", "review-source-link", "Read this review on Google Maps");

    link.href = review.reviewUrl;
    link.target = "_blank";
    link.rel = "noopener noreferrer";

    meta.appendChild(stars);
    meta.appendChild(author);
    article.appendChild(quote);
    article.appendChild(meta);
    article.appendChild(link);

    return article;
  }

  function setTextIfPresent(root, selector, value) {
    var element = root.querySelector(selector);

    if (element && value) {
      element.textContent = value;
    }
  }

  function setHrefIfPresent(root, selector, href) {
    var element = root.querySelector(selector);

    if (element && href) {
      element.href = href;
    }
  }

  function mountCarousel(root, payload) {
    var reviews = payload.items;
    var meta = payload.meta;
    var stage = root.querySelector("[data-review-list]");
    var prevButton = root.querySelector("[data-review-prev]");
    var nextButton = root.querySelector("[data-review-next]");
    var indexLabel = root.querySelector("[data-review-index]");
    var totalLabel = root.querySelector("[data-review-total]");
    var statusLabel = root.querySelector("[data-review-status]");
    var fallback = root.querySelector("[data-review-fallback]");
    var currentIndex = 0;
    var timer = null;

    if (!stage || !reviews.length) {
      return false;
    }

    if (fallback) {
      fallback.hidden = true;
    }

    if (meta.totalReviews > 0) {
      setTextIfPresent(root, "[data-review-count]", String(meta.totalReviews) + " Google reviews");
    }

    if (meta.averageRating > 0) {
      setTextIfPresent(root, "[data-review-rating]", meta.averageRating.toFixed(1) + " / 5");
    }

    setHrefIfPresent(root, "[data-review-google-link]", meta.reviewsUrl);

    function render() {
      stage.innerHTML = "";
      stage.appendChild(buildReviewCard(reviews[currentIndex]));

      if (indexLabel) {
        indexLabel.textContent = String(currentIndex + 1);
      }

      if (totalLabel) {
        totalLabel.textContent = String(reviews.length);
      }
    }

    function clearCycle() {
      if (timer) {
        window.clearInterval(timer);
        timer = null;
      }
    }

    function next() {
      currentIndex = (currentIndex + 1) % reviews.length;
      render();
    }

    function previous() {
      currentIndex = currentIndex === 0 ? reviews.length - 1 : currentIndex - 1;
      render();
    }

    function startCycle() {
      clearCycle();

      if (reviews.length > 1) {
        timer = window.setInterval(next, AUTO_ADVANCE_MS);
      }
    }

    if (prevButton) {
      prevButton.addEventListener("click", function () {
        previous();
        startCycle();
      });
    }

    if (nextButton) {
      nextButton.addEventListener("click", function () {
        next();
        startCycle();
      });
    }

    root.addEventListener("mouseenter", clearCycle);
    root.addEventListener("mouseleave", startCycle);
    root.addEventListener("focusin", clearCycle);
    root.addEventListener("focusout", startCycle);

    render();
    startCycle();

    if (statusLabel) {
      statusLabel.textContent = "Showing curated Google reviews from the latest exported feed.";
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
          "https://www.google.com/maps/place/?q=place_id:ChIJTbclAm05DW0ROljb3bNvNw8"
      }
    };
  }

  function initCarousel(root) {
    var feedUrl = root.getAttribute("data-review-feed") || DEFAULT_FEED_URL;
    var statusLabel = root.querySelector("[data-review-status]");

    if (statusLabel) {
      statusLabel.textContent = "Loading Google reviews...";
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

        if (!mountCarousel(root, payload) && statusLabel) {
          statusLabel.textContent = "Google reviews are temporarily unavailable. Showing fallback testimonials.";
        }
      })
      .catch(function () {
        if (statusLabel) {
          statusLabel.textContent = "Google reviews are temporarily unavailable. Showing fallback testimonials.";
        }
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
