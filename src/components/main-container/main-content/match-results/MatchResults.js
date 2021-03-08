import "./MatchResults.css";
import Spinner from "../../../Spinner/Spinner";
import AddButton from "../add-button/AddButton";
import { DatePicker } from "../date-picker/DatePicker";

class MatchResults {
  constructor({ $target, isCustom }) {
    this.matchResults = this._template();

    if (!isCustom)
      new AddButton({ $target: this.matchResults.querySelector(".header") });

    this.spinner = new Spinner({
      $target: this.matchResults,
    });

    $target.appendChild(this.matchResults);
  }

  _template() {
    const div = document.createElement("div");
    div.className = "card half matches result";
    div.setAttribute("data-type", "matchResults");

    div.innerHTML = `
      <div class="header">
        <h3 class="title">Results</h3>
      </div>
      <div class="body"></div>
    `;

    return div;
  }

  render(matchesData) {
    this.data = matchesData.slice();

    // date picker
    const uniqueDateArr = Array.from(
      new Set(this.data.map((match) => match.match_start.split(" ")[0]))
    );
    this.datePicker = DatePicker(uniqueDateArr.reverse());
    this.datePicker.addEventListener("change", (e) => {
      const value = e.target.value;

      this.matchResults.querySelector(".body").innerHTML = "";
      this.matchResults.querySelector(".body").appendChild(this._table(value));
    });

    this.matchResults
      .querySelector(".header .title")
      .insertAdjacentElement("afterend", this.datePicker);

    // initial data
    this.matchResults
      .querySelector(".body")
      .appendChild(this._table(uniqueDateArr[0]));

    this.spinner.toggle();
  }

  _table(date) {
    const table = document.createElement("table");
    const header = `
      <tr>
        <th><h5>Home</h5></th>
        <th><h5>SCORE</h5></th>
        <th><h5>Away</h5></th>
      </tr>
    `;

    const rows = this.data
      .filter((match) => match.match_start.split(" ")[0] === date)
      .map((match) => {
        let home = "home";
        let away = "away";
        let score = "score";
        if (match.stats.home_score > match.stats.away_score) {
          home += " winner";
        } else if (match.stats.home_score < match.stats.away_score) {
          away += " winner";
        } else {
          score += " winner";
        }
        return `
        <tr>
          <td class="team ${home}" data-team-id="${match.home_team.team_id}">
            <h5>${match.home_team.short_code}</h5>
            <img class="logo" src=${match.home_team.logo} alt=""/>
          </td>
          <td class="${score}"><h4>${
          match.stats.ft_score
            ? match.stats.ft_score.split("").join(" ")
            : `${match.stats.home_score} - ${match.stats.away_score}`
        }</h4></td>
          <td class="team ${away}" data-team-id="${match.away_team.team_id}">
            <img class="logo" src=${match.away_team.logo} alt=""/>
            <h5>${match.away_team.short_code}</h5>
          </td>
        </tr>
      `;
      })
      .join("");

    table.innerHTML = header + rows;

    return table;
  }
}

export default MatchResults;
