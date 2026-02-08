import React, { useState, useEffect, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import './CardDetail.css';
import Card from '../components/Card';
import TransactionList from '../components/TransactionList';
import AddTransactionModal from '../components/AddTransactionModal';
import BenefitsList from '../components/BenefitsList';

const backendUrl = import.meta.env.VITE_APP_BACKEND_URL;

interface BankCreditCard {
id: number;
cardImage: string;
cardName: string;
}

interface UserCard {
id: number;
lastFourDigits: string;
openMonth: number;
bankCreditCard: BankCreditCard;
}

interface TransactionDetail {
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
    const [refreshKey, setRefreshKey] = useState(0);


    const triggerRefresh = () => {
        setRefreshKey(prev => prev + 1);
    };

    const handleDeleteTransaction = async (id: number) => {
        try {
            await axios.delete(`${backendUrl}/transactionrecords/${id}`);
            triggerRefresh(); 
        } catch (error) {
            console.error("Delete failed:", error);
        }
    };

    const handleAddTransactionSubmit = async (formData: any) => {
        try {
            if (!userId || !cardId) return;

            const payload = {
                date: formData.date,
                amount: formData.amount,
                description: formData.description,
                merchantType: formData.category || formData.merchantType
            };

            const response = await axios.post(
                `${backendUrl}/transactionrecords/user/${userId}/card/${cardId}`, 
                payload
            );

            console.log("res:", response.data);

            setIsModalOpen(false);
            triggerRefresh(); 
        } catch (error) {
            console.error("error:", error);
        }
    };
    const fetchUserSpecificCards = useCallback(async (id: number) => {
        try {
            setIsLoading(true);
            const res = await axios.get(`${backendUrl}/usercreditcard/${id}`);
            setCardData(res.data); 
        } catch (error) {
            console.error("Error fetching card info:", error);
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        if (storedUser && cardId) {
            const user = JSON.parse(storedUser);
            setUserId(user.id);
            fetchUserSpecificCards(Number(cardId));
        }
    }, [cardId, fetchUserSpecificCards]);

    return (
        <div className="card-details-page">
            <div className="top-section">
                <div className="card-visual">
                    {cardData && (
                        <Card 
                            id={cardData.id}
                            image={cardData.bankCreditCard.cardImage} 
                            lastFourDigits={cardData.lastFourDigits}
                            openMonth={String(cardData.openMonth)}
                            onDelete={() => {}}
                        />
                    )}
                </div>

                <div className="transaction-mini-log">
                    {userId && cardId && (
                        <TransactionList 
                            key={`transactions-${refreshKey}`} 
                            userId={userId} 
                            cardId={Number(cardId)}
                            onDelete={handleDeleteTransaction}
                            onAdd={() => setIsModalOpen(true)}
                        />
                    )}
                </div>
            </div>

            {cardId && (
                <div className="benefits-section-wrapper" style={{ marginTop: '2rem' }}>
                    <BenefitsList userCardId={cardId} key={`benefits-${refreshKey}`} />
                </div>
            )}
            
            {isModalOpen && (
                <AddTransactionModal 
                    onAddTransactionSubmit={handleAddTransactionSubmit}
                    onClose={() => setIsModalOpen(false)}
                    cardId={Number(cardId)}
                />
            )}
        </div>
    );
}

export default CardDetail;