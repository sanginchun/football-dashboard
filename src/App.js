import "./App.css";
import { api } from "./api/api.js";
import { model } from "./model.js";
import SideBar from "./components/sidebar/SideBar";
import MainContainer from "./components/main-container/MainContainer";

class App {
  constructor($target) {
    // initial state
    this.state = { custom: JSON.parse(localStorage.getItem("custom")) || [] };
    window.addEventListener("beforeunload", () => {
      localStorage.setItem("custom", JSON.stringify(this.state.custom));
    });

    // sidebar
    this.sidebar = new SideBar({
      $target,
      onClickNav: this.handleClickNav.bind(this),
      onClickLeague: this.handleClickLeague.bind(this),
      onClickTeam: this.handleClickTeam.bind(this),
    });

    // main
    this.mainContainer = new MainContainer({
      $target,
      onClickLeague: this.handleClickLeague.bind(this),
      onClickTeam: this.handleClickTeam.bind(this),
      onClickAddBtn: this.handleClickAddBtn.bind(this),
    });

    this.sidebar.mainNav.spinner.toggle();

    // init cache
    api.initCache("football-dashboard").then(() => {
      // initial data
      this.initNav();
    });
  }

  initNav() {
    model
      .getLeagueData()
      .then((data) => {
        this.sidebar.mainNav.renderLeague(data);
      })
      .catch((err) => {
        // handle error
        console.log(err);
      })
      .finally(() => {
        this.sidebar.mainNav.spinner.toggle();
      });
  }

  // prettier-ignore
  handleClickNav(type) {
    if (type === "custom") {
      window.scroll(0, 0);
      this.sidebar.mainNav.spinner.toggle();

      this.mainContainer.header.renderTitle("Custom");
      
      const contentsRef = this.mainContainer.content.renderCustomPagePlaceholder({ contents: this.state.custom.slice(), });
      this.handleClickCustom(contentsRef).then(() => this.sidebar.mainNav.spinner.toggle());
    }
    else {
      this.sidebar.mainNav.toggleNested(type);
    }
  }

  async handleClickLeague({ leagueId, seasonId }) {
    window.scroll(0, 0);
    this.sidebar.mainNav.spinner.toggle();

    // render page title & content placeholders
    this.mainContainer.header.renderTitle(await model.getLeagueName(leagueId));
    this.mainContainer.content.renderLeaguePagePlaceholder({
      leagueId,
      seasonId,
    });

    // toggle add buttons
    this.toggleAddedContentAddBtns({ leagueId });

    // get data needed before getting other data
    const standingsData = await model.getStandingsData(leagueId, seasonId);
    const {
      teamsDataArr,
      teamsData,
      teamsDataByName,
    } = await model.getTeamsData(leagueId, standingsData);

    // render nav
    this.sidebar.mainNav.renderTeam(teamsDataArr, leagueId);

    // render contents
    const dataArgs = {
      leagueId,
      seasonId,
      standingsData,
      teamsData,
      teamsDataByName,
    };

    const standingsProm = this.renderContent({
      type: "standings",
      caller: this.mainContainer.content.standings,
      ...dataArgs,
    });

    const matchResultsProm = this.renderContent({
      type: "matchResults",
      caller: this.mainContainer.content.matchResults,
      ...dataArgs,
    });

    const matchUpcomingProm = this.renderContent({
      type: "matchUpcoming",
      caller: this.mainContainer.content.matchUpcoming,
      ...dataArgs,
    });

    const topScorersProm = this.renderContent({
      type: "topScorers",
      caller: this.mainContainer.content.topScorers,
      ...dataArgs,
    });

    // prettier-ignore
    Promise.all([ standingsProm, matchResultsProm, matchUpcomingProm, topScorersProm, ]).then(() => {
      this.sidebar.mainNav.spinner.toggle();
    });
  }

  async handleClickTeam({ leagueId, seasonId, teamId, teamCode }) {
    window.scroll(0, 0);
    this.sidebar.mainNav.spinner.toggle();

    // render page title & content placeholders
    this.mainContainer.header.renderTitle(
      await model.getTeamName(leagueId, teamId)
    );
    this.mainContainer.content.renderTeamPagePlaceholder({
      leagueId,
      seasonId,
      teamId,
      teamCode,
    });

    // toggle add buttons
    this.toggleAddedContentAddBtns({ teamId });

    // get data needed before getting other data
    const standingsData = await model.getStandingsData(leagueId, seasonId);
    const { teamsData, teamsDataByName } = await model.getTeamsData(
      leagueId,
      standingsData
    );

    // render contents
    const dataArgs = {
      leagueId,
      seasonId,
      teamId,
      teamCode,
      standingsData,
      teamsData,
      teamsDataByName,
    };

    const teamStandingProm = this.renderContent({
      type: "teamStanding",
      caller: this.mainContainer.content.teamStanding,
      ...dataArgs,
    });

    const nextMatchProm = this.renderContent({
      type: "nextMatch",
      caller: this.mainContainer.content.nextMatch,
      ...dataArgs,
    });

    const formProm = this.renderContent({
      type: "form",
      caller: this.mainContainer.content.form,
      ...dataArgs,
    });

    Promise.all([teamStandingProm, nextMatchProm, formProm]).then(() => {
      this.sidebar.mainNav.spinner.toggle();
    });
  }

  async handleClickCustom(contentsRef) {
    return Promise.all(
      contentsRef.map(async (content, i) => {
        const {
          type,
          leagueId,
          seasonId,
          teamId,
          teamCode,
        } = this.state.custom[i];

        // get data
        const standingsData = await model.getStandingsData(leagueId, seasonId);
        const { teamsData, teamsDataByName } = await model.getTeamsData(
          leagueId,
          standingsData
        );

        const dataArgs = {
          type,
          leagueId,
          seasonId,
          teamId,
          teamCode,
          standingsData,
          teamsData,
          teamsDataByName,
        };

        return this.renderContent({
          caller: content,
          ...dataArgs,
        });
      })
    );
  }

  handleClickAddBtn({ type, leagueId, seasonId, teamId, teamCode }) {
    const content = teamId
      ? { type, leagueId, seasonId, teamId, teamCode }
      : { type, leagueId, seasonId };

    // check if already in custom
    let index = -1;
    this.state.custom.forEach((val, i) => {
      const { type, leagueId, teamId } = val;
      if (teamId) {
        if (content.type === type && content.teamId === teamId) {
          index = i;
        }
      } else {
        if (content.type === type && content.leagueId === leagueId) {
          index = i;
        }
      }
    });

    if (index === -1) {
      this.state.custom = this.state.custom.concat([content]);
      this.mainContainer.content.toggleAddBtn({ type, isAdded: true });
    } else {
      this.state.custom = this.state.custom
        .slice(0, index)
        .concat(this.state.custom.slice(index + 1));
      this.mainContainer.content.toggleAddBtn({ type, isAdded: false });
    }

    console.log(this.state.custom);
  }

  // prettier-ignore
  renderContent(data) {
    const { type, leagueId, seasonId, teamId, teamCode, standingsData, teamsData, teamsDataByName, caller, } = data;

    // return promise
    switch (type) {
      case "standings":
        return Promise.resolve(standingsData).then((standingsData) => {
          caller.render({
            standingsData,
            teamsData,
          });
        });
      case "matchResults":
        return model
          .getMatchResultsData(leagueId, seasonId)
          .then((matchesData) => {
            caller.render({
              matchesData,
              teamsDataByName,
            });
          });
      case "matchUpcoming":
        return model
          .getMatchUpcomingData(leagueId, seasonId)
          .then((matchesData) => {
            caller.render({
              matchesData,
              teamsDataByName,
            });
          });
      case "topScorers":
        return model
          .getTopScorersData(leagueId, seasonId)
          .then((topScorersData) => {
            caller.render({
              topScorersData,
              teamsDataByName,
            });
          });
      case "teamStanding":
        return Promise.resolve(standingsData).then((standingsData) => {
          caller.render({
            standingsData,
            teamsData,
            teamId,
          });
        });
      case "nextMatch":
        return model
          .getMatchUpcomingData(leagueId, seasonId, teamCode)
          .then((matchesData) => {
            // get first one
            const [nextMatchData] = matchesData;
            caller.render({
              nextMatchData,
              teamCode,
              teamsDataByName,
            });
          });
      case "form":
        return model
          .getMatchResultsData(leagueId, seasonId, true, teamCode)
          .then((matchesData) => {
            caller.render({
              matchesData,
              teamCode,
              teamsDataByName,
            });
          });
    }
  }

  toggleAddedContentAddBtns({ leagueId, teamId }) {
    let contentsToToggle;

    // current page: league
    if (!teamId) {
      contentsToToggle = this.state.custom
        .map((content) => {
          const { type, leagueId: _leagueId, teamId: _teamId } = content;
          if (!_teamId && _leagueId === leagueId) return type;
        })
        .filter((t) => t);
    }
    // current page: team
    else {
      contentsToToggle = this.state.custom
        .map((content) => {
          const { type, teamId: _teamId } = content;
          if (_teamId && _teamId === teamId) return type;
        })
        .filter((t) => t);
    }

    contentsToToggle.forEach((type) => {
      this.mainContainer.content.toggleAddBtn({ type, isAdded: true });
    });
  }
}

export default App;
