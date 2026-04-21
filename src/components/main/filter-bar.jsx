import { CATEGORIES } from "../../data/expense"
// Dashboard: Barra superiore per il filtraggio delle spese per testo, importo, categoria e data.
import './filter-bar.css'

function FilterBar({ searchText, setSearchText, searchAmount, setSearchAmount, category, setCategory, searchDate, setSearchDate }) {
    const hasFilters = searchText || searchAmount || category || searchDate //serve per vedere se ci sono filtri attivi
    return (
        <div className="filter-bar">
            <div className="filter-group">
                <label>Cerca</label>
                <input
                    type="text"
                    placeholder="Nome spesa..."
                    value={searchText}
                    onChange={(e) => setSearchText(e.target.value)}
                />
            </div>

            <div className="filter-group">
                <label>Prezzo</label>
                <input
                    type="number"
                    placeholder="Importo (€)..."
                    value={searchAmount}
                    onChange={(e) => setSearchAmount(e.target.value)}
                />
            </div>

            <div className="filter-group">
                <label>Categoria</label>
                <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                >
                    <option value="">Tutte</option>
                    {CATEGORIES.map((cat) => (
                        <option key={cat} value={cat}>
                            {cat}
                        </option>
                    ))}
                </select>

            </div>

            <div className="filter-group">
                <label>Data</label>
                <input
                    type="date"
                    value={searchDate}
                    onChange={(e) => setSearchDate(e.target.value)}
                />
            </div>

            {hasFilters && ( //
                <button onClick={() => {
                    setSearchText('')
                    setSearchAmount('')
                    setCategory('')
                    setSearchDate('')
                }}>Svuota filtri</button>
            )}
        </div>
    )
}

export default FilterBar