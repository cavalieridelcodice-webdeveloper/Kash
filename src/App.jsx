import './App.css'
import { useState, useEffect } from 'react'
import { supabase } from './supabaseClient'
import Dashboard from './components/main/dashboard'
import { useSupabaseExpenses } from './hooks/use-supabase-expenses'
import WelcomeModal from './components/main/welcome-modal'
import Header from './components/navbar/hearder'
import ExpenseForm from './components/main/expense-form'
import ExpenseList from './components/main/expense-list'
import FilterBar from './components/main/filter-bar'
import Login from './components/auth/Login'
import Footer from './components/footer/Footer'

function App() {
  const [session, setSession] = useState(null)

  // Utilizziamo il nuovo hook per gestire le spese su Supabase
  const { expenses, addExpense, deleteExpense, updateExpense: updateExpenseBase, loading } = useSupabaseExpenses(session)

  const [username, setUsername] = useState('')

  useEffect(() => {
    if (session?.user) {
      // Usa SOLO il nome salvato, così se è nuovo mostrerà la modale
      const savedName = localStorage.getItem(`app_username_${session.user.id}`)
      setUsername(savedName || '')
    }
  }, [session])

  const [searchText, setSearchText] = useState('')
  const [searchAmount, setSearchAmount] = useState('')
  const [searchCategory, setSearchCategory] = useState('')
  const [searchDate, setSearchDate] = useState('')
  const [editingId, setEditingId] = useState(null)

  useEffect(() => {
    // Carica la sessione attuale
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
    })

    // Ascolta i cambiamenti di stato (Login/Logout)
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
    })

    return () => subscription.unsubscribe()
  }, [])

  // Wrapper per chiudere il form di editing dopo il salvataggio
  const updateExpense = (id, updatedExpense) => {
    updateExpenseBase(id, updatedExpense)
    setEditingId(null)
  }

  const handleSaveName = (name) => {
    if (session?.user) {
      localStorage.setItem(`app_username_${session.user.id}`, name)
      setUsername(name)
    }
  }

  // --- LOGICA DI FILTRAGGIO ---
  // filteredExpenses è la lista "dinamica" che mostriamo all'utente.
  // Usiamo .filter() per creare una nuova lista che contiene solo le spese che rispettano i filtri.
  const filteredExpenses = expenses.filter(expense => {
    // 1. Filtro per Testo: controlliamo se la descrizione include il testo cercato (ignorando maiuscole/minuscole)
    const matchesText = expense.description.toLowerCase().includes(searchText.toLowerCase())

    // 2. Filtro per Importo: se il campo è vuoto passa tutto, altrimenti cerca la corrispondenza
    const matchesAmount = searchAmount === '' || expense.amount.toString().includes(searchAmount)

    // 3. Filtro per Categoria: se non è selezionata nulla passa tutto, altrimenti confronta la stringa
    const matchesCategory = searchCategory === '' || expense.category === searchCategory

    // 4. Filtro per Data: confrontiamo solo la parte YYYY-MM-DD dell'oggetto Date
    const rawDate = expense.created_at || expense.createdAt
    const expenseDate = rawDate ? new Date(rawDate).toISOString().split('T')[0] : ''
    const matchesDate = searchDate === '' || expenseDate === searchDate

    // Una spesa viene mostrata solo se rispetta TUTTI i filtri (&&)
    return matchesText && matchesAmount && matchesCategory && matchesDate
  })

  const handleLogout = async () => {
    await supabase.auth.signOut()
  }

  // Se non c'è una sessione, mostriamo la pagina di Login
  if (!session) {
    return <Login />
  }

  // Il 'return' restituisce il codice JSX (simile all'HTML) che verrà mostrato sullo schermo.
  return (
    // Questo tag vuoto <> </> si chiama "Fragment" e serve a raggruppare più elementi genitore
    <>
      {/* Mostriamo l'intestazione passando la proprietà 'title' */}
      <Header
        title={username}
        onLogout={handleLogout}
      />

      {/* Se l'utente non ha impostato il nome, mostriamo la modale in sovrimpressione */}
      {!username && <WelcomeModal onSaveName={handleSaveName} />}
      {/* Mostriamo la Dashboard passandole tutte le spese per il calcolo e il grafico */}
      <Dashboard expenses={expenses} />

      {/* Passiamo tutti gli stati e le funzioni di aggiornamento alla FilterBar */}
      <FilterBar
        category={searchCategory}
        setCategory={setSearchCategory}
        searchAmount={searchAmount}
        setSearchAmount={setSearchAmount}
        searchDate={searchDate}
        setSearchDate={setSearchDate}
        searchText={searchText}
        setSearchText={setSearchText}
      />
      {/* Mostriamo il form per aggiungere spese */}
      <ExpenseForm expenses={expenses} setExpenses={addExpense} isSupabase={true} />

      {loading ? (
        <p className="loading-text">Caricamento spese dal cloud...</p>
      ) : filteredExpenses.length > 0 && (
        <>
          <p className="search-count">SPESE TROVATE: {filteredExpenses.length}</p>
          <ExpenseList
            expenses={filteredExpenses}
            onDelete={deleteExpense}
            editingId={editingId}
            onEdit={setEditingId}
            onSave={updateExpense}
            onCancel={() => setEditingId(null)}
          />
        </>
      )}

      {/* 
        IMPORTANTE: Qui non passiamo più l'array intero "expenses", 
        ma l'array filtrato "filteredExpenses" 
      */}
      {/* Footer finale con crediti e policy */}
      <Footer />
    </>
  )
}

export default App
