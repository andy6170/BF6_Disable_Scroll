(function () {
  const pluginId = "bf-portal-disable-scrolling";
  const plugin = BF2042Portal.Plugins.getPlugin(pluginId);

  let previous = {};
  let wheelBlocker = null;

  // Elements that are allowed to scroll
  const ALLOWED_SCROLL_CONTAINERS = [
    ".blocklySvg",                     // main workspace
    ".blocklyToolboxContents",          // toolbox
    ".blocklyFlyout",                   // flyout panel
    ".blocklyWidgetDiv",                // dropdowns / menus
    ".blocklyDropDownDiv",              // variable/type dropdowns
  ];

  function isInsideAllowedContainer(target) {
    return ALLOWED_SCROLL_CONTAINERS.some(selector =>
      target.closest(selector)
    );
  }

  plugin.initializeWorkspace = function () {
    console.info("[DisableScrollPlugin] Initializing");

    // Save previous overflow styles
    previous.bodyOverflow = document.body.style.overflow;
    previous.htmlOverflow = document.documentElement.style.overflow;

    // Disable page scrolling
    document.body.style.overflow = "hidden";
    document.documentElement.style.overflow = "hidden";

    wheelBlocker = function (e) {
      // Allow scrolling inside Blockly UI elements
      if (isInsideAllowedContainer(e.target)) {
        return;
      }

      // Otherwise prevent page scroll
      e.preventDefault();
    };

    document.addEventListener("wheel", wheelBlocker, { passive: false });

    console.info("[DisableScrollPlugin] Page scrolling disabled");
  };

  plugin.dispose = function () {
    console.info("[DisableScrollPlugin] Disposing");

    document.body.style.overflow = previous.bodyOverflow || "";
    document.documentElement.style.overflow = previous.htmlOverflow || "";

    if (wheelBlocker) {
      document.removeEventListener("wheel", wheelBlocker);
      wheelBlocker = null;
    }

    console.info("[DisableScrollPlugin] Page scrolling restored");
  };
})();
