import React from 'react';

interface CardProps {
    id: number;
    image: string;
    lastFourDigits: string;
    onDelete: (id: number) => void;
}

const Card: React.FC<CardProps> = ({ id, image, lastFourDigits, onDelete }) => {
    return (
        <li className="card-item">
            <div className="card-container" style={{ position: 'relative' }}>
                <button 
                    className="delete-button" 
                    onClick={() => onDelete(id)}
                >
                    &times;
                </button>
                
                <img src={image} alt="Credit Card" className="card-image" />
                
                <div className="card-digits">
                    {lastFourDigits}
                </div>
            </div>
        </li>
    );
};

export default Card;