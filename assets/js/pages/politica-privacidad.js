document.addEventListener("DOMContentLoaded", function () {
  const searchInput = document.getElementById("privacySearch");
  const topics = document.querySelectorAll(".privacy-topic");
  const emptyState = document.getElementById("privacyEmpty");
  const jumpSelect = document.getElementById("privacyJump");
  const indexLinks = document.querySelectorAll(".privacy-index a");
  const accordionButtons = document.querySelectorAll(
    ".privacy-accordion-trigger"
  );

  const sectionIds = [
    "pilares",
    "datos",
    "usos",
    "compartidos",
    "conservacion",
    "cookies",
    "cuenta",
    "derechos",
    "contacto-privacidad",
    "politica",
  ];

  function filterTopics(query) {
    const term = query.trim().toLowerCase();
    let visible = 0;

    topics.forEach(function (card) {
      const haystack = (
        card.dataset.keywords +
        " " +
        card.textContent
      ).toLowerCase();
      const match = !term || haystack.includes(term);
      card.hidden = !match;
      if (match) visible += 1;
    });

    if (emptyState) {
      emptyState.hidden = visible > 0;
    }
  }

  if (searchInput) {
    searchInput.addEventListener("input", function () {
      filterTopics(searchInput.value);
    });
  }

  if (jumpSelect) {
    jumpSelect.addEventListener("change", function () {
      const target = document.querySelector(jumpSelect.value);
      if (target) {
        target.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    });
  }

  accordionButtons.forEach(function (button) {
    button.addEventListener("click", function () {
      const panelId = button.getAttribute("aria-controls");
      const panel = document.getElementById(panelId);
      const expanded = button.getAttribute("aria-expanded") === "true";
      const icon = button.querySelector("i");

      button.setAttribute("aria-expanded", String(!expanded));
      if (panel) {
        panel.hidden = expanded;
      }
      if (icon) {
        icon.className = expanded ? "ri-add-line" : "ri-subtract-line";
      }
    });
  });

  function setCurrent(id) {
    indexLinks.forEach(function (link) {
      const isCurrent = link.getAttribute("href") === "#" + id;
      if (isCurrent) {
        link.setAttribute("aria-current", "true");
      } else {
        link.removeAttribute("aria-current");
      }
    });

    if (jumpSelect) {
      jumpSelect.value = "#" + id;
    }
  }

  const observed = sectionIds
    .map(function (id) {
      return document.getElementById(id);
    })
    .filter(Boolean);

  if ("IntersectionObserver" in window && observed.length) {
    const spy = new IntersectionObserver(
      function (entries) {
        const visible = entries
          .filter(function (entry) {
            return entry.isIntersecting;
          })
          .sort(function (a, b) {
            return b.intersectionRatio - a.intersectionRatio;
          })[0];

        if (visible && visible.target.id) {
          setCurrent(visible.target.id);
        }
      },
      {
        rootMargin: "-20% 0px -60% 0px",
        threshold: [0.15, 0.35, 0.6],
      }
    );

    observed.forEach(function (section) {
      spy.observe(section);
    });
  }

  setCurrent("pilares");
});
