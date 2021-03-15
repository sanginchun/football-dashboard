import firebase from "./others/firebase";

export const Auth = {
  addUserAuth() {
    this.authProvider = new firebase.auth.GoogleAuthProvider();
    this.authProvider.setCustomParameters({
      prompt: "select_account",
    });

    firebase.auth().onAuthStateChanged((user) => {
      console.log("auth change");
      if (user) this.handleUserSignIn(user);
      else this.handleNotUser();
    });
  },

  // prettier-ignore
  handleClickSignIn() {
    localStorage.setItem("custom", JSON.stringify(this.state.custom));
    firebase.auth().signInWithRedirect(this.authProvider)
    .catch((error) => {
      console.log(error);
    });
  },

  // prettier-ignore
  handleClickSignOut() {
    firebase.auth().signOut()
    .catch((error) => {
      console.log(error);
    })
    .finally(() => {
      this.mainContainer.spinner.toggle();
    });
  },

  handleUserSignIn(user) {
    // set user
    this.state.user = user;

    // set user nav ui
    this.sidebar.userNav.renderUserUi({
      photoURL: user.photoURL,
    });

    // set custom
    let userCustom = [];
    // prettier-ignore
    firebase.database().ref(`users/${this.state.user.uid}/custom`).get()
    .then((snapshot) => {
      if (snapshot.exists()) userCustom = JSON.parse(snapshot.val());
      this.state.custom = JSON.parse(localStorage.getItem("custom")) || [];

      if (this.state.custom.length && userCustom.length) {
        if(confirm("You already have a custom page saved in your account.\n\nWould you like to change it to the current one?"))
          firebase.database().ref(`users/${this.state.user.uid}/custom`).set(JSON.stringify(this.state.custom));
        else {
          this.state.custom = userCustom.slice();
        }
      }
      else if (this.state.custom.length && !userCustom.length) {
        firebase.database().ref(`users/${this.state.user.uid}/custom`).set(JSON.stringify(this.state.custom));
      }
      else if (!this.state.custom.length && userCustom.length) {
        this.state.custom = userCustom.slice();
      }

      const pathname = window.location.pathname;
      if (pathname === "/"){}
      // reload contents if custom
      else if (pathname === "/custom") {
        this.handleClickCustom(false);
      }
      // toggle add buttons if league or team
      else {
        const dataArgs = {};
        const params = new URLSearchParams(
          window.atob(window.location.search.slice(1))
          );
          for (const [key, value] of params) dataArgs[key] = value;
          this.toggleAddedContentAddBtns(dataArgs);
        }
      }).finally(() => {
        localStorage.removeItem("custom");
        this.mainContainer.spinner.toggle();
      });
  },

  handleNotUser() {
    // set user
    this.state.user = null;

    // set user nav ui
    this.sidebar.userNav.renderSignInBtn();

    // set custom
    this.state.custom = [];

    this.route(window.location.pathname);
    this.mainContainer.spinner.toggle();
  },

  handleClickDeleteAccount() {
    const isConfirmed = confirm("Are you sure to delete account?");

    // prettier-ignore
    if (isConfirmed) {
      this.state.user.delete()
      .catch((err) => {
        if (err.code === "auth/requires-recent-login") {
          this.state.user.reauthenticateWithPopup(new firebase.auth.GoogleAuthProvider())
          .then((result) => {
            return result.user.delete();
          })
        }
      })
      .finally(() => {
        firebase.database().ref(`users/${this.state.user.uid}`).remove().then(() => {
          this.state.user = null;
          alert("Your account has been deleted.\n\nThank you for using Football Dashboard.\n");
          this.mainContainer.spinner.toggle();
        });
      });
    }
  },
};
