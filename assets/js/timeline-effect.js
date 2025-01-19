(function () {
  "use strict";

  function isElementInViewport(el) {
    var rect = el.getBoundingClientRect();
    return (
      rect.top >= 0 &&
      rect.left >= 0 &&
      rect.bottom <=
        (window.innerHeight || document.documentElement.clientHeight) &&
      rect.right <= (window.innerWidth || document.documentElement.clientWidth)
    );
  }

  function callback() {
    let items = document.querySelectorAll(".timeline li");

    for (let i = 0; i < items.length; i++) {
      if (isElementInViewport(items[i])) {
        items[i].classList.add("in-view");
      }
    }
  }

  window.addEventListener("load", callback);
  window.addEventListener("resize", callback);
  window.addEventListener("scroll", callback);

  document.addEventListener("eventAdded", function () {
    setTimeout(() => {
      callback();
    }, 200);
  });

  document.addEventListener("eventDeleted", function () {
    setTimeout(() => {
      callback();
    }, 200);
  });
})();
