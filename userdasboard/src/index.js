import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { BrowserRouter as Router } from 'react-router-dom';

// Import Bootstrap CSS and Icons
import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import HomePageComponent from './Components/HomePageComponent';

// Create the root element
const root = ReactDOM.createRoot(document.getElementById('root'));

// Render the App component
root.render(
  <React.StrictMode>
    <Router>
      <App/>
    </Router>
  </React.StrictMode>
);

// Measure performance (optional)
reportWebVitals();
