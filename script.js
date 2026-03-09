// Reveals key sections/cards when they enter the viewport.
function initReveal() {
  const targets = document.querySelectorAll(
    ".hero-copy, .hero-side, .section h2, .section > p, .card, .timeline article, .experience-item, .recommendation, .contact-form"
  );

  targets.forEach(function (element, index) {
    element.classList.add("reveal");
    element.style.setProperty("--reveal-delay", `${(index % 8) * 70}ms`);
  });

  const observer = new IntersectionObserver(
    function (entries, obs) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          obs.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15, rootMargin: "0px 0px -40px 0px" }
  );

  targets.forEach(function (element) {
    observer.observe(element);
  });
}

// Accordion behavior for experience cards (single item open at a time).
function initExperienceToggle() {
  const items = document.querySelectorAll(".experience-item");
  if (!items.length) {
    return;
  }

  items.forEach(function (item) {
    const toggle = item.querySelector(".experience-toggle");
    if (!toggle) {
      return;
    }

    toggle.addEventListener("click", function () {
      const isOpen = item.classList.contains("expanded");

      items.forEach(function (other) {
        other.classList.remove("expanded");
        const otherToggle = other.querySelector(".experience-toggle");
        if (otherToggle) {
          otherToggle.setAttribute("aria-expanded", "false");
        }
      });

      if (!isOpen) {
        item.classList.add("expanded");
        toggle.setAttribute("aria-expanded", "true");
        item.classList.remove("flip-open");
        // Re-trigger the flip animation every time a card opens.
        requestAnimationFrame(function () {
          item.classList.add("flip-open");
        });
      }
    });
  });
}

// Counts up stat chips once they become visible.
function animateCounter(counter) {
  const target = Number(counter.getAttribute("data-counter-target")) || 0;
  const duration = 1100;
  const start = performance.now();

  function step(timestamp) {
    const progress = Math.min((timestamp - start) / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    counter.textContent = String(Math.round(target * eased));

    if (progress < 1) {
      requestAnimationFrame(step);
    }
  }

  requestAnimationFrame(step);
}

// Starts animated counters on intersection.
function initCounters() {
  const counters = document.querySelectorAll(".stat-value[data-counter-target]");
  if (!counters.length) {
    return;
  }

  const observer = new IntersectionObserver(
    function (entries, obs) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          animateCounter(entry.target);
          obs.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.55 }
  );

  counters.forEach(function (counter) {
    observer.observe(counter);
  });
}

// Adds lightweight neon cursor trail on desktop pointers.
function initCursorTrail() {
  if (window.matchMedia("(pointer: coarse)").matches) {
    return;
  }

  let lastSpawn = 0;
  const spawnInterval = 24;

  window.addEventListener("mousemove", function (event) {
    const now = performance.now();
    if (now - lastSpawn < spawnInterval) {
      return;
    }
    lastSpawn = now;

    const dot = document.createElement("span");
    // Retro mode gets pixel-style cursor particles.
    dot.className = document.body.classList.contains("retro-mode") ? "retro-trail-dot" : "trail-dot";
    dot.style.left = `${event.clientX}px`;
    dot.style.top = `${event.clientY}px`;
    document.body.appendChild(dot);

    setTimeout(function () {
      dot.remove();
    }, 500);
  });
}

// Types the main hero name once on load.
function initTypingName() {
  const typingNode = document.getElementById("typing_name");
  if (!typingNode) {
    return;
  }

  const fullText = typingNode.getAttribute("data-full-text") || typingNode.textContent || "";
  typingNode.textContent = "";
  typingNode.classList.add("typing");
  let index = 0;

  const timer = setInterval(function () {
    typingNode.textContent = fullText.slice(0, index);
    index += 1;

    if (index > fullText.length) {
      clearInterval(timer);
      setTimeout(function () {
        typingNode.classList.remove("typing");
      }, 1200);
    }
  }, 65);
}

// Subtle parallax offset on hero copy/sidebar.
function initHeroParallax() {
  const hero = document.querySelector(".hero");
  if (!hero || window.matchMedia("(pointer: coarse)").matches) {
    return;
  }

  hero.addEventListener("mousemove", function (event) {
    const rect = hero.getBoundingClientRect();
    const dx = event.clientX - (rect.left + rect.width / 2);
    const dy = event.clientY - (rect.top + rect.height / 2);
    hero.style.setProperty("--mx", `${dx}px`);
    hero.style.setProperty("--my", `${dy}px`);
  });

  hero.addEventListener("mouseleave", function () {
    hero.style.setProperty("--mx", "0px");
    hero.style.setProperty("--my", "0px");
  });
}

// Tracks mouse position to drive project card glow focus.
function initProjectCardGlow() {
  const cards = document.querySelectorAll(".project-card");
  cards.forEach(function (card) {
    card.addEventListener("mousemove", function (event) {
      const rect = card.getBoundingClientRect();
      const x = ((event.clientX - rect.left) / rect.width) * 100;
      const y = ((event.clientY - rect.top) / rect.height) * 100;
      card.style.setProperty("--x", `${x}%`);
      card.style.setProperty("--y", `${y}%`);
    });
  });
}

// Toggles retro/classic mode and persists preference.
function initClassicMode() {
  const toggle = document.getElementById("classic_toggle");
  if (!toggle) {
    return;
  }

  function playRetroLoader() {
    const loader = document.querySelector(".retro-loader");
    if (!loader) {
      return;
    }
    loader.classList.remove("play");
    void loader.offsetWidth;
    loader.classList.add("play");
    setTimeout(function () {
      loader.classList.remove("play");
    }, 1900);
  }

  const saved = localStorage.getItem("portfolio_mode");
  if (saved === "classic") {
    document.body.classList.add("retro-mode");
    toggle.setAttribute("aria-pressed", "true");
    toggle.textContent = "Modern";
    playRetroLoader();
  }

  toggle.addEventListener("click", function () {
    const retroEnabled = document.body.classList.toggle("retro-mode");
    toggle.setAttribute("aria-pressed", retroEnabled ? "true" : "false");
    toggle.textContent = retroEnabled ? "Modern" : "Classic";
    localStorage.setItem("portfolio_mode", retroEnabled ? "classic" : "modern");
    if (retroEnabled) {
      playRetroLoader();
    }
  });
}

// Shows old-browser style URL previews in Classic mode.
function initRetroStatusBar() {
  const statusBar = document.getElementById("retro_statusbar");
  if (!statusBar) {
    return;
  }

  const links = document.querySelectorAll("a[href]");
  const defaultText = "Ready";

  links.forEach(function (link) {
    function showLinkTarget() {
      if (!document.body.classList.contains("retro-mode")) {
        return;
      }
      const href = link.getAttribute("href") || "";
      statusBar.textContent = href.startsWith("#") ? `Jump to ${href}` : href;
    }

    function clearLinkTarget() {
      statusBar.textContent = defaultText;
    }

    link.addEventListener("mouseenter", showLinkTarget);
    link.addEventListener("focus", showLinkTarget);
    link.addEventListener("mouseleave", clearLinkTarget);
    link.addEventListener("blur", clearLinkTarget);
  });
}

// Filters project cards by keyword from title/description/tags.
function initProjectFilter() {
  const filterInput = document.getElementById("project_filter");
  const cards = document.querySelectorAll(".projects-grid .project-card");
  if (!filterInput || !cards.length) {
    return;
  }

  function applyFilter() {
    const query = filterInput.value.trim().toLowerCase();
    cards.forEach(function (card) {
      const text = card.textContent.toLowerCase();
      card.style.display = text.includes(query) ? "" : "none";
    });
  }

  filterInput.addEventListener("input", applyFilter);

  // Quick keyboard shortcut to jump into project search.
  window.addEventListener("keydown", function (event) {
    if (event.key === "/" && document.activeElement !== filterInput) {
      event.preventDefault();
      filterInput.focus();
    }
  });
}

// Retro-style local visitor counter shown in footer.
function initVisitorCounter() {
  const counterNode = document.getElementById("visit_count");
  if (!counterNode) {
    return;
  }

  const current = Number(localStorage.getItem("portfolio_visits") || "0") + 1;
  localStorage.setItem("portfolio_visits", String(current));
  counterNode.textContent = String(current).padStart(6, "0");
}

function addRecommendation(event) {
  event.preventDefault();

  const messageInput = document.getElementById("new_recommendation");
  const nameInput = document.getElementById("name_input");
  const message = messageInput.value.trim();
  const name = nameInput.value.trim();

  if (!message) {
    messageInput.focus();
    return;
  }

  const card = document.createElement("article");
  card.className = "recommendation";

  const text = document.createElement("p");
  const author = name ? ` — ${name}` : "";
  text.textContent = `\"${message}\"${author}`;

  card.appendChild(text);
  card.classList.add("new-entry");
  document.getElementById("all_recommendations").appendChild(card);

  messageInput.value = "";
  nameInput.value = "";
  showPopup(true);
}

function showPopup(visible) {
  const popup = document.getElementById("popup");

  if (visible) {
    popup.showModal();
    return;
  }

  if (popup.open) {
    popup.close();
  }
}

document.addEventListener("DOMContentLoaded", function () {
  initClassicMode();
  initRetroStatusBar();
  initReveal();
  initExperienceToggle();
  initCounters();
  initCursorTrail();
  initTypingName();
  initHeroParallax();
  initProjectCardGlow();
  initProjectFilter();
  initVisitorCounter();
});
