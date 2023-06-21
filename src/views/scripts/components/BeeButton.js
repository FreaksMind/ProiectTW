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
  padding: 9px;
  cursor: pointer;
  width: 100%;
}
</style>

<button id="btn" class="btn"><slot></slot></button>
`;

class BeeButton extends HTMLElement {
  connectedCallback() {
    this.attachShadow({ mode: "open" });
    this.shadowRoot.appendChild(template.content.cloneNode(true));

    // const button = this.shadowRoot.getElementById("btn");
    // Array.from(this.children).forEach((child) => button.appendChild(child.cloneNode(true)));
  }
}

customElements.define("bee-button", BeeButton);
