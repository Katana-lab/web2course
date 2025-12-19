import React from 'react';
import { Link } from 'react-router-dom';
import './Navigation.css';

const Navigation = () => {
  const categories = [
    'Чехли для iPhone',
    'Скло для iPhone',
    'Аксесуари',
    'Подарункові набори',
    'Розпродаж',
    'Новинки'
  ];

  return (
    <nav className="navigation">
      <div className="nav-container">
        <ul className="nav-menu">
          <li className="nav-item">
            <Link to="/catalog" className="nav-link">Каталог</Link>
          </li>
          {categories.map((category, index) => (
            <li key={index} className="nav-item">
              <a href="#" className="nav-link">{category}</a>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
};

export default Navigation;