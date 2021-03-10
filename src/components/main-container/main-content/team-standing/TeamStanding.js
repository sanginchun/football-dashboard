import "./TeamStanding.css";
import AddButton from "../add-button/AddButton";
import Checkbox from "../checkbox/Checkbox";
import Spinner from "../../../spinner/Spinner";

class TeamStanding {
  constructor({ $target, isCustom, title, dataset }) {
    this.titleSpan = title;
    this.teamStanding = this._template();
    Object.keys(dataset).forEach(
      (key) => (this.teamStanding.dataset[key] = dataset[key])
    );

    const controlButton = isCustom ? Checkbox() : AddButton();
    this.teamStanding.querySelector(".header").appendChild(controlButton);

    this.spinner = new Spinner({
      $target: this.teamStanding,
    });

    $target.appendChild(this.teamStanding);
  }

  _template() {
    const article = document.createElement("article");
    article.className = "card half team-standing";
    article.setAttribute("data-type", "teamStanding");

    article.innerHTML = `
      <div class="header">
        <h3 class="title">Standing${
          this.titleSpan ? `<span>${this.titleSpan}</span>` : ``
        }</h3>
      </div>
      <div class="body"></div>
    `;

    return article;
  }

  render({ standingsData, teamsData, teamId }) {
    this.teamStanding
      .querySelector(".body")
      .appendChild(this._content(standingsData, teamsData, teamId));

    this.teamStanding
      .querySelector(".body .current")
      .scrollIntoView({ block: "center" });
    window.scroll(0, 0);
    this.spinner.toggle();
  }

  _content(standingsData, teamsData, teamId) {
    const div = document.createElement("div");
    div.className = "container";
    const positionUnit = ["st", "nd", "rd"];

    // prettier-ignore
    div.innerHTML = standingsData
      .map((team) => {
        return `
          <div class="team${team.team_id+"" === teamId ? " current" : ""}" data-team-id="${team.team_id}" data-team-code="${teamsData[team.team_id].short_code}">
            <img class="logo" src=${teamsData[team.team_id].logo}>
            <div class="info">
              <h2 class="position">${team.position}<span class="units">${team.position <= 3 ? positionUnit[team.position - 1] : "th"}</span></h2>
              <h3 class="team-name">${teamsData[team.team_id].name}</h3>
              <h3 class="points">${team.points}<span class="units">pts</span> ${team.overall.won}<span class="units">W</span> ${team.overall.draw}<span class="units">D</span> ${team.overall.lost}<span class="units">L</span></h3>
            </div>
          </div>
          `;
      })
      .join("");

    return div;
  }
}

export default TeamStanding;
