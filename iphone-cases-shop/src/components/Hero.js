import React from 'react';
import './Hero.css';
import logo from '../assets/images/logo.jpg';

const Hero = () => {
  return (
    <section className="hero">
      <div className="hero-container">
        <div className="hero-content">
          <h2 className="hero-title">Чохли преміум якості для вашого iPhone</h2>
          <p className="hero-subtitle">Захист та стиль у кожному чохлі</p>
          <button className="hero-button">Переглянути каталог</button>
        </div>
        <div className="hero-image">
          <div className="placeholder-image">
            <img src={logo} alt="iPhoneCases" className="logo-image" />
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;