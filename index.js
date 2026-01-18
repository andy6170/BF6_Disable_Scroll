(function () {
  const pluginId = "bf-portal-disable-scrolling";
  const plugin = BF2042Portal.Plugins.getPlugin(pluginId);

  let wheelBlocker = null;
  let observer = null;
  let enabled = false;
  let previous = {};

  const ALLOWED_SCROLL_CONTAINERS = [
    ".blocklySvg",
    ".blocklyToolboxContents",
    ".blocklyFlyout",
    ".blocklyWidgetDiv",
    ".blocklyDropDownDiv",
  ];

  function isInsideAllowedContainer(target) {
    return ALLOWED_SCROLL_CONTAINERS.some(sel => target.closest(sel));
  }

  function enableScrollBlock() {
    if (enabled) return;
    enabled = true;

    console.info("[DisableScrollPlugin] Enabling page scroll lock");

    previous.bodyOverflow = document.body.style.overflow;
    previous.htmlOverflow = document.documentElement.style.overflow;

    document.body.style.overflow = "hidden";
    document.documentElement.style.overflow = "hidden";

    wheelBlocker = function (e) {
      if (isInsideAllowedContainer(e.target)) return;
      e.preventDefault();
    };

    document.addEventListener("wheel", wheelBlocker, { passive: false });
  }

  function disableScrollBlock() {
    if (!enabled) return;
    enabled = false;

    console.info("[DisableScrollPlugin] Restoring page scrolling");

    document.body.style.overflow = previous.bodyOverflow || "";
    document.documentElement.style.overflow = previous.htmlOverflow || "";

    if (wheelBlocker) {
      document.removeEventListener("wheel", wheelBlocker);
      wheelBlocker = null;
    }
  }

  function checkBlocklyPresence() {
    const blocklyRoot = document.querySelector(".blocklySvg");
    if (blocklyRoot) {
      enableScrollBlock();
    } else {
      disableScrollBlock();
    }
  }

  plugin.initialize = function () {
    console.info("[DisableScrollPlugin] Plugin loaded");

    // Initial check
    checkBlocklyPresence();

    // Watch for SPA navigation / DOM swaps
    observer = new MutationObserver(() => {
      checkBlocklyPresence();
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true,
    });
  };

  plugin.dispose = function () {
    console.info("[DisableScrollPlugin] Plugin disposed");

    if (observer) {
      observer.disconnect();
      observer = null;
    }

    disableScrollBlock();
  };
})();
