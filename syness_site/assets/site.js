/* ============================================================
   SYNESS INVEST — site behaviour
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
    var errBox = document.getElementById('formError');
    function showError(msg) {
      if (!errBox) { alert(msg); return; }
      errBox.textContent = msg;
      errBox.classList.remove('hidden');
    }

    /* Real submission via FormSubmit (same service as the v1 contact forms). */
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      if (errBox) errBox.classList.add('hidden');

      /* The form is "novalidate" (multi-step), so check the mandatory boxes here. */
      var decl = form.querySelector('input[name="declaration"]');
      var consent = form.querySelector('input[name="consent"]');
      if ((decl && !decl.checked) || (consent && !consent.checked)) {
        showError('Please accept the declaration and the data-processing consent before submitting. / Merci d\'accepter la déclaration et le consentement avant d\'envoyer.');
        return;
      }

      var email = form.getAttribute('data-form-email');
      var raw = new FormData(form);
      var fd = new FormData();
      /* Merge multi-choice checkboxes (same name) into one line so no answer is lost. */
      raw.forEach(function (value, key) {
        if (typeof value !== 'string') return;
        if (fd.has(key)) fd.set(key, fd.get(key) + ', ' + value);
        else fd.append(key, value);
      });
      var name = (raw.get('legal_name') || '').toString().trim();
      fd.set('_subject', (form.getAttribute('data-subject') || 'New Student Profile') + (name ? ' — ' + name : ''));

      var btn = document.getElementById('submitBtn');
      var btnText = btn ? btn.textContent : '';
      if (btn) { btn.disabled = true; btn.textContent = 'Sending… / Envoi…'; }

      fetch('https://formsubmit.co/ajax/' + email, {
        method: 'POST',
        body: fd,
        headers: { Accept: 'application/json' }
      })
        .then(function (res) { return res.json(); })
        .then(function (data) {
          if (!(data && data.success && data.success !== 'false')) {
            throw new Error((data && data.message) || 'Submission failed');
          }
          form.classList.add('hidden');
          var done = document.getElementById('formDone');
          if (done) done.classList.remove('hidden');
          window.scrollTo({ top: document.getElementById('new').offsetTop - 90, behavior: 'smooth' });
        })
        .catch(function () {
          showError('Sorry, your profile could not be sent. Please try again, or write to contact@synessinvest.com. / Désolé, l\'envoi a échoué. Réessayez ou écrivez à contact@synessinvest.com.');
          if (btn) { btn.disabled = false; btn.textContent = btnText; }
        });
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
