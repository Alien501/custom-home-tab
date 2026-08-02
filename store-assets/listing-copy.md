# Chrome Web Store listing copy

## Privacy practices tab

### Remote code justification

The extension optionally embeds a single iframe from `spotify-github-profile.kittinanx.com` to display an opt-in "now playing" Spotify status widget. This widget is off by default and only loads once the user enters their own Spotify UID in Settings. No other remote code, scripts, or resources are fetched — all other functionality runs from files packaged with the extension.

### Single purpose description

Replaces the browser's new tab page with a personal, customisable dashboard — clock, to-do list, bookmarks, pomodoro timer, and optional widgets — with all data stored locally in the browser.

### Data usage

No data is collected or transmitted. Answer "No" to every category (personally identifiable info, health, financial, authentication, personal communications, location, web history, user activity, website content), then check the compliance certification box.

## Store listing tab

### Category

Productivity

### Short description (130/132 chars)

A clean, customisable new tab page — clock, to-do list, bookmarks, pomodoro timer, and ambient effects, all stored locally.

### Detailed description

Tired of your new tab being either blank or cluttered with ads and "recommended" links? This replaces it with a simple dashboard you actually control.

Open a new tab and you get a live clock, a greeting, and a spot for today's focus — or a rotating quote if you haven't set one. Below that: a to-do list that persists across sessions, your most-visited sites as bookmarks, and an optional pomodoro timer for focus sessions.

Everything is configured from the settings panel (the gear icon, bottom-right) — no config files, no options page buried three menus deep:

- Set your name and today's focus
- Pick an accent colour
- Set your own pomodoro focus/break lengths
- Upload your own background — image, GIF, or video — optionally on a time-of-day timeline that shifts through morning, afternoon, evening, and night
- Toggle ambient ember particles on or off
- Show or hide individual widgets (greeting, quote, pomodoro, embers, seconds on the clock)
- Optionally show a Spotify "now playing" status widget (off by default, just needs your UID)

Everything lives in your browser's local storage — no account, no sign-in, nothing sent anywhere. The extension only touches the new tab page; it doesn't read your browsing history or other tabs.

Built as a personal project because I wanted a new tab page that looked and worked exactly the way I wanted, nothing more. Feedback and bug reports welcome on GitHub: https://github.com/Alien501/custom-home-tab
