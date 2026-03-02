import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { useExpenseStats } from '../../hooks/use-expanse-stats';
import './dashboard.css';

function Dashboard({ expenses }) {
    // Utilizziamo l'hook personalizzato per ottenere tutti i calcoli e i dati del grafico
    const { totalIncome, totalExpense, balance, chartData, hasData } = useExpenseStats(expenses);

    // Colori per il grafico: Verde per entrate, Rosso per uscite
    const COLORS = ['#4ade80', '#ff5252'];

    return (
        <div className="dashboard-container">
            <div className="dashboard-header">
                <h2>Panoramica Finanziaria</h2>
                <div className="balance-card">
                    <h3>Saldo Attuale</h3>
                    <p className={`balance-amount ${balance >= 0 ? 'positive' : 'negative'}`} translate="no">
                        <span>{balance.toFixed(2)}</span> €
                    </p>
                </div>
            </div>

            <div className="dashboard-content">
                <div className="summary-cards">
                    <div className="card income-card">
                        <h4>Totale Entrate</h4>
                        <p className="amount" translate="no">+<span>{totalIncome.toFixed(2)}</span> €</p>
                    </div>
                    <div className="card expense-card">
                        <h4>Totale Uscite</h4>
                        <p className="amount" translate="no">-<span>{totalExpense.toFixed(2)}</span> €</p>
                    </div>
                </div>

                {hasData ? (
                    <div className="chart-container">
                        <ResponsiveContainer width="100%" height={300}>
                            <PieChart>
                                <Pie
                                    data={chartData}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={80} // Questo crea l'effetto "ciambella"
                                    outerRadius={120}
                                    paddingAngle={5}
                                    dataKey="value"
                                    stroke="none" // Rimuove il bordo bianco di default
                                >
                                    {chartData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip
                                    formatter={(value) => `${value.toFixed(2)} €`}
                                    contentStyle={{
                                        backgroundColor: 'rgba(0,0,0,0.9)',
                                        border: '1px solid rgba(255,255,255,0.2)',
                                        borderRadius: '12px',
                                        color: '#fff',
                                        padding: '10px 15px',
                                        boxShadow: '0 10px 25px rgba(0,0,0,0.5)',
                                        fontWeight: 'bold'
                                    }}
                                    itemStyle={{ color: '#fff', fontSize: '1.1rem' }}
                                />
                                <Legend verticalAlign="bottom" height={36} iconType="circle" />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                ) : (
                    <div className="no-data-msg">
                        <p>Aggiungi delle entrate o uscite per vedere il grafico.</p>
                    </div>
                )}
            </div>
        </div>
    );
}

export default Dashboard;
