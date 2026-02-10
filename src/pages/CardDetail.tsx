import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import Card from '../components/Card';
import TransactionList from '../components/TransactionList';
import AddTransactionModal from '../components/AddTransactionModal';
import BenefitsList from '../components/BenefitsList';
import "./CardDetail.css";

const backendUrl = import.meta.env.VITE_APP_BACKEND_URL;

const getCardDetailAPI = (id: number) => {
    return axios.get(`${backendUrl}/usercreditcard/${id}`)
        .then(response => response.data)
        .catch(error => console.log(error));
};

const getTransactionsAPI = (userId: number, cardId: number) => {
    return axios.get(`${backendUrl}/transactionrecords/user/${userId}/card/${cardId}`)
        .then((response: any) => response.data.content || response.data || [])
        .catch(error => {
            console.log(error);
        });
};

const addTransactionAPI = (userId: number, cardId: number, payload: any) => {
    return axios.post(`${backendUrl}/transactionrecords/user/${userId}/card/${cardId}`, payload)
        .then(response => response.data)
        .catch(error => console.log("Add Transaction Error:", error));
};

const deleteTransactionAPI = (id: number) => {
    return axios.delete(`${backendUrl}/transactionrecords/${id}`)
        .then(response => response.data)
        .catch(error => console.log(error));
};


const CardDetail: React.FC = () => {
    const { cardId } = useParams<{ cardId: string }>();
    const [cardData, setCardData] = useState<any>(null);
    const [userId, setUserId] = useState<number | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [refreshTrigger, setRefreshTrigger] = useState(0);


    const loadPageData = () => {
        const storedUser = localStorage.getItem('user');
        if (!storedUser || !cardId) return;

        const user = JSON.parse(storedUser);
        setUserId(user.id);

        getCardDetailAPI(Number(cardId)).then(data => {
            setCardData(data);
        });
    };

    useEffect(() => {
        loadPageData();
    }, [cardId, refreshTrigger]);

    const handleAddSubmit = (formData: any) => {
        if (!userId || !cardId) return;

        const payload = {
            date: formData.date,
            amount: formData.amount,
            description: formData.description,
            merchantType: formData.category || formData.merchantType
        };

        addTransactionAPI(userId, Number(cardId), payload).then(() => {
            setIsModalOpen(false);
            setRefreshTrigger(prev => prev + 1);
        });
    };

    const handleDelete = (id: number) => {
        if (window.confirm("Delete this transaction?")) {
            deleteTransactionAPI(id).then(() => {
                setRefreshTrigger(prev => prev + 1);
            });
        }
    };

    return (
        <div id="card-detail-page-wrapper">
            <div id="card-detail-grid">
                
                <aside id="detail-sidebar">
                    <div className="sidebar-content-sticky">
                        <header className="sidebar-header">
                            <h1>{cardData?.bankCreditCard.cardName}</h1>
                            <span className="status-badge">Active Card</span>
                        </header>

                        <div className="main-card-visual">
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

                        <div className="sidebar-stats">
                            <div className="detail-stat-box">
                                <label>ANNUAL FEE</label>
                                <p className="text-danger">${cardData?.bankCreditCard.annualFee}</p>
                            </div>
                            <div className="detail-stat-box">
                                <label>CARD DIGITS</label>
                                <p>**** {cardData?.lastFourDigits}</p>
                            </div>
                        </div>
                    </div>
                </aside>

                <section id="detail-main-content">
                    
                    <div className="detail-content-block">
                        <div className="block-header">
                            <h3>Transaction History</h3>
                            <button className="btn-add-action" onClick={() => setIsModalOpen(true)}>
                                + Add New
                            </button>
                        </div>
                        
                        {userId && cardId && (
                            <TransactionList 
                                key={`t-${refreshTrigger}`} 
                                userId={userId} 
                                cardId={Number(cardId)}
                                onDelete={handleDelete}
                            />
                        )}
                    </div>

                    <div className="detail-content-block benefits-wrapper">
                        <div className="block-header">
                            <h3>Rewards & Benefits Progress</h3>
                        </div>
                        {cardId && (
                            <BenefitsList 
                                userCardId={cardId} 
                                key={`b-${refreshTrigger}`} 
                            />
                        )}
                    </div>
                </section>
            </div>

            {isModalOpen && (
                <AddTransactionModal 
                    onAddTransactionSubmit={handleAddSubmit}
                    onClose={() => setIsModalOpen(false)}
                    cardId={Number(cardId)}
                />
            )}
        </div>
    );
};

export default CardDetail;