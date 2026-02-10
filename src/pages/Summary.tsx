import React, { useState, useEffect } from 'react';
import axios from 'axios';
import AnnualFeeTotal from '../components/AnnualFeeTotal';
import SummaryTransaction from '../components/SummaryTransaction';
import NewCardForm from '../components/NewCardForm';
import CardList from '../components/CardList';
import AddCardModal from '../components/AddCardModalSummary.js';
import { useNavigate } from 'react-router-dom';
import './Summary.css';

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

interface NewCardFormData {
    lastFourDigits: string;
    bankCardId: number | string;
    cardType: string;
    openMonth: string;
}

const getUserCardsAPI = (userId: number) => {
    return axios.get(`${backendUrl}/usercreditcard/user/${userId}`)
        .then(response => {         
            const cardsData = response.data.content ? response.data.content : response.data;
            return cardsData;
        })
        .catch(error => {
            console.log(error);
        });
};


const deleteCardAPI = (id: number) => {
    return axios.delete(`${backendUrl}/usercreditcard/${id}`)
    .then(response => response.data)
    .catch(error => console.log(error));
};

const Summary: React.FC = () => {
    const [cardsData, setCardsData] = useState<UserCard[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const navigate = useNavigate();

    const viewCardDetails = (id: number) => {
    navigate(`/card/${id}`);
    };

    const loadDashboard = () => {
        const storedUser = localStorage.getItem('user');
        if (!storedUser) return;
        const user = JSON.parse(storedUser);

        setIsLoading(true);
        getUserCardsAPI(user.id).then(data => {
            setCardsData(data || []);
            setIsLoading(false);
        });
    };

    useEffect(() => {
        loadDashboard();
    }, []);

    const handleDeleteCard = (id: number) => {
        deleteCardAPI(id).then(() => {
            loadDashboard(); 
            alert("Card deleted successfully!");
        });
    };

    const handleAddCard = (formData: NewCardFormData) => {
        const storedUser = localStorage.getItem('user');
        if (!storedUser) return;
        const user = JSON.parse(storedUser);

        axios.post(`${backendUrl}/usercreditcard/user/${user.id}`, formData)
            .then(() => {
                setIsModalOpen(false);
                loadDashboard();
                alert("Card added!");
            })
            .catch(err => console.log(err));
    };

    return (
        <div id="summary-page-container">
            <header id="summary-header">
                <h1>My Wallet Dashboard</h1>
            </header>

            <div id="summary-stats-banner">
                <div className="stat-item-wrapper left">
                    <AnnualFeeTotal />
                </div>
                <div className="stat-item-wrapper right">
                    <SummaryTransaction />
                </div>
            </div>

            <section id="my-cards-section">
                <div id="section-header">
                    <h2>My Credit Cards</h2>
                </div>
                
                <CardList 
                    cards={cardsData} 
                    onDelete={handleDeleteCard} 
                    onCardClick={viewCardDetails} 
                    onAdd={() => setIsModalOpen(true)}
                />
            </section>

            {isModalOpen && (
                <AddCardModal
                    onAddCardSubmit={handleAddCard}
                    onClose={() => setIsModalOpen(false)}
                />
            )}
        </div>
    );
};
export default Summary;