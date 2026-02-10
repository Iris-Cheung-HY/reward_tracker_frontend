import React, { useState, useEffect } from 'react';
import axios from 'axios';
import "./AnnualFeeTotal.css";

const backendUrl = import.meta.env.VITE_APP_BACKEND_URL;

interface UserSession {
    id: number;
    username?: string;
}

const fetchTotalSpendAPI = (userId: number) => {
    return axios.get<number>(`${backendUrl}/transactionrecords/user/${userId}/total-transaction`)
        .then(response => response.data)
        .catch(error => console.log(error));

};

const TotalTransactionTotal: React.FC = () => {
    const [totalTransactionAmount, setTotalTransactionAmount] = useState<number>(0);
    const currentDate: Date = new Date();

    const loadTotalAmount = () => {
        const storedUser = localStorage.getItem('user');
        if (!storedUser) return;

        const user: UserSession = JSON.parse(storedUser);
        
        fetchTotalSpendAPI(user.id).then(data => {
            setTotalTransactionAmount(data || 0);
        });
    };

    useEffect(() => {
        loadTotalAmount();
    }, []);

    return (
        <div id="total-spend-card" className="tra-card">
            <h6 className="ann-label">Total Spend</h6>
            <h2 className="ann-value">
                ${totalTransactionAmount.toLocaleString(undefined, { minimumFractionDigits: 2 })}
            </h2>
            <span className="ann-subtext">as of {currentDate.toLocaleDateString()}</span>
        </div>
    );
};

export default TotalTransactionTotal;