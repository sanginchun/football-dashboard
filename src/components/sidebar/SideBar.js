import "./SideBar.css";
import Logo from "./logo/Logo";
import UserNav from "./user-nav/UserNav";
import MainNav from "./main-nav/MainNav";
import SidebarBtn from "./sidebar-btn/SidebarBtn";

class SideBar {
  constructor({
    $target,
    onClickSignIn,
    onClickSignOut,
    onClickDeleteAccount,
    onClickNav,
    onClickLeague,
    onClickTeam,
  }) {
    this.sidebar = this._template();

    // sidebar toggle btn
    this.sidebarBtn = SidebarBtn();
    this.sidebarBtn.addEventListener("click", () => {
      this.toggle();
    });
    this.sidebar.appendChild(this.sidebarBtn);

    new Logo({ $target: this.sidebar });

    this.userNav = new UserNav({
      $target: this.sidebar,
      onClickSignIn,
      onClickSignOut,
      onClickDeleteAccount,
    });

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
