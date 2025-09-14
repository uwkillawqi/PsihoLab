
# NERVE PSYCHE LAB Blueprint

## Overview

This project is an interactive web application designed to provide psychological analyses of the characters from the anime series Neon Genesis Evangelion. The application presents detailed character profiles, including their psychological stats, in-depth analysis, and a visual representation of their mental state in the form of a radar chart.

## Implemented Features

### Design and Styling
- **Modern Aesthetics**: The application features a dark, futuristic theme inspired by the NERV interface from the series.
- **Custom Fonts**: Uses `Roboto Mono` for body text and `Share Tech Mono` for headings to create a technical,monospace aesthetic.
- **Dynamic Background**: The background color of the page changes dynamically based on the selected character.
- **Responsive Layout**: The layout is designed to be responsive and adapt to different screen sizes.

### Interactivity
- **Character Carousel**: A top-level navigation allows users to switch between different character profiles.
- **Dynamic Content**: The main content area is dynamically updated with the selected character's information without a page reload.
- **Interactive Charts**: Character stats are visualized using a Chart.js radar chart, providing a quick overview of their psychological state.

## Current Task: Image Gallery

### Plan
1.  **Update `data.json`**: Add a new `gallery` array to each character object, containing URLs for multiple images.
2.  **Modify `index.html`**: Replace the static `<img>` element with a new HTML structure for an image gallery. This will include a container for the slides, navigation arrows, and indicator dots.
3.  **Update `style.css`**: Add CSS for the gallery, including:
    -   Styling for the gallery container, slides, and navigation elements.
    -   Fade-in-out transitions for smooth image changes.
    -   Active states for the indicator dots.
4.  **Update `main.js`**: Implement the gallery logic:
    -   A function to render the gallery for the selected character.
    -   Event listeners for the navigation arrows and indicator dots.
    -   An interval for automatic image sliding.
    -   A function to reset the interval when the user interacts with the controls.
