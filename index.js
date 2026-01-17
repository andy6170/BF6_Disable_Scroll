(function () {
  const pluginId = "bf-portal-disable-scrolling";
  const plugin = BF2042Portal.Plugins.getPlugin(pluginId);

  let previousOverflow = null;

  plugin.initialize = function () {
    // Save previous state so we can restore it
    previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    console.info("[DisableScrollPlugin] Page scrolling disabled");
  };

  plugin.dispose = function () {
    // Restore original scroll behavior
    document.body.style.overflow = previousOverflow || "";

    console.info("[DisableScrollPlugin] Page scrolling restored");
  };
})();
