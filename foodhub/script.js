document.addEventListener('DOMContentLoaded', () => {
  // ensure mount point
  let mount = document.getElementById('app');
  const navbar = document.querySelector('.navbar');
  if (!mount) {
    mount = document.createElement('main');
    mount.id = 'app';
    if (navbar && navbar.parentNode) navbar.parentNode.insertBefore(mount, navbar.nextSibling);
    else document.body.insertBefore(mount, document.body.firstChild);
  }

  function navigate(path) {
    if (!path.startsWith('/')) path = '/' + path;
    location.hash = path;
  }

  function renderSubscribe(container) {
    container.innerHTML = `
      <section id="subscribe-page" style="background-color: rgb(212, 191,157); color: rgba(110, 95, 71, 1);">
        <style>
          /* make placeholders and input text slightly smaller for the subscribe form */
          #spa-subscribe-form { display:flex; flex-direction:column; gap:.75rem; align-items:center; }
          #spa-subscribe-form input,
          #spa-subscribe-form input::placeholder {
            font-size: 0.9rem;
          }
          #spa-subscribe-form input::placeholder { color: rgba(0,0,0,0.35); }

          /* constrain input width so name/email fields are visually smaller but responsive */
          #spa-subscribe-form input[type="text"],
          #spa-subscribe-form input[type="email"] {
            width: clamp(240px, 36vw, 420px);
            max-width: 100%;
            box-sizing: border-box;
          }

          /* keep buttons aligned with inputs */
          #spa-subscribe-form > div { display:flex; gap:.5rem; justify-content:center; width:100%; }
          #spa-subscribe-form button { min-width: 90px; transition: background-color 160ms ease, color 160ms ease, border-color 160ms ease; }

          /* hover / focus for submit & back buttons */
          #spa-subscribe-form button:hover,
          #spa-subscribe-form button:focus {
            background-color: rgb(49, 29, 10);
            color: rgba(255, 254, 254, 1);
            outline: none;
          }
          /* ensure the Back button's border blends on hover */
          #spa-subscribe-form button[type="button"]:hover,
          #spa-subscribe-form button[type="button"]:focus {
            background-color: rgb(49, 29, 10);
            color: #ffffff;
          }
        </style>
        <form id="spa-subscribe-form" novalidate style="background-color: rgb(212, 191,157); display:flex;flex-direction:column;gap:.75rem;align-items:center;">
          <h2 style="-webkit-text-stroke-width: 1.5px; -webkit-text-stroke-color: rgb(49, 29, 10); color: rgba(128, 104, 83, 1); margin:0 2rem; font-size: clamp(1.5rem, 4vw, 2.5rem);">Subscribe</h2>
          <p style="color: rgb(49, 29, 10); margin:0 0 .75rem; font-size: clamp(1rem, 2.2vw, 1.25rem); text-align:center;">Get member updates and exclusive recipes.</p>
          <input id="spa-name" name="name" type="text" placeholder="Your name" required style="padding:.6rem;border-radius:6px;border:1px solid #ccc">
          <input id="spa-email" name="email" type="email" placeholder="you@example.com" required style="padding:.6rem;border-radius:6px;border:1px solid #ccc">
          <div style="display:flex;gap:.5rem">
            <button type="submit" style="padding:.6rem 1rem;border-radius:6px;border:none;background:transparent;color:rgb(49, 29, 10);font-weight:700">Subscribe</button>
            <button type="button" id="spa-back" style="padding:.6rem 1rem;border-radius:6px;border:1px solid #ccc;background:transparent">Back</button>
          </div>
          <div id="spa-feedback" style="min-height:1.2rem;color:#333;margin-top:.5rem"></div>
        </form>
      </section>
    `;

    const form = document.getElementById('spa-subscribe-form');
    const feedback = document.getElementById('spa-feedback');
    const back = document.getElementById('spa-back');

    function validEmail(e) { return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e); }

    form.addEventListener('submit', (ev) => {
      ev.preventDefault();
      const name = (document.getElementById('spa-name') || {}).value || '';
      const email = (document.getElementById('spa-email') || {}).value || '';
      if (!name.trim()) { feedback.textContent = 'Please enter your name.'; feedback.style.color = '#b00'; return; }
      if (!validEmail(email)) { feedback.textContent = 'Please enter a valid email.'; feedback.style.color = '#b00'; return; }

      try {
        const list = JSON.parse(localStorage.getItem('subscribers') || '[]');
        list.push({ name: name.trim(), email: email.trim(), date: new Date().toISOString() });
        localStorage.setItem('subscribers', JSON.stringify(list));
      } catch (err) { console.warn(err); }

      feedback.style.color = '#0a0';
      feedback.textContent = 'Thanks — you are subscribed.';
      form.reset();
      setTimeout(() => { feedback.textContent = ''; }, 3500);
    });

    back && back.addEventListener('click', () => navigate('/'));
  }

  function route() {
    const path = (location.hash || '#/').replace(/^#/, '') || '/';
    if (path === '/subscribe' || path === 'subscribe') {
      renderSubscribe(mount);
    } else {
      // minimal home / clear view
      mount.innerHTML = '';
    }
  }

  // delegated handler: link any .subscribe-button to SPA subscribe route
  document.addEventListener('click', (e) => {
    const btn = e.target.closest && e.target.closest('.subscribe-button');
    if (!btn) return;
    try { e.preventDefault(); } catch (err) {}
    navigate('/subscribe');

    // close mobile nav if open
    const links = document.getElementById('nav-links');
    const toggle = document.getElementById('nav-toggle');
    if (links && links.classList.contains('open')) {
      links.classList.remove('open');
      try { toggle.setAttribute('aria-expanded', 'false'); } catch (e) {}
    }
  });

  window.addEventListener('hashchange', route);
  route();
});

(function () {
        const toggle = document.getElementById('login-toggle');
        const panel = document.getElementById('login-panel');
        const form = document.getElementById('login-form');

        if (!toggle || !panel) return;

        function setExpanded(v) {
          toggle.setAttribute('aria-expanded', String(!!v));
          if (v) panel.removeAttribute('hidden'); else panel.setAttribute('hidden', '');
        }

        toggle.addEventListener('click', (e) => {
          const isOpen = panel.hasAttribute('hidden');
          setExpanded(isOpen);
        });

        // Close on outside click
        document.addEventListener('click', (e) => {
          if (!panel || !toggle) return;
          if (!panel.contains(e.target) && !toggle.contains(e.target)) {
            setExpanded(false);
          }
        });

        // Close on Escape
        document.addEventListener('keydown', (e) => {
          if (e.key === 'Escape') setExpanded(false);
        });

        // Basic submit handler (prevent navigation, accept entry)
        form && form.addEventListener('submit', (e) => {
          e.preventDefault();
          // minimal feedback: close panel after submit
          setExpanded(false);
          // you can handle authentication here (ajax) — currently just closes panel
        });
      })();