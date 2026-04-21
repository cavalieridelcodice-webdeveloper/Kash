// Dashboard: Visualizzazione del singolo elemento spesa con pulsanti di modifica ed eliminazione.
import './expense-item.css'
import EditExpenseForm from './edit-expense-form'

// Componente figlio che mostra nel dettaglio i dati di una specifica spesa in riga.
// Riceve tutti i vari dati dalla prop 'expense'
function ExpenseItem({ expense, isEditing, onEdit, onSave, onCancel, onDelete }) {

    // Usiamo toLocaleString per mostrare sia data che orario formattati
    const rawDate = expense.created_at || expense.createdAt
    const formattedDate = rawDate ? new Date(rawDate).toLocaleString('it-IT', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    }) : 'Data non disponibile'
    if (isEditing) {
        return (
            <li className="expense-item editing">
                <EditExpenseForm
                    expense={expense}
                    onSave={onSave}
                    onCancel={onCancel}
                />
            </li>
        )
    }

    const isIncome = expense.type === 'entrata'
    const amountColorClass = isIncome ? 'income-text' : 'expense-text'
    const amountPrefix = isIncome ? '+ ' : '- '

    return (
        // Creiamo la riga "elenco" con le sue colonne ed applichiamo il formatting
        // Mostrando le chiavi dell'oggetto (description, amount, e category)
        <li className="expense-item">
            <span className="col desc">{expense.description}</span>
            <span className={`col amt ${amountColorClass}`}>
                {amountPrefix}{expense.amount} €
            </span>
            <span className="col cat">{expense.category}</span>
            <span className="col date">{formattedDate}</span>
            <div className="item-actions">
                <button className="btn-edit" onClick={onEdit}>Modifica</button>
                <button className="btn-delete" onClick={() => onDelete(expense.id)}>Elimina</button>
            </div>
        </li>
    );
}

export default ExpenseItem