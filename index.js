(function () {
  const pluginId = "bf-portal-disable-scrolling";
  const plugin = BF2042Portal.Plugins.getPlugin(pluginId);

  let previous = {};

  function preventScroll(e) {
    e.preventDefault();
  }

  plugin.initialize = function () {
    // Save previous overflow values
    previous.body = document.body.style.overflow;
    previous.html = document.documentElement.style.overflow;

    // Disable scrolling
    document.body.style.overflow = "hidden";
    document.documentElement.style.overflow = "hidden";

    // Extra safety: block wheel + touch scrolling
    window.addEventListener("wheel", preventScroll, { passive: false });
    window.addEventListener("touchmove", preventScroll, { passive: false });

    console.info("[DisableScrollPlugin] Scrolling disabled");
  };

  plugin.dispose = function () {
    // Restore overflow
    document.body.style.overflow = previous.body || "";
    document.documentElement.style.overflow = previous.html || "";

    // Remove listeners
    window.removeEventListener("wheel", preventScroll);
    window.removeEventListener("touchmove", preventScroll);

    console.info("[DisableScrollPlugin] Scrolling restored");
  };
})();
