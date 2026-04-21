// Footer: Piè di pagina con crediti e informazioni sulla privacy.
import { useState } from 'react'
import { createPortal } from 'react-dom'
import './Footer.css'

function Footer() {
    const currentYear = new Date().getFullYear()
    const [activeModal, setActiveModal] = useState(null) // 'privacy' | 'cookies' | null

    const closeModal = () => setActiveModal(null)

    return (
        <>
            <footer className="main-footer">
                <div className="footer-content">
                    <div className="footer-links">
                        <button className="footer-link-btn" onClick={() => setActiveModal('privacy')}>Privacy Policy</button>
                        <button className="footer-link-btn" onClick={() => setActiveModal('cookies')}>Cookie Policy</button>
                    </div>
                    <div className="footer-credits">
                        <p>© {currentYear} KASH - Creato con ❤️ dai <span>Cavalieri del Codice</span></p>
                    </div>
                </div>
            </footer>

            {/* Modal Privacy - Portaled to Body */}
            {activeModal === 'privacy' && createPortal(
                <div className="policy-modal-overlay" onClick={closeModal}>
                    <div className="policy-modal-content" onClick={e => e.stopPropagation()}>
                        <button className="modal-close-btn" onClick={closeModal}>×</button>
                        <h2>Privacy Policy</h2>
                        <div className="policy-text">
                            <p>Benvenuto su <strong>KASH</strong>. La tua privacy è fondamentale per noi.</p>
                            <h3>1. Raccolta dei Dati</h3>
                            <p>KASH raccoglie solo le informazioni necessarie per il funzionamento dell'app, come le spese inserite e il nome utente scelto. I dati sono memorizzati in modo sicuro tramite Supabase.</p>
                            <h3>2. Utilizzo dei Dati</h3>
                            <p>I tuoi dati vengono utilizzati esclusivamente per fornirti una panoramica delle tue finanze personali. Non vendiamo né condividiamo i tuoi dati con terze parti.</p>
                            <h3>3. Sicurezza</h3>
                            <p>Utilizziamo protocolli di sicurezza avanzati e crittografia per proteggere i tuoi dati durante il trasferimento e l'archiviazione.</p>
                            <h3>4. I tuoi Diritti</h3>
                            <p>Puoi eliminare le tue spese o il tuo account in qualsiasi momento contattando il supporto tecnico o utilizzando le funzioni integrate nell'app.</p>
                        </div>
                    </div>
                </div>,
                document.body
            )}

            {/* Modal Cookies - Portaled to Body */}
            {activeModal === 'cookies' && createPortal(
                <div className="policy-modal-overlay" onClick={closeModal}>
                    <div className="policy-modal-content" onClick={e => e.stopPropagation()}>
                        <button className="modal-close-btn" onClick={closeModal}>×</button>
                        <h2>Cookie Policy</h2>
                        <div className="policy-text">
                            <p>Questa app utilizza cookie tecnici per garantirti la migliore esperienza possibile.</p>
                            <h3>Cosa sono i Cookie?</h3>
                            <p>I cookie sono piccoli file di testo che vengono salvati sul tuo dispositivo quando visiti un sito o usi un'app.</p>
                            <h3>Come li usiamo?</h3>
                            <ul>
                                <li><strong>Sessione:</strong> Per mantenerti loggato al tuo account Supabase.</li>
                                <li><strong>Preferenze:</strong> Per ricordare il tuo nome utente salvato localmente nel browser.</li>
                            </ul>
                            <p>Non utilizziamo cookie di profilazione o di terze parti per scopi pubblicitari.</p>
                        </div>
                    </div>
                </div>,
                document.body
            )}
        </>
    )
}

export default Footer
