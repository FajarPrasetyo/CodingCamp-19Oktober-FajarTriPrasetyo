# Personal Productivity Dashboard 🚀

A clean, modern, and minimal client-side productivity dashboard web application built with pure HTML, CSS, and Vanilla JavaScript.

🌐 **Live Demo (Langsung Bisa Dibuka Siapapun):**  
- **Instant Preview Link:** [https://raw.githack.com/FajarPrasetyo/CodingCamp-19Oktober-FajarTriPrasetyo/main/index.html](https://raw.githack.com/FajarPrasetyo/CodingCamp-19Oktober-FajarTriPrasetyo/main/index.html)  
- **GitHub Pages Sub-Path:** [https://fajarprasetyo.github.io/CodingCamp-19Oktober-FajarTriPrasetyo/](https://fajarprasetyo.github.io/CodingCamp-19Oktober-FajarTriPrasetyo/)  
*(Catatan: URL sub-path ini tidak mengganggu/menimpa root domain portofolio https://fajarprasetyo.github.io/)*

---

## 📸 Overview
This web application is designed to help you stay focused, organized, and productive throughout the day with a clean aesthetic and responsive user interface.

---

## ✨ Features

- 🕒 **Real-Time Clock & Dynamic Greeting**:
  - Displays current time (`HH:MM:SS`) updated every second.
  - Shows full date format (e.g., *Tuesday, January 27, 2026*).
  - Dynamic greeting based on the hour (*Good Morning*, *Good Afternoon*, *Good Evening*, *Good Night*).
  - 👤 **Custom Name**: Click on your name or the edit icon (✏️) to customize your name. Persisted in `localStorage`.

- 🌓 **Light & Dark Mode**:
  - Smooth theme switcher with custom CSS variable tokens.
  - Midnight slate aesthetic for dark mode and lilac/violet gradient for light mode.
  - Remembers your theme preference in `localStorage`.

- ⏱️ **Focus Timer (Pomodoro)**:
  - Preset durations: **25m**, **15m**, **50m**, and **Custom** (1 - 180 minutes).
  - Clean controls: **Start**, **Stop** (Pause/Resume), and **Reset**.
  - Web Audio chime sound and alert notification upon session completion.

- ✅ **To-Do List (Tasks)**:
  - **Add Tasks**: Quick input with Enter key support.
  - 🚫 **Prevent Duplicates**: Case-insensitive duplicate task prevention with visual alert.
  - ✏️ **Edit Tasks**: Inline task editing with Save / Cancel controls or Enter key.
  - 🗹 **Mark Done**: Checkbox toggle with strikethrough styling.
  - 🗑️ **Delete Tasks**: Remove tasks with one click.
  - 🔀 **Sort Tasks**: Sort by *Newest*, *Oldest*, *A-Z (Alphabetical)*, and *Active first*.
  - Full persistence using browser `localStorage`.

- 🔗 **Quick Links**:
  - One-click launch buttons for favorite websites in a new tab.
  - Pre-populated with *Google*, *Gmail*, and *Calendar*.
  - Add new links with custom name and URL (auto-handles `https://`).
  - Delete links with the `×` button.
  - Persisted in `localStorage`.

---

## 🛠️ Tech Stack & Constraints
- **HTML5**: Semantic document structure.
- **CSS3**: Vanilla CSS with modern flexbox/grid, custom properties (CSS variables), and glassmorphism touches.
- **Vanilla JavaScript**: Pure JS (ES6+), zero external libraries or frameworks.
- **Storage**: Browser Local Storage API (100% client-side, no backend required).
- **Folder Rule**:
  - Only 1 CSS file inside `css/` (`css/style.css`)
  - Only 1 JS file inside `js/` (`js/app.js`)

---

## 📂 Project Structure
```text
CodingCamp-19Oktober-FajarTriPrasetyo/
├── index.html          # Main HTML structure
├── README.md           # Documentation & instructions
├── Open-Dashboard.bat  # Quick double-click launcher for Windows
├── css/
│   └── style.css       # All styles and themes
└── js/
    └── app.js          # Core application logic
```

---

## 🚀 How to Run Locally

### Option 1: Direct File
Simply double-click `index.html` (or `Open-Dashboard.bat`) to open it directly in any modern web browser (Chrome, Edge, Firefox, Safari).

### Option 2: Local HTTP Server (Optional)
If you have Node.js or Python installed:
```bash
# Using Python
python -m http.server 3000

# Using Node.js
npx serve .
```
Then visit `http://localhost:3000` in your browser.
