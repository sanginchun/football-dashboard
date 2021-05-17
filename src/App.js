import "./App.css";
import firebase from "./others/firebase";
import { api } from "./api/api.js";
import { model } from "./model.js";
import SideBar from "./components/sidebar/SideBar";
import MainContainer from "./components/main-container/MainContainer";
import { getKey } from "./others/helper";

// page contents
const LEAGUE_PAGE = [
  "standings",
  "matchResults",
  "matchUpcoming",
  "topScorers",
];
const TEAM_PAGE = ["teamStanding", "nextMatch", "form"];

class App {
  constructor($target) {
    // initial state
    this.state = {
      custom: [],
      selectedEl: new Map(),
      isEditing: false,
      user: null,
    };

    // sidebar
    this.sidebar = new SideBar({
      $target,
      onClickNav: this.handleClickNav.bind(this),
      onClickSignIn: this.handleClickSignIn.bind(this),
      onClickSignOut: this.handleClickSignOut.bind(this),
      onClickDeleteAccount: this.handleClickDeleteAccount.bind(this),
      onClickLeague: this.handleClickLeague.bind(this),
      onClickTeam: this.handleClickTeam.bind(this),
    });

    // main
    this.mainContainer = new MainContainer({
      $target,
      onClickLeague: this.handleClickLeague.bind(this),
      onClickTeam: this.handleClickTeam.bind(this),
      onClickAddBtn: this.handleClickAddBtn.bind(this),
      onClickCheckbox: this.handleClickCheckbox.bind(this),
      onClickEditBtn: this.handleClickEditBtn.bind(this),
      onClickController: this.handleClickController.bind(this),
    });

    // handle pop state
    window.addEventListener("popstate", (e) => {
      this.handlePopState(e);
    });

    // add login functionality
    this.addUserAuth();
    this.mainContainer.spinner.toggle();

    this.init();
  }

  async init() {
    try {
      this.sidebar.mainNav.spinner.toggle();

      // init cache
      await api.initCache("football-dashboard");

      // render nav with initial data
      const initialData = await model.getLeagueData();
      this.sidebar.mainNav.renderLeague(initialData);
      this.sidebar.mainNav.spinner.toggle();

      // load content
      this.route(window.location.pathname);
    } catch (err) {
      this.handleError(err);
    }
  }

  /* nav */
  handleClickNav(type) {
    if (type === "custom") {
      this.handleClickCustom();
    } else {
      this.sidebar.mainNav.toggleNested(type);
    }
  }

  /* router */
  route(pathname) {
    switch (pathname) {
      case "/":
        break;
      case "/custom":
        this.handleClickCustom(false);
        break;
      case "/league":
      case "/team":
        const dataParams = {};
        const params = new URLSearchParams(window.location.search.slice(1));
        for (const [key, value] of params) dataParams[key] = value;

        pathname === "/league"
          ? this.handleClickLeague(dataParams, false)
          : this.handleClickTeam(dataParams, false);
        break;
      default:
        window.location = window.location.origin;
    }
  }

  handlePopState({ state }) {
    if (state) {
      if (state.hasOwnProperty("custom")) this.handleClickCustom(false);
      else if (state.hasOwnProperty("teamId"))
        this.handleClickTeam(state, false);
      else this.handleClickLeague(state, false);
    } else {
      window.location = window.location.origin;
    }
  }

  /* load pages */
  // get teams data to render contents
  async getTeamsDataInAdvance({ leagueId, seasonId }) {
    try {
      const standingsData = await model.getStandingsData(leagueId, seasonId);
      const { teamsDataArr, teamsData, teamsDataByName } =
        await model.getTeamsData(leagueId, standingsData);

      return { teamsDataArr, teamsData, teamsDataByName };
    } catch (err) {
      this.handleError(err);
    }
  }

  async handleClickLeague(dataParams, pushState = true) {
    try {
      if (this.state.isEditing) {
        alert("You must finish editing first.");
        return;
      }

      const { leagueId, seasonId } = dataParams;

      // push state
      if (pushState)
        window.history.pushState(
          dataParams,
          "",
          `/league?leagueId=${leagueId}&seasonId=${seasonId}`
        );

      window.scroll(0, 0);
      this.sidebar.mainNav.spinner.toggle();
      this.mainContainer.controller.hideController();

      // render page title & content placeholders
      const leagueName = await model.getLeagueName(leagueId);
      this.mainContainer.header.renderTitle(leagueName);
      this.mainContainer.mainContent.renderLeaguePagePlaceholder(dataParams);

      // toggle add buttons
      this.state.custom.forEach((key) =>
        this.mainContainer.mainContent.toggleAddBtn(key)
      );

      // get teams data
      const teams = await this.getTeamsDataInAdvance(dataParams);

      // render nav
      this.sidebar.mainNav.renderTeam(teams.teamsDataArr, leagueId);
      this.sidebar.mainNav.spinner.toggle();

      // render
      LEAGUE_PAGE.forEach((type) =>
        this.renderContent({
          type,
          ref: this.mainContainer.mainContent[type],
          dataParams,
          teams,
        })
      );
    } catch (err) {
      this.handleError(err);
    }
  }

  async handleClickTeam(dataParams, pushState = true) {
    try {
      if (this.state.isEditing) {
        alert("You must finish editing first.");
        return;
      }

      const { leagueId, seasonId, teamId, teamCode } = dataParams;

      // push state
      if (pushState)
        window.history.pushState(
          dataParams,
          "",
          `/team?leagueId=${leagueId}&seasonId=${seasonId}&teamId=${teamId}&teamCode=${teamCode}`
        );

      window.scroll(0, 0);
      this.sidebar.mainNav.spinner.toggle();
      this.mainContainer.controller.hideController();

      // render page title & content placeholders
      const teamName = await model.getTeamName(leagueId, teamId);
      this.mainContainer.header.renderTitle(teamName);
      this.mainContainer.mainContent.renderTeamPagePlaceholder(dataParams);

      // toggle add buttons
      this.state.custom.forEach((key) =>
        this.mainContainer.mainContent.toggleAddBtn(key)
      );

      // get teams data
      const teams = await this.getTeamsDataInAdvance(dataParams);

      // render nav when it is not rendered yet
      if (!pushState)
        this.sidebar.mainNav.renderTeam(teams.teamsDataArr, leagueId);
      this.sidebar.mainNav.spinner.toggle();

      // render
      TEAM_PAGE.forEach((type) =>
        this.renderContent({
          type,
          ref: this.mainContainer.mainContent[type],
          dataParams,
          teams,
        })
      );
    } catch (err) {
      this.handleError(err);
    }
  }

  async handleClickCustom(pushState = true) {
    try {
      if (pushState) window.history.pushState({ custom: true }, "", `/custom`);
      window.scroll(0, 0);

      this.mainContainer.header.renderTitle(
        `Custom${
          this.state.user
            ? ""
            : "<span> - Please sign in to keep your custom page</span>"
        }`
      );
      if (this.state.custom.length) {
        this.mainContainer.controller.showController();
      } else {
        this.mainContainer.controller.hideController();
        this.mainContainer.mainContent.renderNoCustomMessage();
        return;
      }

      const customData = this.state.custom.map((key) => {
        const [type, title, leagueId, seasonId, teamId, teamCode] =
          key.split("-");

        return { type, title, leagueId, seasonId, teamId, teamCode };
      });

      const contentRefs =
        this.mainContainer.mainContent.renderCustomPagePlaceholder({
          customData,
        });

      const markLeagueId = {};
      const uniqueDataParams = customData.filter(({ leagueId }) => {
        if (markLeagueId[leagueId]) return false;
        else {
          markLeagueId[leagueId] = true;
          return true;
        }
      });

      const teams = {};
      await Promise.all(
        uniqueDataParams.map(({ leagueId, seasonId }) =>
          this.getTeamsDataInAdvance({ leagueId, seasonId }).then(
            (data) => (teams[leagueId] = data)
          )
        )
      );

      contentRefs.forEach(async (ref, i) => {
        const { type, ...dataParams } = customData[i];
        this.renderContent({
          type,
          ref,
          dataParams,
          teams: teams[dataParams.leagueId],
        });
      });
    } catch (err) {
      this.handleError(err);
    }
  }

  /* render content */
  renderContent({ type, ref, dataParams, teams }) {
    const { leagueId, seasonId, teamId, teamCode } = dataParams;
    const { teamsData, teamsDataByName } = teams;

    // get actual data, then render
    switch (type) {
      case "standings":
        model.getStandingsData(leagueId, seasonId).then((standingsData) => {
          ref.render({
            standingsData,
            teamsData,
          });
        });
        break;
      case "matchResults":
        model.getMatchResultsData(leagueId, seasonId).then((matchesData) => {
          ref.render({
            matchesData,
            teamsDataByName,
          });
        });
        break;
      case "matchUpcoming":
        model.getMatchUpcomingData(leagueId, seasonId).then((matchesData) => {
          ref.render({
            matchesData,
            teamsDataByName,
          });
        });
        break;
      case "topScorers":
        model.getTopScorersData(leagueId, seasonId).then((topScorersData) => {
          ref.render({
            topScorersData,
            teamsDataByName,
          });
        });
        break;
      case "teamStanding":
        model.getStandingsData(leagueId, seasonId).then((standingsData) => {
          ref.render({
            standingsData,
            teamsData,
            teamId,
          });
        });
        break;
      case "nextMatch":
        model
          .getMatchUpcomingData(leagueId, seasonId, teamCode)
          .then((matchesData) => {
            // get first one
            const [nextMatchData] = matchesData;
            ref.render({
              nextMatchData,
              teamCode,
              teamsDataByName,
            });
          });
        break;
      case "form":
        model
          .getMatchResultsData(leagueId, seasonId, true, teamCode)
          .then((matchesData) => {
            ref.render({
              matchesData,
              teamCode,
              teamsDataByName,
            });
          });
        break;
    }
  }

  /* Auth */
  addUserAuth() {
    this.authProvider = new firebase.auth.GoogleAuthProvider();
    this.authProvider.setCustomParameters({
      prompt: "select_account",
    });

    firebase.auth().onAuthStateChanged((user) => {
      if (user) this.handleUserSignIn(user);
      else this.handleNotUser();
    });
  }

  // prettier-ignore
  handleClickSignIn() {
    localStorage.setItem("custom", JSON.stringify(this.state.custom));
    firebase.auth().signInWithRedirect(this.authProvider)
    .catch((error) => {
      console.log(error);
    });
  }

  // prettier-ignore
  handleClickSignOut() {
    firebase.auth().signOut()
    .catch((error) => {
      console.log(error);
    })
    .finally(() => {
      this.mainContainer.spinner.toggle();
    });
  }

  handleUserSignIn(user) {
    // set user
    this.state.user = user;

    // set user nav ui
    this.sidebar.userNav.renderUserUi({
      photoURL: user.photoURL,
    });

    // set custom
    // prettier-ignore
    firebase.database().ref(`users/${this.state.user.uid}/custom`).get()
    .then((snapshot) => {
      let userCustom;
      if (snapshot.exists()) userCustom = JSON.parse(snapshot.val());
      else userCustom = [];
      this.state.custom = JSON.parse(localStorage.getItem("custom")) || [];

      // both exists
      if (this.state.custom.length && userCustom.length) {
        // ask user
        if(confirm("You already have a custom page saved in your account.\n\nWould you like to change it to the current one?"))
          firebase.database().ref(`users/${this.state.user.uid}/custom`).set(JSON.stringify(this.state.custom));
        else {
          this.state.custom = userCustom.slice();
        }
      }
      // only state
      else if (this.state.custom.length && !userCustom.length) {
        // update user custom
        firebase.database().ref(`users/${this.state.user.uid}/custom`).set(JSON.stringify(this.state.custom));
      }
      // only user
      else if (!this.state.custom.length && userCustom.length) {
        // update state
        this.state.custom = userCustom.slice();
      }

      const pathname = window.location.pathname;
      switch(pathname) {
        case "/":
          break;
        case "/custom": // reload contents
          this.handleClickCustom(false);
          break;
        case "/league":
        case "/team":
          const dataParams = {};
          const params = new URLSearchParams(window.location.search.slice(1));
          for (const [key, value] of params) dataParams[key] = value;

          // toggle add buttons
          this.state.custom.forEach((key) =>
            this.mainContainer.mainContent.toggleAddBtn(key)
          );
          break;
      }
    })
    .finally(() => {
      localStorage.removeItem("custom");
      this.mainContainer.spinner.toggle();
    });
  }

  handleNotUser() {
    // set user
    this.state.user = null;

    // set user nav ui
    this.sidebar.userNav.renderSignInBtn();

    // toggle add buttons
    this.state.custom.forEach((key) =>
      this.mainContainer.mainContent.toggleAddBtn(key)
    );

    // reset custom
    this.state.custom = [];

    this.mainContainer.spinner.toggle();
  }

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
  }

  /* custom edit buttons */
  handleClickAddBtn(key) {
    const index = this.state.custom.findIndex((v) => v === key);
    const nextCustom = [...this.state.custom];

    if (index === -1) nextCustom.push(key);
    else {
      nextCustom.splice(index, 1);
    }

    this.state.custom = [...nextCustom];
    this.mainContainer.mainContent.toggleAddBtn(key);

    // prettier-ignore
    if (this.state.user) firebase.database().ref(`users/${this.state.user.uid}/custom`).set(JSON.stringify(this.state.custom));
  }

  handleClickCheckbox({ targetEl, isSelected }) {
    isSelected
      ? this.state.selectedEl.set(targetEl, true)
      : this.state.selectedEl.delete(targetEl);

    this.mainContainer.controller.toggleSelectAll({
      isAll: this.state.selectedEl.size === this.state.custom.length,
    });
  }

  handleClickEditBtn({ isEditing }) {
    // reset controller
    this.state.isEditing = isEditing;
    this.state.selectedEl = new Map();
    this.mainContainer.mainContent.toggleCheckboxAll({ isSelect: false });

    if (isEditing) {
      this.mainContainer.mainContent.activateEditMode();
      this.sidebar.activateEditMode();
    }
    // done editing
    else {
      this.mainContainer.mainContent.endEditMode();
      this.sidebar.endEditMode();

      // reset custom
      this.state.custom = Array.from(document.querySelectorAll(".card")).map(
        (card) => {
          const title = card.querySelector(".title span").textContent;
          const { type, leagueId, seasonId, teamId, teamCode } = card.dataset;

          return getKey({
            type,
            title,
            leagueId,
            seasonId,
            teamId,
            teamCode,
          });
        }
      );

      // prettier-ignore
      if (this.state.user) firebase.database().ref(`users/${this.state.user.uid}/custom`).set(JSON.stringify(this.state.custom));
      if (!this.state.custom.length) this.handleClickCustom(false);
    }
  }

  handleClickController({ type, isSelect }) {
    if (!this.state.selectedEl.size && type !== "select") return;
    switch (type) {
      case "select":
        this.mainContainer.mainContent.toggleCheckboxAll({ isSelect });
        break;
      case "left":
        this.state.selectedEl.forEach((_, el) => {
          const prevEl = el.previousSibling;
          if (prevEl && !this.state.selectedEl.get(prevEl)) {
            prevEl.insertAdjacentElement("beforebegin", el);
            el.scrollIntoView({ block: "center" });
          }
        });
        break;
      case "right":
        this.state.selectedEl.forEach((_, el) => {
          const nextEl = el.nextSibling;
          if (nextEl && !this.state.selectedEl.get(nextEl)) {
            nextEl.insertAdjacentElement("afterend", el);
            el.scrollIntoView({ block: "center" });
          }
        });
        break;
      // prettier-ignore
      case "remove":
        const isConfirmed = confirm(`Confirm: Delete ${this.state.selectedEl.size} content${this.state.selectedEl.size > 1 ? "s" : ""}`);

        if (isConfirmed) {
          this.state.selectedEl.forEach((_, el) => {
            el.remove();
          });
          this.mainContainer.controller.toggleSelectAll( { isAll: false });
        }
        break;
    }
  }

  /* handle error */
  handleError(err) {
    // request error
    if (Number.isFinite(err)) {
      if (err < 400) {
        // alert("redirect");
      } else if (err < 500) {
        alert("Wrong API Key or Exceeded API request limits.");
      } else {
        alert("Server error, please try again later.");
      }
    }
    // other
    else {
      // custom error
      if (err.name === "Error") alert(err);
      // dev error
      else {
        console.log(err);
        return;
      }
    }

    window.location = window.location.origin;
  }
}

export default App;
