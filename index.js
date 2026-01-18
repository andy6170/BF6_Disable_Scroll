(function () {
  const pluginId = "bf-portal-disable-scrolling";
  const plugin = BF2042Portal.Plugins.getPlugin(pluginId);

  let active = false;
  let wheelBlocker = null;
  let observer = null;
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

  function enable() {
    if (active) return;
    active = true;

    console.info("[DisableScrollPlugin] Enabling");

    previous.bodyOverflow = document.body.style.overflow;
    previous.htmlOverflow = document.documentElement.style.overflow;

    document.body.style.overflow = "hidden";
    document.documentElement.style.overflow = "hidden";

    wheelBlocker = (e) => {
      if (isInsideAllowedContainer(e.target)) return;
      e.preventDefault();
    };

    document.addEventListener("wheel", wheelBlocker, { passive: false });
  }

  function disable() {
    if (!active) return;
    active = false;

    console.info("[DisableScrollPlugin] Disabling");

    document.body.style.overflow = previous.bodyOverflow || "";
    document.documentElement.style.overflow = previous.htmlOverflow || "";

    if (wheelBlocker) {
      document.removeEventListener("wheel", wheelBlocker);
      wheelBlocker = null;
    }
  }

  function checkBlocklyPresence() {
    const hasBlockly = document.querySelector(".blocklySvg");
    if (hasBlockly) enable();
    else disable();
  }

  plugin.initialize = function () {
    console.info("[DisableScrollPlugin] Initialized");

    // Observe SPA DOM changes
    observer = new MutationObserver(checkBlocklyPresence);
    observer.observe(document.body, {
      childList: true,
      subtree: true,
    });

    // Initial check
    checkBlocklyPresence();
  };

  plugin.dispose = function () {
    console.info("[DisableScrollPlugin] Disposed");
    if (observer) observer.disconnect();
    disable();
  };
})();
