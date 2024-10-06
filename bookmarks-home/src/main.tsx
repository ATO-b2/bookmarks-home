import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)

chrome.bookmarks.create(
  {'parentId': bookmarksBar.id, 'title': 'Bookmarks Extension'},
  function(newFolder) {
    console.log("added folder: " + newFolder.title);
  },
);