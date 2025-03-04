# Sticky Notes ToDo App

A lightweight drag-and-drop ToDo application built with vanilla ES6. This project demonstrates a range of front-end skills including DOM manipulation, functional programming with lenses, ES6 templating, CSS3 transitions, and robust REST API calls using fetch (with simulated responses). The app also includes new todo creation, inline editing, deletion, and accessibility enhancements.

## Features

- **Data Model & Functional Lenses:**  
  Uses a robust lens approach (in `data.js`) to handle immutable updates and maintain referential transparency.

- **UI Rendering & ES6+ Templating:**  
  Renders todos as sticky notes using template literals. The UI supports inline editing (double-click to edit), deletion, and real-time updates.

- **Drag-and-Drop Functionality:**  
  Supports drag-and-drop reordering with visual drop-target highlights and optimized partial DOM updates.

- **CSS3 Animations & Transitions:**  
  Sticky notes have hover transitions, subtle rotations, shadows, and smooth state changes.

- **REST API Calls with Fetch:**  
  All API calls (GET, PUT, POST, DELETE) use the native fetch API. Simulated responses are provided when the API fails, ensuring the frontend continues to work during development or demo.

- **Robust Error Handling & Accessibility:**  
  Errors are shown via a notification component. The app includes ARIA roles, keyboard navigation support, and proper labels to enhance accessibility.

- **Testing:**  
  Jest tests (with Babel) mock the fetch API for a reliable testing experience.

- **Dockerized Deployment with NGINX:**  
  The app is containerized using Docker and NGINX for easy deployment.

## Project Structure

```
sticky-notes-todo-app/
├── src/
│   ├── data.js            # Data model and lens implementation
│   ├── dom.js             # DOM rendering and helper functions (sticky notes UI)
│   ├── main.js            # Main application logic (event handling, state management)
│   └── services.js        # API service functions (fetch, simulated responses)
├── tests/
│   └── services.test.js   # Jest tests for API functions
├── index.html             # Main HTML file
├── styles.css             # CSS for the sticky notes and app layout
├── Dockerfile             # Docker configuration for NGINX container
├── docker-compose.yml     # Docker Compose configuration for running the app
├── nginx/default.conf     # Custom NGINX configuration (optional)
├── babel.config.js        # Babel configuration for Jest
├── package.json           # Project manifest (scripts, dependencies)
└── README.md              # This file
```

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v14 or later recommended)
- [Docker](https://www.docker.com/get-started) (latest version recommended)
- [Docker Compose](https://docs.docker.com/compose/install/)

### Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/Arkay92/todo.git
   cd todo
   ```

2. Install the dependencies:

   ```bash
   npm install
   ```

### Running the Application

#### Option 1: Run with Local Development Server

You can use the included `serve` package to run a local static server:

```bash
npm start
```

Then open [http://localhost:5000](http://localhost:5000) (or the port indicated by the server) in your browser to use the app.

#### Option 2: Run with Docker and NGINX

To build and run the application using Docker, follow these steps:

1. Build and run the Docker container using Docker Compose:

   ```bash
   docker-compose up --build
   ```

2. Open the app in your browser at:

   ```
   http://localhost:8080
   ```

This will serve the app using an NGINX container.

### Running Tests

Jest is used for testing the API service functions. To run tests:

```bash
npm test
```

This will run all tests in the `tests/` folder. The tests mock fetch calls to simulate API responses.

## Design Decisions & Further Improvements

- **Functional Lenses:**  
  The lens implementation in `data.js` allows for immutable updates of nested data, a critical aspect of functional programming.

- **Partial DOM Updates:**  
  Instead of re-rendering the entire list on every change, the app updates only the changed elements (e.g., checkbox toggles, inline editing), enhancing performance.

- **Simulated API Responses:**  
  To ensure the app remains responsive even if the backend fails, all API endpoints simulate a fallback response. This approach simplifies development and demoing.

- **Accessibility:**  
  The app includes ARIA attributes, focus management, and semantic HTML to improve usability for all users.

- **Testing:**  
  API functions are fully tested using Jest with Babel, ensuring code quality and maintainability.

- **Dockerization:**  
  The application is packaged with Docker and uses NGINX to serve static files. This makes deployment more reliable and scalable.
