import React, { useState, useEffect } from 'react';
import axios from 'axios';

const backendUrl = import.meta.env.VITE_APP_BACKEND_URL;

type RewardInfo = {
    merchantType: string;
    rewardRate: number | null;
    conditions: string | null;
    type: string;
};

type NewTransactionFormData = {
    date: string;
    merchantType: string;
    amount: number | string;
    description: string;
}

type NewTransactionFormProps = {
    onFormSubmit: (data: NewTransactionFormData) => void;
    cardId: number; 
}

const NewTransactionForm: React.FC<NewTransactionFormProps> = ({ onFormSubmit, cardId }) => {

    const [formData, setFormData] = useState<NewTransactionFormData>({
        date: new Date().toISOString().split('T')[0] || "",
        merchantType: '',
        amount: '',
        description: '',
    });

    const [cardRules, setCardRules] = useState<RewardInfo[]>([]);
    const [isCustomCategory, setIsCustomCategory] = useState(false);
    const [loading, setLoading] = useState<boolean>(true);
    const [errMsg, setErrMsg] = useState('');

    useEffect(() => {
        const fetchCardSpecificBenefits = async () => {
            try {
                setLoading(true);
                const res = await axios.get(`${backendUrl}/bankrewards/card/${cardId}/benefits`);
                const spendRules = res.data.filter((r: any) => (r.type === 'POINTS' || r.type === 'CREDIT') && r.merchantType !== 'ANNIVERSARY');
                setCardRules(spendRules);
            } catch (error) {
                console.error("Fetch card categories failed:", error);
                setErrMsg("Failed to load your card's bonus categories.");
            } finally {
                setLoading(false);
            }
        };
        if (cardId) fetchCardSpecificBenefits();
    }, [cardId]);

    const selectedRule = cardRules.find(r => r.merchantType === formData.merchantType);

    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = event.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (event: React.FormEvent) => {
        event.preventDefault();
        if (!formData.date || !formData.merchantType || !formData.amount || !formData.description) {
            setErrMsg('Please fill out all fields');
            return;
        }
        setErrMsg('');
        onFormSubmit({ ...formData, amount: Number(formData.amount) });
    };

    return (
        <form onSubmit={handleSubmit} className="transaction-form">
            <div className="form-body">
                <div className="form-group mb-3">
                    <label className="form-label fw-bold text-secondary small text-uppercase">Date</label>
                    <input name="date" type="date" className="form-control shadow-sm" value={formData.date} onChange={handleInputChange} required />
                </div>

                <div className="form-group mb-3">
                    <label className="form-label fw-bold text-secondary small text-uppercase">Category</label>
                    {!isCustomCategory ? (
                        <select 
                            name="merchantType" 
                            className="form-select border-primary shadow-sm"
                            value={formData.merchantType} 
                            onChange={(e) => {
                                if (e.target.value === "CUSTOM_OTHER") {
                                    setIsCustomCategory(true);
                                    setFormData(prev => ({ ...prev, merchantType: '' }));
                                } else {
                                    handleInputChange(e);
                                }
                            }}
                            required
                            disabled={loading}
                        >
                            <option value="">-- Choose Category --</option>
                            {cardRules.map(rule => (
                                <option key={rule.merchantType} value={rule.merchantType}>
                                    {rule.merchantType} ({rule.rewardRate}x)
                                </option>
                            ))}
                            <option value="CUSTOM_OTHER" className="text-muted fw-bold">Add Custom Category</option>
                        </select>
                    ) : (
                        <div className="input-group shadow-sm">
                            <input 
                                name="merchantType"
                                className="form-control border-secondary" 
                                placeholder="e.g. Hospital, Tax, Rent..."
                                value={formData.merchantType}
                                onChange={handleInputChange}
                                required
                                autoFocus
                            />
                            <button className="btn btn-outline-secondary" type="button" onClick={() => setIsCustomCategory(false)}>
                                Back
                            </button>
                        </div>
                    )}
                    
                    {!isCustomCategory && selectedRule?.conditions ? (
                        <div className="form-text text-muted mt-2 ps-2" style={{ borderLeft: '3px solid #0d6efd' }}>
                            <i className="bi bi-info-circle-fill me-1 text-primary"></i>
                            <strong>Rule:</strong> {selectedRule.conditions}
                        </div>
                    ) : isCustomCategory ? (
                        <div className="form-text text-info mt-2 ps-2" style={{ borderLeft: '3px solid #0dcaf0' }}>
                            <i className="bi bi-shield-check me-1"></i>
                            General spending will earn basic 1x rewards.
                        </div>
                    ) : null}
                </div>

                <div className="form-group mb-3">
                    <label className="form-label fw-bold text-secondary small text-uppercase">Amount</label>
                    <div className="input-group shadow-sm">
                        <span className="input-group-text bg-light text-muted fw-bold">$</span>
                        <input name="amount" type="number" step="0.01" className="form-control" placeholder="0.00" value={formData.amount} onChange={handleInputChange} required />
                    </div>
                </div>

                <div className="form-group mb-4">
                    <label className="form-label fw-bold text-secondary small text-uppercase">Merchant Description</label>
                    <input
                        name="MerchantDescription"
                        type="text"
                    placeholder={selectedRule?.conditions ? selectedRule.conditions : "Description"}
                    className="form-control"
                    value={formData.description}
                    onChange={handleInputChange}
                    required
                    />
                </div>
            </div>

            {errMsg && <div className="alert alert-danger py-2 border-0 shadow-sm">{errMsg}</div>}

            <button className="btn btn-primary w-100 py-3 fw-bold text-uppercase shadow" type="submit" disabled={loading} style={{ letterSpacing: '1px' }}>
                {loading ? "Syncing..." : "Confirm Transaction"}
            </button>
        </form>
    );
};

export default NewTransactionForm;