import "./Logo.css";

class Logo {
  constructor({ $target }) {
    $target.appendChild(this._template());
  }

  _template() {
    const div = document.createElement("div");
    div.className = "logo-container";
    div.innerHTML = `
      <a href=".">
        <div class="logo">
          <h3><em>Football</em></h3>
          <h3><em>Dashboard</em></h3>
        </div>
      </a>`;

    return div;
  }
}

export default Logo;
