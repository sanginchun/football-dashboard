import "./TopScorers.css";
import AddButton from "../add-button/AddButton";
import Checkbox from "../checkbox/Checkbox";
import Spinner from "../../../spinner/Spinner";
import { formatName } from "../../../../others/helper.js";

class TopScorers {
  constructor({ $target, isCustom, title, dataset }) {
    this.titleSpan = title;
    this.topScorers = this._template();
    Object.keys(dataset).forEach(
      (key) => (this.topScorers.dataset[key] = dataset[key])
    );

    const controlButton = isCustom ? Checkbox() : AddButton();
    this.topScorers.querySelector(".header").appendChild(controlButton);

    this.spinner = new Spinner({
      $target: this.topScorers,
    });
    this.spinner.toggle();

    $target.appendChild(this.topScorers);
  }

  _template() {
    const article = document.createElement("article");
    article.className = `card half top-scorers`;
    article.setAttribute("data-type", `topScorers`);

    article.innerHTML = `
      <div class="header">
        <h3 class="title">Top Scorers${
          this.titleSpan ? `<span>${this.titleSpan}</span>` : ``
        }</h3>
      </div>
      <div class="body"></div>
    `;

    return article;
  }

  render({ topScorersData, teamsDataByName }) {
    this.topScorers
      .querySelector(".body")
      .appendChild(this._content(topScorersData, teamsDataByName));

    this.spinner.toggle();
  }

  _content(topScorersData, teamsData) {
    const table = document.createElement("table");
    const header = `
    <tr>
      <th><h5>#</h5></th>
      <th><h5>Name</h5></th>
      <th><h5>Goals</h5></th>
      <th><h5>Played</h5></th>
      <th><h5>P90</h5></th>
    </tr>
  `;

    const rows = topScorersData
      .map((p) => {
        const { logo, code } = teamsData[p.team.team_name];
        return `
          <tr>
            <td><h4>${p.pos}</h4></td>
            <td class="player" data-id=${p.player.player_id}>
              ${logo ? `<img class="logo" src=${logo} alt=${code}/>` : ""}
              <h5>${formatName(p.player.player_name)}</h5>
            </td>
            <td><h5>${p.goals.overall}</h5></td>
            <td><h5>${p.matches_played}</h5></td>
            <td><h5>${((p.goals.overall / p.minutes_played) * 90).toFixed(
              2
            )}</h5></td>
          </tr>
          `;
      })
      .join("");

    table.innerHTML = header + rows;

    return table;
  }
}

export default TopScorers;
