import React from 'react';
import "./Card.css";

interface CardProps {
    id: number;
    image: string;
    lastFourDigits: string;
    openMonth: string;
    onDelete: (id: number) => void;
    onClick?: () => void;
}

const Card: React.FC<CardProps> = ({ id, image, lastFourDigits, openMonth, onDelete, onClick }) => {
    return (
        <div className="credit-card-item" onClick={onClick}>
            <button 
                className="delete-card-trigger" 
                onClick={(e) => {
                    e.stopPropagation();
                    onDelete(id);
                }}
            >
                &times;
            </button>

            <div className="card-media-wrapper">
                <img 
                    src={image} 
                    alt="Credit Card Display" 
                    className="card-artwork"
                />
                
                <div className="card-info-overlay">
                    <div className="card-details-row">
                        <span className="card-digits">
                            **** {lastFourDigits}
                        </span>
                        <span className="card-expiry-month">
                            {openMonth}
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Card;