import "./MainContainer.css";

class MainContainer {
  constructor({ $target }) {
    $target.appendChild(this._template());
  }

  _template() {
    const main = document.createElement("main");
    main.className = "main-container";

    return main;
  }
}

export default MainContainer;
