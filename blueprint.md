# NERV PSYCHE LAB Blueprint

## Overview

A single-page application for the psychoanalytic analysis of "Evangelion" characters. The site has a minimal, techno, cyberpunk style, mimicking the NERV interfaces from the anime, and displays all information dynamically on the main page.

## Project Structure

*   `index.html`: Main HTML file
*   `style.css`: Main stylesheet
*   `main.js`: Main JavaScript file
*   `data.json`: JSON file containing all character data.
*   `assets/`: Folder for images

## Style and Design

*   **Color Palette:** Primarily a dark blue-black (`#0d1a26`) with white and accent colors for each character.
*   **Fonts:** `Roboto Mono` and `Share Tech Mono` for a monospace, technical feel.
*   **Layout:** A single-page layout. A header and intro are followed by a character carousel. Selecting a character dynamically populates the content sections below (Profile, Analysis, Summary) without a page reload.

## Features

*   **Dynamic Content:** All character information (profile, stats, analysis, charts) is loaded from `data.json` and dynamically rendered on the page using JavaScript.
*   **Character Carousel:** A horizontal row of character icons that, when clicked, updates the content displayed on the page.
*   **Dynamic Background Color:** The background color of the page changes to match the theme of the selected character.
*   **Content Sections:**
    1.  **Profile:** Displays the character's name, role, an image, a series of animated progress bars for psychometric stats, and a summary text.
    2.  **Analysis:** Shows a grid of cards with detailed analysis (e.g., defense mechanisms, trauma) and a list of keywords.
    3.  **Summary:** Features a radar chart visualizing the character's mental state using Chart.js.
*   **Implemented Characters:** Shinji Ikari, Asuka Langley Soryu, Rei Ayanami.

