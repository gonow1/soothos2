// Minimal component helpers for web-ui
(function () {
  // Copy to clipboard helper (for guides/report snippets)
  document.addEventListener('click', function (e) {
    const btn = e.target.closest('[data-copy-target]');
    if (!btn) return;
    const selector = btn.dataset.copyTarget;
    const el = document.querySelector(selector);
    if (!el) return;
    const text = el.innerText || el.textContent;
    navigator.clipboard?.writeText(text).then(() => {
      btn.innerText = '복사됨';
      setTimeout(() => (btn.innerText = '가이드 복사'), 1200);
    }).catch(() => {
      btn.innerText = '복사 실패';
      setTimeout(() => (btn.innerText = '가이드 복사'), 1600);
    });
  });

  // Simple collapse toggle using data-collapse
  document.addEventListener('click', function (e) {
    const t = e.target.closest('[data-collapse]');
    if (!t) return;
    const target = document.querySelector(t.dataset.collapse);
    if (!target) return;
    const expanded = target.classList.toggle('collapsed');
    t.setAttribute('aria-expanded', String(!expanded));
  });
})();
