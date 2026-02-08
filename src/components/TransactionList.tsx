import React, { useState, useEffect } from 'react';
import Transaction from './Transaction';
import axios from 'axios';

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
    onDelete: (id: number) => void;
    onAdd: () => void;
}

const TransactionList: React.FC<TransactionListProps> = ({ userId, cardId, onDelete, onAdd }) => {
    const [transactions, setTransactions] = useState<TransactionItem[]>([]);
    const [loading, setLoading] = useState(true);


    const fetchTransactions = async () => {
        try {
            setLoading(true);
            const res = await axios.get(`${backendUrl}/transactionrecords/user/${userId}/card/${cardId}`);
            console.log("dataJSON:", res.data);
            setTransactions(res.data);
        } catch (error) {
            console.error("Failed to fetch transactions:", error);
        } finally {
            setLoading(false);
        }

    };

    useEffect(() => {
        const fetchTransactions = async () => {
            try {
                setLoading(true);
                const res = await axios.get(
                    `${backendUrl}/transactionrecords/user/${userId}/card/${cardId}`
                );
                setTransactions(res.data);
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        };

        if (userId && cardId) {
            fetchTransactions();
        }
    }, [userId, cardId]);

    const handleDelete = async (id: number) => {
        if (window.confirm("Delete this transaction?")) {
            await axios.delete(`${backendUrl}/transactionrecords/${id}`);
            fetchTransactions();
        }
    };

    return (
        <div className="trans-list-container shadow-sm rounded bg-white p-3">
            <div className="d-flex justify-content-between align-items-center mb-3">
                <h5 className="mb-0">Transaction History</h5>
                <button className="btn btn-primary btn-sm" onClick={onAdd}>
                    <span className="me-1">+</span> Add Transaction
                </button>
            </div>

            <div className="table-responsive">
                <table className="table table-hover align-middle">
                    <thead className="table-light">
                        <tr>
                            <th style={{ width: '15%' }}>Date</th>
                            <th style={{ width: '20%' }}>Category</th>
                            <th style={{ width: '15%' }}>Amount</th>
                            <th style={{ width: '40%' }}>Merchant</th>
                            <th style={{ width: '10%' }}>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {transactions.length === 0 ? (
                            <tr>
                                <td colSpan={5} className="text-center py-4 text-muted">
                                    No transactions found.
                                </td>
                            </tr>
                        ) : (
                            transactions.map((transaction) => (
                                <Transaction
                                    key={transaction.id}
                                    id={transaction.id}
                                    date={transaction.date}
                                    category={transaction.merchantType || "Other"}
                                    amount={transaction.amount}
                                    description={transaction.description}
                                    onDelete={handleDelete}
                                />
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}


export default TransactionList;