// Dashboard: Modale di benvenuto per l'inserimento iniziale del nome utente.
import { useState } from 'react';
import './welcome-modal.css';

function WelcomeModal({ onSaveName }) {
    const [name, setName] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        const trimmedName = name.trim();
        if (trimmedName) {
            onSaveName(trimmedName);
        }
    };

    return (
        <div className="modal-overlay">
            <div className="welcome-modal">
                <h2>Benvenuto!</h2>
                <p>Inserisci il tuo nome per iniziare a monitorare le tue spese e le tue entrate in modo intelligente.</p>
                <form onSubmit={handleSubmit}>
                    <input
                        type="text"
                        placeholder="Il tuo nome..."
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        autoFocus
                    />
                    <button type="submit" className="btn-start" disabled={!name.trim()}>
                        Inizia
                    </button>
                </form>
            </div>
        </div>
    );
}

export default WelcomeModal;
