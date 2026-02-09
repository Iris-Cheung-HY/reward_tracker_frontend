import React, { useState, useEffect, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import Card from '../components/Card';
import TransactionList from '../components/TransactionList';
import AddTransactionModal from '../components/AddTransactionModal';
import BenefitsList from '../components/BenefitsList';

const backendUrl = import.meta.env.VITE_APP_BACKEND_URL;

interface BankCreditCard {
id: number;
cardImage: string;
cardName: string;
annualFee: number | string;
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
        <div className="container py-5 mt-5">
            
            <div className="row g-5 align-items-start">
                
                <div className="col-lg-4">
                    <div className="sticky-top" style={{ top: '100px' }}>
                        <div className="mb-4">
                            <h2 className="fw-bold text-dark">{cardData?.bankCreditCard.cardName}</h2>
                            <span className="badge bg-primary-subtle text-primary rounded-pill px-3">Active Card</span>
                        </div>

                        <div className="shadow-lg rounded-4 overflow-hidden">
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

                        <div className="mt-4 row g-2">
                            <div className="col-6">
                                <div className="p-3 bg-white border rounded-3 shadow-sm">
                                    <small className="text-muted d-block fw-bold">ANNUAL FEE</small>
                                    <span className="h5 fw-bold text-danger">${cardData?.bankCreditCard.annualFee}</span>
                                </div>
                            </div>
                            <div className="col-6">
                                <div className="p-3 bg-white border rounded-3 shadow-sm">
                                    <small className="text-muted d-block fw-bold">LAST 4 Digit</small>
                                    <span className="h5 fw-bold">{cardData?.lastFourDigits}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="col-lg-8">
                    <div className="card border-0 shadow-sm rounded-4 overflow-hidden">
                        <div className="card-header bg-white border-0 pt-4 px-4">
                            <div className="d-flex justify-content-between align-items-center">
                            </div>
                        </div>
                        <div className="card-body p-4">
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
                </div>
            </div>

            <div className="row mt-5">
                <div className="col-12">
                    <div className="card border-0 shadow-sm rounded-4 bg-light p-4">
                        <div className="d-flex align-items-center gap-2 mb-4 border-bottom pb-3">
                        </div>
                        {cardId && (
                            <BenefitsList userCardId={cardId} key={`benefits-${refreshKey}`} />
                        )}
                    </div>
                </div>
            </div>
            
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