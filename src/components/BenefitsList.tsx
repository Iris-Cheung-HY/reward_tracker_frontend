import React, { useEffect, useState } from 'react';
import Benefit from './Benefit';

export interface RewardsDTO {
    merchantType: string;
    rewardRate: number | null;
    totalAmount: number | null;
    usedAmount: number;
    remainingAmount: number;
    lostAmount: number;
    type: 'POINTS' | 'CREDIT' | 'STATUS' | 'BENEFIT' | 'MILESTONE' | 'FREE_NIGHT';
    eligible: boolean;
    nextDueDate: string | null;
    conditions: string | null;
    displayMode: 'STATIC' | 'PROGRESS';
}

interface BenefitsListProps {
    userCardId: string | number;
}

const backendUrl = import.meta.env.VITE_APP_BACKEND_URL;

const BenefitsList: React.FC<BenefitsListProps> = ({ userCardId }) => {
    const [rewards, setRewards] = useState<RewardsDTO[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const isValidId = userCardId && 
                          userCardId !== "{userCardId}" && 
                          userCardId !== "undefined" && 
                          userCardId !== "null";

        if (!isValidId) {
            setLoading(false);
            return;
        }

        const fetchBenefits = async () => {
            try {
                setLoading(true);
                setError(null);
                
                const response = await fetch(`${backendUrl}/bankrewards/card/${userCardId}/benefits`);
                
                if (!response.ok) {
                    throw new Error(`Server responded with status: ${response.status}`);
                }

                const data = await response.json();
                
                if (Array.isArray(data)) {
                    const sortedData = [...data].sort((a, b) => {
                        if (a.type === 'CREDIT' && b.type !== 'CREDIT') return -1;
                        if (a.type !== 'CREDIT' && b.type === 'CREDIT') return 1;
                        return 0;
                    });
                    setRewards(sortedData);
                } else {
                    setRewards([]);
                }
            } catch (err) {
                console.error("Fetch error:", err);
                setError("Unable to sync your benefit progress. Please try again later.");
                setRewards([]);
            } finally {
                setLoading(false);
            }
        };

        fetchBenefits();
    }, [userCardId]);

    if (loading) {
        return (
            <div className="d-flex flex-column align-items-center justify-content-center p-5 my-4">
                <div className="spinner-border text-primary mb-3" role="status" style={{ width: '3rem', height: '3rem' }}>
                    <span className="visually-hidden">Loading...</span>
                </div>
                <h5 className="text-secondary fw-light">Calculating your rewards...</h5>
            </div>
        );
    }

    if (error) {
        return (
            <div className="alert alert-danger d-flex align-items-center m-3 shadow-sm" role="alert">
                <i className="bi bi-exclamation-triangle-fill me-2"></i>
                <div>{error}</div>
            </div>
        );
    }

    if (rewards.length === 0) {
        return (
            <div className="text-center p-5 bg-light rounded-4 border border-dashed my-4">
                <i className="bi bi-credit-card-2-front text-muted" style={{ fontSize: '3rem' }}></i>
                <p className="text-muted mt-3 mb-0">No active benefits or rewards tracking for this card.</p>
                <small className="text-black-50">Transaction data might still be processing.</small>
            </div>
        );
    }

    return (
        <div className="benefits-section">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <div>
                    <h4 className="fw-bold mb-1">Card Progress</h4>
                    <p className="text-muted small mb-0">Real-time tracking of your spending goals and credits.</p>
                </div>
                <span className="badge rounded-pill bg-primary px-3 py-2">
                    {rewards.length} Rules Active
                </span>
            </div>

            <div className="row g-4">
                {rewards.map((reward, index) => (
                    <div className="col-12 col-md-6 col-xl-4" key={`${reward.merchantType}-${reward.type}-${index}`}>
                        <Benefit reward={reward} />
                    </div>
                ))}
            </div>

            <style>{`
                .benefits-section {
                    animation: fadeIn 0.5s ease-in-out;
                }
                @keyframes fadeIn {
                    from { opacity: 0; transform: translateY(10px); }
                    to { opacity: 1; transform: translateY(0); }
                }
            `}</style>
        </div>
    );
};

export default BenefitsList;