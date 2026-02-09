import React from 'react';
import type { RewardsDTO } from './BenefitsList';
import { OverlayTrigger, Tooltip } from 'react-bootstrap';

interface BenefitProps {
    reward: RewardsDTO;
}

const Benefit: React.FC<BenefitProps> = ({ reward }) => {
    const isPoints = reward.type === 'POINTS';
    
    const isStatic = reward.displayMode === 'STATIC';
    
    const hasProgress = reward.totalAmount !== null && reward.totalAmount > 0;
    
    const progressPercent = hasProgress 
        ? Math.min((reward.usedAmount / (reward.totalAmount || 1)) * 100, 100)
        : 0;

    return (
        <div className={`card h-100 shadow-sm border-0 position-relative ${reward.eligible ? 'border-start border-success border-5' : 'border-start border-light border-5'}`} style={{ borderRadius: '12px' }}>
            <div className="card-body d-flex flex-column">
                
                <div className="d-flex justify-content-between align-items-start mb-2">
                    <div className="flex-grow-1">
                        <span className="text-uppercase text-muted fw-bold small ls-wide" style={{ fontSize: '0.65rem' }}>
                            {reward.merchantType.replace(/_/g, ' ')}
                        </span>
                        {reward.conditions && (
                            <div className="text-muted x-small mt-1 fst-italic">
                                {reward.conditions.length > 45 
                                    ? `${reward.conditions.substring(0, 45)}...` 
                                    : reward.conditions
                                }
                            </div>
                        )}
                    </div>
                    
                    {reward.conditions && (
                        <OverlayTrigger
                            placement="top"
                            overlay={<Tooltip id={`tooltip-${reward.merchantType}`}>{reward.conditions}</Tooltip>}
                        >
                            <span className="text-secondary ms-2" style={{ cursor: 'help', fontSize: '0.85rem' }}>ℹ️</span>
                        </OverlayTrigger>
                    )}
                </div>

                <div className="flex-grow-1 py-1 d-flex align-items-center">


                    {isPoints ? (
                        <div className="points-info w-100">
                            <div className="d-flex align-items-baseline gap-1">
                                <h2 className="fw-bold text-primary mb-0">{reward.usedAmount.toLocaleString()}</h2>
                                <span className="text-primary small fw-bold">Pts</span>
                            </div>
                            <div className="mt-1">
                                <span className="badge bg-light text-secondary border small fw-normal">
                                    {reward.rewardRate}x Multiplier
                                </span>
                            </div>
                        </div>
                    ) : isStatic ? (
                        <div className="status-info">
                            <div className="d-flex align-items-center">
                                <span className="badge bg-success-subtle text-success border border-success-subtle px-3 py-2 rounded-pill fw-bold">
                                    <i className="bi bi-patch-check-fill me-1"></i> ✓ Ready
                                </span>
                                <span className="ms-2 text-muted x-small">Active Perk</span>
                            </div>
                        </div>
                    ) : (
                        <div className="credit-info w-100">
                            <div className="d-flex justify-content-between align-items-end mb-1">
                                <h3 className="fw-bold mb-0" style={{ fontSize: '1.2rem' }}>
                                    {reward.type === 'FREE_NIGHT' ? "Free Night" : `$${reward.usedAmount.toFixed(0)}`}
                                    <span className="text-muted fs-6 fw-normal"> / ${reward.totalAmount}</span>
                                </h3>
                                {reward.eligible && <span className="text-success x-small fw-bold">✓ Ready</span>}
                            </div>

                            <div className="progress mt-2" style={{ height: '8px', backgroundColor: '#f0f0f0', borderRadius: '4px' }}>
                                <div 
                                    className={`progress-bar ${reward.eligible ? 'bg-success' : 'bg-primary'} progress-bar-striped`} 
                                    style={{ width: `${progressPercent}%` }}
                                />
                            </div>
                        </div>
                    )}
                </div>

                {reward.nextDueDate && (
                    <div className="mt-auto pt-2 border-top border-light d-flex align-items-center text-muted" style={{ fontSize: '0.65rem' }}>
                        <i className="bi bi-arrow-repeat me-1"></i>
                        <span>Resets: <strong>{new Date(reward.nextDueDate).toLocaleDateString()}</strong></span>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Benefit;