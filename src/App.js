import "./App.css";
import { LEAGUE_IDS } from "./config.js";
import { api } from "./api/api.js";
import SideBar from "./components/sidebar/SideBar";
import MainContainer from "./components/main-container/MainContainer";

class App {
  constructor($target) {
    // sidebar
    this.sidebar = new SideBar({
      $target,
      onClickNav: this.handleClickNav.bind(this),
      onClickLeague: this.handleClickLeague.bind(this),
    });

    // main
    this.mainContainer = new MainContainer({
      $target,
      onClickLeague: this.handleClickLeague.bind(this),
    });

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

  async handleClickLeague({ leagueId, seasonId }) {
    this.sidebar.mainNav.spinner.toggle();

    // get league name and render
    const { name: leagueName } = await api.getLeague(leagueId);
    this.mainContainer.header.renderTitle(leagueName);

    // render page template
    this.mainContainer.content.renderLeaguePage({ leagueId, seasonId });

    // get standings data
    const { standings: standingsData } = await api.getStandings(
      leagueId,
      seasonId
    );

    // get teams data, parse
    const teamsDataArr = await Promise.all(
      standingsData.map((team) => api.getTeam(leagueId, team.team_id))
    );
    const teamsData = {};
    teamsDataArr.forEach((team) => {
      const { team_id } = team;
      teamsData[team_id] = team;
    });

    // render on nav
    this.sidebar.mainNav.renderTeam(
      teamsDataArr.sort((a, b) => a.name.localeCompare(b.name))
    );

    // get standings and render
    api.getStandings(leagueId, seasonId).then((data) => {
      const { standings: standingsData } = data;
      this.mainContainer.content.standings.render({
        standingsData,
        teamsData,
      });
    });

    // get match results and render
    api.getMatchResults(leagueId, seasonId).then((data) => {
      // filter finished matches
      const matchesData = data.filter((match) => match.status === "finished");

      // sort
      matchesData.sort(
        (a, b) => new Date(a.match_start) - new Date(b.match_start)
      );

      // render
      this.mainContainer.content.matchResults.render(matchesData);
    });

    // 각각 => 콜백에 render

    // promise all로 받아서 => user state 업데이트
  }

  handleClickTeam({}) {}
}

export default App;
