import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Summary.css';
import AnnualFeeTotal from '../components/AnnualFeeTotal';
import SummaryTransaction from '../components/SummaryTransaction';
import NewCardForm from '../components/NewCardForm';
import CardList from '../components/CardList';
import AddCardModal from '../components/AddCardModalSummary.js';

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
}

const Summary: React.FC = () => {
    const [cards, setCards] = useState<UserCard[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const fetchUserCards = async () => {
        try {
            const storedUser = localStorage.getItem('user');
            if (!storedUser) return;
            const user = JSON.parse(storedUser);
            console.log("User in storage:", user, user.id);

            const res = await axios.get(`${backendUrl}/usercreditcard/user/${user.id}`);
            setCards(res.data);
        } catch (error) {
            console.error("Error fetching cards:", error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleDeleteCard = async (id: number) => {
            try {
                await axios.delete(`${backendUrl}/usercreditcard/${id}`);
                fetchUserCards();
                window.location.reload();
            } catch (error) {
                console.error("Delete failed:", error);
            }
    };

    const handleAddCard = async (formData: NewCardFormData) => {
        try {
            const storedUser = localStorage.getItem('user');
            if (!storedUser) return;
            const user = JSON.parse(storedUser);

            await axios.post(`${backendUrl}/usercreditcard/user/${user.id}`, {
                lastFourDigits: formData.lastFourDigits,
                bankCardId: formData.bankCardId,
                cardType: formData.cardType
            });

            alert("Card added successfully!");
            setIsModalOpen(false);
            fetchUserCards();
        } catch (error) {
            console.error("Failed to add card:", error);
            alert("Failed to add card. Please try again.");
        }
    };


    useEffect(() => {
        fetchUserCards();
    }, []);

    return (
        <div className="summary-page">
            <header className="summary-header">
                <h1>My Wallet Dashboard</h1>
            </header>

            <div className="summary-stats-container">
                <div className="annual-fee-item">
                    <AnnualFeeTotal />
                </div>
                <div className="transaction-summary-item">
                    <SummaryTransaction />
                </div>
            </div>

        <section className="cards-section">
                    <h2>My Credit Cards</h2>
                    <CardList 
                        cards={cards} 
                        onDelete={handleDeleteCard} 
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