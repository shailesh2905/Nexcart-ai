import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Home from './pages/Home';

function App() {
  return (
    <Router>
      <Header />
      <main className="main-content">
        <Routes>
          <Route path="/" element={<Home />} />
          {/* Add more routes here as we build them */}
        </Routes>
      </main>
      <footer className="glass" style={{ padding: '2rem', textAlign: 'center', marginTop: 'auto', borderRadius: '0' }}>
        <p>&copy; 2026 NexCart AI. All rights reserved.</p>
      </footer>
    </Router>
  );
}

export default App;
