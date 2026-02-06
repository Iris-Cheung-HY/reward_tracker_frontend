import React from 'react';
import type { RewardsDTO } from './BenefitsList';

interface BenefitProps {
    reward: RewardsDTO;
}

const Benefit: React.FC<BenefitProps> = ({ reward }) => {
    const isMilestone = reward.totalAmount && reward.totalAmount >= 1000; 
    const isMonthly = reward.totalAmount && reward.totalAmount < 1000;
    const isMultiplier = reward.rewardRate && reward.rewardRate > 0;

    const progressPercent = Math.min(
        (reward.usedAmount / (reward.totalAmount || 1)) * 100, 
        100
    );

    return (
        <div className={`card h-100 shadow-sm border-0 benefit-card ${reward.lostAmount > 0 ? 'border-start border-danger border-4' : ''}`}>
            <div className="card-body d-flex flex-column">
                <div className="d-flex justify-content-between align-items-start mb-3">
                    <span className="text-uppercase text-muted fw-bold x-small tracking-wider">
                        {reward.merchantType}
                    </span>
                    {isMultiplier && (
                        <span className="badge bg-primary text-white">{reward.rewardRate}x</span>
                    )}
                </div>

                {isMilestone && (
                    <div className="milestone-content">
                        <div className="d-flex justify-content-between align-items-end mb-1">
                            <h3 className="fw-bold mb-0">${reward.usedAmount.toLocaleString()}</h3>
                            <span className="text-muted small">Target: ${reward.totalAmount?.toLocaleString()}</span>
                        </div>
                        <div className="progress mb-2" style={{ height: '12px', borderRadius: '6px' }}>
                            <div 
                                className="progress-bar bg-info progress-bar-striped progress-bar-animated" 
                                style={{ width: `${progressPercent}%` }}
                            />
                        </div>
                        <p className="card-text small text-secondary">
                            {reward.remainingAmount > 0 
                                ? `Spend $${reward.remainingAmount.toLocaleString()} more to obtain rewards!`
                                : "🎉 Goal Achieved!"}
                        </p>
                    </div>
                )}

                {isMonthly && !isMilestone && (
                    <div className="monthly-content">
                        <div className="d-flex justify-content-between align-items-center mb-1">
                            <h3 className="fw-bold mb-0">${reward.usedAmount.toFixed(0)}</h3>
                            <span className="badge bg-light text-dark border">${reward.totalAmount} Credit</span>
                        </div>
                        <div className="progress mb-2" style={{ height: '6px' }}>
                            <div 
                                className={`progress-bar ${reward.remainingAmount === 0 ? 'bg-success' : 'bg-primary'}`} 
                                style={{ width: `${progressPercent}%` }}
                            />
                        </div>
                        {reward.lostAmount > 0 ? (
                            <div className="text-danger small fw-bold mt-2">
                                ⚠️ ${reward.remainingAmount.toFixed(2)} unused - expires {reward.nextDueDate}
                            </div>
                        ) : (
                            <div className="text-success small mt-2">✓ Monthly benefit redeemed</div>
                        )}
                    </div>
                )}

                {!reward.totalAmount && isMultiplier && (
                    <div className="multiplier-content mt-auto">
                        <h3 className="fw-bold mb-0">{reward.usedAmount.toLocaleString()}</h3>
                        <span className="text-muted small">Points accrued this period</span>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Benefit;