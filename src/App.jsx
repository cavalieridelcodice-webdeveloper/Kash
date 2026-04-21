// Core: Componente principale che gestisce la sessione, il routing e la struttura globale dell'app.
import './App.css'
import { useState, useEffect } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { supabase } from './supabaseClient'
import Dashboard from './components/main/dashboard'
import { useSupabaseExpenses } from './hooks/use-supabase-expenses'
import WelcomeModal from './components/main/welcome-modal'
import Header from './components/navbar/hearder'
import ExpenseForm from './components/main/expense-form'
import ExpenseList from './components/main/expense-list'
import FilterBar from './components/main/filter-bar'
import Login from './components/auth/Login'
import ResetPassword from './components/auth/ResetPassword'
import Footer from './components/footer/Footer'

function MainContent({ session, setSession }) {
  // Utilizziamo il nuovo hook per gestire le spese su Supabase
  const { expenses, addExpense, deleteExpense, updateExpense: updateExpenseBase, loading } = useSupabaseExpenses(session)
  const [username, setUsername] = useState('')

  useEffect(() => {
    if (session?.user) {
      const savedName = localStorage.getItem(`app_username_${session.user.id}`)
      setUsername(savedName || '')
    }
  }, [session])

  const [searchText, setSearchText] = useState('')
  const [searchAmount, setSearchAmount] = useState('')
  const [searchCategory, setSearchCategory] = useState('')
  const [searchDate, setSearchDate] = useState('')
  const [editingId, setEditingId] = useState(null)

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

  const filteredExpenses = expenses.filter(expense => {
    const matchesText = expense.description.toLowerCase().includes(searchText.toLowerCase())
    const matchesAmount = searchAmount === '' || expense.amount.toString().includes(searchAmount)
    const matchesCategory = searchCategory === '' || expense.category === searchCategory
    
    const rawDate = expense.created_at || expense.createdAt
    const expenseDate = rawDate ? new Date(rawDate).toISOString().split('T')[0] : ''
    const matchesDate = searchDate === '' || expenseDate === searchDate

    return matchesText && matchesAmount && matchesCategory && matchesDate
  })

  const handleLogout = async () => {
    await supabase.auth.signOut()
    setSession(null)
  }

  return (
    <>
      <Header
        title={username}
        onLogout={handleLogout}
      />

      {!username && <WelcomeModal onSaveName={handleSaveName} />}
      <Dashboard expenses={expenses} />

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

      <Footer />
    </>
  )
}

function App() {
  const [session, setSession] = useState(null)
  const [initializing, setInitializing] = useState(true)

  useEffect(() => {
    // Carica la sessione attuale
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
      setInitializing(false)
    })

    // Ascolta i cambiamenti di stato (Login/Logout)
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
    })

    return () => subscription.unsubscribe()
  }, [])

  if (initializing) return null;

  return (
    <BrowserRouter>
      <Routes>
        <Route 
          path="/login" 
          element={session ? <Navigate to="/" /> : <Login />} 
        />
        <Route 
          path="/reset-password" 
          element={<ResetPassword />} 
        />
        <Route 
          path="/" 
          element={session ? <MainContent session={session} setSession={setSession} /> : <Navigate to="/login" />} 
        />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
