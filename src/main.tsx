// import React from 'react';
// import ReactDOM from 'react-dom/client';
// import App from './App';
// // import './index.css';
// // import './styles.css';

// ReactDOM.createRoot(
//   (() => {
//     const app = document.createElement('div');
//     document.body.append(app);
//     return app;
//   })(),
// ).render(
//   <React.StrictMode>
//     <App />
//   </React.StrictMode>,
// );





import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
// The "?inline" tells Vite: "Don't inject this globally. Just give me the text."
import cssText from './styles.css?inline'; 

const MOUNT_ID = 'leetcode-detective-root';

// 1. Create a container for our Shadow DOM
const container = document.createElement('div');
container.id = MOUNT_ID;
document.body.append(container);

// 2. Create the Shadow DOM (The invisible barrier)
const shadow = container.attachShadow({ mode: 'open' });

// 3. Inject our styles INSIDE the shadow DOM
const styleTag = document.createElement('style');
styleTag.textContent = cssText;
shadow.append(styleTag);

// 4. Create a root element for React inside the shadow DOM
const appRoot = document.createElement('div');
shadow.append(appRoot);

// 5. Mount React
ReactDOM.createRoot(appRoot).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);