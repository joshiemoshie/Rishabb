document.addEventListener("DOMContentLoaded", function () {
  // Set video playback speeds:
  const videos = document.querySelectorAll("video");
  videos.forEach((video) => {
    // Check if the file name is pacman-maze.mp4 or village.mp4:
    const src = video.querySelector("source");
    if (src && (src.src.includes("pacman.mp4") || src.src.includes("village.mp4"))) {
      video.playbackRate = 0.2; // slow
    } else {
      video.playbackRate = 1.0; // normal speed
    }
    const playPromise = video.play();
    if (playPromise !== undefined) {
      playPromise.catch((error) => {
        console.log("Video play failed:", error);
      });
    }
  });

  // Background audio setup:
  const bgMusic = document.getElementById("bg-music");
  if (bgMusic) {
    bgMusic.volume = 0.3;
    const audioPromise = bgMusic.play();
    if (audioPromise !== undefined) {
      audioPromise.catch((error) => {
        console.log("Audio play failed:", error);
      });
    }
  }

  // Bounce effect for anchor tags with class "bounce-button":
  document.querySelectorAll("a.bounce-button").forEach((link) => {
    link.addEventListener("click", function (e) {
      e.preventDefault();
      this.classList.add("bounce");
      this.addEventListener("animationend", function () {
        this.classList.remove("bounce");
        window.location.href = this.href;
      });
    });
  });

  // Bounce effect for the "Yes" button:
  const yesButton = document.getElementById("yes-button");
  if (yesButton) {
    yesButton.addEventListener("click", function (e) {
      e.preventDefault();
      this.classList.add("bounce");
      this.addEventListener("animationend", function () {
        this.classList.remove("bounce");
        launchConfetti();
        setTimeout(() => {
          window.location.href = "dates.html";
        }, 500);
      });
    });
  }

  // "No" Button Movement Logic (proposal page):
  const noButton = document.getElementById("no-button");
  const proposalContainer = document.querySelector(".proposal-container");
  let isMoving = false;
  if (noButton && proposalContainer) {
    function handleMove() {
      if (!isMoving) {
        isMoving = true;
        moveNoButton();
        setTimeout(() => {
          isMoving = false;
        }, 100);
      }
    }
    noButton.addEventListener("mouseover", handleMove);
    noButton.addEventListener("touchstart", function (e) {
      e.preventDefault();
      handleMove();
    });
    noButton.addEventListener("click", function (e) {
      e.preventDefault();
      handleMove();
    });
  }

  // Dropdown toggles for Date Ideas page (if applicable):
  const dropdownToggles = document.querySelectorAll(".dropdown-toggle");
  dropdownToggles.forEach(function (toggle) {
    toggle.addEventListener("click", function (e) {
      e.preventDefault();
      const dropdownContent = this.nextElementSibling;
      if (dropdownContent) {
        dropdownContent.classList.toggle("show");
      }
    });
  });
});

// Re-enable background music when the page is shown (even after back navigation)
window.addEventListener("pageshow", function () {
  const bgMusic = document.getElementById("bg-music");
  if (bgMusic && bgMusic.paused) {
    bgMusic.currentTime = 0;
    bgMusic.play();
  }
});

// Move the "No" button within the proposal container:
function moveNoButton() {
  const noButton = document.getElementById("no-button");
  const container = document.querySelector(".proposal-container");
  const yesButton = document.getElementById("yes-button");

  const containerRect = container.getBoundingClientRect();
  const buttonRect = noButton.getBoundingClientRect();
  const yesRect = yesButton.getBoundingClientRect();

  let newX, newY;
  let attempts = 0;
  const maxAttempts = 50;

  do {
    newX = Math.random() * (containerRect.width - buttonRect.width);
    newY = Math.random() * (containerRect.height - buttonRect.height);
    attempts++;

    // Ensure the new position does not overlap with the "Yes" button:
    const overlap = !(
      newX + buttonRect.width < (yesRect.left - containerRect.left) ||
      newX > (yesRect.right - containerRect.left) ||
      newY + buttonRect.height < (yesRect.top - containerRect.top) ||
      newY > (yesRect.bottom - containerRect.top)
    );
    if (!overlap || attempts > maxAttempts) break;
  } while (true);

  noButton.style.left = `${newX}px`;
  noButton.style.top = `${newY}px`;
}

// Launch a confetti effect (duration shortened):
function launchConfetti() {
  const canvas = document.getElementById("confetti-canvas");
  if (!canvas) return;
  const ctx = canvas.getContext("2d");

  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  const confettiCount = 100;
  const confetti = [];
  for (let i = 0; i < confettiCount; i++) {
    confetti.push({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height - canvas.height,
      size: Math.random() * 8 + 2,
      speed: Math.random() * 3 + 2,
      angle: Math.random() * 2 * Math.PI,
      color: getRandomColor(),
    });
  }

  let animationFrame;
  function update() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    confetti.forEach((c) => {
      c.y += c.speed;
      c.x += Math.sin(c.angle);
      ctx.fillStyle = c.color;
      ctx.fillRect(c.x, c.y, c.size, c.size);
      if (c.y > canvas.height) {
        c.y = -c.size;
        c.x = Math.random() * canvas.width;
      }
    });
    animationFrame = requestAnimationFrame(update);
  }
  update();

  // Stop the confetti after 1 second:
  setTimeout(() => {
    cancelAnimationFrame(animationFrame);
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  }, 1000);
}

function getRandomColor() {
  const colors = ["#ff0000", "#ff1493", "#ff69b4", "#ff4500"];
  return colors[Math.floor(Math.random() * colors.length)];
}
