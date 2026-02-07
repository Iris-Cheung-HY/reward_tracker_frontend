import React, { useEffect, useState } from 'react';
import Benefit from './Benefit';
import './BenefitsList.css';

export interface RewardsDTO {
    merchantType: string;
    rewardRate: number | null;
    totalAmount: number | null;
    usedAmount: number;
    remainingAmount: number;
    lostAmount: number;
    type: string; 
    eligible: boolean;
    nextDueDate: string;
    conditions: string | null;
}

interface BenefitsListProps {
    userCardId: string;
}

const backendUrl = import.meta.env.VITE_APP_BACKEND_URL;

const BenefitsList: React.FC<BenefitsListProps> = ({ userCardId }) => {
    const [rewards, setRewards] = useState<RewardsDTO[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!userCardId || userCardId === "{userCardId}") return;

        setLoading(true);
        fetch(`${backendUrl}/card/${userCardId}`)
            .then(res => res.json())
            .then(data => {
                if (Array.isArray(data)) {
                setRewards(data);
            } else {
                console.error("error", data);
                setRewards([]); 
            }
            setLoading(false);
        })
        .catch((err) => {
            console.error("Fetch error:", err);
            setRewards([]);
            setLoading(false);
        });
}, [userCardId]);

    if (loading) return <div className="text-center p-5 text-muted">Calculating rewards...</div>;

    return (
        <div className="benefits-container">
            <h4 className="fw-bold mb-4">Benefit Progress</h4>
            <div className="row g-4">
                {rewards.map((reward, index) => (
                    <div className="col-12 col-md-6 col-lg-4" key={index}>
                        <Benefit reward={reward} />
                    </div>
                ))}
            </div>
        </div>
    );
};

export default BenefitsList;