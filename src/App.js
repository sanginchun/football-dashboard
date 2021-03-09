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

  handleClickNav(type) {
    if (type === "custom") {
      this.sidebar.mainNav.spinner.toggle();

      this.mainContainer.header.renderTitle("Custom");
      const contentsRef = this.mainContainer.content.renderCustomPagePlaceholder(
        {
          contentTypes: this.state.custom.map((content) => content.type),
        }
      );

      this.handleClickCustom(contentsRef).then(() => {
        this.sidebar.mainNav.spinner.toggle();
      });
    } else {
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

    // get standings data
    const standingsData = await model.getStandingsData(leagueId, seasonId);

    // get teams data
    const {
      teamsDataArr,
      teamsData,
      teamsDataByName,
    } = await model.getTeamsData(leagueId, standingsData);

    // render nav
    this.sidebar.mainNav.renderTeam(teamsDataArr, leagueId);

    // render contents
    const standingsProm = Promise.resolve(standingsData).then(
      (standingsData) => {
        this.mainContainer.content.standings.render({
          standingsData,
          teamsData,
        });
      }
    );

    const matchResultsProm = model
      .getMatchResultsData(leagueId, seasonId)
      .then((matchesData) => {
        // render
        this.mainContainer.content.matchResults.render({
          matchesData,
          teamsDataByName,
        });
      });

    const matchUpcomingProm = model
      .getMatchUpcomingData(leagueId, seasonId)
      .then((matchesData) => {
        this.mainContainer.content.matchUpcoming.render({
          matchesData,
          teamsDataByName,
        });
      });

    const topScorersProm = model
      .getTopScorersData(leagueId, seasonId)
      .then((topScorersData) => {
        this.mainContainer.content.topScorers.render({
          topScorersData,
          teamsDataByName,
        });
      });

    // after rendered all
    Promise.all([
      standingsProm,
      matchResultsProm,
      matchUpcomingProm,
      topScorersProm,
    ]).then(() => {
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
    });

    // toggle add buttons
    this.toggleAddedContentAddBtns({ teamId });

    // get standings data
    const standingsData = await model.getStandingsData(leagueId, seasonId);

    // get teams data
    const { teamsData, teamsDataByName } = await model.getTeamsData(
      leagueId,
      standingsData
    );

    // render contents
    const teamStandingProm = Promise.resolve(standingsData).then(
      (standingsData) => {
        this.mainContainer.content.teamStanding.render({
          standingsData,
          teamsData,
          teamId,
        });
      }
    );

    const nextMatchProm = model
      .getMatchUpcomingData(leagueId, seasonId, teamCode)
      .then((matchesData) => {
        // get first one
        const [nextMatchData] = matchesData;

        this.mainContainer.content.nextMatch.render({
          nextMatchData,
          teamCode,
          teamsDataByName,
        });
      });

    const formProm = model
      .getMatchResultsData(leagueId, seasonId, true, teamCode)
      .then((matchesData) => {
        this.mainContainer.content.form.render({
          matchesData,
          teamCode,
          teamsDataByName,
        });
      });

    Promise.all([teamStandingProm, nextMatchProm, formProm]).then(() => {
      this.sidebar.mainNav.spinner.toggle();
    });
  }

  async handleClickCustom(contentsRef) {
    console.log(contentsRef, this.state.custom);
    return Promise.all(
      contentsRef.map(async (content, i) => {
        const { type, leagueId, seasonId, teamId } = this.state.custom[i];

        // get standings data
        const standingsData = await model.getStandingsData(leagueId, seasonId);

        // get teams data
        const { teamsData, teamsDataByName } = await model.getTeamsData(
          leagueId,
          standingsData
        );

        switch (type) {
          case "standings":
            return Promise.resolve(standingsData).then((standingsData) => {
              content.render({
                standingsData,
                teamsData,
              });
            });
          case "matchResults":
            return model
              .getMatchResultsData(leagueId, seasonId)
              .then((matchesData) => {
                // render
                content.render({
                  matchesData,
                  teamsDataByName,
                });
              });
          case "matchUpcoming":
            return model
              .getMatchUpcomingData(leagueId, seasonId)
              .then((matchesData) => {
                content.render({
                  matchesData,
                  teamsDataByName,
                });
              });
          case "topScorers":
            return model
              .getTopScorersData(leagueId, seasonId)
              .then((topScorersData) => {
                content.render({
                  topScorersData,
                  teamsDataByName,
                });
              });
          case "teamStanding":
            return Promise.resolve(standingsData).then((standingsData) => {
              content.render({
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

                content.render({
                  nextMatchData,
                  teamCode,
                  teamsDataByName,
                });
              });
          case "form":
            return model
              .getMatchResultsData(leagueId, seasonId, true, teamCode)
              .then((matchesData) => {
                content.render({
                  matchesData,
                  teamCode,
                  teamsDataByName,
                });
              });
        }
      })
    );
  }

  handleClickAddBtn({ type, leagueId, seasonId, teamId }) {
    const content = teamId
      ? { type, leagueId, seasonId, teamId }
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
    // console.log(type, leagueId, seasonId, teamId);
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
