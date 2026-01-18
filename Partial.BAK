(function () {
  const pluginId = "bf-portal-disable-scrolling";
  const plugin = BF2042Portal.Plugins.getPlugin(pluginId);

  let previous = {};
  let wheelBlocker = null;
  let observer = null;
  let active = false;

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

    document.body.style.overflow = "hidden";
    document.documentElement.style.overflow = "hidden";

    wheelBlocker = function (e) {
      if (isInsideAllowedContainer(e.target)) return;
      e.preventDefault();
    };

    document.addEventListener("wheel", wheelBlocker, { passive: false });
    active = true;

    // 🔑 Watch for Blockly being removed (navigation away)
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
