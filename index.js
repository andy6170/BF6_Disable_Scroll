(function () {
  const pluginId = "bf-portal-disable-scrolling";
  const plugin = BF2042Portal.Plugins.getPlugin(pluginId);

  let previous = {};
  let wheelBlocker = null;
  let cleanupObserver = null;

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

  function enable() {
    if (wheelBlocker) return;

    console.info("[DisableScrollPlugin] Enabling");

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

  function disable() {
    if (!wheelBlocker) return;

    console.info("[DisableScrollPlugin] Disabling");

    document.body.style.overflow = previous.bodyOverflow || "";
    document.documentElement.style.overflow = previous.htmlOverflow || "";

    document.removeEventListener("wheel", wheelBlocker);
    wheelBlocker = null;
  }

  plugin.initializeWorkspace = function () {
    enable();

    // Watch for Blockly being removed from the DOM
    cleanupObserver = new MutationObserver(() => {
      if (!document.querySelector(".blocklySvg")) {
        disable();
        cleanupObserver.disconnect();
        cleanupObserver = null;
      }
    });

    cleanupObserver.observe(document.body, {
      childList: true,
      subtree: true,
    });
  };

  plugin.dispose = function () {
    disable();
    if (cleanupObserver) {
      cleanupObserver.disconnect();
      cleanupObserver = null;
    }
  };
})();
