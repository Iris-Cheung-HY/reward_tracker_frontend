import React from 'react';
import Card from './Card.tsx';
import './CardList.css';
import { useNavigate } from 'react-router-dom';

const backendUrl = import.meta.env.VITE_APP_BACKEND_URL;

interface BankCreditCard {
    id: number;
    cardImage: string;
    cardName: string;
}

interface UserCard {
    id: number;
    lastFourDigits: string;
    bankCreditCard: BankCreditCard;
}

interface CardListProps {
    cards: UserCard[];
    onDelete: (id: number) => void;
    onAdd: () => void;
}


const CardList: React.FC<CardListProps> = ({ cards, onDelete, onAdd }) => {
    return (
        <div className="card-list-container">
            <ul className="card__list no-bullet">
                <li className="card-item add-card-placeholder" onClick={onAdd}>
                    <div className="add-button-inner">
                        <span className="plus-icon">+</span>
                        <p>Add Card</p>
                    </div>
                </li>

                {cards.map((card) => (
                    <Card
                        key={card.id}
                        id={card.id}
                        image={card.bankCreditCard.cardImage} 
                        lastFourDigits={card.lastFourDigits}
                        onDelete={onDelete}
                    />
                ))}
            </ul>
        </div>
    );
}

export default CardList
