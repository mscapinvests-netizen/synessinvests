/* ============================================================
   SYNNESS INVEST — site behaviour (demo front-end, no backend)
   ============================================================ */
document.addEventListener('DOMContentLoaded', function () {

  /* Footer year */
  document.querySelectorAll('#yr').forEach(function (el) { el.textContent = new Date().getFullYear(); });

  /* ---------- Multi-step intake form (portal.html) ---------- */
  var form = document.getElementById('intakeForm');
  if (form) {
    var steps = Array.prototype.slice.call(form.querySelectorAll('fieldset.fstep'));
    var idx = 0;
    var label = document.getElementById('stepLabel');
    var fill = document.getElementById('barFill');
    var prevBtn = document.getElementById('prevBtn');
    var nextBtn = document.getElementById('nextBtn');
    var submitBtn = document.getElementById('submitBtn');

    function render(scroll) {
      steps.forEach(function (s, i) { s.classList.toggle('active', i === idx); });
      if (label) label.textContent = 'Section ' + (idx + 1) + ' / ' + steps.length;
      if (fill) fill.style.width = Math.round(((idx + 1) / steps.length) * 100) + '%';
      if (prevBtn) prevBtn.classList.toggle('hidden', idx === 0);
      if (nextBtn) nextBtn.classList.toggle('hidden', idx === steps.length - 1);
      if (submitBtn) submitBtn.classList.toggle('hidden', idx !== steps.length - 1);
      if (scroll !== false) {
        var top = form.getBoundingClientRect().top + window.pageYOffset - 120;
        window.scrollTo({ top: top, behavior: 'smooth' });
      }
    }

    if (prevBtn) prevBtn.addEventListener('click', function () { if (idx > 0) { idx--; render(); } });
    if (nextBtn) nextBtn.addEventListener('click', function () { if (idx < steps.length - 1) { idx++; render(); } });
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      /* DEMO: no backend attached yet. Connect to Syness CRM / secure mailbox before launch. */
      form.classList.add('hidden');
      var done = document.getElementById('formDone');
      if (done) done.classList.remove('hidden');
      window.scrollTo({ top: document.getElementById('new').offsetTop - 90, behavior: 'smooth' });
    });

    render(false);
  }

  /* ---------- Contact form (contact.html) ---------- */
  var cform = document.getElementById('contactForm');
  if (cform) {
    cform.addEventListener('submit', function (e) {
      e.preventDefault();
      /* DEMO: no backend attached yet. */
      var ok = document.getElementById('contactOk');
      if (ok) ok.classList.remove('hidden');
      cform.querySelector('button[type=submit]').classList.add('hidden');
    });
  }

  /* ---------- Portal dashboard tabs (portal.html) ---------- */
  var tabs = document.querySelectorAll('.ptab');
  if (tabs.length) {
    tabs.forEach(function (t) {
      t.addEventListener('click', function () {
        tabs.forEach(function (x) { x.classList.remove('active'); });
        document.querySelectorAll('.panel').forEach(function (p) { p.classList.remove('active'); });
        t.classList.add('active');
        var panel = document.getElementById(t.getAttribute('data-panel'));
        if (panel) panel.classList.add('active');
      });
    });
  }
});
