import "./MainContainer.css";
import MainHeader from "./main-header/MainHeader";
import MainContent from "./main-content/MainContent";

class MainContainer {
  constructor({ $target, onClickLeague }) {
    this.mainContainer = this._template();

    this.header = new MainHeader({ $target: this.mainContainer });

    this.content = new MainContent({
      $target: this.mainContainer,
      onClickLeague,
    });

    $target.appendChild(this.mainContainer);
  }

  _template() {
    const main = document.createElement("main");
    main.className = "main-container";

    return main;
  }
}

export default MainContainer;
