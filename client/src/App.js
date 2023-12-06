import React, { useEffect } from 'react';
import logo from './img/highlights-full-logo.png';
import './App.css';
import {BrowserRouter as Router, Route, Link, Routes, Navigate} from 'react-router-dom';
import Events from './components/Events';
import Event from './components/Event';
import Lists from './components/Lists';
import Home from './components/Home';

const App = () => {
  useEffect(() => {
    const script = document.createElement('script');
  
    script.src = "https://kit.fontawesome.com/de672b1f53.js";
    script.async = true;
    script.crossOrigin = "anonymous";
  
    document.body.appendChild(script);
  
    return () => {
      document.body.removeChild(script);
    }
  }, []);

  return (
    <Router>
      <div className='App'>
        <header className='App-header'>
          <img src={logo} className='App-logo' alt='logo' />
          <h1 className='App-title'>
            Welcome to Highlights - a community driven Events Listing portal
          </h1>
          <Link className='marvel' to='/'>Home</Link>
          <Link className='marvel' to='/events/page/1'>
            Events
          </Link>
          <Link className='marvel' to='/saved'>
            Saved Lists
          </Link>
          <script src="https://kit.fontawesome.com/de672b1f53.js"></script>
        </header>
        <div className='App-body'>
          <Routes>
            <Route path='/' element={<Navigate to="/events/page/1" replace/>} />
            <Route path='/events/page/:pagenum' element={<Events />} />
            <Route path='/event/:id' element={<Event />} />
            <Route path='/saved' element={<Lists />} />

            <Route path='*' element={<Navigate to="/events/page/1" replace/>}></Route>
          </Routes>
        </div>
      </div>
    </Router>
  );
};

export default App;
