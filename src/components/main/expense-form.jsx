// Dashboard: Modulo per l'inserimento di nuove spese o entrate.
// Importiamo useState da React per gestire le variabili che possono cambiare (stato del componente)
import { useState } from 'react'
import './expense-form.css'
import { CATEGORIES } from "../../data/expense"


// Riceviamo come props l'array delle spese (expenses), la funzione per aggiornarlo (setExpenses) e un flag per Supabase
function ExpenseForm({ expenses, setExpenses, isSupabase }) {

    // Inizializziamo tre variabili di stato per i campi del form. 
    // All'inizio sono stringhe vuote ('')
    const [description, setDescription] = useState('');
    const [amount, setAmount] = useState('');
    const [category, setCategory] = useState('');
    const [type, setType] = useState('uscita'); // 'entrata' o 'uscita'

    // Questa funzione (handler) viene chiamata quando l'utente clicca su "Aggiungi" o preme Invio
    const handleSubmit = (e) => { // SERVE PER ATTIVARE IL BOTTONE SUBMIT
        // previene il comportamento standard del browser di ricaricare la pagina quando si invia un form
        e.preventDefault();

        // Controllo: se manca anche solo un campo (descrizione, importo o categoria), fermiamo l'esecuzione
        if (!description || !amount || !category) {
            alert("Inserisci tutti i campi")
            return // L'istruzione "return" interrompe la funzione
        }

        // Creiamo un nuovo oggetto 'Spesa' con i dati inseriti dall'utente
        const newExpense = {
            description,    // Equivalente a scrivere description: description
            amount: Number(amount), // Assicuriamo che sia un numero
            category,
            type, // Salviamo se è entrata o uscita
        }

        if (isSupabase) {
            // Su Supabase l'ID e la data vengono generati automaticamente dal database
            setExpenses(newExpense) // Qui setExpenses è in realtà la funzione addExpense del hook
        } else {
            // Vecchia logica per LocalStorage (per retrocompatibilità)
            newExpense.id = Date.now()
            newExpense.createdAt = new Date()
            setExpenses([...expenses, newExpense])
        }

        // Dopo aver aggiunto la spesa, svuotiamo i campi del form reimpostandoli a stringa vuota
        setDescription('');
        setAmount('');
        setCategory('');
        setType('uscita'); // Reset al default

    }


    return (
        <div className="expense-form-container">
            <h2 className="form-description">Aggiungi qui i dettagli</h2>

            {/* Toggle Entrata / Uscita */}
            <div className="type-toggle">
                <button
                    type="button"
                    className={`toggle-btn income ${type === 'entrata' ? 'active' : ''}`}
                    onClick={() => setType('entrata')}
                >
                    Entrata
                </button>
                <button
                    type="button"
                    className={`toggle-btn expense ${type === 'uscita' ? 'active' : ''}`}
                    onClick={() => setType('uscita')}
                >
                    Uscita
                </button>
            </div>

            {/* onSubmit: colleghiamo l'evento di invio del form alla nostra funzione handleSubmit */}
            <form className='expense-form' onSubmit={handleSubmit} >
                {/* qui inserisco la descrizione */}
                {/* value={description}: il valore del campo è legato alla nostra variabile di stato */}
                {/* onChange: ogni volta che l'utente scrive, aggiorniamo la variabile di stato */}
                <input type="text" placeholder="Descrizione"
                    value={description} onChange={(e) => setDescription(e.target.value)} />

                {/* qui inserisco l'importo. type="number" forza l'inserimento di numeri */}
                <input type="number" placeholder="Importo (€)" value={amount} onChange={(e) => setAmount(e.target.value)} />

                {/* qui inserisco la categoria usando un menu a tendina (select) */}
                <select name="" id=""
                    value={category} onChange={(e) => setCategory(e.target.value)}>
                    <option value="">SELEZIONA LA CATEGORIA</option>
                    {CATEGORIES.map((cat) => (
                        <option key={cat} value={cat}>
                            {cat}
                        </option>
                    ))}
                </select>
                {/* Bottone che fa scattare l'evento di "submit" del form */}
                <button type="submit">Aggiungi</button>
            </form>

        </div>
    );
}

export default ExpenseForm