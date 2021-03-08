import "./Spinner.css";

class Spinner {
  constructor({ $target }) {
    this.spinner = this._template();
    $target.appendChild(this.spinner);
  }

  _template() {
    const div = document.createElement("div");
    div.className = "overlay show";
    div.innerHTML = `
        <div class="spinner">
          <i class="fas fa-spinner fa-2x fa-spin"></i>
        </div>`;

    return div;
  }

  toggle() {
    this.spinner.classList.toggle("hide");
    this.spinner.classList.toggle("show");
  }
}

export default Spinner;
