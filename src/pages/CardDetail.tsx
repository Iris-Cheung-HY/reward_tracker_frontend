import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import './CardDetail.css';
import Card from '../components/Card';
import TransactionList from '../components/TransactionList';

const backendUrl = import.meta.env.VITE_APP_BACKEND_URL;

interface BankCreditCard {
    id: number;
    cardImage: string;
    cardName: string;
}

interface UserCard {
    id: number;
    lastFourDigits: string;
    openMonth: string;
    bankCreditCard: BankCreditCard;
}

const CardDetail: React.FC = () => {
    const { cardId } = useParams<{ cardId: string }>(); 
    const [userId, setUserId] = useState<number | null>(null);
    const [cardData, setCardData] = useState<UserCard | null>(null);

    useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
        setUserId(JSON.parse(storedUser).id);
    }
    }, []);

    return (
        <div className="card-details-page">
            <div className="top-section">
                <div className="card-visual">
                    {cardData && <Card card={cardData} />} 
                </div>

                <div className="transaction-mini-log">
                    {userId && cardId && (
                        <TransactionList userId={userId} cardId={Number(cardId)} />
                    )}
                </div>
            </div>
        </div>
    );
}

export default CardDetail;