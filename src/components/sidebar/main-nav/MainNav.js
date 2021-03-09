import "./MainNav.css";
import Spinner from "../../spinner/Spinner";
import { formatTeamName } from "../../../helper";

class MainNav {
  constructor({ $target, onClickNav, onClickLeague, onClickTeam }) {
    this.mainNav = this._template();
    this.spinner = new Spinner({ $target: this.mainNav });

    // on main nav click
    this.mainNav.addEventListener("click", (e) => {
      if (!e.target.closest(".main-nav__items")) return;
      const type = e.target.closest(".main-nav__items").dataset.type;

      onClickNav(type);
    });

    // on league click
    this.mainNav.addEventListener("click", (e) => {
      if (!e.target.closest("ul.main-nav__nested.league li")) return;

      const { leagueId, seasonId } = e.target.closest(
        "ul.main-nav__nested.league li"
      ).dataset;

      onClickLeague({ leagueId, seasonId });
    });

    // on team click
    this.mainNav.addEventListener("click", (e) => {
      if (!e.target.closest("ul.main-nav__nested.team li")) return;

      const { leagueId, teamId, teamCode } = e.target.closest(
        "ul.main-nav__nested.team li"
      ).dataset;

      const { seasonId } = this.mainNav.querySelector(
        `.main-nav__nested.league li[data-league-id="${leagueId}"]`
      ).dataset;

      onClickTeam({ leagueId, seasonId, teamId, teamCode });
    });

    $target.appendChild(this.mainNav);
  }

  _template() {
    const nav = document.createElement("nav");
    nav.className = "main-nav";

    // prettier-ignore
    nav.innerHTML = `
      <li class="main-nav__items" data-type="custom">
        <h3>Custom</h3>
      </li>
      <li class="main-nav__items deactive" data-type="league">
        <h3>League</h3>
        <i class="fas fa-chevron-down" aria-hidden="true"></i>
      </li>
      <li class="main-nav__items deactive" data-type="team">
        <h3>Team</h3>
        <i class="fas fa-chevron-down" aria-hidden="true"></i>
      </li>
      `;

    return nav;
  }

  renderLeague(data) {
    const navLeague = this.mainNav.querySelector(`li[data-type="league"]`);
    const nested = document.createElement("ul");

    nested.className = "main-nav__nested league hide";
    nested.innerHTML = data
      .map((league) => {
        const { name, league_id: leagueId, season_id: seasonId } = league;
        return `
        <li data-league-id="${leagueId}" data-season-id="${seasonId}">
          <h4>${name}</h4>
        </li>`;
      })
      .join("");

    navLeague.insertAdjacentElement("afterend", nested);
    navLeague.classList.remove("deactive");
    this.spinner.toggle();
  }

  renderTeam(data, leagueId) {
    this.mainNav
      .querySelector(`.main-nav__items[data-type="team"] i`)
      .classList.remove("show");
    this.mainNav.querySelector(".main-nav__nested.team") &&
      this.mainNav.querySelector(".main-nav__nested.team").remove();

    const navTeam = this.mainNav.querySelector(`li[data-type="team"]`);
    const nested = document.createElement("ul");

    nested.className = "main-nav__nested team hide";
    nested.innerHTML = data
      .map((team) => {
        const { team_id: teamId, name, short_code: code, logo } = team;

        return `
        <li data-team-id="${teamId}" data-team-code="${code}" data-league-id="${leagueId}">
          <img class="logo" src="${logo}" alt="logo of ${code}" title="${code}">
          <h4 class="team-name">${formatTeamName(name)}</h4>
        </li>`;
      })
      .join("");

    navTeam.insertAdjacentElement("afterend", nested);
    navTeam.classList.remove("deactive");
    this.spinner.toggle();
  }

  toggleNested(type) {
    const chevron = this.mainNav.querySelector(
      `.main-nav__items[data-type=${type}] i`
    );
    const nested = this.mainNav.querySelector(`.main-nav__nested.${type}`);

    chevron.classList.toggle("show");
    nested.classList.toggle("hide");
    nested.classList.toggle("show");
  }
}

export default MainNav;
