import { useState, useEffect } from 'react';
import axios from 'axios';


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


const NewCardForm: React.FC<NewCardFormProps> = ({ onFormSubmit }) => {
    const defaultCardFormData: NewCardFormData = {
        lastFourDigits: '',
        bankName: '',
        cardName: '',
        cardType: '',
        bankCardId: '',
        openMonth: ''
    };

    const [cardFormData, setCardFormData] = useState(defaultCardFormData);
    const [errMsg, setErrMsg] = useState('');
    const [isDuplicate, setIsDuplicate] = useState(false);
    const [disableSubmit, setDisableSubmit] = useState(true);
    const [banks, setBanks] = useState<string[]>([]);
    const [filteredCards, setFilteredCards] = useState<BankCreditCardDTO[]>([]);
    

    const checkCardWithLastFourDigits = async (lastFourDigits: string) => {
        if (lastFourDigits.length !== 4) return;
        try {
            const user = JSON.parse(localStorage.getItem('user') || '{}');
            const userId = user.id;
            const res = await axios.post(`${backendUrl}/usercreditcard/user/${userId}/check-card`, { lastFourDigits });
            
            setIsDuplicate(res.data.isDuplicate);
            
            if (res.data.isDuplicate === true) {
                setErrMsg('Duplicate Card');
                setDisableSubmit(true);
            } else {
                setErrMsg('');
                setDisableSubmit(false);
            }
        } catch (error) {
            console.error("Card check failed:", error);
            setErrMsg('Please try again later'); 
            setDisableSubmit(false);
        }
    };

    useEffect(() => {
        const fetchBanks = async () => {
            const banks = await axios.get(`${backendUrl}/bankcreditcard/banks`);
            setBanks(banks.data);
        }
        fetchBanks();
    }, []);

    const handleBankInputChange = async(event: React.ChangeEvent<HTMLSelectElement>) => {
        const selectedBank = event.target.value;
        
        setCardFormData(prev => ({
            ...prev,
            bankName: selectedBank,
            bankCardId: '',
            cardName: ''
        }));

        if (selectedBank) {
            try {
                const cards = await axios.get(`${backendUrl}/bankcreditcard/bank/${selectedBank}/cards`);
                setFilteredCards(cards.data);
            } catch (error) {
                console.error("Fetch cards error", error);
            }
            } else {
                setFilteredCards([]); 
            }
        }

    const handleInputChange = async (event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = event.target;
        console.log(`${name} = ${value}`);
        setCardFormData(prev => ({ 
            ...prev, 
            [name]: value 
        }));
        
        if (name === "bankCardId") {
            const selectedObject = filteredCards.find(c => c.id.toString() === value);
            if (selectedObject) {
                setCardFormData(prev => ({ ...prev, cardName: selectedObject.cardName}));

            }
        }
        setDisableSubmit(false);
    };

    const handleSubmit = (event :React.FormEvent) => {
        event.preventDefault();
        if(isDuplicate || !cardFormData.bankCardId || cardFormData.lastFourDigits.length !== 4 || !cardFormData.openMonth) {
            return;
        }
        onFormSubmit(cardFormData);
    };


    const cardOptions = cardFormData.cardType 
        ? filteredCards.filter(card => card.cardType === cardFormData.cardType)
        : filteredCards;
    
        console.log("Bug check", {
    isDuplicate,
    bankCardId: cardFormData.bankCardId,
    digitsLen: cardFormData.lastFourDigits.length,
    openMonth: cardFormData.openMonth
});

    return (
        <form onSubmit={handleSubmit} className="newCardForm">
            <div className="formContainer">
                <div>
                    <label>Last 4 Digits</label>
                    <input
                        name="lastFourDigits"
                        type="text"
                        value={cardFormData.lastFourDigits}
                        onChange={handleInputChange}
                        onBlur={() => checkCardWithLastFourDigits(cardFormData.lastFourDigits)}
                        className="formInput"
                    />
                </div>

                <label>Bank Name</label>
                <select name="bankName" value={cardFormData.bankName} onChange={handleBankInputChange} className="formInput">
                    <option value="">Select Bank Name</option>
                    {banks.map(bank => <option key={bank} value={bank}>{bank}</option>)}
                </select>

                <label>Card Type</label>
                <select name="cardType" value={cardFormData.cardType} onChange={handleInputChange} className="formInput">
                    <option value="">Select Type (Optional)</option>
                    <option value="Personal">Personal</option>
                    <option value="Business">Business</option>
                </select>

                <label>Card Name</label>
                <select 
                    name="bankCardId" 
                    value={cardFormData.bankCardId} 
                    onChange={handleInputChange} 
                    className="formInput"
                    disabled={!cardFormData.bankName}
                >
                    <option value="">Select Card Name</option>
                    {cardOptions.map(card => (
                        <option key={card.id} value={card.id}>{card.cardName} ({card.cardType})</option>
                    ))}
                </select>

                <label>Open Month</label>
                <select 
                    name="openMonth" 
                    value={cardFormData.openMonth} 
                    onChange={handleInputChange} 
                    className="formInput"
                >
                    <option value="">Select Month</option>
                    {MONTH_OPTIONS.map((month) => (
                        <option key={month} value={month}>
                            {month}
                        </option>
                    ))}
                </select>
            </div>

            
            <button 
                className="submitButton" 
                type="submit" 
                disabled={isDuplicate || !cardFormData.bankCardId || cardFormData.lastFourDigits.length !== 4 || !cardFormData.openMonth }
            >
                Create Card
            </button>
        </form>
    );
};

export default NewCardForm;