// Navigazione: Barra superiore con nome utente e pulsante di logout.
// Importiamo il CSS specifico per lo stile della testata
import './hearder.css'
// Importiamo l'immagine del logo. In React, le immagini locali si importano come se fossero codice (variabili)
import logo from '../../assets/images/logo-soldi.png'

// Componente Header che riceve le proprietà 'title' e 'onLogout'
function Header({ title, onLogout }) {
    return (
        // Usiamo il tag semantico <header> per definire la parte alta della pagina
        <header className="main-header">
            <div className='logo-container'>
                {/* Mostriamo l'immagine importata usando src={logo} */}
                <img src={logo} className='logo' alt="logo-soldi" />
                <span className="app-name">KASH</span>
            </div>
            {/* Stampiamo il titolo che è stato passato quando il componente è stato richiamato */}
            <h1 className="title">DASHBOARD FINANZIARIA DI <span className="username-red">{title}</span></h1>

            {onLogout && (
                <button onClick={onLogout} className="logout-btn">
                    ESCI
                </button>
            )}
        </header>
    );
}

// Esportiamo il componente
export default Header;
