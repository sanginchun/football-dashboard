import "./SideBar.css";
import Logo from "./logo/Logo";
import MainNav from "./main-nav/MainNav";
import SidebarBtn from "./sidebar-btn/SidebarBtn";

class SideBar {
  constructor({ $target, onClickNav, onClickLeague, onClickTeam }) {
    this.sidebar = this._template();

    // sidebar toggle btn
    this.sidebarBtn = SidebarBtn();
    this.sidebarBtn.addEventListener("click", () => {
      this.toggle();
    });
    this.sidebar.appendChild(this.sidebarBtn);

    new Logo({ $target: this.sidebar });

    this.mainNav = new MainNav({
      $target: this.sidebar,
      onClickNav,
      onClickLeague,
      onClickTeam,
    });

    $target.appendChild(this.sidebar);
  }

  _template() {
    const aside = document.createElement("aside");
    aside.className = "sidebar";
    return aside;
  }

  activateEditMode() {
    this.sidebar.style.cursor = "default";
    this.sidebar.style.pointerEvents = "none";
    this.sidebar.style.opacity = "0.6";
  }

  endEditMode() {
    this.sidebar.style = "";
  }

  toggle() {
    this.sidebar.classList.toggle("show");
  }
}

export default SideBar;
