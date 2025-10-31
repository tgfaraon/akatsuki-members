class THeader extends HTMLElement {
    connectedCallback() {
        const h1text = this.getAttribute("h1text") || "Food is best from your own hands";
        const ptext = this.getAttribute("ptext") || "Learn how to make delectables";
        this.innerHTML = `    
        <header class="header">
            <div class="header-container">
                <h1>${h1text}</h1>
                <p>${ptext}</p>
                <button id="cook-now-btn" class="subscribe-button navbar">Cook Now!</button>
            </div>
        </header>`;
        // Add event listener to button
        this.querySelector("#cook-now-btn").addEventListener("click", () => {
            const subSection = document.getElementById("subscribe");
            if (subSection) {
                subSection.scrollIntoView({ behavior: "smooth" });
            }
        });
    }
}

// Register custom element if not already registered
if (!customElements.get('t-header')) {
    try {
        customElements.define('t-header', THeader);
    } catch (e) {
        // If registration fails, don't break the rest of the script
        console.warn('Failed to register t-header custom element:', e);
    }
}

// Optionally, link all .subscribe-button.navbar buttons to the subscription section
document.addEventListener("DOMContentLoaded", () => {

    // setup hamburger/menu toggle + accessibility
    (function setupHamburger() {
        const toggle = document.getElementById('nav-toggle');
        const links = document.getElementById('nav-links');
        if (!toggle || !links) return;

        function setExpanded(val) {
            try { toggle.setAttribute('aria-expanded', String(!!val)); } catch (e) {}
        }

        toggle.addEventListener('click', (e) => {
            const isOpen = links.classList.toggle('open');
            setExpanded(isOpen);
        });

        // Close when any link inside the menu is clicked (also allow default anchor behavior to update hash)
        links.addEventListener('click', (e) => {
            const a = e.target.closest && e.target.closest('a');
            if (!a) return;
            links.classList.remove('open');
            setExpanded(false);
        });

        // Close on outside click
        document.addEventListener('click', (e) => {
            if (!links.classList.contains('open')) return;
            if (e.target.closest && (e.target.closest('#nav-links') || e.target.closest('#nav-toggle'))) return;
            links.classList.remove('open');
            setExpanded(false);
        });

        // Close on Escape
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                links.classList.remove('open');
                setExpanded(false);
                toggle && toggle.focus();
            }
        });
    })();

    // Keep existing navbar subscribe-button behavior but target buttons inside nav as well
    const navSubscribeSelector = 'nav .subscribe-button, .subscribe-button.navbar, #nav-links .subscribe-button';
    document.querySelectorAll(navSubscribeSelector).forEach(btn => {
        btn.addEventListener('click', (e) => {
            try { e.preventDefault(); } catch (err) {}
            const subSection = document.getElementById("subscribe");
            if (subSection) {
                subSection.scrollIntoView({ behavior: "smooth" });
            } else {
                // fallback to SPA route if present
                try { location.hash = '/subscribe'; } catch (err) {}
            }

            // close nav if open
            const links = document.getElementById('nav-links');
            const toggle = document.getElementById('nav-toggle');
            if (links && links.classList.contains('open')) {
                links.classList.remove('open');
                try { toggle.setAttribute('aria-expanded', 'false'); } catch (e) {}
            }
        });
    });

    // Specifically link the "Let's cook!" button to the subscribe section.
    // This finds the visible subscribe-button whose text contains "let's cook" or "lets cook".
    const subscribeButtons = Array.from(document.querySelectorAll('.subscribe-button'));
    const letsCookBtn = subscribeButtons.find(b => {
        if (!b || !b.textContent) return false;
        const txt = b.textContent.trim().toLowerCase();
        return txt === "let's cook!" || txt === "lets cook!" || txt.includes("let's cook") || txt.includes('lets cook');
    });

    if (letsCookBtn) {
        letsCookBtn.addEventListener('click', (e) => {
            // If the button is inside an anchor, allow preventing default to avoid jump
            try { e.preventDefault(); } catch (err) {}
            const subSection = document.getElementById('subscribe');
            if (subSection) subSection.scrollIntoView({ behavior: 'smooth' });

            // close nav when used on mobile
            const links = document.getElementById('nav-links');
            const toggle = document.getElementById('nav-toggle');
            if (links && links.classList.contains('open')) {
                links.classList.remove('open');
                try { toggle.setAttribute('aria-expanded', 'false'); } catch (e) {}
            }
        });
    }
});

// Subscribe form handling: validate, save to localStorage, and show feedback
(function setupSubscribeForm() {
    function isValidEmail(email) {
        // Basic email regex
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    }

    document.addEventListener('DOMContentLoaded', () => {
        const form = document.getElementById('subscribe-form');
        if (!form) return;
        const feedback = document.getElementById('subscribe-feedback');

        form.addEventListener('submit', (e) => {
            e.preventDefault();
            const name = (document.getElementById('subscribe-name') || {}).value || '';
            const email = (document.getElementById('subscribe-email') || {}).value || '';

            // Client-side validation
            if (!name.trim()) {
                feedback.textContent = 'Please enter your name.';
                feedback.classList.add('error');
                return;
            }
            if (!isValidEmail(email)) {
                feedback.textContent = 'Please enter a valid email address.';
                feedback.classList.add('error');
                return;
            }

            // Save to localStorage (append to an array)
            try {
                const existing = JSON.parse(localStorage.getItem('subscribers') || '[]');
                existing.push({ name: name.trim(), email: email.trim(), date: new Date().toISOString() });
                localStorage.setItem('subscribers', JSON.stringify(existing));
            } catch (err) {
                console.warn('Could not save subscriber locally:', err);
            }

            // Provide success feedback and clear form
            feedback.classList.remove('error');
            feedback.textContent = 'Thanks! You are subscribed.';
            form.reset();

            // Optionally, hide feedback after a short delay
            setTimeout(() => { feedback.textContent = ''; }, 4000);
        });
    });
})();