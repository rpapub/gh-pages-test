"use strict";

window.cpmFooter = window.cpmFooter || {
  id: "cpmFooter",
  init: function (deck) {
    console.log("cpmFooter.js");
    initFooter(deck);
  },
};

const initFooter = function (deck) {
  console.log("initFooter");
  deck.on("ready", function (event) {
    console.log("ready");
    const footer = document.createElement("footer");
    footer.id = "cpmFooter";
    footer.innerHTML = "Footer";
    // document.body.appendChild(footer);
    var div_class_reveal = document.querySelectorAll(".reveal")[0];
    //div_class_reveal.appendChild(footer);
  });
};
