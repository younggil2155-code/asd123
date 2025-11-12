import React from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import Navigation from './components/Navigation';
import Page1 from './pages/Page1';
import Page2 from './pages/Page2';
import Page3 from './pages/Page3';
import Page4 from './pages/Page4';
import Page5 from './pages/Page5';
import Page6 from './pages/Page6';
import Page7 from './pages/Page7';
import Page8 from './pages/Page8';
import Page9 from './pages/Page9';

function App() {
  return (
    <HashRouter>
      <div className="min-h-screen flex items-center justify-center p-4 sm:p-6 lg:p-8">
        <div className="w-full max-w-3xl mx-auto bg-gray-900/80 backdrop-blur-sm rounded-2xl shadow-2xl p-6 sm:p-8">
          <Navigation />
          <Routes>
            <Route path="/" element={<Navigate to="/1" replace />} />
            <Route path="/1" element={<Page1 />} />
            <Route path="/2" element={<Page2 />} />
            <Route path="/3" element={<Page3 />} />
            <Route path="/4" element={<Page4 />} />
            <Route path="/5" element={<Page5 />} />
            <Route path="/6" element={<Page6 />} />
            <Route path="/7" element={<Page7 />} />
            <Route path="/8" element={<Page8 />} />
            <Route path="/9" element={<Page9 />} />
            <Route path="*" element={<Navigate to="/1" replace />} />
          </Routes>
        </div>
      </div>
    </HashRouter>
  );
}

export default App;
