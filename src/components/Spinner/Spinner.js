import "./Spinner.css";

class Spinner {
  constructor({ $target, isLarge }) {
    this.spinner = this._template(isLarge);
    $target.appendChild(this.spinner);
  }

  _template(isLarge) {
    const div = document.createElement("div");
    div.className = "overlay hide";
    div.innerHTML = `
        <div class="spinner">
          <i class="fas fa-spinner fa-${isLarge ? "3x" : "2x"} fa-spin"></i>
        </div>`;

    return div;
  }

  toggle() {
    this.spinner.classList.toggle("hide");
  }
}

export default Spinner;
