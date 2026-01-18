(function () {
  const pluginId = "bf-portal-disable-scrolling";
  const plugin = BF2042Portal.Plugins.getPlugin(pluginId);

  let wheelBlocker = null;
  let active = false;

  function isBlocklyPage() {
    return !!document.querySelector(".blocklySvg");
  }

  function disablePageScroll() {
    if (active) return;
    active = true;

    console.info("[DisableScrollPlugin] Disabling page scroll");

    document.documentElement.style.overflow = "hidden";
    document.body.style.overflow = "hidden";

    wheelBlocker = function (e) {
      // Allow Blockly + toolbox scrolling
      if (
        e.target.closest(".blocklySvg") ||
        e.target.closest(".blocklyToolboxContents")
      ) {
        return;
      }
      e.preventDefault();
    };

    document.addEventListener("wheel", wheelBlocker, { passive: false });
  }

  function enablePageScroll() {
    if (!active) return;
    active = false;

    console.info("[DisableScrollPlugin] Restoring page scroll");

    document.documentElement.style.overflow = "";
    document.body.style.overflow = "";

    if (wheelBlocker) {
      document.removeEventListener("wheel", wheelBlocker);
      wheelBlocker = null;
    }
  }

  function updateState() {
    if (isBlocklyPage()) {
      disablePageScroll();
    } else {
      enablePageScroll();
    }
  }

  plugin.initialize = function () {
    console.info("[DisableScrollPlugin] Plugin loaded");

    // Initial check
    updateState();

    // Watch for SPA navigation / DOM changes
    const observer = new MutationObserver(updateState);
    observer.observe(document.body, {
      childList: true,
      subtree: true,
    });

    plugin._observer = observer;
  };

  plugin.dispose = function () {
    console.info("[DisableScrollPlugin] Plugin disposed");

    enablePageScroll();

    if (plugin._observer) {
      plugin._observer.disconnect();
      plugin._observer = null;
    }
  };
})();
