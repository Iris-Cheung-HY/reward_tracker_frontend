import React, { useState, useEffect } from 'react';
import Transaction from './Transaction';
import axios from 'axios';
import "./TransactionList.css";

const backendUrl = import.meta.env.VITE_APP_BACKEND_URL;

interface TransactionItem {
    id: number;
    date: string;
    merchantType: string;
    amount: number;
    description: string;
}

interface TransactionListProps {
    userId: number;
    cardId: number;
    onAdd: () => void;
}

const fetchTransactionsAPI = (userId: number, cardId: number) => {
    return axios.get(`${backendUrl}/transactionrecords/user/${userId}/card/${cardId}`)
        .then(response => response.data.content || response.data || [])
        .catch(error => {
            console.log(error);
            return [];
        });
};

const deleteTransactionAPI = (id: number) => {
    return axios.delete(`${backendUrl}/transactionrecords/${id}`)
        .then(response => response.data)
        .catch(error => console.log(error));
};

const TransactionList: React.FC<TransactionListProps> = ({ userId, cardId, onAdd }) => {
    const [transactions, setTransactions] = useState<TransactionItem[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    const loadTransactions = () => {
        if (!userId || !cardId) return;
        setIsLoading(true);
        fetchTransactionsAPI(userId, cardId).then(data => {
            setTransactions(data);
            setIsLoading(false);
        });
    };

    useEffect(() => {
        loadTransactions();
    }, [userId, cardId]);

    const handleDelete = (id: number) => {
        if (window.confirm("Are you sure you want to delete this transaction?")) {
            deleteTransactionAPI(id).then(() => {
                loadTransactions();
            });
        }
    };

    return (
        <div id="transaction-history-wrapper">
            <div className="transaction-grid-body">
                {transactions.length === 0 && !isLoading ? (
                    <div className="empty-message">No records found.</div>
                ) : (
                    transactions.map((t) => (
                        <Transaction
                            key={t.id}
                            id={t.id}
                            date={t.date}
                            category={t.merchantType}
                            amount={t.amount}
                            description={t.description}
                            onDelete={handleDelete}
                        />
                    ))
                )}
            </div>
        </div>
    );
};

export default TransactionList;