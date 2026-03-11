"use client";

import { useState } from "react";

export default function BudgetsTab({ budgets, setBudgets, formatPHP, deleteBudget, addBudget }) {
  const [showModal, setShowModal] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedBudget, setSelectedBudget] = useState(null);
  const [addAmount, setAddAmount] = useState('');
  const [budgetName, setBudgetName] = useState('');
  const [budgetLimit, setBudgetLimit] = useState('');
  const [budgetCategory, setBudgetCategory] = useState('Food');
  const [budgetPeriod, setBudgetPeriod] = useState('Month');

  // Safe calculation of spent amount
  const calculateSpent = (budget) => {
    return (budget.spent && !isNaN(budget.spent)) ? budget.spent : 0;
  };

  const addBudgetHandler = (e) => {
    e.preventDefault();
    
    const limitValue = parseFloat(budgetLimit) || 0;
    
    const newBudget = {
      id: Date.now(),
      name: budgetName,
      limit_amount: limitValue,
      category: budgetCategory,
      period: budgetPeriod,
      spent: 0
    };
    
    if (addBudget) {
      addBudget(newBudget);
    } else {
      setBudgets([...budgets, newBudget]);
    }
    
    setShowModal(false);
    setBudgetName('');
    setBudgetLimit('');
  };

  const handleAddExpense = () => {
    if (!selectedBudget || !addAmount) return;
    
    const amount = parseFloat(addAmount) || 0;
    if (amount <= 0) return;
    
    const updatedBudget = {
      ...selectedBudget,
      spent: (selectedBudget.spent || 0) + amount
    };
    
    setBudgets(budgets.map(b => 
      b.id === selectedBudget.id ? updatedBudget : b
    ));
    
    setShowAddModal(false);
    setSelectedBudget(null);
    setAddAmount('');
  };

  return (
    <section id="view-budgets" className="view-section">
      {/* Header */}
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        marginBottom: '2rem',
        flexWrap: 'wrap',
        gap: '15px'
      }}>
        <h3 style={{ fontSize: 'clamp(1.5rem, 5vw, 2rem)', margin: 0 }}>Your Budgets</h3>
        <button 
          className="btn btn-primary" 
          onClick={() => setShowModal(true)}
          style={{
            padding: '12px 24px',
            fontSize: '1rem',
            borderRadius: '12px',
            whiteSpace: 'nowrap',
            background: '#10B981',
            color: 'white',
            border: 'none',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            transition: 'all 0.2s'
          }}
          onMouseEnter={(e) => e.currentTarget.style.background = '#059669'}
          onMouseLeave={(e) => e.currentTarget.style.background = '#10B981'}
        >
          <span>+</span>
          New Budget
        </button>
      </div>

      {/* Budgets Grid */}
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
        gap: '20px'
      }}>
        {budgets && budgets.length > 0 ? budgets.map(b => {
          const spent = calculateSpent(b);
          const limit = b.limit_amount || 0;
          const percentage = limit > 0 ? (spent / limit) * 100 : 0;
          const isOverBudget = spent > limit;
          
          return (
            <div key={b.id} style={{
              background: 'white',
              padding: '20px',
              borderRadius: '16px',
              border: '1px solid #E5E7EB',
              boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
              borderLeft: isOverBudget ? '4px solid #ef4444' : '4px solid #10B981'
            }}>
              <div style={{ 
                display: 'flex', 
                justifyContent: 'space-between',
                alignItems: 'flex-start',
                marginBottom: '15px'
              }}>
                <div>
                  <h4 style={{ margin: 0, fontSize: '1.1rem', fontWeight: '700' }}>{b.name}</h4>
                  <span style={{ fontSize: '0.8rem', color: '#6B7280' }}>{b.period} • {b.category}</span>
                </div>
                <button
                  onClick={() => deleteBudget(b.id)}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: '#9CA3AF',
                    cursor: 'pointer',
                    fontSize: '1rem',
                    padding: '4px 8px',
                    borderRadius: '4px',
                    transition: 'all 0.2s'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.color = '#ef4444'}
                  onMouseLeave={(e) => e.currentTarget.style.color = '#9CA3AF'}
                >
                  Remove
                </button>
              </div>

              {/* Progress Bar */}
              <div style={{ marginBottom: '15px' }}>
                <div style={{ 
                  display: 'flex', 
                  justifyContent: 'space-between',
                  marginBottom: '5px',
                  fontSize: '0.9rem'
                }}>
                  <span style={{ color: '#6B7280' }}>Spent: {formatPHP(spent)}</span>
                  <span style={{ color: '#6B7280' }}>Limit: {formatPHP(limit)}</span>
                </div>
                <div style={{
                  height: '8px',
                  background: '#F3F4F6',
                  borderRadius: '10px',
                  overflow: 'hidden'
                }}>
                  <div style={{
                    width: `${Math.min(percentage, 100)}%`,
                    height: '100%',
                    background: isOverBudget ? '#ef4444' : '#10B981',
                    borderRadius: '10px',
                    transition: 'width 0.3s ease'
                  }}></div>
                </div>
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  marginTop: '5px',
                  fontSize: '0.85rem'
                }}>
                  <span style={{ color: isOverBudget ? '#ef4444' : '#10B981' }}>
                    {percentage.toFixed(1)}% used
                  </span>
                  <span style={{ color: isOverBudget ? '#ef4444' : '#6B7280' }}>
                    Remaining: {formatPHP(Math.max(0, limit - spent))}
                  </span>
                </div>
              </div>

              {/* Add Expense Button */}
              <button
                onClick={() => {
                  setSelectedBudget(b);
                  setShowAddModal(true);
                }}
                style={{
                  width: '100%',
                  padding: '10px',
                  background: '#F3F4F6',
                  color: '#1F2937',
                  border: '1px dashed #9CA3AF',
                  borderRadius: '8px',
                  fontSize: '0.9rem',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '6px',
                  transition: 'all 0.2s'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = '#E5E7EB';
                  e.currentTarget.style.borderColor = '#10B981';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = '#F3F4F6';
                  e.currentTarget.style.borderColor = '#9CA3AF';
                }}
              >
                <span>+</span>
                Add Expense
              </button>
            </div>
          );
        }) : (
          <div style={{
            gridColumn: '1 / -1',
            textAlign: 'center',
            padding: '40px 20px',
            background: '#F9FAFB',
            borderRadius: '16px',
            border: '2px dashed #E5E7EB'
          }}>
            <span style={{ fontSize: '3rem', display: 'block', marginBottom: '15px' }}>💰</span>
            <h3 style={{ color: '#4B5563', marginBottom: '8px' }}>No Budgets Yet</h3>
            <p style={{ color: '#9CA3AF', marginBottom: '20px' }}>
              Create your first budget to track spending
            </p>
            <button 
              onClick={() => setShowModal(true)}
              style={{
                padding: '10px 24px',
                fontSize: '0.95rem',
                background: '#10B981',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px'
              }}
              onMouseEnter={(e) => e.currentTarget.style.background = '#059669'}
              onMouseLeave={(e) => e.currentTarget.style.background = '#10B981'}
            >
              <span>+</span>
              Create Your First Budget
            </button>
          </div>
        )}
      </div>

      {/* Add Budget Modal */}
      {showModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          background: 'rgba(0,0,0,0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 2000,
          padding: '15px',
          backdropFilter: 'blur(4px)'
        }}>
          <div style={{
            background: 'white',
            padding: '25px',
            borderRadius: '20px',
            width: '100%',
            maxWidth: '500px',
            boxShadow: '0 20px 40px rgba(0,0,0,0.2)'
          }}>
            <h3 style={{ marginBottom: '20px', fontSize: '1.5rem' }}>Create New Budget</h3>
            
            <form onSubmit={addBudgetHandler}>
              {/* Budget Name */}
              <div style={{ marginBottom: '15px' }}>
                <label style={{ display: 'block', marginBottom: '5px', fontWeight: '600' }}>
                  Budget Name
                </label>
                <input
                  type="text"
                  value={budgetName}
                  onChange={(e) => setBudgetName(e.target.value)}
                  required
                  placeholder="e.g., Monthly Groceries"
                  style={{
                    width: '100%',
                    padding: '10px',
                    border: '1px solid #E5E7EB',
                    borderRadius: '8px',
                    fontSize: '0.95rem'
                  }}
                />
              </div>

              {/* Period and Category */}
              <div style={{ 
                display: 'grid', 
                gridTemplateColumns: '1fr 1fr',
                gap: '10px',
                marginBottom: '15px'
              }}>
                <div>
                  <label style={{ display: 'block', marginBottom: '5px', fontWeight: '600' }}>
                    Period
                  </label>
                  <select
                    value={budgetPeriod}
                    onChange={(e) => setBudgetPeriod(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '10px',
                      border: '1px solid #E5E7EB',
                      borderRadius: '8px'
                    }}
                  >
                    <option value="Week">Weekly</option>
                    <option value="Month">Monthly</option>
                    <option value="Year">Yearly</option>
                  </select>
                </div>
                <div>
                  <label style={{ display: 'block', marginBottom: '5px', fontWeight: '600' }}>
                    Category
                  </label>
                  <select
                    value={budgetCategory}
                    onChange={(e) => setBudgetCategory(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '10px',
                      border: '1px solid #E5E7EB',
                      borderRadius: '8px'
                    }}
                  >
                    <option value="Food">Food</option>
                    <option value="Transport">Transport</option>
                    <option value="Utilities">Utilities</option>
                    <option value="Shopping">Shopping</option>
                    <option value="Entertainment">Entertainment</option>
                    <option value="Health">Health</option>
                    <option value="Education">Education</option>
                  </select>
                </div>
              </div>

              {/* Limit Amount */}
              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', marginBottom: '5px', fontWeight: '600' }}>
                  Limit Amount (₱)
                </label>
                <input
                  type="number"
                  value={budgetLimit}
                  onChange={(e) => setBudgetLimit(e.target.value)}
                  required
                  placeholder="0.00"
                  min="0"
                  step="0.01"
                  style={{
                    width: '100%',
                    padding: '10px',
                    border: '1px solid #E5E7EB',
                    borderRadius: '8px',
                    fontSize: '0.95rem'
                  }}
                />
              </div>

              {/* Buttons */}
              <div style={{ display: 'flex', gap: '10px' }}>
                <button
                  type="submit"
                  style={{
                    flex: 2,
                    padding: '12px',
                    background: '#10B981',
                    color: 'white',
                    border: 'none',
                    borderRadius: '8px',
                    fontSize: '0.95rem',
                    fontWeight: '600',
                    cursor: 'pointer'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.background = '#059669'}
                  onMouseLeave={(e) => e.currentTarget.style.background = '#10B981'}
                >
                  Create Budget
                </button>
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  style={{
                    flex: 1,
                    padding: '12px',
                    background: 'white',
                    color: '#6B7280',
                    border: '1px solid #E5E7EB',
                    borderRadius: '8px',
                    cursor: 'pointer'
                  }}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Expense Modal */}
      {showAddModal && selectedBudget && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          background: 'rgba(0,0,0,0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 2000,
          padding: '15px',
          backdropFilter: 'blur(4px)'
        }}>
          <div style={{
            background: 'white',
            padding: '25px',
            borderRadius: '20px',
            width: '100%',
            maxWidth: '400px',
            boxShadow: '0 20px 40px rgba(0,0,0,0.2)'
          }}>
            <h3 style={{ marginBottom: '15px', fontSize: '1.3rem' }}>
              Add Expense to "{selectedBudget.name}"
            </h3>
            
            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600' }}>
                Amount (₱)
              </label>
              <input
                type="number"
                value={addAmount}
                onChange={(e) => setAddAmount(e.target.value)}
                placeholder="Enter amount"
                min="0"
                step="0.01"
                style={{
                  width: '100%',
                  padding: '12px',
                  border: '1px solid #E5E7EB',
                  borderRadius: '8px',
                  fontSize: '1rem',
                  outline: 'none'
                }}
                autoFocus
              />
            </div>
            
            <div style={{ display: 'flex', gap: '10px' }}>
              <button
                onClick={handleAddExpense}
                style={{
                  flex: 2,
                  padding: '12px',
                  background: '#10B981',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  fontSize: '0.95rem',
                  fontWeight: '600',
                  cursor: 'pointer'
                }}
              >
                Add Expense
              </button>
              <button
                onClick={() => {
                  setShowAddModal(false);
                  setSelectedBudget(null);
                  setAddAmount('');
                }}
                style={{
                  flex: 1,
                  padding: '12px',
                  background: 'white',
                  color: '#6B7280',
                  border: '1px solid #E5E7EB',
                  borderRadius: '8px',
                  cursor: 'pointer'
                }}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}