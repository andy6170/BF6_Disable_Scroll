(function () {
  const pluginId = "bf-portal-disable-scrolling";
  const plugin = BF2042Portal.Plugins.getPlugin(pluginId);

  let prevHtmlOverflow = "";
  let prevBodyOverflow = "";

  plugin.initialize = function () {
    console.info("[DisableScrollPlugin] Initializing…");

    prevHtmlOverflow = document.documentElement.style.overflow;
    prevBodyOverflow = document.body.style.overflow;

    document.documentElement.style.overflow = "hidden";
    document.body.style.overflow = "hidden";

    console.info("[DisableScrollPlugin] Page scrolling disabled (Blockly preserved)");
  };

  plugin.dispose = function () {
    document.documentElement.style.overflow = prevHtmlOverflow || "";
    document.body.style.overflow = prevBodyOverflow || "";

    console.info("[DisableScrollPlugin] Page scrolling restored");
  };
})();
