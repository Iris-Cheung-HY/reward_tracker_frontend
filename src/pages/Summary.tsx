import React, { useState, useEffect } from 'react';
import axios from 'axios';
import AnnualFeeTotal from '../components/AnnualFeeTotal';
import SummaryTransaction from '../components/SummaryTransaction';
import NewCardForm from '../components/NewCardForm';
import CardList from '../components/CardList';
import AddCardModal from '../components/AddCardModalSummary.js';
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

interface NewCardFormData {
    lastFourDigits: string;
    bankCardId: number | string;
    cardType: string;
    openMonth: string;
}

const Summary: React.FC = () => {
    const [cards, setCards] = useState<UserCard[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const navigate = useNavigate();

    const fetchUserCards = async () => {
        try {
            const storedUser = localStorage.getItem('user');
            if (!storedUser) return;
            const user = JSON.parse(storedUser);

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
                alert("Card deleted successfully!");
            } catch (error) {
                console.error("Delete failed:", error);
            }
    };

    const handleAddCard = async (formData: NewCardFormData) => {
        try {
            const storedUser = localStorage.getItem('user');
            if (!storedUser) return;
            const user = JSON.parse(storedUser);

            console.log(formData);

            await axios.post(`${backendUrl}/usercreditcard/user/${user.id}`, formData);
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

    const handleCardClick = (cardId: number) => {
        navigate(`/card/${cardId}`);
    }

    return (
        <div className="container py-5">
            <header className="mb-5 text-center">
                <h1 className="fw-bold display-5">My Wallet Dashboard</h1>
            </header>

            <div className="row g-4 mb-5">
                <div className="col-md-6">
                    <AnnualFeeTotal />
                </div>
                <div className="col-md-6">
                    <SummaryTransaction />
                </div>
            </div>

            <section className="cards-section">
                <div className="d-flex justify-content-between align-items-center mb-4">
                    <h2 className="fw-bold">My Credit Cards</h2>
                </div>
                <CardList 
                    cards={cards} 
                    onDelete={handleDeleteCard} 
                    onAdd={() => setIsModalOpen(true)}
                    onCardClick={handleCardClick} 
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