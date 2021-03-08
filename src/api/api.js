const API_HOST = `app.sportdataapi.com/api/v1/soccer`;
const API_KEY = `7548f260-66c2-11eb-8cf1-cfec162038ad`;
const API_KEY2 = `b7378ec0-6644-11eb-aa1d-d5b666f6a0bb`;
// 237: Premier League, 314: Bundesliga, 538: La Liga, 392: Serie A
const LEAGUE_ID_KEY1 = [237, 314];
const HALF_HOUR = 1000 * 60 * 30;
const MONTH = 1000 * 60 * 60 * 24 * 30;
const YEAR = 1000 * 60 * 60 * 24 * 365;

class API {
  constructor() {
    this.cacheExpire = JSON.parse(localStorage.getItem("cacheExpire")) || {};
    console.log(this.cacheExpire);

    window.addEventListener("beforeunload", () => {
      localStorage.setItem("cacheExpire", JSON.stringify(this.cacheExpire));
    });
  }

  async initCache(cacheName) {
    this.cache = await caches.open(cacheName);
  }

  async request(URL, expire) {
    try {
      // add to cache
      await this.cache.add(URL);

      // set expire
      this.cacheExpire[URL] = expire;

      const res = await this.cache.match(URL);
      if (!res.ok) throw new Error(`${res.status} ${res.statusText}`);

      const { data } = await res.json();
      return data;
    } catch (err) {
      console.log(err);
    }
  }

  async requestCache(URL) {
    const res = await this.cache.match(URL);
    const { data } = await res.json();

    return data;
  }

  getLeague(leagueId) {
    const KEY = LEAGUE_ID_KEY1.includes(leagueId) ? API_KEY : API_KEY2;
    const URL = `https://${API_HOST}/leagues/${leagueId}?apikey=${KEY}`;

    if (this.cacheExpire[URL] && new Date(this.cacheExpire[URL]) > Date.now()) {
      return this.requestCache(URL);
    }
    // request and set cache
    else {
      const expire = new Date(Date.now() + YEAR);
      return this.request(URL, expire);
    }
  }

  getSeason(leagueId) {
    const KEY = LEAGUE_ID_KEY1.includes(leagueId) ? API_KEY : API_KEY2;
    const URL = `https://${API_HOST}/seasons/?apikey=${KEY}&league_id=${leagueId}`;

    if (this.cacheExpire[URL] && new Date(this.cacheExpire[URL]) > Date.now()) {
      return this.requestCache(URL);
    }
    // request and set cache
    else {
      const expire = new Date(Date.now() + MONTH);
      return this.request(URL, expire);
    }
  }

  getStandings(leagueId, seasonId) {
    const KEY = LEAGUE_ID_KEY1.includes(leagueId) ? API_KEY : API_KEY2;
    const URL = `https://${API_HOST}/standings?apikey=${KEY}&season_id=${seasonId}`;

    if (this.cacheExpire[URL] && new Date(this.cacheExpire[URL]) > Date.now()) {
      return this.requestCache(URL);
    }
    // request and set cache
    else {
      const expire = new Date(Date.now() + HALF_HOUR);
      return this.request(URL, expire);
    }
  }

  getTeam(leagueId, teamId) {
    const KEY = LEAGUE_ID_KEY1.includes(leagueId) ? API_KEY : API_KEY2;
    const URL = `https://${API_HOST}/teams/${teamId}?apikey=${KEY}`;

    if (this.cacheExpire[URL] && new Date(this.cacheExpire[URL]) > Date.now()) {
      return this.requestCache(URL);
    }
    // request and set cache
    else {
      const expire = new Date(Date.now() + MONTH);
      return this.request(URL, expire);
    }
  }
}

export const api = new API();
