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
    const div = document.createElement("div");
    div.className = "sidebar";
    return div;
  }
}

export default SideBar;
