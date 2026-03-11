"use client";

import { useState } from "react";

export default function DebtsTab({ debts, setDebts, formatPHP, formatDate, deleteDebt }) {
  const [showModal, setShowModal] = useState(false);
  const [debtName, setDebtName] = useState('');
  const [debtAmount, setDebtAmount] = useState('');
  const [debtDate, setDebtDate] = useState('');

  const addDebt = (e) => {
    e.preventDefault();
    const newDebt = {
      id: Date.now(),
      name: debtName,
      amount: parseFloat(debtAmount),
      due_date: debtDate
    };
    setDebts([...debts, newDebt]);
    setShowModal(false);
    setDebtName('');
    setDebtAmount('');
    setDebtDate('');
  };

  return (
    <section id="view-debts" className="view-section">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <h3>Debt Tracker</h3>
        <button className="btn btn-primary" onClick={() => setShowModal(true)}>
          <i className="fa-solid fa-plus"></i> Add Debt
        </button>
      </div>

      <div className="grid-2">
        {debts.map(d => (
          <div key={d.id} className="card" style={{ borderLeft: '4px solid #ef4444' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ fontWeight: 700 }}>{d.name}</span>
              <span style={{ background: '#fee2e2', color: '#ef4444', padding: '4px 8px', borderRadius: '20px', fontSize: '12px' }}>
                Due {formatDate(d.due_date)}
              </span>
            </div>
            <h3 style={{ margin: '10px 0' }}>{formatPHP(d.amount)}</h3>
            <button onClick={() => deleteDebt(d.id)} className="btn btn-outline">Paid</button>
          </div>
        ))}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="modal" style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 2000 }}>
          <div style={{ background: 'white', padding: '30px', borderRadius: '12px', width: '90%', maxWidth: '500px' }}>
            <h3 style={{ marginBottom: '20px' }}>Add Debt</h3>
            <form onSubmit={addDebt}>
              <div style={{ marginBottom: '15px' }}>
                <label style={{ display: 'block', marginBottom: '5px', fontWeight: 500 }}>Description</label>
                <input value={debtName} onChange={(e) => setDebtName(e.target.value)} required style={{ width: '100%', padding: '10px', border: '1px solid #e2e8f0', borderRadius: '6px' }} />
              </div>
              <div style={{ marginBottom: '15px' }}>
                <label style={{ display: 'block', marginBottom: '5px', fontWeight: 500 }}>Amount</label>
                <input type="number" value={debtAmount} onChange={(e) => setDebtAmount(e.target.value)} required style={{ width: '100%', padding: '10px', border: '1px solid #e2e8f0', borderRadius: '6px' }} />
              </div>
              <div style={{ marginBottom: '15px' }}>
                <label style={{ display: 'block', marginBottom: '5px', fontWeight: 500 }}>Due Date</label>
                <input type="date" value={debtDate} onChange={(e) => setDebtDate(e.target.value)} required style={{ width: '100%', padding: '10px', border: '1px solid #e2e8f0', borderRadius: '6px' }} />
              </div>
              <div style={{ display: 'flex', gap: '10px' }}>
                <button type="submit" className="btn btn-primary" style={{ flex: 1 }}>Save</button>
                <button type="button" onClick={() => setShowModal(false)} className="btn btn-outline">Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </section>
  );
}