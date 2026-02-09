import { useState, useEffect } from 'react';
import axios from 'axios';

const backendUrl = import.meta.env.VITE_APP_BACKEND_URL;

interface AnnualFee {
    annualFee: number;
}

interface UserSession {
    id: number;
    username?: string;
}

const AnnualFeeTotal: React.FC = () => {
    const [totalFee, setTotalFee] = useState<number>(0);

    const grabFee = async () => {
        try {
            const storedUser = localStorage.getItem('user');
            if (!storedUser) return;

            const user: UserSession = JSON.parse(storedUser);
            
            const res = await axios.get<number>(`${backendUrl}/usercreditcard/user/${user.id}/total-annual-fee`);
            setTotalFee(res.data);
        } catch (error) {
            console.error("Fetch error", error);
        }
    };

    useEffect(() => {
        grabFee()
    }, []);

    return (
        <div className="card h-100 border-0 shadow-sm rounded-4 bg-white p-4 border-start border-danger border-5">
            <h6 className="fw-bold">Total Annual Fees</h6>
            <h2 className="fw-bold mb-0 text-dark">
                ${totalFee.toLocaleString(undefined, { minimumFractionDigits: 2 })}
            </h2>
            <span className="text-muted small mt-2">per year</span>
        </div>
    );
};

export default AnnualFeeTotal;