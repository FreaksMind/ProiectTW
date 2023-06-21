const template = document.createElement("template");
template.innerHTML = `
<style>
.btn {
  --c: #ffc107;
  background-color: black;
  color: var(--c);
  font-size: 0.9rem;
  border: 1px solid var(--c);
  border-radius: 10px;
  font-family: "Rubik", sans-serif;
  letter-spacing: 0.1em;
  text-align: center;
  position: relative;
  overflow: hidden;
  z-index: 1;
  padding: 9px;
  cursor: pointer;
}
</style>

<button id="btn" class="btn"></button>
`;

class Button extends HTMLElement {
  connectedCallback() {

    this.attachShadow({ mode: "open" });
    this.shadowRoot.appendChild(template.content.cloneNode(true));
    this.shadowRoot.getElementById("btn").innerText = this.getAttribute("text");

  }
}

customElements.define("bee-button", Button);
