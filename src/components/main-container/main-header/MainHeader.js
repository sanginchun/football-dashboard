import "./MainHeader.css";

class MainHeader {
  constructor({ $target }) {
    this.header = this._template();

    $target.appendChild(this.header);
  }

  _template() {
    const header = document.createElement("header");
    header.className = "main-header";

    header.innerHTML = `
      <div class="main-header__title">
        <h2>Welcome to Football Dashboard !</h2>
      </div>`;

    return header;
  }

  renderTitle(title) {
    this.header.querySelector(".main-header__title h2").innerHTML = title;
  }
}

export default MainHeader;
