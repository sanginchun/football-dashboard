import "./Matches.css";
import Spinner from "../../../spinner/Spinner";
import AddButton from "../add-button/AddButton";
import Checkbox from "../checkbox/Checkbox";
import { DatePicker } from "../date-picker/DatePicker";

class Matches {
  constructor({ $target, isCustom, type, title, dataset }) {
    this.titleSpan = title;
    this.type = type;
    this.matches = this._template();
    Object.keys(dataset).forEach(
      (key) => (this.matches.dataset[key] = dataset[key])
    );

    const controlButton = isCustom ? Checkbox() : AddButton();
    this.matches.querySelector(".header").appendChild(controlButton);

    this.spinner = new Spinner({
      $target: this.matches,
    });
    this.spinner.toggle();

    $target.appendChild(this.matches);
  }

  _template() {
    const article = document.createElement("article");
    article.className = `card half matches ${this.type.toLowerCase()}`;
    article.setAttribute("data-type", `match${this.type}`);

    article.innerHTML = `
      <div class="header">
        <h3 class="title">${this.type}${
      this.titleSpan ? `<span>${this.titleSpan}</span>` : ``
    }</h3>
      </div>
      <div class="body"></div>
    `;

    return article;
  }

  render({ matchesData, teamsDataByName }) {
    this.data = matchesData.slice();
    this.teamsData = Object.assign({}, teamsDataByName);

    // date picker
    const uniqueDateArr = Array.from(
      new Set(this.data.map((match) => match.match_start.split(" ")[0]))
    );

    this.datePicker = DatePicker(
      this.type === "Upcoming" ? uniqueDateArr : uniqueDateArr.reverse()
    );
    this.datePicker.addEventListener("change", (e) => {
      const value = e.target.value;

      this.matches.querySelector(".body").innerHTML = "";
      this.matches.querySelector(".body").appendChild(this._content(value));
    });

    this.matches
      .querySelector(".header .title")
      .insertAdjacentElement("afterend", this.datePicker);

    // initial data
    this.matches
      .querySelector(".body")
      .appendChild(this._content(uniqueDateArr[0]));

    this.spinner.toggle();
  }

  _content(date) {
    const table = document.createElement("table");
    const header = `
      <tr>
        <th><h5>Home</h5></th>
        <th><h5>${this.type === "Results" ? "SCORE" : "Schedule"}</h5></th>
        <th><h5>Away</h5></th>
      </tr>
    `;

    const rows = this.data
      .filter((match) => match.match_start.split(" ")[0] === date)
      .map((match) => {
        let home = "home";
        let away = "away";
        let score = "score";
        if (this.type === "Results") {
          if (match.stats.home_score > match.stats.away_score) {
            home += " winner";
          } else if (match.stats.home_score < match.stats.away_score) {
            away += " winner";
          } else {
            score += " winner";
          }
        }
        return `
        <tr>
          <td class="team ${home}" data-team-id="${
          this.teamsData[match.home_team.name].team_id
        }" data-team-code="${match.home_team.short_code}">
            <h5>${match.home_team.short_code}</h5>
            <img class="logo" src=${
              this.teamsData[match.home_team.name].logo
            } alt=""/>
          </td>
          ${
            this.type === "Results"
              ? `<td class="${score}"><h4>${match.stats.home_score} - ${match.stats.away_score}</h4></td>`
              : `<td class="schedule"><h4>${
                  match.match_start.split(" ")[1]
                }</h4></td>`
          }
          <td class="team ${away}" data-team-id="${
          this.teamsData[match.away_team.name].team_id
        }" data-team-code="${match.away_team.short_code}">
            <img class="logo" src=${
              this.teamsData[match.away_team.name].logo
            } alt=""/>
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

export default Matches;
