import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom'; // 1. 必須引入 useParams
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

const CardDetails: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const [cardData, setCardData] = useState<UserCard | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchDetail = async () => {
            if (!id) return;
            try {
                setLoading(true);
                const res = await axios.get(`${backendUrl}/usercreditcard/${id}`);
                setCardData(res.data);
            } catch (error) {
                console.error("Error fetching card details:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchDetail();
    }, [id]);

    if (loading) return <div className="p-5 text-center">Loading...</div>;
    if (!cardData) return <div className="p-5 text-center">Card not found.</div>;

    return (
        <div className="card-details-page">
            <div className="top-section d-flex justify-content-between">
                <div className="card-visual">
                    <Card card={cardData} />
                </div>

                <div className="transaction-mini-log" style={{ flex: 1, marginLeft: '2rem' }}>
                    <h3>Recent Activity</h3>
                    <TransactionList cardId={Number(id)} />
                </div>
            </div>
        </div>
    );
}

export default CardDetails;