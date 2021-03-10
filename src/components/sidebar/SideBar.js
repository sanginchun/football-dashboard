import "./SideBar.css";
import Logo from "./logo/Logo";
import MainNav from "./main-nav/MainNav";

class SideBar {
  constructor({ $target, onClickNav, onClickLeague, onClickTeam }) {
    this.sideBar = this._template();

    new Logo({ $target: this.sideBar });

    this.mainNav = new MainNav({
      $target: this.sideBar,
      onClickNav,
      onClickLeague,
      onClickTeam,
    });

    $target.appendChild(this.sideBar);
  }

  _template() {
    const aside = document.createElement("aside");
    aside.className = "sidebar";
    return aside;
  }

  activateEditMode() {
    this.sideBar.style.cursor = "default";
    this.sideBar.style.pointerEvents = "none";
    this.sideBar.style.opacity = "0.6";
  }

  endEditMode() {
    this.sideBar.style = "";
  }
}

export default SideBar;
