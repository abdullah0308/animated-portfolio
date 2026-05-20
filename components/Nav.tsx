'use client'

import { openMenu } from './MenuOverlay'

export default function Nav() {
  return (
    <header className="nav">
      <a href="/" className="nav-logo">Abdullah Mohamed</a>

      <div className="nav-right">
        <ul className="nav-links">
          <li><a href="#work">Works</a></li>
          <li><a href="#about">About</a></li>
          <li><a href="https://www.linkedin.com/in/abdullah-mohamed-05426931a/" target="_blank" rel="noopener">Reach out</a></li>
        </ul>
        <button className="nav-menu-btn" onClick={openMenu}>
          Menu
        </button>
      </div>
    </header>
  )
}
