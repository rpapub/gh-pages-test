"use strict";

window.cpmBroadcastdesign = window.cpmBroadcastdesign || {
  id: "cpmBroadcastdesign",
  init: function (deck) {
    console.log("cpmBroadcastdesign.js");
    initBroadcastDesign(deck);
  },
};

const initBroadcastDesign = function (deck) {
  console.log("initBroadcastDesign");

  var config = Reveal.getConfig().cpmBroadcastdesign;

  deck.on("ready", function (event) {
    // Remove existing ticker and lower third elements
    removeElements();
    setup(event, config);
  });
  deck.on("slidechanged", function (event) {
    // Remove existing ticker and lower third elements
    removeElements();
    setup(event, config);
  });

  deck.on("slidehidden", function (event) {
    // Remove ticker and lower third elements when leaving the slide
    removeElements();
  });

  // Add event listener for keydown
  document.addEventListener("keydown", function (event) {
    // Check if the pressed key is the desired key
    if (event.key === "3") {
      toggleLowerThird();
    }
  });
};

const setup = function (event, config) {
  // Get the current slide
  const currentSlide = event.currentSlide;

  // Check if data attributes for ticker and lower third exist
  const tickerData = currentSlide.getAttribute("data-ticker");
  const lowerThirdData = currentSlide.getAttribute("data-lower-third");

  // Add ticker if data-ticker attribute exists
  if (tickerData) {
    console.log(tickerData);
    const tickerContent = JSON.parse(tickerData);
    addTicker(tickerContent, config);
  }

  // Add lower third if data-lower-third attribute exists
  if (lowerThirdData) {
    const lowerThirdContent = JSON.parse(lowerThirdData);
    addLowerThird(lowerThirdContent, config);
    //expandLowerThird();
  }
};

const addLowerThird = function (lowerThirdContent, config) {
  const lowerThird = document.createElement("div");
  lowerThird.classList.add("lower-third");

  // Set visibility class based on data-lower-third attribute or default to "hidden"
  lowerThird.classList.toggle(
    lowerThirdContent.visibility || "hidden",
    lowerThirdContent.visibility !== "hidden"
  );

  // Set layout based on data-lower-third attribute or default to "single-line"
  const layout = lowerThirdContent.layout
    ? lowerThirdContent.layout
    : config.defaults.lowerThirdLayout;

  // Set text content based on layout
  switch (layout) {
    case "one-line":
      lowerThird.textContent = lowerThirdContent.content.line1 || "";
      break;
    case "two-line":
      lowerThird.innerHTML =
        (lowerThirdContent.content.line1 || "") +
        "<br>" +
        (lowerThirdContent.content.line2 || "");
      break;

    // Add more cases for other layouts if needed
    default:
      lowerThird.textContent = "";
      break;
  }

  document.body.appendChild(lowerThird);
};

const expandLowerThird = function () {
  const lowerThird = document.querySelector(".lower-third");
  if (lowerThird) {
    lowerThird.classList.add("expanded");
  }
};

const toggleLowerThird = function () {
  const lowerThird = document.querySelector(".lower-third");
  if (lowerThird) {
    if (lowerThird.classList.contains("expanded")) {
      lowerThird.classList.remove("expanded");
      lowerThird.classList.add("collapsed");
    } else {
      lowerThird.classList.remove("collapsed");
      lowerThird.classList.add("expanded");
    }
  }
};

const addTicker = function (tickerContent, config) {
  const ticker = document.createElement("div");
  ticker.classList.add("ticker");

  // Set visibility based on data-ticker attribute or default to "hidden"
  ticker.style.visibility = tickerContent.visibility
    ? tickerContent.visibility
    : "hidden";

  // Set text content based on data-ticker attribute
  ticker.textContent = tickerContent.tickertext || config.defaults.tickertext;

  document.body.appendChild(ticker);
};

const removeElements = function () {
  const ticker = document.querySelector(".ticker");
  if (ticker) {
    ticker.remove();
  }

  const lowerThird = document.querySelector(".lower-third");
  if (lowerThird) {
    lowerThird.remove();
  }
};
