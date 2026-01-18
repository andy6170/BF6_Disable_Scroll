(function () {
  const pluginId = "bf-portal-disable-scrolling";
  const plugin = BF2042Portal.Plugins.getPlugin(pluginId);

  let previous = {};
  let wheelBlocker = null;
  let observer = null;
  let active = false;

  function canElementScroll(el) {
    if (!el || el === document.body || el === document.documentElement) {
      return false;
    }

    const style = window.getComputedStyle(el);
    const overflowY = style.overflowY;

    if (overflowY !== "auto" && overflowY !== "scroll") {
      return false;
    }

    return el.scrollHeight > el.clientHeight;
  }

  function hasScrollableAncestor(target) {
    let el = target;
    while (el && el !== document.body) {
      if (canElementScroll(el)) return true;
      el = el.parentElement;
    }
    return false;
  }

  function cleanup(reason) {
    if (!active) return;
    active = false;

    console.info("[DisableScrollPlugin] Cleanup:", reason);

    document.body.style.overflow = previous.bodyOverflow || "";
    document.documentElement.style.overflow = previous.htmlOverflow || "";

    if (wheelBlocker) {
      document.removeEventListener("wheel", wheelBlocker);
      wheelBlocker = null;
    }

    if (observer) {
      observer.disconnect();
      observer = null;
    }
  }

  plugin.initializeWorkspace = function () {
    console.info("[DisableScrollPlugin] Initializing");

    previous.bodyOverflow = document.body.style.overflow;
    previous.htmlOverflow = document.documentElement.style.overflow;

    // Disable page scrolling
    document.body.style.overflow = "hidden";
    document.documentElement.style.overflow = "hidden";

    wheelBlocker = function (e) {
      // ✅ Allow scroll if any ancestor can scroll
      if (hasScrollableAncestor(e.target)) return;

      // ❌ Otherwise block page scroll
      e.preventDefault();
    };

    document.addEventListener("wheel", wheelBlocker, { passive: false });

    active = true;

    // Auto-cleanup when Blockly disappears
    observer = new MutationObserver(() => {
      if (!document.querySelector(".blocklySvg")) {
        cleanup("Blockly removed");
      }
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true,
    });

    console.info("[DisableScrollPlugin] Page scrolling disabled");
  };

  plugin.dispose = function () {
    cleanup("Plugin disposed");
  };
})();
