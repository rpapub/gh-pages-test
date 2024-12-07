"use strict";

window.cpmCarousel = window.cpmCarousel || {
  id: "cpmCarousel",
  init: function (deck) {
    console.log("cpmCarousel.js");
    initCarousel(deck);
  },
};

let currentIndex = 0; // Track the current image index
let autoplayActive = true; // Track autoplay state
let autoplayIntervalId; // Store the interval ID for clearing
let lastTime = 0; // Keep track of the last time the function was called
const autoplayInterval = 3000; // Interval in milliseconds

const initCarousel = function (deck) {
  // Setup carousel on slide slidetransitionend
  // The slidechanged event fires instantly as soon as the slide changes. If you'd rather invoke your event listener when the slide has finished transitioning and is fully visible, you can use the slidetransitionend event. The slidetransitionend event includes the same event data as slidechanged.
  deck.on("slidetransitionend", function (event) {
    setupCarousel(event);
  });

  // Detect entering overview mode
  deck.on("overviewshown", function () {
    stopAutoplay(); // Stop autoplay when entering overview mode
  });

  // Detect exiting overview mode
  deck.on("overviewhidden", function () {
    if (autoplayActive) {
      startAutoplay(); // Restart autoplay if it was active
    }
  });

  // Add event listener for keydown to toggle autoplay
  document.addEventListener("keydown", function (event) {
    // Check if the pressed key is "a"
    if (event.key === "a") {
      toggleAutoplay(); // Call the toggle function
    }
  });
};

const toggleAutoplay = function () {
  autoplayActive = !autoplayActive; // Toggle the autoplay state
  if (autoplayActive) {
    startAutoplay(); // Restart autoplay
  } else {
    stopAutoplay(); // Stop autoplay
  }
};

const startAutoplay = function () {
  if (!autoplayIntervalId) {
    console.log("Autoplay started");

    const autoplayLoop = (timestamp) => {
      // Calculate the time elapsed since the last update
      if (timestamp - lastTime >= autoplayInterval) {
        const nextButton = document.querySelector(".carousel-container .next");
        if (nextButton) nextButton.click(); // Trigger next button
        lastTime = timestamp; // Update the last time
      }

      autoplayIntervalId = requestAnimationFrame(autoplayLoop); // Request the next frame
    };

    autoplayIntervalId = requestAnimationFrame(autoplayLoop); // Start the loop
  }
};

const stopAutoplay = function () {
  if (autoplayIntervalId) {
    cancelAnimationFrame(autoplayIntervalId); // Cancel the animation frame
    autoplayIntervalId = null; // Reset the interval ID
    console.log("Autoplay stopped");
  }
};

const cleanupCarousel = function () {
  stopAutoplay(); // Stop autoplay
  const carouselContainer = document.querySelector(".carousel-container");
  if (carouselContainer) {
    const existingImages = carouselContainer.querySelectorAll("img");
    existingImages.forEach((img) => img.remove()); // Remove images
  }
  currentIndex = 0; // Reset current index
  console.log("Carousel cleaned up");
};

const setupCarousel = function (event) {
  const currentSlide = event.currentSlide;
  const carouselData = currentSlide.getAttribute("data-carousel");

  if (carouselData) {
    const carouselContent = JSON.parse(carouselData);
    createCarousel(
      carouselContent.images,
      carouselContent.autoplay,
      carouselContent.interval
    );
  }

  // Find any heading element and attach a click event to start autoplay
  const heading = currentSlide.querySelector("h1, h2, h3, h4, h5, h6");
  if (heading) {
    heading.addEventListener("click", startAutoplay);
  }
};

const createCarousel = function (images, autoplay, interval) {
  const carouselContainer = document.querySelector(".carousel-container");

  // Clear existing images but keep buttons intact
  const existingImages = carouselContainer.querySelectorAll("img");
  existingImages.forEach((img) => img.remove());

  // Add new images to the carousel
  images.forEach((imgSrc) => {
    const img = document.createElement("img");
    img.src = imgSrc;
    img.alt = "Carousel Image";

    // Add click event to toggle full screen
    img.addEventListener("click", function () {
      stopAutoplay(); // Stop autoplay when the image is clicked
      // Request full screen
      if (!document.fullscreenElement) {
        img.requestFullscreen(); // Request full screen
      } else {
        document.exitFullscreen(); // Exit full screen
      }
    });

    carouselContainer.appendChild(img);
  });

  // Initialize current index
  currentIndex = 0;

  // Create button functionality
  const nextButton = document.createElement("button");
  nextButton.classList.add("carousel-button", "next");
  nextButton.innerText = ""; // Add a chevron icon here if needed
  carouselContainer.appendChild(nextButton);

  const prevButton = document.createElement("button");
  prevButton.classList.add("carousel-button", "prev");
  prevButton.innerText = ""; // Add a chevron icon here if needed
  carouselContainer.appendChild(prevButton);

  nextButton.onclick = function () {
    currentIndex = (currentIndex + 1) % images.length; // Cycle to the first image after the last
    updateCarouselDisplay(carouselContainer, images);
  };

  prevButton.onclick = function () {
    if (currentIndex === 0) {
      return; // Do nothing if already at the first image
    }
    currentIndex = (currentIndex - 1 + images.length) % images.length; // Cycle back
    updateCarouselDisplay(carouselContainer, images);
  };

  // Autoplay functionality
  if (autoplay) {
    startAutoplay(); // Start autoplay if specified
  }

  // Display the initial image
  updateCarouselDisplay(carouselContainer, images);
};

const updateCarouselDisplay = function (carouselContainer, images) {
  const imgs = carouselContainer.querySelectorAll("img");
  imgs.forEach((img, index) => {
    img.style.display = index === currentIndex ? "block" : "none"; // Show the current image only
  });
};
