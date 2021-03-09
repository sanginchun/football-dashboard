import "./NextMatch.css";
import Spinner from "../../../spinner/Spinner";
import AddButton from "../add-button/AddButton";
import { formatDate, formatTeamName } from "../../../../helper";

class NextMatch {
  constructor({ $target, isCustom }) {
    this.nextMatch = this._template();

    if (!isCustom)
      new AddButton({ $target: this.nextMatch.querySelector(".header") });

    this.spinner = new Spinner({
      $target: this.nextMatch,
    });

    $target.appendChild(this.nextMatch);
  }

  _template() {
    const div = document.createElement("div");
    div.className = "card half next-match";
    div.setAttribute("data-type", "nextMatch");

    div.innerHTML = `
      <div class="header">
        <h3 class="title">Next Match</h3>
      </div>
      <div class="body"></div>
    `;

    return div;
  }

  render({ nextMatchData, teamCode, teamsDataByName }) {
    this.nextMatch
      .querySelector(".body")
      .appendChild(this._content(nextMatchData, teamCode, teamsDataByName));

    this.spinner.toggle();
  }

  _content(nextMatchData, teamCode, teamsDataByName) {
    const div = document.createElement("div");

    if (!nextMatchData) {
      div.innerHTML = `<h3>No Match this Week.</h3>`;
      return div;
    }

    const isHome = nextMatchData.home_team.short_code === teamCode;
    const opponent = isHome ? nextMatchData.away_team : nextMatchData.home_team;

    const [weekday, date, time] = formatDate(nextMatchData.match_start);

    const template = `
      <div class="schedule">
        <h2 class="date">${date}</h2>
        <h2 class="weekday">(${weekday})</h2>
        <h2 class="time">${time}</h2>
      </div>
      <h5 class="venue">@ ${
        nextMatchData.venue ? `${nextMatchData.venue.name}` : "TBD"
      } ${isHome ? "(Home)" : "(Away)"}</h5>
      <div class="team" data-team-id="${
        teamsDataByName[opponent.name].team_id
      }" data-team-code="${opponent.short_code}">
        <h4><span>vs.</span> ${formatTeamName(opponent.name)}</h4>
        <img class="logo" src="${teamsDataByName[opponent.name].logo}">
      </div>
    `;

    div.innerHTML = template;
    return div;
  }
}

export default NextMatch;
