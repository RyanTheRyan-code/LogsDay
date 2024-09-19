import React from 'react';
import logo from './logo.png';
import Header from './Header';
import '../App.css';
import NavBar from '../NavBar';

function Home() {
    


  return (
    <div className="Home">
      <NavBar />
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <Header />
      </header>
    </div>
  );
}

export default Home;
