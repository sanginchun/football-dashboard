import "./Standings.css";
import Spinner from "../../../Spinner/Spinner";

class Standings {
  constructor({ $target }) {
    this.standings = this._template();

    this.spinner = new Spinner({
      $target: this.standings,
    });

    $target.appendChild(this.standings);
  }

  _template() {
    const div = document.createElement("div");
    div.className = "card full standings";
    div.setAttribute("data-type", "standings");

    div.innerHTML = `
      <div class="header">
        <h3>Standings</h3>
      </div>
      <div class="body"></div>
    `;

    return div;
  }

  render({ standingsData, teamsData }) {
    this.standings
      .querySelector(".body")
      .appendChild(this._table(standingsData, teamsData));

    this.spinner.toggle();
  }

  _table(standings, teams) {
    console.log(standings, teams);
    const table = document.createElement("table");
    const header = `
    <tr>
      <th><h4>#</h4></th>
      <th><h4>Team</h4></th>
      <th><h4>Points</h4></th>
      <th><h4>Played</h4></th>
      <th><h4>W</h4></th>
      <th><h4>D</h4></th>
      <th><h4>L</h4></th>
      <th><h4>GS</h4></th>
      <th><h4>GA</h4></th>
      <th><h4>GD</h4></th>
    </tr>
  `;

    const rows = standings
      .map((t) => {
        const { logo, name, code } = teams[t.team_id];
        return `
          <tr>
            <td><h4>${t.position}</h4></td>
            <td class="team" data-team-id=${t.team_id}><img class="logo" src=${logo} alt="${code}"/><h5>${name}<h5></td>
            <td><h5>${t.points}</h5></td>
            <td><h5>${t.overall.games_played}</h5></td>
            <td><h5>${t.overall.won}</h5></td>
            <td><h5>${t.overall.draw}</h5></td>
            <td><h5>${t.overall.lost}</h5></td>
            <td><h5>${t.overall.goals_scored}</h5></td>
            <td><h5>${t.overall.goals_against}</h5></td>
            <td><h5>${t.overall.goals_diff}</h5></td>
          </tr>
          `;
      })
      .join("");

    table.innerHTML = header + rows;

    return table;
  }
}

export default Standings;
