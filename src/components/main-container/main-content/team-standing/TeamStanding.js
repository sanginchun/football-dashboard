import "./TeamStanding.css";
import Spinner from "../../../spinner/Spinner";
import AddButton from "../add-button/AddButton";

class TeamStanding {
  constructor({ $target, isCustom }) {
    this.teamStanding = this._template();

    if (!isCustom)
      new AddButton({ $target: this.teamStanding.querySelector(".header") });

    this.spinner = new Spinner({
      $target: this.teamStanding,
    });

    $target.appendChild(this.teamStanding);
  }

  _template() {
    const div = document.createElement("div");
    div.className = "card half team-standing";
    div.setAttribute("data-type", "teamStanding");

    div.innerHTML = `
      <div class="header">
        <h3 class="title">Standing</h3>
      </div>
      <div class="body"></div>
    `;

    return div;
  }

  render({ standingsData, teamsData, teamId }) {
    this.teamStanding
      .querySelector(".body")
      .appendChild(this._content(standingsData, teamsData, teamId));

    this.teamStanding
      .querySelector(".body .current")
      .scrollIntoView({ block: "center" });
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
