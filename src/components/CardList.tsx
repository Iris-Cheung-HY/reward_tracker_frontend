import React from 'react';
import Card from './Card.tsx';
import "./CardList.css"

interface BankCreditCard {
    id: number;
    cardImage: string;
    cardName: string;
}

interface UserCard {
    id: number;
    lastFourDigits: string;
    bankCreditCard: BankCreditCard;
    openMonth: string;
}

interface CardListProps {
    cards: UserCard[];
    onDelete: (id: number) => void;
    onAdd: () => void;
    onCardClick?: (id: number) => void;
}

const CardList: React.FC<CardListProps> = ({ cards, onDelete, onAdd, onCardClick }) => {
    return (
        <div id="cards-grid-wrapper">
            
            <div className="add-card-item" onClick={onAdd}>
                <div className="add-card-inner">
                    <span className="add-icon">+</span>
                    <p>Add New Card</p>
                </div>
            </div>

            {cards.map((card) => (
                <Card
                    key={card.id}
                    id={card.id}
                    image={card.bankCreditCard.cardImage} 
                    lastFourDigits={card.lastFourDigits}
                    openMonth={card.openMonth}
                    onDelete={onDelete}
                    onClick={() => onCardClick?.(card.id)}
                />
            ))}
        </div>
    );
}

export default CardList;