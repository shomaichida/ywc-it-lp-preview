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

  // --- 問い合わせフォーム送信（Web3Forms） ---
  var contactForm = document.getElementById("contact-form");
  if (contactForm) {
    var submitBtn = contactForm.querySelector('button[type="submit"]');
    var statusEl = contactForm.querySelector(".form-status");
    var defaultBtnText = submitBtn ? submitBtn.textContent.trim() : "";

    contactForm.addEventListener("submit", function (e) {
      e.preventDefault();

      if (!contactForm.checkValidity()) {
        contactForm.reportValidity();
        return;
      }

      // honeypot：ボットがチェックを入れていたら送信しない
      var botcheck = contactForm.querySelector('input[name="botcheck"]');
      if (botcheck && botcheck.checked) {
        return;
      }

      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.textContent = "送信中...";
      }
      if (statusEl) {
        statusEl.textContent = "送信中...";
        statusEl.classList.remove("is-success", "is-error");
      }

      // 任意項目が空欄の場合は、通知メールに不要な空欄行が出ないよう送信データから除外する
      var formData = new FormData(contactForm);
      ["company", "phone"].forEach(function (key) {
        if (!formData.get(key)) {
          formData.delete(key);
        }
      });

      fetch(contactForm.action, {
        method: "POST",
        body: formData,
        headers: { Accept: "application/json" },
      })
        .then(function (response) { return response.json(); })
        .then(function (data) {
          if (data && data.success) {
            if (statusEl) {
              statusEl.textContent = "お問い合わせを送信しました。ありがとうございます。";
              statusEl.classList.add("is-success");
            }
            contactForm.reset();
          } else {
            if (statusEl) {
              statusEl.textContent = "送信に失敗しました。時間をおいて再度お試しください。";
              statusEl.classList.add("is-error");
            }
          }
        })
        .catch(function () {
          if (statusEl) {
            statusEl.textContent = "送信に失敗しました。時間をおいて再度お試しください。";
            statusEl.classList.add("is-error");
          }
        })
        .finally(function () {
          if (submitBtn) {
            submitBtn.disabled = false;
            submitBtn.textContent = defaultBtnText;
          }
        });
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
