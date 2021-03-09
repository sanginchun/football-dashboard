const API_HOST = `app.sportdataapi.com/api/v1/soccer`;
const API_KEY = `7548f260-66c2-11eb-8cf1-cfec162038ad`;
const API_KEY2 = `b7378ec0-6644-11eb-aa1d-d5b666f6a0bb`;
// 237: Premier League, 314: Bundesliga, 538: La Liga, 392: Serie A
const LEAGUE_ID_KEY1 = [237, 314];
const HALF_HOUR = 1000 * 60 * 30;
const WEEK = 1000 * 60 * 60 * 24 * 7;
const MONTH = 1000 * 60 * 60 * 24 * 30;
const YEAR = 1000 * 60 * 60 * 24 * 365;

class API {
  constructor() {
    this.cacheExpire = JSON.parse(localStorage.getItem("cacheExpire")) || {};
    window.addEventListener("beforeunload", () => {
      localStorage.setItem("cacheExpire", JSON.stringify(this.cacheExpire));
    });
  }

  // need to add delete match cache func

  async initCache(cacheName) {
    this.cache = await caches.open(cacheName);
  }

  async request(URL, expire = "") {
    try {
      // check cache
      const cacheRes = await this.cache.match(URL);

      // cached & not expired
      if (
        cacheRes &&
        this.cacheExpire[URL] &&
        new Date(this.cacheExpire[URL]) > Date.now()
      ) {
        const { data } = await cacheRes.json();

        return data;
      }

      // not cached, need to cache
      if (expire) {
        // add to cache
        await this.cache.add(URL);
        this.cacheExpire[URL] = expire;

        const res = await this.cache.match(URL);
        if (!res.ok) throw new Error(`${res.status}`);

        const { data } = await res.json();
        return data;
      }

      // not cached, no need to cache
      if (!expire) {
        const res = await fetch(URL);
        if (!res.ok) throw new Error(`${res.status}`);

        const { data } = await res.json();
        return data;
      }
    } catch (err) {
      console.log(err);
    }
  }

  getLeague(leagueId) {
    const KEY = LEAGUE_ID_KEY1.includes(+leagueId) ? API_KEY : API_KEY2;
    const URL = `https://${API_HOST}/leagues/${leagueId}?apikey=${KEY}`;
    const expire = new Date(Date.now() + YEAR);

    return this.request(URL, expire);
  }

  getSeason(leagueId) {
    const KEY = LEAGUE_ID_KEY1.includes(+leagueId) ? API_KEY : API_KEY2;
    const URL = `https://${API_HOST}/seasons/?apikey=${KEY}&league_id=${leagueId}`;

    const expire = new Date(Date.now() + MONTH);
    return this.request(URL, expire);
  }

  getStandings(leagueId, seasonId) {
    const KEY = LEAGUE_ID_KEY1.includes(+leagueId) ? API_KEY : API_KEY2;
    const URL = `https://${API_HOST}/standings?apikey=${KEY}&season_id=${seasonId}`;

    const expire = new Date(Date.now() + HALF_HOUR);
    return this.request(URL, expire);
  }

  getTeam(leagueId, teamId) {
    const KEY = LEAGUE_ID_KEY1.includes(+leagueId) ? API_KEY : API_KEY2;
    const URL = `https://${API_HOST}/teams/${teamId}?apikey=${KEY}`;

    const expire = new Date(Date.now() + MONTH);
    return this.request(URL, expire);
  }

  getMatchResults(leagueId, seasonId, isMonth = false) {
    const KEY = LEAGUE_ID_KEY1.includes(+leagueId) ? API_KEY : API_KEY2;
    const from = new Date(Date.now() - (isMonth ? MONTH : WEEK))
      .toISOString()
      .slice(0, 10);
    const to = new Date(Date.now()).toISOString().slice(0, 10);
    const URL = `https://${API_HOST}/matches?apikey=${KEY}&season_id=${seasonId}&date_from=${from}&date_to=${to}`;

    const expire = new Date(Date.now() + HALF_HOUR);
    return this.request(URL, expire);
  }

  getMatchUpcoming(leagueId, seasonId) {
    const KEY = LEAGUE_ID_KEY1.includes(+leagueId) ? API_KEY : API_KEY2;
    const from = new Date(Date.now()).toISOString().slice(0, 10);
    const to = new Date(Date.now() + WEEK).toISOString().slice(0, 10);
    const URL = `https://${API_HOST}/matches?apikey=${KEY}&season_id=${seasonId}&date_from=${from}&date_to=${to}`;

    const expire = new Date(Date.now() + HALF_HOUR);
    return this.request(URL, expire);
  }

  getTopScorers(leagueId, seasonId) {
    const KEY = LEAGUE_ID_KEY1.includes(+leagueId) ? API_KEY : API_KEY2;
    const URL = `https://${API_HOST}/topscorers?apikey=${KEY}&season_id=${seasonId}`;

    const expire = new Date(Date.now() + HALF_HOUR);

    return this.request(URL, expire);
  }
}

export const api = new API();
