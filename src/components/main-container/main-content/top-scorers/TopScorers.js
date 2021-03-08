import "./TopScorers.css";
import AddButton from "../add-button/AddButton";
import Spinner from "../../../spinner/Spinner";
import { formatName } from "../../../../helper";

class TopScorers {
  constructor({ $target, isCustom }) {
    this.topScorers = this._template();

    if (!isCustom)
      new AddButton({ $target: this.topScorers.querySelector(".header") });

    this.spinner = new Spinner({
      $target: this.topScorers,
    });

    $target.appendChild(this.topScorers);
  }

  _template() {
    const div = document.createElement("div");
    div.className = `card half top-scorers`;
    div.setAttribute("data-type", `topScorers`);

    div.innerHTML = `
      <div class="header">
        <h3 class="title">Top Scorers</h3>
      </div>
      <div class="body"></div>
    `;

    return div;
  }

  render(topScorersData, teamsData) {
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

    this.topScorers.querySelector(".body").appendChild(table);

    this.spinner.toggle();
  }
}

export default TopScorers;
