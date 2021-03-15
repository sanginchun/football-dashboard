import "./Form.css";
import Spinner from "../../../spinner/Spinner";
import AddButton from "../add-button/AddButton";
import Checkbox from "../checkbox/Checkbox";
import { formatDate } from "../../../../others/helper.js";

class Form {
  constructor({ $target, isCustom, dataset, title }) {
    this.titleSpan = title;
    this.form = this._template();
    Object.keys(dataset).forEach(
      (key) => (this.form.dataset[key] = dataset[key])
    );

    const controlButton = isCustom ? Checkbox() : AddButton();
    this.form.querySelector(".header").appendChild(controlButton);

    this.spinner = new Spinner({
      $target: this.form,
    });
    this.spinner.toggle();

    $target.appendChild(this.form);
  }

  _template() {
    const article = document.createElement("article");
    article.className = "card full form";
    article.setAttribute("data-type", "form");

    article.innerHTML = `
      <div class="header">
        <h3 class="title">Form${
          this.titleSpan ? `<span>${this.titleSpan}</span>` : ``
        }</h3>
      </div>
      <div class="body"></div>
    `;

    return article;
  }

  render({ matchesData, teamCode, teamsDataByName }) {
    this.form
      .querySelector(".body")
      .appendChild(this._content(matchesData, teamCode, teamsDataByName));

    this.spinner.toggle();
  }

  _content(matchesData, teamCode, teamsDataByName) {
    const div = document.createElement("div");

    if (!matchesData) {
      div.innerHTML = `<h3>No Match this Week.</h3>`;
      return div;
    }

    let wins, draws, losts;
    wins = draws = losts = 0;

    const template = matchesData
      .map((match) => {
        const isHome = match.home_team.short_code === teamCode;
        const opponent = isHome ? match.away_team : match.home_team;

        const date = formatDate(match.match_start)[1];

        const gs = isHome ? match.stats.home_score : match.stats.away_score;
        const ga = isHome ? match.stats.away_score : match.stats.home_score;
        let result;
        // prettier-ignore
        if (gs > ga) {result = "won"; wins++;}
        else if (gs === ga) {result = "draw"; draws++;}
        else {result = "lost"; losts++;}

        const matchResult = `
        <div class="container">
          <div class="info">
            <h4 class="date">${date},</h4>
            <h4 class="homeaway">${isHome ? "Home" : "Away"}</h4>
          </div>
          <div class="team" data-team-id="${
            teamsDataByName[opponent.name].team_id
          }" data-team-code="${opponent.short_code}">
            <h3 class="name">vs. ${opponent.short_code}</h3>
            <img class="logo" src="${teamsDataByName[opponent.name].logo}">
          </div>
          <div class="result">
            <div class="color ${result}"></div>
            <h2 class="score">${gs} : ${ga}</h2>
          </div>
        </div>
      `;

        return matchResult;
      })
      .join("");

    div.innerHTML =
      `<h3 class="overall">${wins}<span class=units>W</span>${draws}<span class=units>D</span>${losts}<span class=units>L</span></h3>` +
      `<div class="outer-container">${template}</div>`;

    return div;
  }
}

export default Form;
