import "./MainContent.css";
import Standings from "./standings/Standings";
import Matches from "./matches/Matches";
import TopScorers from "./top-scorers/TopScorers";
import TeamStanding from "./team-standing/TeamStanding";
import NextMatch from "./next-match/NextMatch";
import Form from "./form/Form";

class MainContent {
  constructor({ $target, onClickLeague, onClickTeam }) {
    this.content = this._template();

    // on click team
    this.content.addEventListener("click", (e) => {
      if (!e.target.closest(".team")) return;

      const { teamId, teamCode } = e.target.closest(".team").dataset;
      const { leagueId, seasonId } = this.content.dataset;

      onClickTeam({ leagueId, seasonId, teamId, teamCode });
    });

    $target.appendChild(this.content);
  }

  _template() {
    const div = document.createElement("header");
    div.className = "main-content";

    return div;
  }

  renderLeaguePage({ leagueId, seasonId }) {
    // clear
    this.content.innerHTML = "";

    // set data
    this.content.dataset.leagueId = leagueId;
    this.content.dataset.seasonId = seasonId;

    // render templates
    this.standings = new Standings({
      $target: this.content,
      isCustom: false,
    });

    this.matchResults = new Matches({
      $target: this.content,
      isCustom: false,
      type: "Results",
    });

    this.matchUpcoming = new Matches({
      $target: this.content,
      isCustom: false,
      type: "Upcoming",
    });

    this.topScorers = new TopScorers({
      $target: this.content,
      isCustom: false,
    });
  }

  renderTeamPage({ leagueId, seasonId, teamId }) {
    // clear
    this.content.innerHTML = "";

    // set data
    this.content.dataset.leagueId = leagueId;
    this.content.dataset.seasonId = seasonId;
    this.content.dataset.teamId = teamId;

    // render templates
    this.teamStanding = new TeamStanding({
      $target: this.content,
      isCustom: false,
    });

    this.nextMatch = new NextMatch({
      $target: this.content,
      isCustom: false,
    });

    this.form = new Form({
      $target: this.content,
      isCustom: false,
    });
  }
}

export default MainContent;
