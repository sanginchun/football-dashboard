import "./UserNav.css";

class UserNav {
  constructor({
    $target,
    onClickSignIn,
    onClickSignOut,
    onClickDeleteAccount,
  }) {
    this.userNav = this._template();

    this.userNav.addEventListener("click", (e) => {
      // sign in
      if (e.target.closest(".btn-signin")) {
        onClickSignIn();
        return;
      }

      // sign out
      if (e.target.closest(".btn-signout")) {
        onClickSignOut();
        return;
      }

      // delete account
      if (e.target.closest(".btn-delete")) {
        onClickDeleteAccount();
        return;
      }

      // toggle user modal
      if (e.target.closest(".user-img")) {
        this.toggleModal();
        return;
      }
    });

    $target.appendChild(this.userNav);
  }

  _template() {
    const div = document.createElement("div");
    div.className = `user-nav`;

    return div;
  }

  _clear() {
    this.userNav.innerHTML = "";
  }

  renderSignInBtn() {
    this._clear();
    this.userNav.innerHTML = `<div class="btn btn-signin">Sign In</div>`;
  }

  renderUserUi({ photoURL }) {
    this._clear();

    const imgContainer = document.createElement("div");
    imgContainer.className = "user-img-container";
    imgContainer.innerHTML = `<img class="user-img" src="${photoURL}" alt="User">`;

    const userModal = document.createElement("div");
    userModal.className = "user-modal hide";
    userModal.innerHTML = `
      <div class="btn-container">
        <div class="btn btn-signout">Sign out</div>
        <div class="btn btn-delete">Delete account</div>
      </div>`;

    this.userNav.appendChild(imgContainer);
    this.userNav.appendChild(userModal);
  }

  toggleModal() {
    this.userNav.closest(".sidebar").classList.toggle("modal-opened");
    this.userNav.querySelector(".user-modal").classList.toggle("hide");
  }
}

export default UserNav;
