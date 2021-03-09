import "./MainContent.css";
import Standings from "./standings/Standings";
import Matches from "./matches/Matches";
import TopScorers from "./top-scorers/TopScorers";
import TeamStanding from "./team-standing/TeamStanding";
import NextMatch from "./next-match/NextMatch";
import Form from "./form/Form";

class MainContent {
  constructor({ $target, onClickLeague, onClickTeam, onClickAddBtn }) {
    this.content = this._template();

    // on click team
    this.content.addEventListener("click", (e) => {
      if (!e.target.closest(".team")) return;

      const { teamId, teamCode } = e.target.closest(".team").dataset;
      const { leagueId, seasonId } = this.content.dataset;

      onClickTeam({ leagueId, seasonId, teamId, teamCode });
    });

    // on click add button
    this.content.addEventListener("click", (e) => {
      if (!e.target.closest(".btn-add")) return;

      // get content info
      const { type } = e.target.closest(".card").dataset;
      const { leagueId, seasonId, teamId } = this.content.dataset;

      onClickAddBtn({ type, leagueId, seasonId, teamId });
    });

    $target.appendChild(this.content);
  }

  _template() {
    const div = document.createElement("header");
    div.className = "main-content";

    div.innerHTML = `
    <div class="card full landing">
      <div class="header">
        <h3>How To Use</h3>
      </div>
      <div class="body">
        <div class="steps">
          <h4 class="step step-1">1. Navigate through League and Team tabs.</h4>
          <h4 class="step step-2">2. Create your own dashboard by adding contents.</h4>
          <h4 class="step step-3">3. Check it out on Custom tab and sign in to save it.</h4>
          <h4 class="step step-4">4. Have fun 🙂</h4>
          <h4 class="contact">- Please let me know if something goes wrong -><a href="mailto:sanginchun91@gmail.com">Contact</a></h4>
        </div>
      </div>
    </div>`;

    return div;
  }

  renderLeaguePage({ leagueId, seasonId }) {
    // clear
    this.content.innerHTML = "";

    // set data
    this.content.dataset.leagueId = leagueId;
    this.content.dataset.seasonId = seasonId;
    this.content.dataset.teamId = "";

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

  renderCustomPage({ contentTypes }) {
    // clear
    this.content.innerHTML = "";

    // prettier-ignore
    contentTypes.forEach((type) => {
      switch (type) {
        case "standings":
          new Standings({$target: this.content, isCustom: true});
          break;
        case "matchResults":
          new Matches({$target: this.content, isCustom: true, type: "Results"});
          break;
        case "matchUpcoming":
          new Matches({$target: this.content, isCustom: true, type: "Upcoming"});
          break;
        case "topScorers":
          new Matches({$target: this.content, isCustom: true});
          break;
        case "teamStanding":
          new TeamStanding({$target: this.content, isCustom: true});
          break;
        case "nextMatch":
          new NextMatch({$target: this.content, isCustom: true});
          break;
        case "form":
          new Form({$target: this.content, isCustom: true});
          break;
      }
    });
  }

  toggleAddBtn({ type, isAdded }) {
    const target = this.content.querySelector(
      `.card[data-type="${type}"] .btn-add`
    );
    target.classList.toggle("added");
    target.textContent = isAdded ? "Added" : "Add";
  }
}

export default MainContent;
