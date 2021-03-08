import "./MainContent.css";
import Standings from "./standings/Standings";

class MainContent {
  constructor({ $target }) {
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
    });
  }
}

export default MainContent;
