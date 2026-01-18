(function () {
  const pluginId = "bf-portal-disable-scrolling";
  const plugin = BF2042Portal.Plugins.getPlugin(pluginId);

  let previous = {};
  let wheelBlocker = null;

  plugin.initializeWorkspace = function () {
    console.info("[DisableScrollPlugin] Initializing…");

    // Save previous styles
    previous.bodyOverflow = document.body.style.overflow;
    previous.htmlOverflow = document.documentElement.style.overflow;

    // Disable page scrolling
    document.body.style.overflow = "hidden";
    document.documentElement.style.overflow = "hidden";

    // Block wheel scrolling at document level
    wheelBlocker = function (e) {
      // Allow Blockly editor to handle its own scrolling
      if (e.target.closest(".blocklySvg")) return;
      e.preventDefault();
    };

    document.addEventListener("wheel", wheelBlocker, { passive: false });

    console.info("[DisableScrollPlugin] Page scrolling disabled");
  };

  plugin.dispose = function () {
    console.info("[DisableScrollPlugin] Disposing…");

    // Restore styles
    document.body.style.overflow = previous.bodyOverflow || "";
    document.documentElement.style.overflow = previous.htmlOverflow || "";

    if (wheelBlocker) {
      document.removeEventListener("wheel", wheelBlocker);
      wheelBlocker = null;
    }

    console.info("[DisableScrollPlugin] Page scrolling restored");
  };
})();
