// Importiamo il componente figlio che ci servirà per renderizzare ogni singola spesa
// Dashboard: Lista che visualizza tutti gli elementi spesa filtrati.
import ExpenseItem from './expense-item'

// Componente per la lista delle spese che riceve come proprietà l'array 'expenses'
function ExpenseList({ expenses, onDelete, editingId, onEdit, onSave, onCancel }) {

    // Se l'array è vuoto (.length è 0), mostriamo un messaggio invece di una tabella vuota
    if (expenses.length === 0) {
        return (
            <p className="no-expenses">Nessuna spesa inserita</p>
        )
    }

    // Creiamo una copia dell'array [...expenses] e usiamo il metodo .sort() per ordinarle cronologicamente.
    // L'ordinamento avviene dalla più recente alla più vecchia, confrontando le date.
    const sortedExpenses = [...expenses].sort((a, b) => {
        // Convertiamo la stringa o il timestamp originario in un vero e proprio oggetto Date per sottrarle
        return new Date(b.createdAt) - new Date(a.createdAt)
    })

    // questo mi permette di vedere la data in cui ho inserito la spesa 
    // all'interno di un layout a griglia o tabella
    return (
        <div className="expense-container">
            {/* Inseriamo l'intestazione delle colonne */}
            <div className="expense-header">
                <span className="col">Descrizione</span>
                <span className="col">Importo (€)</span>
                <span className="col">Categoria</span>
                <span className="col">Data e Ora</span>
                <span className="col">Azione</span>
            </div>

            {/* Usiamo un elenco (ul) per elencare gli elementi iterati */}
            <ul className="expense-list">
                {/* 
                  Usiamo il metodo .map() che ci permette di "ciclare" sull'array "sortedExpenses".
                  Per ognuno degli oggetti generiamo un nuovo componente React: "ExpenseItem".
                  In React è obbligatorio passare una proprietà 'key' univoca (es: expense.id) agli elementi generati tramite mappa.
                */}
                {sortedExpenses.map(expense => (
                    <ExpenseItem
                        key={expense.id}
                        expense={expense}
                        onDelete={onDelete}
                        isEditing={editingId === expense.id}
                        onEdit={() => onEdit(expense.id)}
                        onSave={onSave}
                        onCancel={onCancel}
                    />
                ))}
            </ul>
        </div>
    );
}

export default ExpenseList