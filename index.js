(function () {
  const pluginId = "bf-portal-disable-scrolling";
  const plugin = BF2042Portal.Plugins.getPlugin(pluginId);

  let previous = {};
  let wheelBlocker = null;
  let observer = null;
  let enabled = false;

  function isBlocklyActive() {
    return !!document.querySelector(".blocklySvg");
  }

  function enableScrollLock() {
    if (enabled) return;
    enabled = true;

    console.info("[DisableScrollPlugin] Enabling scroll lock");

    previous.bodyOverflow = document.body.style.overflow;
    previous.htmlOverflow = document.documentElement.style.overflow;

    document.body.style.overflow = "hidden";
    document.documentElement.style.overflow = "hidden";

    wheelBlocker = function (e) {
      // Allow Blockly & toolbox scrolling
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

  function disableScrollLock() {
    if (!enabled) return;
    enabled = false;

    console.info("[DisableScrollPlugin] Disabling scroll lock");

    document.body.style.overflow = previous.bodyOverflow || "";
    document.documentElement.style.overflow = previous.htmlOverflow || "";

    if (wheelBlocker) {
      document.removeEventListener("wheel", wheelBlocker);
      wheelBlocker = null;
    }
  }

  function evaluateState() {
    if (isBlocklyActive()) {
      enableScrollLock();
    } else {
      disableScrollLock();
    }
  }

  plugin.initialize = function () {
    console.info("[DisableScrollPlugin] Initializing");

    // Watch for SPA DOM changes
    observer = new MutationObserver(() => {
      evaluateState();
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true,
    });

    // Initial check
    evaluateState();
  };

  plugin.dispose = function () {
    console.info("[DisableScrollPlugin] Disposing");

    if (observer) {
      observer.disconnect();
      observer = null;
    }

    disableScrollLock();
  };
})();
