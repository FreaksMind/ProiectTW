class Modal extends HTMLElement {
  get visible() {
    return this.hasAttribute("visible");
  }

  set visible(value) {
    if (value) {
      this.setAttribute("visible", "");
    } else {
      this.removeAttribute("visible");
    }
  }

  constructor() {
    super();
  }

  connectedCallback() {
    this._render();
  }

  static get observedAttributes() {
    return ["visible"];
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (name === "visible" && this.shadowRoot) {
      if (newValue === null) {
        this.shadowRoot.querySelector(".wrapper").classList.remove("visible");
      } else {
        this.shadowRoot.querySelector(".wrapper").classList.add("visible");
      }
    }
  }

  _render() {
    const wrapperClass = this.visible ? "wrapper visible" : "wrapper";
    const container = document.createElement("div");
    container.innerHTML = `
      <style>
        .wrapper {
          position: fixed;
          left: 0;
          top: 0;
          width: 100%;
          height: 100%;
          background-color: rgba(20, 20, 20, 0.8);
          backdrop-filter: blur(3px);
          opacity: 0;
          visibility: hidden;
          transform: scale(1.1);
          transition: visibility 0s linear .25s,opacity .25s 0s,transform .25s;
          z-index: 1000;
        }
        .visible {
          opacity: 1;
          visibility: visible;
          transform: scale(1);
          transition: visibility 0s linear 0s,opacity .25s 0s,transform .25s;
        }
        .modal {
          border-radius: 10px;
          font-family: Helvetica;
          font-size: 14px;
          padding: 10px 10px 5px 10px;
          background-color: black;
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%,-50%);
          min-width: 300px;
        }
      </style>
      <div class='${wrapperClass}'>
        <div class='modal'>
          <slot></slot>
        </div>
      </div>`;

    const shadowRoot = this.attachShadow({ mode: "open" });
    shadowRoot.appendChild(container);
  }
}
window.customElements.define("bee-modal", Modal);
