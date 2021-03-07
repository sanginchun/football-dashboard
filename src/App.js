import "./App.css";
import { LEAGUE_IDS } from "./config.js";
import { api } from "./api/api.js";
import SideBar from "./components/sidebar/SideBar";
import MainContainer from "./components/main-container/MainContainer";

class App {
  constructor($target) {
    // render components
    this.sidebar = new SideBar({
      $target,
      onClickNav: this.handleClickNav.bind(this),
      onClickLeague: this.handleClickLeague.bind(this),
    });
    this.mainContainer = new MainContainer({ $target });

    // init cache
    api.initCache("football-dashboard").then(() => {
      // initial data
      this.initNav();
    });
  }

  initNav() {
    let leagueData = [];
    // get league names
    Promise.all(LEAGUE_IDS.map((leagueId) => api.getLeague(leagueId)))
      .then((data) => {
        leagueData = data.slice();

        // get season info
        return Promise.all(
          data.map((league) => {
            const { league_id: leagueId } = league;
            return api.getSeason(leagueId);
          })
        );
      })
      // get current season
      .then((data) => {
        const currentSeasons = data.map((league) => {
          const [current] = league.filter((season) => season.is_current);
          return current;
        });
        currentSeasons.forEach((league, i) => {
          const { season_id } = league;
          leagueData[i] = Object.assign(leagueData[i], { season_id });
        });

        this.sidebar.mainNav.renderLeague(leagueData);
      });
  }

  handleClickNav(type) {
    if (type === "custom") {
      // load custom page
    } else {
      this.sidebar.mainNav.toggleNested(type);
    }
  }

  handleClickLeague({ leagueId, seasonId }) {
    this.sidebar.mainNav.spinner.toggle();

    // standings: cache X, team: cache
    api
      .getStandings(leagueId, seasonId)
      .then((data) => {
        const { standings } = data;
        return Promise.all(
          standings.map((team) => {
            const { team_id: teamId } = team;
            return api.getTeam(leagueId, teamId);
          })
        );
      })
      .then((data) => {
        this.sidebar.mainNav.renderTeam(
          data.sort((a, b) => a.name.localeCompare(b.name))
        );
      });
  }

  handleClickTeam({}) {}
}

export default App;
