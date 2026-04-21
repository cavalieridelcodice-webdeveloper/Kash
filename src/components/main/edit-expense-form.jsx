// Dashboard: Modulo per la modifica dei dettagli di una spesa esistente.
import { useState } from 'react'
import { CATEGORIES } from '../../data/expense'

function EditExpenseForm({ expense, onSave, onCancel }) {
    const [description, setDescription] = useState(expense.description)
    const [amount, setAmount] = useState(expense.amount)
    const [category, setCategory] = useState(expense.category)

    const handleSubmit = (e) => {
        e.preventDefault()
        if (!description || !amount || !category) return

        onSave(expense.id, {
            ...expense,
            description,
            amount: Number(amount),
            category
        })
    }

    return (
        <form className="edit-expense-form" onSubmit={handleSubmit}>
            <input
                type="text"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Descrizione"
            />
            <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="Importo (€)"
            />
            <select value={category} onChange={(e) => setCategory(e.target.value)}>
                {CATEGORIES.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                ))}
            </select>
            <div className="edit-actions">
                <button type="submit" className="btn-save">Salva</button>
                <button type="button" className="btn-cancel" onClick={onCancel}>Annulla</button>
            </div>
        </form>
    )
}

export default EditExpenseForm
