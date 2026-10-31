Framework: React
React version: ^18.2.0
TypeScript/JavaScript: JavaScript
Vite/CRA/other: Vite
package manager: npm
build scripts: vite build
Application Entry: src/main.jsx

Main entry: src/main.jsx
Root component: App.jsx
Routing configuration: react-router-dom in App.jsx
Global CSS: index.css
Theme system: CSS variables + Custom Glassmorphism (.nexus-surface, .spatial-card)
API client: axios (Service/apiCalls.js)
State management: React Context/Hooks

Pages:
 /
 /search (via Dashboard)
 /flight-details (Modal/Component)
 /seats (via Component)
 /booking
 /payment
 /admin

Components:
FlightSearch
FlightCard
SeatMap
BookingSummary
Payment
AdminDashboard
UserDashboard

CSS:
Total CSS files: 1 (index.css)
Approximate CSS size: Medium
Duplicate styling detected: Minimal
Unused styling detected: Minimal
Hardcoded colors: Replaced with design tokens
!important usage: Minimal
Responsive rules: Standard media queries
Animation system: CSS transitions/keyframes
