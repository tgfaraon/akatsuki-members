class THeader extends HTMLElement {
    connectedCallback() {
        const h1text = this.getAttribute("h1text") || "Protein Is Good";
        const ptext = this.getAttribute("ptext") || "Learn how to make websites";
        this.innerHTML = `    
        <header class="header">
            <div class="header-container">
                <h1>${h1text}</h1>
                <p>${ptext}</p>
                <button>Join Us Now!</button>
            </div>
        </header>`;
    }
}

class Card extends HTMLElement {
    connectedCallback() {

    }
}

customElements.define("t-header", THeader)