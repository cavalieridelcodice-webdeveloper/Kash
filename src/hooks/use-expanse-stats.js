import { useMemo } from 'react';

/**
 * Custom Hook per calcolare le statistiche delle spese (entrate, uscite, saldo).
 * Estrae la logica di calcolo da Dashboard.jsx per rendere il componente più pulito.
 */
export function useExpenseStats(expenses) {
    // Usiamo useMemo per ricalcolare i valori solo quando l'array expenses cambia effettivamente.
    // Questo ottimizza le prestazioni evitando ricalcoli inutili ad ogni render.

    return useMemo(() => {
        // Calcolo totale Entrate
        const totalIncome = expenses
            .filter(exp => exp.type === 'entrata')
            .reduce((acc, exp) => acc + Number(exp.amount), 0);

        // Calcolo totale Uscite
        const totalExpense = expenses
            .filter(exp => exp.type === 'uscita')
            .reduce((acc, exp) => acc + Number(exp.amount), 0);

        // Calcolo Saldo (Entrate - Uscite)
        const balance = totalIncome - totalExpense;

        // Formattazione dati per il grafico Recharts
        const chartData = [
            { name: 'Entrate', value: totalIncome },
            { name: 'Uscite', value: totalExpense }
        ];

        // Se non ci sono dati (entrambi i totali a zero)
        const hasData = totalIncome > 0 || totalExpense > 0;

        return {
            totalIncome,
            totalExpense,
            balance,
            chartData,
            hasData
        };
    }, [expenses]);
}
