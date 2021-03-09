import "./App.css";
import { LEAGUE_IDS, MAX_TOP_SCORERS, MAX_FORM_RESULTS } from "./config.js";
import { api } from "./api/api.js";
import { model } from "./model.js";
import SideBar from "./components/sidebar/SideBar";
import MainContainer from "./components/main-container/MainContainer";
import { getLocalDate } from "./helper";

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
      this.sidebar.mainNav.spinner.toggle();

      this.mainContainer.header.renderTitle("Custom");
      this.mainContainer.content.renderCustomPage({
        contentTypes: this.state.custom.map((content) => content.type),
      });
    } else {
      this.sidebar.mainNav.toggleNested(type);
    }
  }

  async handleClickLeague({ leagueId, seasonId }) {
    this.sidebar.mainNav.spinner.toggle();

    // render page title & content placeholders
    const { name: leagueName } = await api.getLeague(leagueId);
    this.mainContainer.header.renderTitle(leagueName);
    this.mainContainer.content.renderLeaguePage({ leagueId, seasonId });

    // toggle add buttons
    this.state.custom
      .map((content) => {
        const { type, leagueId: _leagueId, teamId } = content;
        if (!teamId && _leagueId === leagueId) return type;
      })
      .filter((t) => t)
      .forEach((type) => {
        this.mainContainer.content.toggleAddBtn({ type, isAdded: true });
      });

    window.scroll(0, 0);

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
    const teamsDataByName = {};
    teamsDataArr.forEach((team) => {
      const { team_id, name } = team;
      teamsData[team_id] = team;
      teamsDataByName[name] = team;
    });

    // render on nav
    this.sidebar.mainNav.renderTeam(
      teamsDataArr.sort((a, b) => a.name.localeCompare(b.name)),
      leagueId
    );

    // standings
    const standingsProm = Promise.resolve(standingsData).then(
      (standingsData) => {
        this.mainContainer.content.standings.render({
          standingsData,
          teamsData,
        });
      }
    );

    // match results
    const matchResultsProm = api
      .getMatchResults(leagueId, seasonId)
      .then((data) => {
        // filter, get local date
        const matchesData = data
          .filter((match) => match.status === "finished")
          .map((match) => {
            const { match_start_iso } = match;
            // override match start
            match.match_start = getLocalDate(match_start_iso);
            return match;
          });

        // sort
        matchesData.sort(
          (a, b) => new Date(a.match_start) - new Date(b.match_start)
        );

        // render
        this.mainContainer.content.matchResults.render({
          matchesData,
          teamsDataByName,
        });
      });

    // match upcoming
    const matchUpcomingProm = api
      .getMatchUpcoming(leagueId, seasonId)
      .then((data) => {
        // filter upcoming matches
        const matchesData = data
          .filter((match) => match.status === "notstarted")
          .map((match) => {
            const { match_start_iso } = match;
            // match start local time
            match.match_start = getLocalDate(match_start_iso);
            return match;
          });

        // sort
        matchesData.sort(
          (a, b) => new Date(a.match_start) - new Date(b.match_start)
        );

        this.mainContainer.content.matchUpcoming.render({
          matchesData,
          teamsDataByName,
        });
      });

    // top scorers
    const topScorersProm = api
      .getTopScorers(leagueId, seasonId)
      .then((data) => {
        const top5 = data.slice(0, MAX_TOP_SCORERS);
        // get equals
        const topScorersData = top5.concat(
          data.slice(MAX_TOP_SCORERS).filter((player) => {
            return player.goals.overall >= top5[top5.length - 1].goals.overall;
          })
        );

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
      // do something
    });
  }

  async handleClickTeam({ leagueId, seasonId, teamId, teamCode }) {
    // get team name
    const { name: teamName } = await api.getTeam(leagueId, teamId);

    // render page title & content placeholders
    this.mainContainer.header.renderTitle(teamName);
    this.mainContainer.content.renderTeamPage({ leagueId, seasonId, teamId });

    // toggle add buttons
    this.state.custom
      .map((content) => {
        const { type, teamId: _teamId } = content;
        if (_teamId && _teamId === teamId) return type;
      })
      .filter((t) => t)
      .forEach((type) => {
        this.mainContainer.content.toggleAddBtn({ type, isAdded: true });
      });

    window.scroll(0, 0);

    // get standings, team data
    // get standings data
    const { standings: standingsData } = await api.getStandings(
      leagueId,
      seasonId
    );

    // get teams data
    const teamsDataArr = await Promise.all(
      standingsData.map((team) => api.getTeam(leagueId, team.team_id))
    );
    const teamsData = {};
    const teamsDataByName = {};
    teamsDataArr.forEach((team) => {
      const { team_id, name } = team;
      teamsData[team_id] = team;
      teamsDataByName[name] = team;
    });

    const teamStandingProm = Promise.resolve(standingsData).then(
      (standingsData) => {
        this.mainContainer.content.teamStanding.render({
          standingsData,
          teamsData,
          teamId,
        });
      }
    );

    const nextMatchProm = api
      .getMatchUpcoming(leagueId, seasonId)
      .then((data) => {
        const matchesData = data
          .filter((match) => {
            return (
              match.status === "notstarted" &&
              (match.home_team.short_code === teamCode ||
                match.away_team.short_code === teamCode)
            );
          })
          .map((match) => {
            const { match_start_iso } = match;
            // match start local time
            match.match_start = getLocalDate(match_start_iso);
            return match;
          });

        // sort and get first one
        const [nextMatchData] = matchesData.sort(
          (a, b) => new Date(a.match_start) - new Date(b.match_start)
        );

        this.mainContainer.content.nextMatch.render({
          nextMatchData,
          teamCode,
          teamsDataByName,
        });
      });

    const formProm = api
      .getMatchResults(leagueId, seasonId, true)
      .then((data) => {
        const matchesData = data
          .filter((match) => {
            return (
              match.status === "finished" &&
              (match.home_team.short_code === teamCode ||
                match.away_team.short_code === teamCode)
            );
          })
          .map((match) => {
            const { match_start_iso } = match;
            // match start local time
            match.match_start = getLocalDate(match_start_iso);
            return match;
          });

        // sort
        matchesData.sort(
          (a, b) => new Date(a.match_start) - new Date(b.match_start)
        );

        if (matchesData.length > MAX_FORM_RESULTS) {
          matchesData.splice(0, matchesData.length - MAX_FORM_RESULTS);
        }

        this.mainContainer.content.form.render({
          matchesData,
          teamCode,
          teamsDataByName,
        });
      });

    Promise.all([teamStandingProm, nextMatchProm, formProm]).then(() => {
      //
    });
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
}

export default App;
