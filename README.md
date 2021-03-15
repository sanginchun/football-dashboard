# ⚽ Football Dashboard

## Table of Contents
- [Description](https://github.com/sanginchun/football-dashboard#description)
- [Live Demo](https://github.com/sanginchun/football-dashboard#live-demo)
- [App Contents](https://github.com/sanginchun/football-dashboard#app-contents)
- [Architecture](https://github.com/sanginchun/football-dashboard#architecture)
- [Dev Environment](https://github.com/sanginchun/football-dashboard#dev-environment)

## Description
- Football dashboard is a single-page application that shows up-to-date information about football leagues and teams.
- Used [SportDataApi](https://app.sportdataapi.com/) which is not a public api, so error might occur due to the request limit.
- Made as a personal project to improve basic HTML, CSS, VanillaJS skills.

## Live Demo
[https://football-dashboard.web.app](https://football-dashboard.web.app/)

[![Screenshot](https://github.com/sanginchun/football-dashboard/blob/main/screenshot.png)](https://football-dashboard.web.app/)

## App Contents
- League: Premier League, Bundesliga, Serie A, La Liga are available now.
  - Standings
  - Match Results (from last week until today)
  - Upcoming Matches (from today to next week)
  - Top Scorers
- Team: All teams in the selected league.
  - Standing
  - Next Match (very next match this week)
  - Form (recent match results this month)
- Custom
  - All contents can be added to a custom tab.
  - Editing (change orders of the cards, deletion) available.
  - Saved automatically when user signed in.

## Architecture
![Architecture](https://github.com/sanginchun/football-dashboard/blob/main/architecture.png)
- [index.html](https://github.com/sanginchun/football-dashboard/blob/main/index.html): entry point

- [App.js](https://github.com/sanginchun/football-dashboard/blob/main/src/App.js): controls entire application

- [model.js](https://github.com/sanginchun/football-dashboard/blob/main/src/model.js): parse and format data

- [api.js](https://github.com/sanginchun/football-dashboard/blob/main/src/api/api.js): makes api call and takes control of cache storage

- [components](https://github.com/sanginchun/football-dashboard/tree/main/src/components)

  - [SideBar](https://github.com/sanginchun/football-dashboard/tree/main/src/components/sidebar)
   
    - [Logo](https://github.com/sanginchun/football-dashboard/tree/main/src/components/sidebar/logo)
    - [UserNav](https://github.com/sanginchun/football-dashboard/tree/main/src/components/sidebar/user-nav): user profile, buttons (Sign in, Sign out, Delete account)
    - [MainNav](https://github.com/sanginchun/football-dashboard/tree/main/src/components/sidebar/main-nav): main nav of the app
    - [SideBarBtn](https://github.com/sanginchun/football-dashboard/tree/main/src/components/sidebar/sidebar-btn): activated on mobile devices

  - [MainContainer](https://github.com/sanginchun/football-dashboard/tree/main/src/components/main-container): main display area

    - [MainHeader](https://github.com/sanginchun/football-dashboard/tree/main/src/components/main-container/main-header)
    - [Controller](https://github.com/sanginchun/football-dashboard/tree/main/src/components/main-container/controller): activated on custom tab, controls edit functions    
    - [MainContent](https://github.com/sanginchun/football-dashboard/tree/main/src/components/main-container/main-content): main content area; includes content(card) components and utility components such as buttons, datepicker, checkbox

  - [Spinner](https://github.com/sanginchun/football-dashboard/tree/main/src/components/Spinner)

- [others](https://github.com/sanginchun/football-dashboard/tree/main/src/others/): config, helper, firebase config

## Dev Environment
- Package Manager: [npm](https://www.npmjs.com/)
- Bundler: [Parcel](https://parceljs.org/)
- Deploy & Hosting: [Firebase](https://firebase.google.com/)
- Transpile: [@babel/preset-env](https://babeljs.io/docs/en/babel-preset-env) (which is default of [Parcel](https://parceljs.org/javascript.html#default-babel-transforms))
- Polyfill: [core-js](https://www.npmjs.com/package/core-js/), [regenerator-runtime](https://www.npmjs.com/package/regenerator-runtime)
