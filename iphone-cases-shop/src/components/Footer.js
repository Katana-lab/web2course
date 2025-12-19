import React from 'react';
import './Footer.css';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-section">
          <h3>iPhoneCases</h3>
          <p>Якісні чохли для iPhone з доставкою по всій Україні</p>
        </div>
        <div className="footer-section">
          <h4>Категорії</h4>
          <ul>
            <li><a href="#">Чохли для iPhone 15</a></li>
            <li><a href="#">Чохли для iPhone 14</a></li>
            <li><a href="#">Чохли для iPhone 13</a></li>
            <li><a href="#">Аксесуари</a></li>
          </ul>
        </div>
        <div className="footer-section">
          <h4>Клієнтам</h4>
          <ul>
            <li><a href="#">Доставка та оплата</a></li>
            <li><a href="#">Гарантія</a></li>
            <li><a href="#">Повернення</a></li>
            <li><a href="#">Контакти</a></li>
          </ul>
        </div>
        <div className="footer-section">
          <h4>Контакти</h4>
          <p>📞 (044) 123-45-67</p>
          <p>📧 info@iphonecases.ua</p>
          <p>🕒 9:00 - 21:00 щодня</p>
        </div>
      </div>
      <div className="footer-bottom">
        <p>&copy; 2024 iPhoneCases. Всі права захищені.</p>
      </div>
    </footer>
  );
};

export default Footer;