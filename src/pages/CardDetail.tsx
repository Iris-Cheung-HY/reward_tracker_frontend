import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import './CardDetail.css';
import Card from '../components/Card';
import TransactionList from '../components/TransactionList';
import AddTransactionModal from '../components/AddTransactionModal';

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

interface TransactionsDetail {
    id: number;
    date: string;
    category: string;
    amount: number;
    description: string;
}

const CardDetail: React.FC = () => {
    const { cardId } = useParams<{ cardId: string }>();
    const [cardData, setCardData] = useState<UserCard | null>(null);
    const [userId, setUserId] = useState<number | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    const handleDeleteTransaction = async (id: number) => {
        try {
            await axios.delete(`${backendUrl}/transactionrecords/${id}`);
            fetchUsertransactions();
            window.location.reload();
        } catch (error) {
            console.error("Delete failed:", error);
        }
    };

    const fetchUserSpecificCards = async (id: number) => {
        try {
            setIsLoading(true);
            const res = await axios.get(`${backendUrl}/usercreditcard/${id}`);
            setCardData(res.data);
        } catch (error) {
            console.error("Error fetching cards:", error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        if (storedUser && cardId) {
            const user = JSON.parse(storedUser);
            setUserId(user.id);
            fetchUserSpecificCards(Number(cardId));
        }
    }, [cardId]);


    return (
        <div className="card-details-page">
            <div className="top-section">
                <div className="card-visual">
                    {cardData && (
                        <Card 
                            id={cardData.id}
                            image={cardData.bankCreditCard.cardImage} 
                            lastFourDigits={cardData.lastFourDigits}
                            openMonth={cardData.openMonth}
                            onDelete={() => {}}
                        />
                    )}
                </div>

                <div className="transaction-mini-log">
                    {userId && cardId && (
                        <TransactionList 
                            userId={userId} 
                            cardId={Number(cardId)}
                            onDelete={handleDeleteTransaction}
                            onAdd={() => setIsModalOpen(true)}
                        />
                    )}
                </div>
            </div>
        </div>
    );
}

export default CardDetail;