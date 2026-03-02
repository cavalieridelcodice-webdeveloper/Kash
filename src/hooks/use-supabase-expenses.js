import { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';

/**
 * Custom Hook per gestire le spese su Supabase.
 * Carica, aggiunge, modifica ed elimina i dati dal database cloud.
 */
export function useSupabaseExpenses(session) {
    const [expenses, setExpenses] = useState([]);
    const [loading, setLoading] = useState(true);

    // Carica le spese dal database
    const fetchExpenses = async () => {
        if (!session?.user) return;

        setLoading(true);
        const { data, error } = await supabase
            .from('expenses')
            .select('*')
            .order('created_at', { ascending: false });

        if (error) {
            console.error('Errore nel caricamento delle spese:', error);
        } else {
            // Mapping per retrocompatibilità con createdAt usato nel frontend
            const mappedData = data.map(exp => ({
                ...exp,
                createdAt: exp.created_at
            }));
            setExpenses(mappedData);
        }
        setLoading(false);
    };

    useEffect(() => {
        fetchExpenses();
    }, [session]);

    // Aggiungi una spesa
    const addExpense = async (newExpense) => {
        const { data, error } = await supabase
            .from('expenses')
            .insert([{
                ...newExpense,
                user_id: session.user.id
            }])
            .select();

        if (error) {
            console.error('Errore nell\'aggiunta della spesa:', error);
        } else if (data) {
            const mappedNew = { ...data[0], createdAt: data[0].created_at };
            setExpenses(prev => [mappedNew, ...prev]);
        }
    };

    // Elimina una spesa
    const deleteExpense = async (id) => {
        if (!window.confirm("Sei sicuro di voler eliminare questa spesa dal cloud?")) return;

        const { error } = await supabase
            .from('expenses')
            .delete()
            .eq('id', id);

        if (error) {
            console.error('Errore nell\'eliminazione della spesa:', error);
        } else {
            setExpenses(prev => prev.filter(exp => exp.id !== id));
        }
    };

    // Aggiorna una spesa
    const updateExpense = async (id, updatedExpense) => {
        // Rimuoviamo la proprietà custom "createdAt" del frontend per non far arrabbiare Supabase
        const { createdAt, ...supabasePayload } = updatedExpense;

        const { data, error } = await supabase
            .from('expenses')
            .update(supabasePayload)
            .eq('id', id)
            .select();

        if (error) {
            console.error('Errore nell\'aggiornamento della spesa:', error);
        } else if (data) {
            const mappedUpdated = { ...data[0], createdAt: data[0].created_at };
            setExpenses(prev => prev.map(exp => (exp.id === id ? mappedUpdated : exp)));
        }
    };

    return {
        expenses,
        loading,
        addExpense,
        deleteExpense,
        updateExpense,
        refresh: fetchExpenses
    };
}
