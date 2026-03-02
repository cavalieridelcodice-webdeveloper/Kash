import { useState, useEffect } from 'react';

/**
 * Custom Hook per gestire le spese nel localStorage.
 * Estrae tutta la logica di persistenza e gestione (aggiunta, modifica, eliminazione)
 * rendendo il componente App.jsx più pulito.
 */
export function useExpenses() {
    // Inizializziamo lo stato leggendo dal localStorage
    const [expenses, setExpenses] = useState(() => {
        const saved = localStorage.getItem('expenses');
        if (saved) {
            try {
                return JSON.parse(saved);
            } catch (e) {
                console.error("Errore nel parsing delle spese dal localStorage", e);
                return [];
            }
        }
        return [];
    });

    // Salviamo nel localStorage ogni volta che la lista delle spese cambia
    useEffect(() => {
        // Se l'array è vuoto o non esiste, non sovrascriviamo se non necessario 
        // (o gestiamo il caso di reset)
        localStorage.setItem('expenses', JSON.stringify(expenses));
    }, [expenses]);

    // Funzione per eliminare una spesa con conferma
    const deleteExpense = (id) => {
        if (window.confirm("Sei sicuro di voler eliminare la spesa?")) {
            setExpenses(prevExpenses => prevExpenses.filter(expense => expense.id !== id));
        }
    };

    // Funzione per aggiornare una spesa esistente
    const updateExpense = (id, updatedExpense) => {
        setExpenses(prevExpenses =>
            prevExpenses.map(exp => exp.id === id ? updatedExpense : exp)
        );
    };

    return {
        expenses,
        setExpenses,
        deleteExpense,
        updateExpense
    };
}
