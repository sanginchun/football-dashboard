import "./MainContainer.css";
import MainHeader from "./main-header/MainHeader";
import Controller from "./controller/Controller";
import MainContent from "./main-content/MainContent";
import Spinner from "../Spinner/Spinner";

class MainContainer {
  constructor({
    $target,
    onClickLeague,
    onClickTeam,
    onClickAddBtn,
    onClickCheckbox,
    onClickEditBtn,
    onClickController,
  }) {
    this.mainContainer = this._template();

    this.header = new MainHeader({ $target: this.mainContainer });

    this.controller = new Controller({
      $target: this.mainContainer,
      onClickEditBtn,
      onClickController,
    });

    this.content = new MainContent({
      $target: this.mainContainer,
      onClickLeague,
      onClickTeam,
      onClickAddBtn,
      onClickCheckbox,
    });

    this.spinner = new Spinner({ $target: this.mainContainer, isLarge: true });

    $target.appendChild(this.mainContainer);
  }

  _template() {
    const main = document.createElement("main");
    main.className = "main-container";

    return main;
  }
}

export default MainContainer;
