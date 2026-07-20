# WeatherHub (Weather_APP)

A modern, single-page weather dashboard built with Flask, styled with glassmorphism, and enhanced with Chart.js for visual forecasts.

This repository contains a small Flask app that fetches current weather and forecast data from OpenWeatherMap and displays it in a polished, responsive UI.

**Live preview:** run locally (see instructions below).

---

## Features

- Beautiful glassmorphism UI with animated background particles and icons
- Current weather summary (temperature, description, feels-like, humidity, wind, pressure)
- Hourly forecast (next 8 intervals shown) and a 5-day overview in the sidebar
- Interactive charts (temperature, humidity/wind) powered by Chart.js
- Pre-defined "Other Cities" quick cards (New York, Tokyo, Paris)
- Responsive layout with a sticky sidebar and scrollable hourly forecast

---

## Tech Stack

- Python 3.8+
- Flask
- Requests
- python-dotenv
- Chart.js (frontend)
- Font Awesome, Google Fonts
- HTML / CSS / JavaScript

---

## Project Structure

- `app.py` — Flask application and data-processing functions
- `templates/index.html` — Main Jinja2 template (UI)
- `static/style.css` — Styles and animations
- `static/script.js` — Charts, interactions, and date/time logic
- `.env` — Local environment file (contains `OPENWEATHER_API_KEY`, not tracked)
- `.gitignore` — ignores `.env`, virtualenv and editor folders

---

## Prerequisites

- Python 3.8 or newer installed
- An OpenWeatherMap API key (sign up at https://openweathermap.org/)

---

## Setup (Windows / cmd.exe)

1. Clone the repository or open it locally.

2. Create and activate a virtual environment (recommended):

```cmd
python -m venv venv
venv\Scripts\activate
```

3. Install required Python packages:

```cmd
pip install flask requests python-dotenv
```

4. Create a `.env` file in the project root (this file is already listed in `.gitignore`):

```text
OPENWEATHER_API_KEY=your_openweather_api_key_here
```

Replace `your_openweather_api_key_here` with your actual API key.

5. Run the application:

```cmd
python app.py
```

Open `http://127.0.0.1:5000` in your browser to view the dashboard.

Notes:
- The app currently uses `app.run(debug=True)` for local development. Before deploying to production, disable debug and run with a proper WSGI server.

---

## Usage

- Enter a city name in the search bar and press the search button to fetch current weather and forecasts.
- Sidebar shows a 5-day summary and interactive charts based on hourly forecast data.

---

## Security & Git Hygiene

Important: If you accidentally push secrets (like `.env`) to a remote repository, do the following immediately:

- Rotate the exposed API key (revoke and generate a new one via OpenWeatherMap dashboard).
- Remove the file from the repository HEAD (this repo already has `.env` in `.gitignore` and the file removed from the latest commit). To fully remove it from history, you can rewrite history. Example options:

Recommended (git-filter-repo):

```bash
git clone --mirror <repo-url> repo-mirror.git
cd repo-mirror.git
git filter-repo --invert-paths --paths .env
git push --force
```

Alternative (BFG Repo-Cleaner):

```bash
git clone --mirror <repo-url> repo-mirror.git
java -jar bfg.jar --delete-files .env repo-mirror.git
cd repo-mirror.git
git reflog expire --expire=now --all && git gc --prune=now --aggressive
git push --force
```

Notes on history rewrite:
- History rewrites require a forced push and coordination with collaborators. After a history rewrite, everybody should clone afresh.
- Rotating the key is mandatory — rewritten history may not remove all cached mirrors (e.g., forks, copies, or caches).

---

## Deployment

For production, run the Flask app using a WSGI server like `gunicorn` or `waitress` (Windows). Example using `gunicorn` on Linux:

```bash
pip install gunicorn
gunicorn -w 4 -b 0.0.0.0:8000 app:app
```

On Windows you can use `waitress`:

```cmd
pip install waitress
python -m waitress --listen=0.0.0.0:8000 app:app
```

Remember to set environment variables and disable `debug=True`.

---

## Contributing

- Feel free to open issues or PRs. Keep changes focused and add tests where applicable.
- If you add new dependencies, add them to `requirements.txt`.

---

## Credits

Made with 💗 by `chhuparustam`.

UI assets: Font Awesome and Google Fonts. Weather icons provided by OpenWeatherMap.

---
