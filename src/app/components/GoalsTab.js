"use client";

import { useState } from "react";

export default function GoalsTab({ goals, setGoals, formatPHP, formatDate, deleteGoal, addGoal }) {
  const [showModal, setShowModal] = useState(false);
  const [goalName, setGoalName] = useState('');
  const [goalTarget, setGoalTarget] = useState('');
  const [goalDate, setGoalDate] = useState('');
  const [selectedIcon, setSelectedIcon] = useState('⭐');

  // Function to convert Font Awesome class to emoji
  const faToEmoji = (faIcon) => {
    const iconMap = {
      'fa-star': '⭐',
      'fa-heart': '❤️',
      'fa-gift': '🎁',
      'fa-laptop': '💻',
      'fa-piggy-bank': '🐷',
      'fa-plane': '✈️',
      'fa-car': '🚗',
      'fa-house': '🏠',
      'fa-graduation-cap': '🎓',
      'fa-utensils': '🍽️',
      'fa-pen': '✏️',
      'fa-computer': '💻',
      'fa-gamepad': '🎮',
      'fa-dumbbell': '💪',
      'fa-camera': '📷',
      'fa-headphones': '🎧',
      'fa-coins': '💰',
      'fa-crown': '👑',
      'fa-mobile-alt': '📱',
      'fa-tv': '📺',
      'fa-motorcycle': '🏍️',
      'fa-bicycle': '🚲',
      'fa-couch': '🛋️',
      'fa-bed': '🛏️',
      'fa-mug-hot': '☕',
      'fa-pizza-slice': '🍕',
      'fa-burger': '🍔',
      'fa-umbrella-beach': '🏖️',
      'fa-campground': '⛺',
      'fa-chart-line': '📈',
      'fa-book': '📚',
      'fa-ring': '💍',
      'fa-heart-pulse': '🏥',
      'fa-spa': '🧘',
      'fa-film': '🎬',
      'fa-music': '🎵',
      'fa-clock': '⌚',
      'fa-gem': '💎',
      'fa-shirt': '👕',
      'fa-flask': '⚗️'
    };
    return iconMap[faIcon] || '⭐';
  };

  // Function to get appropriate emoji based on goal name
  const getEmojiForGoal = (goalName) => {
    const name = goalName.toLowerCase();
    
    // Technology & Electronics
    if (name.includes('monitor') || name.includes('laptop') || name.includes('computer') || name.includes('pc') || name.includes('macbook')) 
      return '💻';
    if (name.includes('phone') || name.includes('iphone') || name.includes('samsung') || name.includes('tablet')) 
      return '📱';
    if (name.includes('camera') || name.includes('gopro')) 
      return '📷';
    if (name.includes('headphone') || name.includes('earbuds') || name.includes('airpods')) 
      return '🎧';
    if (name.includes('tv') || name.includes('television') || name.includes('smart tv')) 
      return '📺';
    
    // Transportation
    if (name.includes('car') || name.includes('vehicle') || name.includes('toyota') || name.includes('honda')) 
      return '🚗';
    if (name.includes('motor') || name.includes('bike') || name.includes('motorcycle')) 
      return '🏍️';
    if (name.includes('bicycle') || name.includes('ebike')) 
      return '🚲';
    
    // Home & Living
    if (name.includes('house') || name.includes('home') || name.includes('apartment') || name.includes('condo')) 
      return '🏠';
    if (name.includes('furniture') || name.includes('sofa') || name.includes('table') || name.includes('chair')) 
      return '🛋️';
    if (name.includes('bed') || name.includes('mattress')) 
      return '🛏️';
    
    // Food & Dining
    if (name.includes('dinner') || name.includes('food') || name.includes('restaurant') || name.includes('groceries')) 
      return '🍽️';
    if (name.includes('coffee') || name.includes('starbucks')) 
      return '☕';
    if (name.includes('pizza')) 
      return '🍕';
    if (name.includes('burger')) 
      return '🍔';
    
    // Travel & Vacation
    if (name.includes('plane') || name.includes('flight') || name.includes('vacation') || name.includes('trip') || name.includes('travel')) 
      return '✈️';
    if (name.includes('hotel') || name.includes('resort') || name.includes('beach')) 
      return '🏖️';
    if (name.includes('camping') || name.includes('tent')) 
      return '⛺';
    
    // Finance & Savings
    if (name.includes('piggy') || name.includes('save') || name.includes('bank') || name.includes('emergency fund')) 
      return '🐷';
    if (name.includes('coin') || name.includes('money') || name.includes('cash')) 
      return '💰';
    if (name.includes('investment') || name.includes('stock') || name.includes('crypto')) 
      return '📈';
    
    // Education
    if (name.includes('grad') || name.includes('school') || name.includes('education') || name.includes('college') || name.includes('university')) 
      return '🎓';
    if (name.includes('book') || name.includes('library') || name.includes('study')) 
      return '📚';
    
    // Gifts & Celebrations
    if (name.includes('gift') || name.includes('present') || name.includes('christmas') || name.includes('birthday')) 
      return '🎁';
    if (name.includes('wedding') || name.includes('anniversary')) 
      return '💍';
    
    // Health & Fitness
    if (name.includes('gym') || name.includes('fitness') || name.includes('workout') || name.includes('exercise')) 
      return '💪';
    if (name.includes('health') || name.includes('medical') || name.includes('doctor') || name.includes('hospital')) 
      return '🏥';
    if (name.includes('yoga') || name.includes('meditation')) 
      return '🧘';
    
    // Entertainment
    if (name.includes('game') || name.includes('playstation') || name.includes('xbox') || name.includes('nintendo')) 
      return '🎮';
    if (name.includes('movie') || name.includes('film') || name.includes('cinema') || name.includes('netflix')) 
      return '🎬';
    if (name.includes('music') || name.includes('concert') || name.includes('festival')) 
      return '🎵';
    
    // Personal & Lifestyle
    if (name.includes('watch') || name.includes('rolex') || name.includes('apple watch')) 
      return '⌚';
    if (name.includes('jewelry') || name.includes('necklace') || name.includes('ring')) 
      return '💎';
    if (name.includes('clothes') || name.includes('shirt') || name.includes('dress') || name.includes('shoes')) 
      return '👕';
    
    // Default
    if (name.includes('test') || name.includes('trial')) 
      return '⚗️';
    if (name.includes('new')) 
      return '⭐';
    if (name.includes('big') || name.includes('large')) 
      return '👑';
    
    return '⭐';
  };

  // Icon options for modal selection - with emojis
  const iconOptions = [
    { name: 'Star', emoji: '⭐' },
    { name: 'Heart', emoji: '❤️' },
    { name: 'Gift', emoji: '🎁' },
    { name: 'Laptop', emoji: '💻' },
    { name: 'Piggy Bank', emoji: '🐷' },
    { name: 'Plane', emoji: '✈️' },
    { name: 'Car', emoji: '🚗' },
    { name: 'House', emoji: '🏠' },
    { name: 'Graduation', emoji: '🎓' },
    { name: 'Food', emoji: '🍽️' },
    { name: 'Pen', emoji: '✏️' },
    { name: 'Game', emoji: '🎮' },
    { name: 'Gym', emoji: '💪' },
    { name: 'Camera', emoji: '📷' },
    { name: 'Headphones', emoji: '🎧' },
    { name: 'Money', emoji: '💰' },
    { name: 'Crown', emoji: '👑' },
    { name: 'Phone', emoji: '📱' },
    { name: 'TV', emoji: '📺' },
    { name: 'Coffee', emoji: '☕' },
    { name: 'Pizza', emoji: '🍕' },
    { name: 'Burger', emoji: '🍔' },
    { name: 'Beach', emoji: '🏖️' },
    { name: 'Tent', emoji: '⛺' },
    { name: 'Chart', emoji: '📈' },
    { name: 'Book', emoji: '📚' },
    { name: 'Ring', emoji: '💍' },
    { name: 'Hospital', emoji: '🏥' },
    { name: 'Yoga', emoji: '🧘' },
    { name: 'Movie', emoji: '🎬' },
    { name: 'Music', emoji: '🎵' },
    { name: 'Watch', emoji: '⌚' },
    { name: 'Gem', emoji: '💎' },
    { name: 'Shirt', emoji: '👕' }
  ];

  // Safe percentage calculation - FIXES NaN%
  const calculatePercentage = (saved, target) => {
    const savedNum = Number(saved) || 0;
    const targetNum = Number(target) || 0;
    if (targetNum <= 0) return 0;
    const percentage = (savedNum / targetNum) * 100;
    return Math.min(percentage, 100);
  };

  const addGoalHandler = (e) => {
    e.preventDefault();
    
    const targetValue = parseFloat(goalTarget) || 0;
    
    const newGoal = {
      id: Date.now(),
      name: goalName,
      target: targetValue,
      date: goalDate,
      saved: 0,
      icon: selectedIcon // Store as emoji, not Font Awesome class
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
    setSelectedIcon('⭐');
  };

  return (
    <section id="view-goals" className="view-section">
      {/* Header with Beautiful New Goal Button */}
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        marginBottom: '2rem',
        flexWrap: 'wrap',
        gap: '15px'
      }}>
        <h3 style={{ fontSize: 'clamp(1.5rem, 5vw, 2rem)', margin: 0, color: '#1F2937' }}>Savings Goals</h3>
        
        {/* Beautiful New Goal Button */}
        <button 
          onClick={() => setShowModal(true)}
          style={{
            padding: '12px 28px',
            fontSize: '1rem',
            fontWeight: '600',
            borderRadius: '50px',
            border: 'none',
            background: 'linear-gradient(135deg, #10B981, #059669)',
            color: 'white',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            boxShadow: '0 8px 20px rgba(16, 185, 129, 0.3)',
            transition: 'all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
            whiteSpace: 'nowrap',
            letterSpacing: '0.3px',
            outline: 'none'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translateY(-2px) scale(1.02)';
            e.currentTarget.style.boxShadow = '0 12px 25px rgba(16, 185, 129, 0.4)';
            e.currentTarget.style.background = 'linear-gradient(135deg, #059669, #047857)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translateY(0) scale(1)';
            e.currentTarget.style.boxShadow = '0 8px 20px rgba(16, 185, 129, 0.3)';
            e.currentTarget.style.background = 'linear-gradient(135deg, #10B981, #059669)';
          }}
        >
          <span style={{ 
            fontSize: '1.3rem', 
            fontWeight: '400',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'rgba(255,255,255,0.2)',
            width: '24px',
            height: '24px',
            borderRadius: '50%'
          }}>+</span>
          <span>New Goal</span>
        </button>
      </div>

      {/* Goals Grid */}
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
        gap: '20px',
        padding: '5px'
      }}>
        {goals && goals.length > 0 ? goals.map(g => {
          // Determine which emoji to show:
          // 1. If it's already an emoji (starts with non-letter), use it
          // 2. If it's a Font Awesome class (starts with 'fa-'), convert it
          // 3. Otherwise, generate based on name
          let displayEmoji = '⭐';
          
          if (g.icon) {
            if (g.icon.startsWith('fa-')) {
              displayEmoji = faToEmoji(g.icon);
            } else if (g.icon.length <= 2) {
              // Likely already an emoji
              displayEmoji = g.icon;
            } else {
              displayEmoji = getEmojiForGoal(g.name);
            }
          } else {
            displayEmoji = getEmojiForGoal(g.name);
          }
          
          const percentage = calculatePercentage(g.saved, g.target);
          
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
                {/* Emoji Box - now shows proper emojis */}
                <div style={{
                  width: '50px',
                  height: '50px',
                  backgroundColor: '#D1FAE5',
                  color: '#059669',
                  borderRadius: '12px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '1.8rem',
                  flexShrink: 0
                }}>
                  {displayEmoji}
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
                    Target: {formatPHP(g.target)}
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
                    fontSize: '1.2rem',
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
                  🗑️
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
                  }}>{Math.round(percentage)}%</span>
                </div>
                <div style={{
                  height: '8px',
                  background: '#F3F4F6',
                  borderRadius: '10px',
                  overflow: 'hidden'
                }}>
                  <div style={{
                    width: `${percentage}%`,
                    height: '100%',
                    background: '#10B981',
                    borderRadius: '10px',
                    transition: 'width 0.3s ease'
                  }}></div>
                </div>
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  marginTop: '8px',
                  fontSize: '0.85rem',
                  color: '#64748b'
                }}>
                  <span>Saved: {formatPHP(g.saved || 0)}</span>
                  <span>Remaining: {formatPHP((g.target || 0) - (g.saved || 0))}</span>
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
            <span style={{ fontSize: '3rem', display: 'block', marginBottom: '15px' }}>🎯</span>
            <h3 style={{ color: '#4B5563', marginBottom: '8px' }}>No Goals Yet</h3>
            <p style={{ color: '#9CA3AF', marginBottom: '20px' }}>
              Start saving for something special!
            </p>
            <button 
              onClick={() => setShowModal(true)}
              style={{
                padding: '12px 28px',
                fontSize: '1rem',
                fontWeight: '600',
                borderRadius: '50px',
                border: 'none',
                background: 'linear-gradient(135deg, #10B981, #059669)',
                color: 'white',
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '10px',
                boxShadow: '0 8px 20px rgba(16, 185, 129, 0.3)',
                transition: 'all 0.3s ease',
                outline: 'none'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow = '0 12px 25px rgba(16, 185, 129, 0.4)';
                e.currentTarget.style.background = 'linear-gradient(135deg, #059669, #047857)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 8px 20px rgba(16, 185, 129, 0.3)';
                e.currentTarget.style.background = 'linear-gradient(135deg, #10B981, #059669)';
              }}
            >
              <span style={{ 
                fontSize: '1.3rem', 
                fontWeight: '400',
                background: 'rgba(255,255,255,0.2)',
                width: '24px',
                height: '24px',
                borderRadius: '50%',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>+</span>
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

              {/* Emoji Selection */}
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
                  gridTemplateColumns: 'repeat(auto-fill, minmax(50px, 1fr))',
                  gap: '8px'
                }}>
                  {iconOptions.map((icon, index) => (
                    <button
                      key={`${icon.emoji}-${index}`}
                      type="button"
                      onClick={() => setSelectedIcon(icon.emoji)}
                      style={{
                        padding: '10px 0',
                        border: selectedIcon === icon.emoji ? '3px solid #10B981' : '1px solid #E5E7EB',
                        borderRadius: '8px',
                        background: selectedIcon === icon.emoji ? '#ECFDF5' : 'white',
                        cursor: 'pointer',
                        fontSize: '1.5rem',
                        transition: 'all 0.2s'
                      }}
                      title={icon.name}
                    >
                      {icon.emoji}
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

              {/* Buttons - No emoji on Create Goal */}
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