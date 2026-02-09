import React from 'react';
import type { RewardsDTO } from './BenefitsList';
import { OverlayTrigger, Tooltip } from 'react-bootstrap';

interface BenefitProps {
    reward: RewardsDTO;
}

const Benefit: React.FC<BenefitProps> = ({ reward }) => {
    const isPoints = reward.type === 'POINTS';
    const isCredit = reward.type === 'CREDIT';
    const isBenefit = reward.type === 'BENEFIT';
    const isMilestone = reward.type === 'MILESTONE';
    const isFreeNight = reward.type === 'FREE_NIGHT';
    
    const isStatic = reward.displayMode === 'STATIC' || isBenefit;
    
    const hasProgress = !isPoints && !isStatic && reward.totalAmount !== null && reward.totalAmount > 0;
    
    const progressPercent = hasProgress 
        ? Math.min((reward.usedAmount / (reward.totalAmount || 1)) * 100, 100)
        : 0;

    const formatCurrency = (num: number) => 
        new Intl.NumberFormat('en-US', { 
            style: 'currency', 
            currency: 'USD', 
            maximumFractionDigits: num % 1 === 0 ? 0 : 2 
        }).format(num);

    const getDisplayName = (type: string) => {
        if (!type) return 'Reward';
        if (type === 'OTHERS') return 'All Other Spend';
        return type.replace(/_/g, ' ');
    };

    return (
        <div className={`card h-100 shadow-sm border-0 position-relative ${reward.eligible ? 'border-start border-success border-5' : 'border-start border-light border-5'}`} style={{ borderRadius: '12px', transition: 'transform 0.2s' }}>
            <div className="card-body d-flex flex-column">
                
                <div className="d-flex justify-content-between align-items-start mb-2">
                    <div className="flex-grow-1">
                        <span className="text-uppercase text-muted fw-bold small ls-wide" style={{ fontSize: '0.65rem', letterSpacing: '0.05rem' }}>
                            {getDisplayName(reward.merchantType)}
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
                            <span className="text-secondary ms-2" style={{ cursor: 'help', fontSize: '0.85rem' }}>
                                <i className="bi bi-info-circle"></i>
                            </span>
                        </OverlayTrigger>
                    )}
                </div>

                <div className="flex-grow-1 py-1 d-flex align-items-center">
                    {isPoints ? (
                        <div className="points-info w-100">
                            <div className="d-flex align-items-baseline gap-1">
                                <h2 className="fw-bold text-primary mb-0">{Math.round(reward.usedAmount).toLocaleString()}</h2>
                                <span className="text-primary small fw-bold">Pts</span>
                            </div>
                            <div className="mt-1 d-flex align-items-center gap-2">
                                <span className="badge bg-light text-secondary border small fw-normal">
                                    {reward.rewardRate}x Multiplier
                                </span>
                                <span className="text-muted" style={{ fontSize: '0.6rem' }}>
                                    (Net of credits)
                                </span>
                            </div>
                        </div>
                    ) : isStatic ? (
                        <div className="status-info">
                            <div className="d-flex align-items-center">
                                <span className={`badge ${reward.eligible ? 'bg-success-subtle text-success border-success-subtle' : 'bg-light text-muted border-light'} border px-3 py-2 rounded-pill fw-bold`}>
                                    <i className={`bi ${reward.eligible ? 'bi-patch-check-fill' : 'bi-clock-history'} me-1`}></i> 
                                    {reward.eligible ? 'Ready / Active' : 'Processing'}
                                </span>
                                {isBenefit && <span className="ms-2 text-muted x-small">Membership Perk</span>}
                            </div>
                        </div>
                    ) : (
                        <div className="credit-info w-100">
                            <div className="d-flex justify-content-between align-items-end mb-1">
                                <h3 className="fw-bold mb-0" style={{ fontSize: '1.2rem' }}>
                                    {formatCurrency(reward.usedAmount)}
                                    {reward.totalAmount && (
                                        <span className="text-muted fs-6 fw-normal"> / {formatCurrency(reward.totalAmount)}</span>
                                    )}
                                </h3>
                                {reward.eligible && <i className="bi bi-check-circle-fill text-success"></i>}
                            </div>

                            {(isMilestone || isFreeNight) ? (
                                <div className="text-info fw-bold mt-1" style={{ fontSize: '0.65rem', textTransform: 'uppercase' }}>
                                    <i className="bi bi-trophy-fill me-1"></i>
                                    Goal: {isFreeNight ? "Extra Free Night" : getDisplayName(reward.merchantType)}
                                </div>
                            ) : (
                                <div className="text-muted mt-1" style={{ fontSize: '0.65rem', textTransform: 'uppercase' }}>
                                    Credit Utilization
                                </div>
                            )}

                            {hasProgress && (
                                <div className="progress mt-2" style={{ height: '8px', backgroundColor: '#f0f0f0', borderRadius: '4px' }}>
                                    <div 
                                        className={`progress-bar ${reward.eligible ? 'bg-success' : (isMilestone ? 'bg-info' : 'bg-primary')} progress-bar-striped progress-bar-animated`} 
                                        style={{ width: `${progressPercent}%`, transition: 'width 1s ease-in-out' }}
                                    />
                                </div>
                            )}
                        </div>
                    )}
                </div>

                {reward.nextDueDate && (
                    <div className="mt-auto pt-2 border-top border-light d-flex align-items-center text-muted" style={{ fontSize: '0.65rem' }}>
                        <i className="bi bi-calendar-event me-1"></i>
                        <span>Resets: <strong>{new Date(reward.nextDueDate).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}</strong></span>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Benefit;