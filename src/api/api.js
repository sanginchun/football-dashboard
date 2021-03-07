const API_HOST = `app.sportdataapi.com/api/v1/soccer`;
const API_KEY = `7548f260-66c2-11eb-8cf1-cfec162038ad`;
const API_KEY2 = `b7378ec0-6644-11eb-aa1d-d5b666f6a0bb`;
// 237: Premier League, 314: Bundesliga, 538: La Liga, 392: Serie A
const LEAGUE_ID_KEY1 = [237, 314];

class API {
  async initCache(cacheName) {
    this._cache = await caches.open(cacheName);
  }

  async request(URL) {
    try {
      // check cache
      const isCached = await this._cache.match(URL);
      if (isCached) {
        const { data } = await isCached.json();
        return data;
      }

      // add to cache
      await this._cache.add(URL);
      const res = await this._cache.match(URL);
      if (!res.ok) throw new Error(res.status);

      const { data } = await res.json();
      return data;
    } catch (err) {
      console.log(err);
    }
  }

  getLeague(leagueId) {
    const KEY = LEAGUE_ID_KEY1.includes(leagueId) ? API_KEY : API_KEY2;
    const URL = `https://${API_HOST}/leagues/${leagueId}?apikey=${KEY}`;

    return this.request(URL);
  }

  getSeason(leagueId) {
    const KEY = LEAGUE_ID_KEY1.includes(leagueId) ? API_KEY : API_KEY2;
    const URL = `https://${API_HOST}/seasons/?apikey=${KEY}&league_id=${leagueId}`;

    return this.request(URL);
  }

  getStandings(leagueId, seasonId) {
    const KEY = LEAGUE_ID_KEY1.includes(leagueId) ? API_KEY : API_KEY2;
    const URL = `https://${API_HOST}/standings?apikey=${KEY}&season_id=${seasonId}`;

    return this.request(URL);
  }

  getTeam(leagueId, teamId) {
    const KEY = LEAGUE_ID_KEY1.includes(leagueId) ? API_KEY : API_KEY2;
    const URL = `https://${API_HOST}/teams/${teamId}?apikey=${KEY}`;

    return this.request(URL);
  }
}

export const api = new API();
