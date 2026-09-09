/* Y.W.C. IT事業LP デモ - 共通スクリプト（FAQ開閉／スティッキーCTA表示／スクロールリビール） */
(function () {
  "use strict";

  // --- FAQアコーディオン ---
  document.querySelectorAll(".faq-item").forEach(function (item) {
    var btn = item.querySelector(".faq-q");
    var panel = item.querySelector(".faq-a");
    if (!btn || !panel) return;
    btn.addEventListener("click", function () {
      var isOpen = item.getAttribute("data-open") === "true";
      item.setAttribute("data-open", String(!isOpen));
      btn.setAttribute("aria-expanded", String(!isOpen));
      panel.style.maxHeight = isOpen ? null : panel.scrollHeight + "px";
    });
  });

  // --- スティッキーCTA：ヒーローを過ぎたら表示 ---
  var stickyCta = document.querySelector(".sticky-cta");
  if (stickyCta) {
    var hero = document.querySelector(".hero");
    var threshold = hero ? hero.offsetHeight * 0.6 : 400;
    var ticking = false;
    function updateSticky() {
      if (window.scrollY > threshold) {
        stickyCta.classList.add("is-visible");
      } else {
        stickyCta.classList.remove("is-visible");
      }
      ticking = false;
    }
    window.addEventListener("scroll", function () {
      if (!ticking) {
        window.requestAnimationFrame(updateSticky);
        ticking = true;
      }
    });
    updateSticky();
  }

  // --- ハンバーガーメニュー（該当要素があるページのみ動作） ---
  var navToggle = document.querySelector(".nav-toggle");
  var mobileNav = document.querySelector(".mobile-nav");
  if (navToggle && mobileNav) {
    var openLabel = navToggle.getAttribute("aria-label") || "メニューを開く";
    var closeLabel = "メニューを閉じる";
    function setMenuOpen(isOpen) {
      mobileNav.classList.toggle("is-open", isOpen);
      navToggle.setAttribute("aria-expanded", String(isOpen));
      navToggle.setAttribute("aria-label", isOpen ? closeLabel : openLabel);
    }
    navToggle.addEventListener("click", function () {
      setMenuOpen(!mobileNav.classList.contains("is-open"));
    });
    mobileNav.querySelectorAll("a").forEach(function (a) {
      a.addEventListener("click", function () {
        setMenuOpen(false);
      });
    });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && mobileNav.classList.contains("is-open")) {
        setMenuOpen(false);
        navToggle.focus();
      }
    });
  }

  // --- スクロールリビール（対応ブラウザのみ／非対応は即表示） ---
  var revealEls = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window && revealEls.length) {
    var io = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-in");
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15 }
    );
    revealEls.forEach(function (el) { io.observe(el); });
  } else {
    revealEls.forEach(function (el) { el.classList.add("is-in"); });
  }
})();
