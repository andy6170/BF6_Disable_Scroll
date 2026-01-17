(function () {
  const pluginId = "bf-portal-disable-page-scroll";
  const plugin = BF2042Portal.Plugins.getPlugin(pluginId);

  let previous = {};
  let wheelHandler = null;

  function isInsideBlockly(e) {
    return e.target.closest?.(".blocklySvg, .blocklyWidgetDiv");
  }

  plugin.initialize = function () {
    console.info("[DisableScrollPlugin] Initializing…");

    // Save previous styles
    previous.htmlOverflow = document.documentElement.style.overflow;
    previous.bodyOverflow = document.body.style.overflow;

    // Disable page scroll
    document.documentElement.style.overflow = "hidden";
    document.body.style.overflow = "hidden";

    // Block wheel scrolling unless it's inside Blockly
    wheelHandler = function (e) {
      if (!isInsideBlockly(e)) {
        e.preventDefault();
      }
    };

    window.addEventListener("wheel", wheelHandler, { passive: false });

    console.info("[DisableScrollPlugin] Page scrolling disabled (Blockly preserved)");
  };

  plugin.dispose = function () {
    console.info("[DisableScrollPlugin] Disposing…");

    document.documentElement.style.overflow = previous.htmlOverflow || "";
    document.body.style.overflow = previous.bodyOverflow || "";

    if (wheelHandler) {
      window.removeEventListener("wheel", wheelHandler);
      wheelHandler = null;
    }

    console.info("[DisableScrollPlugin] Page scrolling restored");
  };
})();
