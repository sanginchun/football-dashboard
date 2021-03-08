import "./MainContent.css";
import Standings from "./standings/Standings";
import Matches from "./matches/Matches";
import TopScorers from "./top-scorers/TopScorers";

class MainContent {
  constructor({ $target, onClickLeague }) {
    this.content = this._template();

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
}

export default MainContent;
