import React from 'react';

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
        <li className="card-item">
            <div className="card-image-wrapper" style={{ position: 'relative', cursor: 'pointer' }} onClick={onClick}>
                
                <button 
                    className="delete-x-btn" 
                    onClick={(e) => {
                        e.stopPropagation();
                        onDelete(id);
                    }}
                >
                    &times;
                </button>
                
                <img 
                    src={image} 
                    alt="Credit Card" 
                    className="card-image" 
                />
                
                <div className="card-digits">
                    {lastFourDigits}
                </div>
                
                <div className="card-month">
                    {openMonth}
                </div>
            </div>
        </li>
    );
};

export default Card;