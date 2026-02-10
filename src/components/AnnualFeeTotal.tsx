import React, { useState, useEffect } from 'react';
import axios from 'axios';
import "./AnnualFeeTotal.css"

const backendUrl = import.meta.env.VITE_APP_BACKEND_URL;

interface UserSession {
    id: number;
    username?: string;
}

const getTotalAnnualFeeAPI = (userId: number) => {
    return axios.get<number>(`${backendUrl}/usercreditcard/user/${userId}/total-annual-fee`)
        .then(response => response.data)
        .catch(error => console.log(error));
};

const AnnualFeeTotal: React.FC = () => {
    const [totalFee, setTotalFee] = useState<number>(0);

    const loadFeeData = () => {
        const storedUser = localStorage.getItem('user');
        if (!storedUser) return;

        const user: UserSession = JSON.parse(storedUser);
        
        getTotalAnnualFeeAPI(user.id).then(data => {
            setTotalFee(data || 0);
        });
    };

    useEffect(() => {
        loadFeeData();
    }, []);

    return (
        <div id="annual-fee-card" className="ann-card">
            <h6 className="ann-label">Total Annual Fees</h6>
            <h2 className="ann-value">
                ${totalFee.toLocaleString(undefined, { minimumFractionDigits: 2 })}
            </h2>
            <span className="ann-subtext">per year</span>
        </div>
    );
};

export default AnnualFeeTotal;