import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

// Diagnostic check for document mode
console.log('--- Initial App Load ---');
console.log('Document compat mode:', document.compatMode);
console.log('Doctype:', document.doctype);
if (document.compatMode !== 'CSS1Compat') {
    console.warn('⚠️ WARNING: Document is not in standards mode!');
    console.warn('Ensure <!DOCTYPE html> is the very first line of your HTML file.');
}
console.log('-------------------------');


const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

const root = ReactDOM.createRoot(rootElement);
root.render(
  <App />
);