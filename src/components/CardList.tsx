import React from 'react';
import Card from './Card.tsx';
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

        <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4">
            

            <div className="col">
                <div 
                    className="card h-100 border-0 bg-body-tertiary d-flex align-items-center justify-content-center shadow-sm transition-all add-card-pill-container"
                    style={{ 
                        aspectRatio: '1.58 / 1', 
                        borderRadius: '16px',
                        cursor: 'default'
                    }}
                >

                    <button 
                        className="btn btn-white shadow-sm rounded-pill px-4 py-2 fw-bold text-primary d-flex align-items-center border"
                        onClick={onAdd}
                        style={{ transition: 'all 0.2s ease' }}
                    >
                        <i className="bi bi-plus-lg me-2 fw-bold"></i>
                        Add Card
                    </button>
                </div>
            </div>

            {cards.map((card) => (
                <div className="col" key={card.id}>
                    <Card
                        id={card.id}
                        image={card.bankCreditCard.cardImage} 
                        lastFourDigits={card.lastFourDigits}
                        openMonth={card.openMonth}
                        onDelete={onDelete}
                        onClick={() => onCardClick?.(card.id)}
                    />
                </div>
            ))}
        </div>
    );
}

export default CardList
