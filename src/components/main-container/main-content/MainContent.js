import "./MainContent.css";
import Standings from "./standings/Standings";
import Matches from "./matches/Matches";
import TopScorers from "./top-scorers/TopScorers";
import TeamStanding from "./team-standing/TeamStanding";
import NextMatch from "./next-match/NextMatch";
import Form from "./form/Form";

class MainContent {
  constructor({
    $target,
    onClickLeague,
    onClickTeam,
    onClickCheckbox,
    onClickAddBtn,
  }) {
    this.onClickCheckbox = onClickCheckbox;
    this.content = this._template();

    // on click team
    this.content.addEventListener("click", (e) => {
      if (!e.target.closest(".team")) return;

      const { teamId, teamCode } = e.target.closest(".team").dataset;
      const { leagueId, seasonId } = e.target.closest(".card").dataset;

      onClickTeam({ leagueId, seasonId, teamId, teamCode });
    });

    // on click add button
    this.content.addEventListener("click", (e) => {
      if (!e.target.closest(".btn-add")) return;

      // get content info
      const title = document.querySelector(".main-header .title").textContent;
      const { type, leagueId, seasonId, teamId, teamCode } = e.target.closest(
        ".card"
      ).dataset;

      onClickAddBtn({
        type,
        leagueId,
        seasonId,
        teamId,
        teamCode,
        title,
        isAdded: !e.target.classList.contains("added"),
      });
    });

    // on click checkbox
    this.content.addEventListener("change", (e) => {
      if (!e.target.closest(".btn-checkbox")) return;

      const targetEl = e.target.closest(".card");
      const isSelected = e.target.checked;

      onClickCheckbox({ targetEl, isSelected });
    });

    // on click title span
    this.content.addEventListener("click", (e) => {
      if (!e.target.closest(".title span")) return;

      // get content info
      const { leagueId, seasonId, teamId, teamCode } = e.target.closest(
        ".card"
      ).dataset;

      teamId
        ? onClickTeam({ leagueId, seasonId, teamId, teamCode })
        : onClickLeague({ leagueId, seasonId });
    });

    $target.appendChild(this.content);
  }

  _template() {
    const section = document.createElement("section");
    section.className = "main-content";

    section.innerHTML = `
    <article class="card full landing">
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
    </article>`;

    return section;
  }

  renderLeaguePagePlaceholder({ leagueId, seasonId }) {
    // clear
    this.content.innerHTML = "";

    // render templates
    this.standings = new Standings({
      $target: this.content,
      isCustom: false,
      dataset: { leagueId, seasonId },
    });

    this.matchResults = new Matches({
      $target: this.content,
      isCustom: false,
      type: "Results",
      dataset: { leagueId, seasonId },
    });

    this.matchUpcoming = new Matches({
      $target: this.content,
      isCustom: false,
      type: "Upcoming",
      dataset: { leagueId, seasonId },
    });

    this.topScorers = new TopScorers({
      $target: this.content,
      isCustom: false,
      dataset: { leagueId, seasonId },
    });
  }

  renderTeamPagePlaceholder({ leagueId, seasonId, teamId, teamCode }) {
    // clear
    this.content.innerHTML = "";

    // render templates
    this.teamStanding = new TeamStanding({
      $target: this.content,
      isCustom: false,
      dataset: { leagueId, seasonId, teamId, teamCode },
    });

    this.nextMatch = new NextMatch({
      $target: this.content,
      isCustom: false,
      dataset: { leagueId, seasonId, teamId, teamCode },
    });

    this.form = new Form({
      $target: this.content,
      isCustom: false,
      dataset: { leagueId, seasonId, teamId, teamCode },
    });
  }

  renderCustomPagePlaceholder({ contents }) {
    // clear
    this.content.innerHTML = "";

    // prettier-ignore
    return contents.map((content) => {
      const { type: contentType, title, ...dataset } = content;
      switch (contentType) {
        case "standings":
          return new Standings({$target: this.content, isCustom: true, title, dataset});
        case "matchResults":
          return new Matches({$target: this.content, isCustom: true, type: "Results", title, dataset});
        case "matchUpcoming":
          return new Matches({$target: this.content, isCustom: true, type: "Upcoming", title, dataset});
        case "topScorers":
          return new TopScorers({$target: this.content, isCustom: true, title, dataset});
        case "teamStanding":
          return new TeamStanding({$target: this.content, isCustom: true, title, dataset});
        case "nextMatch":
          return new NextMatch({$target: this.content, isCustom: true, title, dataset});
        case "form":
          return new Form({$target: this.content, isCustom: true, title, dataset});
      }
    });
  }

  activateEditMode() {
    this.content.querySelectorAll(".card .btn-checkbox").forEach((btn) => {
      btn.style.display = "inline-block";
    });
    this.content.style.opacity = "0.6";
  }

  endEditMode() {
    this.content.querySelectorAll(".card .btn-checkbox").forEach((btn) => {
      btn.style.display = "none";
    });
    this.content.style = "";
  }

  toggleAddBtn({ type, isAdded }) {
    const target = this.content.querySelector(
      `.card[data-type="${type}"] .btn-add`
    );
    target.classList.toggle("added");
    target.textContent = isAdded ? "Undo" : "Add";
  }

  toggleCheckboxAll({ isSelect }) {
    this.content.querySelectorAll(`.card`).forEach((card) => {
      const checkbox = card.querySelector(".btn-checkbox");
      checkbox.checked = isSelect;
      this.onClickCheckbox({ targetEl: card, isSelected: checkbox.checked });
    });
  }
}

export default MainContent;
