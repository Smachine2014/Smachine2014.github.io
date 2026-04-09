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

  function buildReviewCard(review) {
    var article = createElement("article", "review-card-live is-entering");
    var head = createElement("div", "review-card-head");
    var avatar = createElement("div", "review-avatar");
    var profile = createElement("div", "review-profile");
    var author = createElement("h4", "review-author", review.author);
    var meta = createElement("div", "review-meta");
    var stars = createElement("span", "review-stars", getStarString(review.rating));
    var date = createElement("span", "review-date", review.dateLabel || "Recent review");
    var quote = createElement("p", "review-text", '"' + review.text + '"');
    var link = createElement("a", "review-source-link", "Read this review on Google");

    if (review.authorImage) {
      var image = createElement("img", "review-avatar-image");
      image.src = review.authorImage;
      image.alt = review.author + " avatar";
      image.loading = "lazy";
      avatar.appendChild(image);
    } else {
      avatar.appendChild(createElement("span", "review-avatar-fallback", review.initials));
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

    article.appendChild(head);
    article.appendChild(quote);
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
    var dotsWrap = root.querySelector("[data-review-dots]");
    var prevButton = root.querySelector("[data-review-prev]");
    var nextButton = root.querySelector("[data-review-next]");
    var statusLabel = root.querySelector("[data-review-status]");
    var currentIndex = 0;
    var timer = null;

    if (!stage || !reviews.length) {
      setUnavailableStatus(root, meta);
      return false;
    }

    updateReviewLink(root, "[data-review-google-link]", meta.reviewsUrl);

    if (meta.totalReviews > 0) {
      updateReviewText(root, "[data-review-count]", String(meta.totalReviews) + " reviews");
    }

    if (meta.averageRating > 0) {
      updateReviewText(root, "[data-review-rating]", meta.averageRating.toFixed(1) + " / 5");
    }

    function clearCycle() {
      if (timer) {
        window.clearInterval(timer);
        timer = null;
      }
    }

    function startCycle() {
      clearCycle();

      if (reviews.length > 1) {
        timer = window.setInterval(function () {
          goTo((currentIndex + 1) % reviews.length, true);
        }, AUTO_ADVANCE_MS);
      }
    }

    function updateDots() {
      var buttons;

      if (!dotsWrap) {
        return;
      }

      buttons = dotsWrap.querySelectorAll("button");

      buttons.forEach(function (button, index) {
        var isActive = index === currentIndex;
        button.classList.toggle("is-active", isActive);
        button.setAttribute("aria-current", isActive ? "true" : "false");
      });
    }

    function render(animateIn) {
      var card = buildReviewCard(reviews[currentIndex]);

      stage.innerHTML = "";
      stage.appendChild(card);
      updateDots();

      if (animateIn) {
        window.requestAnimationFrame(function () {
          card.classList.remove("is-entering");
        });
      } else {
        card.classList.remove("is-entering");
      }
    }

    function goTo(nextIndex, animateIn) {
      currentIndex = nextIndex;
      render(animateIn);
    }

    function buildDots() {
      if (!dotsWrap || reviews.length <= 1) {
        return;
      }

      dotsWrap.innerHTML = "";

      reviews.forEach(function (review, index) {
        var dot = createElement("button", "review-dot");
        dot.type = "button";
        dot.setAttribute("aria-label", "Show review " + (index + 1) + " by " + review.author);
        dot.addEventListener("click", function () {
          goTo(index, true);
          startCycle();
        });
        dotsWrap.appendChild(dot);
      });
    }

    if (prevButton) {
      prevButton.addEventListener("click", function () {
        var targetIndex = currentIndex === 0 ? reviews.length - 1 : currentIndex - 1;
        goTo(targetIndex, true);
        startCycle();
      });
    }

    if (nextButton) {
      nextButton.addEventListener("click", function () {
        goTo((currentIndex + 1) % reviews.length, true);
        startCycle();
      });
    }

    root.addEventListener("mouseenter", clearCycle);
    root.addEventListener("mouseleave", startCycle);
    root.addEventListener("focusin", clearCycle);
    root.addEventListener("focusout", startCycle);
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

    buildDots();
    render(false);
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
