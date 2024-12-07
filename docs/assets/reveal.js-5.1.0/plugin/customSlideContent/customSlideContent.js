const CustomSlideContent = {
  id: "custom-slide-content-plugin", // Adding the required 'id' property

  init: function (reveal) {
    reveal.on("ready", (event) => {
      this.processData(event.currentSlide);
    });

    reveal.on("slidechanged", (event) => {
      this.processData(event.currentSlide);
    });
  },

  processData: function (slide) {
    const dataScript = slide.querySelector('script[type="application/json"]');
    if (dataScript) {
      const data = JSON.parse(dataScript.innerHTML);
      const targetDiv = slide.querySelector("#" + data.targetDivId);
      if (targetDiv) {
        targetDiv.innerHTML = this.createList(data.items);
      }
    }
  },

  createList: function (items) {
    return `<ul>${items.map((item) => `<li>${item}</li>`).join("")}</ul>`;
  },
};
