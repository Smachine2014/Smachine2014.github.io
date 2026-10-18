(function () {
  "use strict";

  function init() {
    var header = document.querySelector(".club-header");
    if (!header) return;

    var toggle = header.querySelector(".club-menu-toggle");
    var navigation = header.querySelector("#club-navigation");
    if (!toggle || !navigation) return;

    var desktop = window.matchMedia("(min-width: 900px)");

    function setOpen(open, restoreFocus) {
      header.setAttribute("data-menu-open", String(open));
      toggle.setAttribute("aria-expanded", String(open));
      if (restoreFocus) toggle.focus();
    }

    setOpen(false);
    header.classList.add("has-menu-js");

    toggle.addEventListener("click", function () {
      setOpen(toggle.getAttribute("aria-expanded") !== "true");
    });

    navigation.addEventListener("click", function (event) {
      if (event.target.closest("a")) setOpen(false);
    });

    document.addEventListener("keydown", function (event) {
      if (event.key === "Escape" && toggle.getAttribute("aria-expanded") === "true") {
        event.preventDefault();
        setOpen(false, true);
      }
    });

    function onBreakpointChange(event) {
      if (event.matches) setOpen(false);
    }

    if (desktop.addEventListener) {
      desktop.addEventListener("change", onBreakpointChange);
    } else {
      desktop.addListener(onBreakpointChange);
    }
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
