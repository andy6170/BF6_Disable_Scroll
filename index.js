(function () {
  const pluginId = "bf-portal-disable-scrolling";
  const plugin = BF2042Portal.Plugins.getPlugin(pluginId);

  let previous = {};

  function preventScroll(e) {
    e.preventDefault();
  }

  plugin.initialize = function () {
    // Save previous styles
    previous.htmlOverflow = document.documentElement.style.overflow;
    previous.bodyOverflow = document.body.style.overflow;

    // Disable scrolling via CSS
    document.documentElement.style.overflow = "hidden";
    document.body.style.overflow = "hidden";

    // Block wheel + touch scrolling
    window.addEventListener("wheel", preventScroll, { passive: false });
    window.addEventListener("touchmove", preventScroll, { passive: false });

    console.info("[DisableScrollPlugin] Scrolling disabled");
  };

  plugin.dispose = function () {
    // Restore styles
    document.documentElement.style.overflow = previous.htmlOverflow || "";
    document.body.style.overflow = previous.bodyOverflow || "";

    window.removeEventListener("wheel", preventScroll);
    window.removeEventListener("touchmove", preventScroll);

    console.info("[DisableScrollPlugin] Scrolling restored");
  };
})();
