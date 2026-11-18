/* Meta Pixel: PageView on load + custom "ClickToEtsy" event on every Etsy button.
   The pixel ID lives only in /config.js. With the placeholder ID, events are queued locally
   and fbevents.js is never loaded, so nothing is sent to Meta. */
(function () {
  var id = (window.SN_CONFIG || {}).META_PIXEL_ID || "";
  var live = /^\d{6,20}$/.test(id);
  /* Standard Meta Pixel base code (loader only runs when a real ID is set) */
  !function (f, b, e, v, n, t, s) {
    if (f.fbq) return; n = f.fbq = function () { n.callMethod ? n.callMethod.apply(n, arguments) : n.queue.push(arguments); };
    if (!f._fbq) f._fbq = n; n.push = n; n.loaded = !0; n.version = "2.0"; n.queue = [];
    if (!live) return;
    t = b.createElement(e); t.async = !0; t.src = v; s = b.getElementsByTagName(e)[0]; s.parentNode.insertBefore(t, s);
  }(window, document, "script", "https://connect.facebook.net/en_US/fbevents.js");
  fbq("init", id);
  fbq("track", "PageView");
  if (!live && window.console) console.info("[StarNorth] Meta Pixel placeholder in config.js: events queued, nothing sent.");

  document.addEventListener("click", function (e) {
    var a = e.target.closest && e.target.closest("a[data-etsy]");
    if (!a) return;
    var d = a.dataset;
    fbq("trackCustom", "ClickToEtsy", {
      content_ids: [d.listing], content_name: d.name, content_type: "product",
      value: parseFloat(d.price), currency: "USD", placement: d.placement || ""
    });
    /* Give the pixel a moment to send before leaving, but never block the shopper. */
    if (live && !e.metaKey && !e.ctrlKey && !e.shiftKey && a.target !== "_blank") {
      e.preventDefault();
      var href = a.href;
      setTimeout(function () { window.location.href = href; }, 250);
    }
  });
})();
