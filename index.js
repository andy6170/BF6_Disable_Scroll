(function () {
  const pluginId = "bf-portal-disable-page-scroll";
  const plugin = BF2042Portal.Plugins.getPlugin(pluginId);

  let previousHtmlOverflow = "";
  let previousBodyOverflow = "";
  let toolboxObserver = null;

  function enableToolboxScroll() {
    const toolbox = document.querySelector(".blocklyToolboxContents");
    if (toolbox) {
      toolbox.style.overflowY = "auto";
      toolbox.style.maxHeight = "100%";
      console.info("[DisableScrollPlugin] Toolbox scrolling restored");
      return true;
    }
    return false;
  }

  plugin.initialize = function () {
    console.info("[DisableScrollPlugin] Initializing");

    // Disable page scroll
    previousHtmlOverflow = document.documentElement.style.overflow;
    previousBodyOverflow = document.body.style.overflow;

    document.documentElement.style.overflow = "hidden";
    document.body.style.overflow = "hidden";

    console.info("[DisableScrollPlugin] Page scrolling disabled");

    // Toolbox may not exist yet → observe DOM until it appears
    if (!enableToolboxScroll()) {
      toolboxObserver = new MutationObserver(() => {
        if (enableToolboxScroll()) {
          toolboxObserver.disconnect();
          toolboxObserver = null;
        }
      });

      toolboxObserver.observe(document.body, {
        childList: true,
        subtree: true,
      });
    }
  };

  plugin.dispose = function () {
    console.info("[DisableScrollPlugin] Disposing");

    document.documentElement.style.overflow = previousHtmlOverflow || "";
    document.body.style.overflow = previousBodyOverflow || "";

    if (toolboxObserver) {
      toolboxObserver.disconnect();
      toolboxObserver = null;
    }

    console.info("[DisableScrollPlugin] Page scrolling restored");
  };
})();
