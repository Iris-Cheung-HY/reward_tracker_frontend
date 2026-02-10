import { useState, useEffect } from 'react';
import axios from 'axios';
import "./NewCardForm.css"


const backendUrl = import.meta.env.VITE_APP_BACKEND_URL;

const MONTH_OPTIONS = [
    "JANUARY", "FEBRUARY", "MARCH", "APRIL", "MAY", "JUNE",
    "JULY", "AUGUST", "SEPTEMBER", "OCTOBER", "NOVEMBER", "DECEMBER"
];

type NewCardFormData = {
    lastFourDigits: string;
    bankName: string;
    cardName: string;
    cardType: string;
    bankCardId: number | string;
    openMonth: string;
}

type NewCardFormProps = {
    onFormSubmit: (data: NewCardFormData) => void;
}

interface BankCreditCardDTO {
    id: number;
    bankName: string;
    cardName: string;
    cardType: string;
}

export const getBanksAPI = () => {
    return axios.get(`${backendUrl}/bankcreditcard/banks`)
    .then(response => response.data)
    .catch(error => console.log(error));
};


export const getCardsByBankAPI = (bankName: string) => {
    return axios.get(`${backendUrl}/bankcreditcard/bank/${bankName}/cards`)
    .then(response => response.data)
    .catch(error => console.log(error));
};

export const checkDuplicateCardAPI = (userId: number, lastFourDigits: string) => {
    return axios.post(`${backendUrl}/usercreditcard/user/${userId}/check-card`, { lastFourDigits })
        .then(response => response.data.isDuplicate)
        .catch(error => console.log(error));
};


const NewCardForm: React.FC<NewCardFormProps> = ({ onFormSubmit }) => {
    const [cardFormData, setCardFormData] = useState<NewCardFormData>({
        lastFourDigits: '',
        bankName: '',
        cardName: '',
        cardType: '',
        bankCardId: '',
        openMonth: ''
    });

    const [banks, setBanks] = useState<string[]>([]);
    const [filteredCards, setFilteredCards] = useState<BankCreditCardDTO[]>([]);
    const [errMsg, setErrMsg] = useState('');
    const [isDuplicate, setIsDuplicate] = useState(false);

    useEffect(() => {
        getBanksAPI().then(data => setBanks(data));
    }, []);

    const checkCardDigits = (digits: string) => {
        if (digits.length !== 4) return;
        const user = JSON.parse(localStorage.getItem('user') || '{}');
        checkDuplicateCardAPI(user.id, digits).then(duplicate => {
            setIsDuplicate(duplicate);
            setErrMsg(duplicate ? 'Card Exists' : '');
        });
    };

    const handleBankChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const bankName = e.target.value;
        setCardFormData(prev => ({ ...prev, bankName, bankCardId: '', cardName: '' }));

        if (bankName) {
            getCardsByBankAPI(bankName).then(data => setFilteredCards(data));
        } else {
            setFilteredCards([]);
        }
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setCardFormData(prev => ({ ...prev, [name]: value }));

        if (name === "bankCardId") {
            const card = filteredCards.find(c => c.id.toString() === value);
            if (card) setCardFormData(prev => ({ ...prev, cardName: card.cardName }));
        }
    };

    return (
        <form id="new-card-form" onSubmit={(e) => { e.preventDefault(); onFormSubmit(cardFormData); }}>
            <div className="form-group">
                <label>Last 4 Digits</label>
                <input
                    name="lastFourDigits"
                    type="text"
                    maxLength={4}
                    value={cardFormData.lastFourDigits}
                    onChange={handleInputChange}
                    onBlur={() => checkCardDigits(cardFormData.lastFourDigits)}
                    placeholder="e.g. 1234"
                />
            </div>

            <div className="form-group">
                <label>Bank</label>
                <select name="bankName" value={cardFormData.bankName} onChange={handleBankChange}>
                    <option value="">Choose Bank...</option>
                    {banks.map(bank => <option key={bank} value={bank}>{bank}</option>)}
                </select>
            </div>

            <div className="form-group">
                <label>Type</label>
                <select name="cardType" value={cardFormData.cardType} onChange={handleInputChange}>
                    <option value="">Personal / Business</option>
                    <option value="Personal">Personal</option>
                    <option value="Business">Business</option>
                </select>
            </div>

            <div className="form-group">
                <label>Card Name</label>
                <select 
                    name="bankCardId" 
                    value={cardFormData.bankCardId} 
                    onChange={handleInputChange} 
                    disabled={!cardFormData.bankName}
                >
                    <option value="">Select Card</option>
                    {filteredCards
                        .filter(c => !cardFormData.cardType || c.cardType === cardFormData.cardType)
                        .map(card => <option key={card.id} value={card.id}>{card.cardName}</option>)
                    }
                </select>
            </div>

            <div className="form-group">
                <label>Open Month</label>
                <select name="openMonth" value={cardFormData.openMonth} onChange={handleInputChange}>
                    <option value="">Select Month...</option>
                    {MONTH_OPTIONS.map(m => <option key={m} value={m}>{m}</option>)}
                </select>
            </div>

            {errMsg && <p className="error-text">{errMsg}</p>}

            <button 
                type="submit" 
                className="form-submit-btn"
                disabled={isDuplicate || !cardFormData.bankCardId || cardFormData.lastFourDigits.length !== 4}
            >
                Add Card
            </button>
        </form>
    );
};
export default NewCardForm;