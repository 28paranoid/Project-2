import React from 'react';
import DrinkCanvas from './DrinkCanvas';

const DrinkCard = ({ drink, onClick }) => {
  return (
    <a href="#" className="card drink-option-card" onClick={(e) => { e.preventDefault(); onClick(); }} aria-label={`Select ${drink.name} for ${drink.minutes} minutes`}>
      <div className="badge" style={{ backgroundColor: drink.badgeClr, color: '#1C1E26' }}>{drink.badge}</div>
      <DrinkCanvas drink={drink} prog={0} width={80} />
      <div className="drink-title">{drink.name}</div>
      <div className="drink-mins">{drink.minutes} MIN &bull; {drink.tag}</div>
    </a>
  );
};

export default DrinkCard;