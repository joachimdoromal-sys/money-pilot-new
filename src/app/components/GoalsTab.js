"use client";

import { useState } from "react";

export default function GoalsTab({ goals, setGoals, formatPHP, formatDate, deleteGoal, addGoal }) {
  const [showModal, setShowModal] = useState(false);
  const [goalName, setGoalName] = useState('');
  const [goalTarget, setGoalTarget] = useState('');
  const [goalDate, setGoalDate] = useState('');
  const [selectedIcon, setSelectedIcon] = useState('fa-star');

  // Icon options for goals - matching feature card style
  const iconOptions = [
    { name: 'Star', icon: 'fa-star' },
    { name: 'Heart', icon: 'fa-heart' },
    { name: 'Gift', icon: 'fa-gift' },
    { name: 'Laptop', icon: 'fa-laptop' },
    { name: 'Piggy Bank', icon: 'fa-piggy-bank' },
    { name: 'Plane', icon: 'fa-plane' },
    { name: 'Car', icon: 'fa-car' },
    { name: 'House', icon: 'fa-house' },
    { name: 'Graduation', icon: 'fa-graduation-cap' },
    { name: 'Utensils', icon: 'fa-utensils' },
    { name: 'Pen', icon: 'fa-pen' },
    { name: 'Computer', icon: 'fa-computer' }
  ];

  const addGoalHandler = (e) => {
    e.preventDefault();
    
    const newGoal = {
      id: Date.now(),
      name: goalName,
      target: parseFloat(goalTarget),
      date: goalDate,
      saved: 0,
      icon: selectedIcon
    };
    
    if (addGoal) {
      addGoal(newGoal);
    } else {
      setGoals([...goals, newGoal]);
    }
    
    setShowModal(false);
    setGoalName('');
    setGoalTarget('');
    setGoalDate('');
    setSelectedIcon('fa-star');
  };

  return (
    <section id="view-goals" className="view-section">
      {/* Header */}
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        marginBottom: '2rem',
        flexWrap: 'wrap',
        gap: '15px'
      }}>
        <h3 style={{ fontSize: 'clamp(1.5rem, 5vw, 2rem)', margin: 0 }}>Savings Goals</h3>
        <button 
          className="btn btn-primary" 
          onClick={() => setShowModal(true)}
          style={{
            padding: '12px 24px',
            fontSize: '1rem',
            borderRadius: '12px',
            whiteSpace: 'nowrap'
          }}
        >
          <i className="fa-solid fa-plus" style={{ marginRight: '8px' }}></i>
          New Goal
        </button>
      </div>

      {/* Goals Grid */}
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
        gap: '20px',
        padding: '5px'
      }}>
        {goals && goals.length > 0 ? goals.map(g => {
          const pct = (g.saved / g.target) * 100;
          return (
            <div key={g.id} style={{
              background: 'white',
              padding: '20px',
              borderRadius: '16px',
              border: '1px solid #E5E7EB',
              transition: 'all 0.3s ease',
              boxShadow: '0 2px 8px rgba(0,0,0,0.05)'
            }}>
              <div style={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: '15px',
                marginBottom: '15px'
              }}>
                {/* Icon Box - matching feature card style */}
                <div style={{
                  width: '50px',
                  height: '50px',
                  backgroundColor: '#D1FAE5',
                  color: '#059669',
                  borderRadius: '12px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '1.5rem',
                  flexShrink: 0
                }}>
                  <i className={`fa-solid ${g.icon || 'fa-star'}`}></i>
                </div>

                {/* Details */}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ 
                    fontWeight: '700', 
                    fontSize: '1.1rem',
                    marginBottom: '4px',
                    color: '#1F2937',
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis'
                  }}>
                    {g.name}
                  </div>
                  <div style={{ 
                    fontSize: '0.9rem', 
                    color: '#6B7280'
                  }}>
                    ₱{g.target.toLocaleString()}
                  </div>
                  {g.date && (
                    <div style={{ 
                      fontSize: '0.8rem', 
                      color: '#9CA3AF'
                    }}>
                      Due: {formatDate(g.date)}
                    </div>
                  )}
                </div>

                {/* Delete Button */}
                <button
                  onClick={() => deleteGoal(g.id)}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: '#9CA3AF',
                    cursor: 'pointer',
                    fontSize: '1rem',
                    padding: '8px',
                    borderRadius: '50%',
                    transition: 'all 0.2s',
                    width: '36px',
                    height: '36px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = '#FEE2E2';
                    e.currentTarget.style.color = '#EF4444';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = 'none';
                    e.currentTarget.style.color = '#9CA3AF';
                  }}
                >
                  <i className="fa-solid fa-trash"></i>
                </button>
              </div>

              {/* Progress Bar */}
              <div>
                <div style={{ 
                  display: 'flex', 
                  justifyContent: 'space-between',
                  marginBottom: '5px',
                  fontSize: '0.85rem'
                }}>
                  <span style={{ color: '#6B7280' }}>Progress</span>
                  <span style={{ 
                    fontWeight: '600',
                    color: '#10B981'
                  }}>{Math.round(pct)}%</span>
                </div>
                <div style={{
                  height: '8px',
                  background: '#F3F4F6',
                  borderRadius: '10px',
                  overflow: 'hidden'
                }}>
                  <div style={{
                    width: `${pct}%`,
                    height: '100%',
                    background: '#10B981',
                    borderRadius: '10px',
                    transition: 'width 0.3s ease'
                  }}></div>
                </div>
              </div>
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
            <i className="fa-solid fa-bullseye" style={{ 
              fontSize: '3rem', 
              color: '#D1D5DB',
              marginBottom: '15px'
            }}></i>
            <h3 style={{ color: '#4B5563', marginBottom: '8px' }}>No Goals Yet</h3>
            <p style={{ color: '#9CA3AF', marginBottom: '20px' }}>
              Start saving for something special!
            </p>
            <button 
              className="btn btn-primary"
              onClick={() => setShowModal(true)}
              style={{
                padding: '10px 24px',
                fontSize: '0.95rem'
              }}
            >
              <i className="fa-solid fa-plus" style={{ marginRight: '8px' }}></i>
              Create Your First Goal
            </button>
          </div>
        )}
      </div>

      {/* Add Goal Modal */}
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
            maxHeight: '90vh',
            overflow: 'auto',
            boxShadow: '0 20px 40px rgba(0,0,0,0.2)'
          }}>
            <h3 style={{ 
              marginBottom: '20px',
              fontSize: '1.5rem',
              color: '#1F2937'
            }}>
              Create New Goal
            </h3>
            
            <form onSubmit={addGoalHandler}>
              {/* Goal Name */}
              <div style={{ marginBottom: '20px' }}>
                <label style={{ 
                  display: 'block', 
                  marginBottom: '5px', 
                  fontWeight: '600',
                  color: '#4B5563',
                  fontSize: '0.9rem'
                }}>
                  Goal Name
                </label>
                <input
                  type="text"
                  value={goalName}
                  onChange={(e) => setGoalName(e.target.value)}
                  required
                  placeholder="e.g., New Laptop"
                  style={{
                    width: '100%',
                    padding: '12px',
                    border: '1px solid #E5E7EB',
                    borderRadius: '8px',
                    fontSize: '0.95rem',
                    outline: 'none'
                  }}
                  onFocus={(e) => e.target.style.borderColor = '#10B981'}
                  onBlur={(e) => e.target.style.borderColor = '#E5E7EB'}
                />
              </div>

              {/* Icon Selection - matching feature card style */}
              <div style={{ marginBottom: '20px' }}>
                <label style={{ 
                  display: 'block', 
                  marginBottom: '10px', 
                  fontWeight: '600',
                  color: '#4B5563',
                  fontSize: '0.9rem'
                }}>
                  Choose Icon
                </label>
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fill, minmax(45px, 1fr))',
                  gap: '8px'
                }}>
                  {iconOptions.map((icon) => (
                    <button
                      key={icon.icon}
                      type="button"
                      onClick={() => setSelectedIcon(icon.icon)}
                      style={{
                        padding: '10px 0',
                        border: selectedIcon === icon.icon ? '2px solid #10B981' : '1px solid #E5E7EB',
                        borderRadius: '8px',
                        background: selectedIcon === icon.icon ? '#ECFDF5' : 'white',
                        cursor: 'pointer',
                        fontSize: '1.2rem',
                        color: selectedIcon === icon.icon ? '#10B981' : '#6B7280',
                        transition: 'all 0.2s'
                      }}
                      title={icon.name}
                    >
                      <i className={`fa-solid ${icon.icon}`}></i>
                    </button>
                  ))}
                </div>
              </div>

              {/* Amount and Date */}
              <div style={{ 
                display: 'grid', 
                gridTemplateColumns: '1fr 1fr',
                gap: '15px',
                marginBottom: '20px'
              }}>
                <div>
                  <label style={{ 
                    display: 'block', 
                    marginBottom: '5px', 
                    fontWeight: '600',
                    color: '#4B5563',
                    fontSize: '0.9rem'
                  }}>
                    Target (₱)
                  </label>
                  <input
                    type="number"
                    value={goalTarget}
                    onChange={(e) => setGoalTarget(e.target.value)}
                    required
                    placeholder="0.00"
                    min="0"
                    step="0.01"
                    style={{
                      width: '100%',
                      padding: '12px',
                      border: '1px solid #E5E7EB',
                      borderRadius: '8px',
                      fontSize: '0.95rem',
                      outline: 'none'
                    }}
                    onFocus={(e) => e.target.style.borderColor = '#10B981'}
                    onBlur={(e) => e.target.style.borderColor = '#E5E7EB'}
                  />
                </div>
                <div>
                  <label style={{ 
                    display: 'block', 
                    marginBottom: '5px', 
                    fontWeight: '600',
                    color: '#4B5563',
                    fontSize: '0.9rem'
                  }}>
                    Target Date
                  </label>
                  <input
                    type="date"
                    value={goalDate}
                    onChange={(e) => setGoalDate(e.target.value)}
                    required
                    style={{
                      width: '100%',
                      padding: '12px',
                      border: '1px solid #E5E7EB',
                      borderRadius: '8px',
                      fontSize: '0.95rem',
                      outline: 'none'
                    }}
                    onFocus={(e) => e.target.style.borderColor = '#10B981'}
                    onBlur={(e) => e.target.style.borderColor = '#E5E7EB'}
                  />
                </div>
              </div>

              {/* Buttons */}
              <div style={{ 
                display: 'flex', 
                gap: '10px', 
                marginTop: '25px'
              }}>
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
                    cursor: 'pointer',
                    transition: 'background 0.2s'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.background = '#059669'}
                  onMouseLeave={(e) => e.currentTarget.style.background = '#10B981'}
                >
                  Create Goal
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
                    fontSize: '0.95rem',
                    cursor: 'pointer',
                    transition: 'background 0.2s'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.background = '#F9FAFB'}
                  onMouseLeave={(e) => e.currentTarget.style.background = 'white'}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </section>
  );
}