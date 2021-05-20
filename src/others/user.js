import firebase from "./firebase";

const authProvider = new firebase.auth.GoogleAuthProvider();
authProvider.setCustomParameters({
  prompt: "select_account",
});

export const userAuth = {
  addAuthStateChangeHandler: ({ onSignedIn, onSignedOut }) => {
    firebase.auth().onAuthStateChanged((user) => {
      if (user) onSignedIn(user);
      else onSignedOut();
    });
  },

  signIn: () => firebase.auth().signInWithRedirect(authProvider),

  signOut: () => firebase.auth().signOut(),

  deleteAccount: (user) =>
    user.delete().catch((err) => {
      if (err.code === "auth/requires-recent-login") {
        return user
          .reauthenticateWithPopup(authProvider)
          .then((result) => result.user.delete());
      } else throw new Error("Unknown Error");
    }),
};

export const database = {
  get: async ({ uid, path }) => {
    const snapshot = await firebase
      .database()
      .ref(`users/${uid}/${path}`)
      .get();

    return snapshot.exists() ? snapshot.val() : [];
  },

  set: ({ uid, path, data }) =>
    firebase.database().ref(`users/${uid}/${path}`).set(data),

  remove: ({ uid }) => firebase.database().ref(`users/${uid}`).remove(),
};
