"use client";
import { useState, useEffect, useRef } from "react";
import BudgetsTab from "./BudgetsTab";
import SavingsTab from "./SavingsTab";
import DebtsTab from "./DebtsTab";
import GoalsTab from "./GoalsTab";
import AIChatbot from "./AIChatbot";

// Chart utilities
const formatCompactPHP = (number) => {
  const fmt = new Intl.NumberFormat('en-PH', { notation: "compact", compactDisplay: "short", maximumFractionDigits: 1 }).format(number);
  return '₱' + fmt;
};

const formatPHP = (num) => {
  return '₱' + parseFloat(num).toLocaleString('en-PH', { minimumFractionDigits: 2 });
};

// Chart state
let chartState = { points: [], layout: {}, ctx: null, cvs: null, data: [] };

const chartConfig = [
  { key: 'balance', label: 'Balance', color: '#10B981', type: 'line' },
  { key: 'income', label: 'Income', color: '#10B981', type: 'dot' },
  { key: 'expense', label: 'Expense', color: '#EF4444', type: 'dot' },
  { key: 'debt', label: 'Debt', color: '#7F1D1D', type: 'dot' },
  { key: 'goal', label: 'Goal', color: '#8B5CF6', type: 'dot' },
  { key: 'planner', label: 'Planner', color: '#F97316', type: 'dot' }
];

// Get real chart data from props
const getChartData = (records, debts, goals, planner) => {
  const currentYear = new Date().getFullYear();
  const MONTH_LABELS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  
  // Initialize monthly data
  let monthlyData = Array.from({ length: 12 }, (_, i) => ({
    month: i,
    monthLabel: MONTH_LABELS[i],
    income: 0,
    expense: 0,
    debt: 0,
    goal: 0,
    planner: 0,
    balance: 0,
    name: `${MONTH_LABELS[i]} ${currentYear}`
  }));

  // Add income/expense from records
  if (records && records.length > 0) {
    records.forEach(r => {
      const d = new Date(r.date);
      if (d.getFullYear() === currentYear) {
        const monthIndex = d.getMonth();
        if (r.type === 'income') {
          monthlyData[monthIndex].income += r.amount;
        } else if (r.type === 'expense') {
          monthlyData[monthIndex].expense += r.amount;
        }
      }
    });
  }

  // Add debts
  if (debts && debts.length > 0) {
    debts.forEach(d => {
      const dueDate = new Date(d.due_date);
      if (dueDate.getFullYear() === currentYear) {
        const monthIndex = dueDate.getMonth();
        monthlyData[monthIndex].debt += d.amount;
        monthlyData[monthIndex].expense += d.amount;
      }
    });
  }

  // Add goals
  if (goals && goals.length > 0) {
    goals.forEach(g => {
      const goalDate = new Date(g.date);
      if (goalDate.getFullYear() === currentYear) {
        const monthIndex = goalDate.getMonth();
        monthlyData[monthIndex].goal += g.target;
        monthlyData[monthIndex].expense += g.target;
      }
    });
  }

  // Add planner items (assume current month)
  if (planner && planner.items && planner.items.length > 0) {
    const currentMonth = new Date().getMonth();
    planner.items.forEach(item => {
      monthlyData[currentMonth].planner += item.cost;
      monthlyData[currentMonth].expense += item.cost;
    });
  }

  // Calculate running balance
  let runningBalance = 0;
  const chartData = monthlyData.map(item => {
    runningBalance += (item.income - item.expense);
    return {
      ...item,
      balance: runningBalance
    };
  });

  return chartData;
};

// Add hover tooltip functionality with position adjustment
function addHoverEffect(canvasId, points, chartData) {
  const canvas = document.getElementById(canvasId);
  if (!canvas) return;

  const handleMouseMove = (e) => {
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    
    // Find closest point
    let closestPoint = null;
    let minDist = Infinity;
    
    points.forEach(point => {
      const dist = Math.abs(point.x - x);
      if (dist < minDist && dist < 30) {
        minDist = dist;
        closestPoint = point;
      }
    });

    // Remove existing tooltip
    const existingTooltip = document.getElementById('chart-tooltip');
    if (existingTooltip) existingTooltip.remove();

    if (closestPoint) {
      const pointIndex = points.indexOf(closestPoint);
      const monthData = chartData[pointIndex];
      
      // Create tooltip
      const tooltip = document.createElement('div');
      tooltip.id = 'chart-tooltip';
      tooltip.style.position = 'fixed';
      
      // Adjust position based on screen edges
      let leftPos = e.clientX + 15;
      let topPos = e.clientY - 150;
      
      // Check right edge
      if (leftPos + 220 > window.innerWidth) {
        leftPos = e.clientX - 235;
      }
      
      // Check left edge
      if (leftPos < 10) {
        leftPos = 10;
      }
      
      // Check top edge
      if (topPos < 10) {
        topPos = e.clientY + 20;
      }
      
      tooltip.style.left = leftPos + 'px';
      tooltip.style.top = topPos + 'px';
      tooltip.style.background = '#1e293b';
      tooltip.style.color = 'white';
      tooltip.style.padding = '15px';
      tooltip.style.borderRadius = '10px';
      tooltip.style.boxShadow = '0 10px 25px rgba(0,0,0,0.2)';
      tooltip.style.zIndex = '2000';
      tooltip.style.fontSize = '12px';
      tooltip.style.minWidth = '200px';
      tooltip.style.border = '1px solid #334155';
      
      tooltip.innerHTML = `
        <div style="font-weight:bold; margin-bottom:12px; color:#10B981; font-size:14px; border-bottom:1px solid #334155; padding-bottom:5px;">${monthData.name}</div>
        <div style="margin-bottom:6px; display:flex; justify-content:space-between;">
          <span style="color:#94a3b8;">Income:</span> 
          <span style="color:#10B981; font-weight:500;">₱${monthData.income.toLocaleString()}</span>
        </div>
        <div style="margin-bottom:6px; display:flex; justify-content:space-between;">
          <span style="color:#94a3b8;">Expense:</span> 
          <span style="color:#ef4444; font-weight:500;">₱${monthData.expense.toLocaleString()}</span>
        </div>
        <div style="margin-bottom:6px; display:flex; justify-content:space-between;">
          <span style="color:#94a3b8;">Debt:</span> 
          <span style="color:#ef4444; font-weight:500;">₱${monthData.debt.toLocaleString()}</span>
        </div>
        <div style="margin-bottom:6px; display:flex; justify-content:space-between;">
          <span style="color:#94a3b8;">Goal:</span> 
          <span style="color:#8B5CF6; font-weight:500;">₱${monthData.goal.toLocaleString()}</span>
        </div>
        <div style="margin-bottom:6px; display:flex; justify-content:space-between;">
          <span style="color:#94a3b8;">Planner:</span> 
          <span style="color:#F97316; font-weight:500;">₱${monthData.planner.toLocaleString()}</span>
        </div>
        <div style="border-top:1px solid #334155; margin:10px 0 5px; padding-top:8px; display:flex; justify-content:space-between;">
          <span style="color:#94a3b8; font-weight:600;">Balance:</span> 
          <span style="color:#10B981; font-weight:700;">₱${monthData.balance.toLocaleString()}</span>
        </div>
      `;
      
      document.body.appendChild(tooltip);
    }
  };

  const handleMouseLeave = () => {
    const tooltip = document.getElementById('chart-tooltip');
    if (tooltip) tooltip.remove();
  };

  canvas.addEventListener('mousemove', handleMouseMove);
  canvas.addEventListener('mouseleave', handleMouseLeave);

  return () => {
    canvas.removeEventListener('mousemove', handleMouseMove);
    canvas.removeEventListener('mouseleave', handleMouseLeave);
  };
}

// Original graph drawing functions
function drawGridAndAxes(ctx, layout, timeline) {
  const { padding, width, height, minVal, maxVal } = layout;
  ctx.font = "500 10px 'Plus Jakarta Sans', sans-serif";
  ctx.textAlign = "right"; 
  ctx.textBaseline = "middle"; 
  ctx.lineWidth = 1;
  
  const steps = 5;
  for (let i = 0; i <= steps; i++) {
    const ratio = i / steps;
    const val = minVal + ratio * (maxVal - minVal);
    const y = padding.top + height - (ratio * height);
    
    ctx.beginPath(); 
    ctx.moveTo(padding.left, y); 
    ctx.lineTo(padding.left + width, y);
    ctx.strokeStyle = Math.abs(val) < (maxVal-minVal)*0.01 ? "#94A3B8" : "#F1F5F9"; 
    ctx.stroke();
    ctx.fillStyle = "#94A3B8"; 
    ctx.fillText(formatCompactPHP(val), padding.left - 15, y);
  }

  ctx.textAlign = "center";
  ctx.fillStyle = "#94A3B8";
  const stepX = width / 11;

  timeline.forEach((item, i) => {
    const x = padding.left + i * stepX;
    ctx.fillText(item.monthLabel, x, padding.top + height + 25);
  });
}

function drawSmoothLine(ctx, points, layout) {
  if (points.length < 2) return;
  const { padding, height } = layout;

  ctx.beginPath();
  ctx.moveTo(points[0].x, points[0].y);

  // Use bezierCurveTo for true smoothing through points
  for (let i = 0; i < points.length - 1; i++) {
    const p0 = points[i === 0 ? i : i - 1];
    const p1 = points[i];
    const p2 = points[i + 1];
    const p3 = points[i + 2] || p2;

    const cp1x = p1.x + (p2.x - p0.x) * 0.15;
    const cp1y = p1.y + (p2.y - p0.y) * 0.15;
    const cp2x = p2.x - (p3.x - p1.x) * 0.15;
    const cp2y = p2.y - (p3.y - p1.y) * 0.15;

    ctx.bezierCurveTo(cp1x, cp1y, cp2x, cp2y, p2.x, p2.y);
  }

  ctx.lineCap = "round";
  ctx.lineJoin = "round";
  ctx.lineWidth = 3;
  ctx.strokeStyle = "#10B981";
  ctx.stroke();

  ctx.lineTo(points[points.length - 1].x, padding.top + height);
  ctx.lineTo(points[0].x, padding.top + height);
  ctx.closePath();
  
  const grad = ctx.createLinearGradient(0, padding.top, 0, padding.top + height);
  grad.addColorStop(0, "rgba(16, 185, 129, 0.2)");
  grad.addColorStop(1, "rgba(16, 185, 129, 0)");
  ctx.fillStyle = grad;
  ctx.fill();
}

function drawMarkers(ctx, points) {
  points.forEach(p => {
    const config = chartConfig.find(c => c.key === p.data.type) || {};
    ctx.beginPath(); 
    ctx.arc(p.x, p.y, 5, 0, Math.PI * 2);
    ctx.fillStyle = config.color || '#64748B'; 
    ctx.fill();
    ctx.lineWidth = 2; 
    ctx.strokeStyle = "#FFFFFF"; 
    ctx.stroke();
  });
}

function drawTrendChart(canvasId, records, debts, goals, planner) {
  const cvs = document.getElementById(canvasId);
  if (!cvs) return;
  
  const ctx = cvs.getContext('2d');
  const dpr = window.devicePixelRatio || 1;
  const rect = cvs.getBoundingClientRect();
  
  // Set canvas dimensions based on container size
  if (cvs.width !== rect.width * dpr || cvs.height !== rect.height * dpr) {
    cvs.width = rect.width * dpr;
    cvs.height = rect.height * dpr;
  }
  
  ctx.setTransform(1, 0, 0, 1, 0, 0); 
  ctx.scale(dpr, dpr);
  ctx.clearRect(0, 0, rect.width, rect.height);

  // Use real data instead of sample data
  const timeline = getChartData(records, debts, goals, planner);

  // If no data, show sample data for demonstration
  const hasData = timeline.some(item => item.income > 0 || item.expense > 0);
  if (!hasData) {
    // Show sample data so graph isn't empty
    const sampleData = [10000, 25000, 18000, 32000, 28000, 45000, 38000, 52000, 48000, 60000, 55000, 72000];
    sampleData.forEach((val, i) => {
      timeline[i].balance = val;
    });
  }

  const padding = { top: 40, right: 20, bottom: 40, left: 50 };
  const width = rect.width - padding.left - padding.right;
  const height = rect.height - padding.top - padding.bottom;

  const values = timeline.map(t => t.balance);
  const minData = Math.min(...values);
  const maxData = Math.max(...values);
  const range = maxData - minData || 1;

  const buffer = range * 0.2; 
  let maxVal = maxData + buffer;
  let minVal = minData - buffer;
  if (minData >= 0 && minVal < 0) minVal = 0;

  const stepX = width / 11;

  const points = timeline.map((t, i) => ({
    x: padding.left + i * stepX,
    y: padding.top + height - ((t.balance - minVal) / (maxVal - minVal)) * height,
    data: t
  }));

  chartState = { points, layout: { padding, width, height, rect, minVal, maxVal }, ctx, cvs };

  drawGridAndAxes(ctx, chartState.layout, timeline);
  drawSmoothLine(ctx, points, chartState.layout);
  drawMarkers(ctx, points);
  
  // Add hover tooltip
  addHoverEffect(canvasId, points, timeline);
}

export default function Dashboard({ 
  userData, 
  onLogout, 
  onBackToHome,
  budgets, setBudgets,
  debts, setDebts,
  goals, setGoals,
  planner, setPlanner,
  records, setRecords,
  formatPHP, formatDate,
  deleteBudget, deleteDebt, deleteGoal, deletePlannerItem,
  addBudget, addDebt, addGoal, addRecord, addPlannerItem
}) {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [chatMessages, setChatMessages] = useState([
    { role: 'assistant', content: '👋 Hi! I\'m your Money Pilot AI. How can I help with your finances today?' }
  ]);
  const [chatInput, setChatInput] = useState('');
  const [isChatLoading, setIsChatLoading] = useState(false);
  const [fabOpen, setFabOpen] = useState(false);
  const [showRecordModal, setShowRecordModal] = useState(false);
  const [recType, setRecType] = useState('income');
  const [recAmount, setRecAmount] = useState('');
  const [recDate, setRecDate] = useState(new Date().toISOString().split('T')[0]);
  const [recCategory, setRecCategory] = useState('Salary');
  const [recNote, setRecNote] = useState('');

  const handleChatSend = async () => {
    if (!chatInput.trim()) return;

    const userMessage = { role: 'user', content: chatInput };
    setChatMessages(prev => [...prev, userMessage]);
    setChatInput('');
    setIsChatLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [...chatMessages, userMessage]
        }),
      });

      const data = await response.json();
      setChatMessages(prev => [...prev, { role: 'assistant', content: data.message }]);
    } catch (error) {
      setChatMessages(prev => [...prev, { 
        role: 'assistant', 
        content: "Hi! I'm your Money Pilot AI. How can I help?" 
      }]);
    } finally {
      setIsChatLoading(false);
    }
  };

  const handleAddRecord = async (e) => {
    e.preventDefault();
    const newRecord = {
      type: recType,
      amount: parseFloat(recAmount),
      date: recDate,
      category: recCategory,
      description: recNote
    };
    
    console.log('Adding record:', newRecord);
    
    if (addRecord) {
      await addRecord(newRecord);
      // Force a re-render
      setRecords(prev => [...prev, newRecord]);
    }
    
    setShowRecordModal(false);
    setRecAmount('');
    setRecNote('');
    setFabOpen(false);
    
    // Force chart to redraw
    setTimeout(() => {
      drawTrendChart('trendCanvas', [...records, newRecord], debts, goals, planner);
    }, 100);
  };

  const totalIncome = records?.filter(r => r.type === 'income').reduce((s, r) => s + r.amount, 0) || 0;
  const totalExpense = records?.filter(r => r.type === 'expense').reduce((s, r) => s + r.amount, 0) || 0;
  const balance = totalIncome - totalExpense;

  // Draw chart when data changes or dashboard tab becomes active
  useEffect(() => {
    if (activeTab === 'dashboard') {
      const timer = setTimeout(() => {
        drawTrendChart('trendCanvas', records, debts, goals, planner);
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [records, debts, goals, planner, activeTab]);

  // Handle window resize for responsive chart
  useEffect(() => {
    const handleResize = () => {
      if (activeTab === 'dashboard') {
        drawTrendChart('trendCanvas', records, debts, goals, planner);
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [activeTab, records, debts, goals, planner]);

  return (
    <>
      {/* Header with buttons */}
      <div style={{
        position: 'fixed',
        top: '20px',
        right: '20px',
        zIndex: 1000,
        display: 'flex',
        alignItems: 'center',
        gap: '10px',
        background: 'white',
        padding: '8px 16px',
        borderRadius: '30px',
        boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
        border: '1px solid #e2e8f0'
      }}>
        <button onClick={onBackToHome} style={{
          padding: '5px 12px',
          background: '#10B981',
          color: 'white',
          border: 'none',
          borderRadius: '20px',
          cursor: 'pointer',
          fontSize: '13px',
          fontWeight: 500
        }}>
          <i className="fa-solid fa-home"></i> Home
        </button>
        <span style={{ color: '#1e293b', fontWeight: 600 }}>👋 Hi, {userData.fullName || 'Hans'}!</span>
        <button onClick={onLogout} style={{ 
          padding: '5px 12px', 
          background: '#ef4444', 
          color: 'white', 
          border: 'none', 
          borderRadius: '20px', 
          cursor: 'pointer', 
          fontSize: '13px', 
          fontWeight: 500 
        }}>
          Logout
        </button>
      </div>

      {/* Main Layout */}
      <div className="app-layout">
        <aside className="sidebar">
          <div className="sidebar__top">
            <div className="logo">
              <img src="/icons/logo/logo.png" alt="Money Pilot Logo" />
            </div>
            <nav className="nav">
              <a href="#" className={`nav__item ${activeTab === 'dashboard' ? 'active' : ''}`} onClick={(e) => { e.preventDefault(); setActiveTab('dashboard'); }}>Dashboard</a>
              <a href="#" className={`nav__item ${activeTab === 'budgets' ? 'active' : ''}`} onClick={(e) => { e.preventDefault(); setActiveTab('budgets'); }}>Budgets</a>
              <a href="#" className={`nav__item ${activeTab === 'savings' ? 'active' : ''}`} onClick={(e) => { e.preventDefault(); setActiveTab('savings'); }}>Savings Planner</a>
              <a href="#" className={`nav__item ${activeTab === 'debts' ? 'active' : ''}`} onClick={(e) => { e.preventDefault(); setActiveTab('debts'); }}>Debts</a>
              <a href="#" className={`nav__item ${activeTab === 'goals' ? 'active' : ''}`} onClick={(e) => { e.preventDefault(); setActiveTab('goals'); }}>Goals</a>
            </nav>
          </div>
          <div className="sidebar__bottom">
            <button className="ai-button" onClick={() => setIsChatOpen(true)}>
              <i className="fa-solid fa-robot"></i> Money Pilot AI
            </button>
          </div>
        </aside>

        <main className="main">
          <header className="main__header">
            <h1 className="page-title">
              {activeTab === 'dashboard' && 'Dashboard'}
              {activeTab === 'budgets' && 'Budgets'}
              {activeTab === 'savings' && 'Savings Planner'}
              {activeTab === 'debts' && 'Debts'}
              {activeTab === 'goals' && 'Goals'}
            </h1>
          </header>

          <section className="main__content">
            {activeTab === 'dashboard' && (
              <section id="view-stats" className="view-section">
                {/* Balance Trend Card with Real Data */}
                <div className="card" style={{ marginBottom: '1.5rem' }}>
                  <div className="card-header" style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem', flexWrap: 'wrap', gap: '10px' }}>
                    <span className="card-title" style={{ fontWeight: 700 }}>Balance Trend</span>
                    <span className="filter-badge" style={{ background: '#f1f5f9', padding: '4px 10px', borderRadius: '20px', fontSize: '0.75rem', fontWeight: 600, color: '#64748b', border: '1px solid #e2e8f0' }}>Current Year</span>
                  </div>
                  <h2 style={{ fontSize: 'clamp(1.8rem, 5vw, 2.5rem)', fontWeight: 800, color: '#10B981', marginBottom: '0.5rem' }}>
                    {formatPHP(balance)}
                  </h2>
                  <p style={{ fontSize: '1rem', color: '#64748b', marginBottom: '1.5rem' }}>
                    <span style={{ fontWeight: 600, color: '#10B981' }}>↑ 12%</span> vs last month
                  </p>
                  <div className="chart-wrapper" style={{ height: 'clamp(250px, 40vh, 400px)', position: 'relative', width: '100%' }}>
                    <canvas id="trendCanvas" style={{ width: '100%', height: '100%' }}></canvas>
                  </div>
                </div>
              </section>
            )}

            {activeTab === 'budgets' && (
              <BudgetsTab 
                budgets={budgets} 
                setBudgets={setBudgets} 
                formatPHP={formatPHP} 
                deleteBudget={deleteBudget}
                addBudget={addBudget}
              />
            )}

            {activeTab === 'savings' && (
              <SavingsTab 
                planner={planner}
                setPlanner={setPlanner}
                formatPHP={formatPHP}
                deletePlannerItem={deletePlannerItem}
                addPlannerItem={addPlannerItem}
              />
            )}

            {activeTab === 'debts' && (
              <DebtsTab 
                debts={debts}
                setDebts={setDebts}
                formatPHP={formatPHP}
                formatDate={formatDate}
                deleteDebt={deleteDebt}
                addDebt={addDebt}
              />
            )}

            {activeTab === 'goals' && (
              <GoalsTab 
                goals={goals}
                setGoals={setGoals}
                formatPHP={formatPHP}
                formatDate={formatDate}
                deleteGoal={deleteGoal}
                addGoal={addGoal}
              />
            )}
          </section>
        </main>
      </div>

      {/* FAB Button - No emojis */}
      <div style={{
        position: 'fixed',
        bottom: '30px',
        right: '30px',
        zIndex: 100
      }}>
        <button 
          onClick={() => setFabOpen(!fabOpen)} 
          style={{
            width: '60px',
            height: '60px',
            borderRadius: '50%',
            background: 'linear-gradient(135deg, #10B981, #059669)',
            color: 'white',
            border: 'none',
            fontSize: '28px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            boxShadow: '0 8px 20px rgba(16, 185, 129, 0.4)',
            transition: 'all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
            transform: fabOpen ? 'rotate(45deg)' : 'rotate(0)',
            outline: 'none'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = fabOpen ? 'rotate(45deg) scale(1.1)' : 'scale(1.1)';
            e.currentTarget.style.boxShadow = '0 10px 25px rgba(16, 185, 129, 0.5)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = fabOpen ? 'rotate(45deg)' : 'scale(1)';
            e.currentTarget.style.boxShadow = '0 8px 20px rgba(16, 185, 129, 0.4)';
          }}
        >
          +
        </button>
        
        {fabOpen && (
          <div style={{
            position: 'absolute',
            bottom: '70px',
            right: '0',
            display: 'flex',
            flexDirection: 'column',
            gap: '10px',
            animation: 'slideIn 0.3s ease'
          }}>
            {/* Income Button */}
            <button 
              onClick={() => { 
                setRecType('income');
                setShowRecordModal(true); 
                setFabOpen(false); 
              }}
              style={{
                padding: '12px 24px',
                background: 'white',
                border: 'none',
                borderRadius: '50px',
                boxShadow: '0 4px 15px rgba(0,0,0,0.15)',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                fontSize: '15px',
                fontWeight: '500',
                color: '#1e293b',
                transition: 'all 0.2s',
                border: '1px solid #e2e8f0',
                backdropFilter: 'blur(10px)',
                background: 'rgba(255, 255, 255, 0.95)'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateX(-5px)';
                e.currentTarget.style.boxShadow = '0 8px 20px rgba(0,0,0,0.2)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateX(0)';
                e.currentTarget.style.boxShadow = '0 4px 15px rgba(0,0,0,0.15)';
              }}
            >
              <i className="fa-solid fa-arrow-down" style={{ color: '#10B981', width: '20px' }}></i>
              <span>Add Income</span>
            </button>

            {/* Expense Button */}
            <button 
              onClick={() => { 
                setRecType('expense');
                setShowRecordModal(true); 
                setFabOpen(false); 
              }}
              style={{
                padding: '12px 24px',
                background: 'white',
                border: 'none',
                borderRadius: '50px',
                boxShadow: '0 4px 15px rgba(0,0,0,0.15)',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                fontSize: '15px',
                fontWeight: '500',
                color: '#1e293b',
                transition: 'all 0.2s',
                border: '1px solid #e2e8f0',
                backdropFilter: 'blur(10px)',
                background: 'rgba(255, 255, 255, 0.95)'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateX(-5px)';
                e.currentTarget.style.boxShadow = '0 8px 20px rgba(0,0,0,0.2)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateX(0)';
                e.currentTarget.style.boxShadow = '0 4px 15px rgba(0,0,0,0.15)';
              }}
            >
              <i className="fa-solid fa-arrow-up" style={{ color: '#ef4444', width: '20px' }}></i>
              <span>Add Expense</span>
            </button>
          </div>
        )}
      </div>

      {/* Add animation keyframes */}
      <style>{`
        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>

      {/* Record Modal */}
      {showRecordModal && (
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
          padding: '15px'
        }}>
          <div style={{
            background: 'white',
            padding: '25px',
            borderRadius: '20px',
            width: '100%',
            maxWidth: '500px',
            maxHeight: '90vh',
            overflow: 'auto'
          }}>
            <h3 style={{ marginBottom: '20px', fontSize: '1.5rem' }}>Add {recType === 'income' ? 'Income' : 'Expense'}</h3>
            <form onSubmit={handleAddRecord}>
              <div style={{ marginBottom: '15px' }}>
                <label style={{ display: 'block', marginBottom: '5px', fontWeight: 500 }}>Amount (₱)</label>
                <input
                  type="number"
                  value={recAmount}
                  onChange={(e) => setRecAmount(e.target.value)}
                  required
                  placeholder="0.00"
                  step="0.01"
                  style={{
                    width: '100%',
                    padding: '12px',
                    border: '1px solid #e2e8f0',
                    borderRadius: '8px',
                    fontSize: '16px'
                  }}
                />
              </div>
              
              <div style={{ marginBottom: '15px' }}>
                <label style={{ display: 'block', marginBottom: '5px', fontWeight: 500 }}>Date</label>
                <input
                  type="date"
                  value={recDate}
                  onChange={(e) => setRecDate(e.target.value)}
                  required
                  style={{
                    width: '100%',
                    padding: '12px',
                    border: '1px solid #e2e8f0',
                    borderRadius: '8px'
                  }}
                />
              </div>
              
              <div style={{ marginBottom: '15px' }}>
                <label style={{ display: 'block', marginBottom: '5px', fontWeight: 500 }}>Category</label>
                <select
                  value={recCategory}
                  onChange={(e) => setRecCategory(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '12px',
                    border: '1px solid #e2e8f0',
                    borderRadius: '8px'
                  }}
                >
                  {recType === 'income' ? (
                    <>
                      <option value="Salary">Salary</option>
                      <option value="Freelance">Freelance</option>
                      <option value="Investment">Investment</option>
                      <option value="Business">Business</option>
                      <option value="Gift">Gift</option>
                    </>
                  ) : (
                    <>
                      <option value="Food">Food</option>
                      <option value="Transport">Transport</option>
                      <option value="Utilities">Utilities</option>
                      <option value="Shopping">Shopping</option>
                      <option value="Health">Health</option>
                      <option value="Education">Education</option>
                      <option value="Entertainment">Entertainment</option>
                    </>
                  )}
                </select>
              </div>
              
              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', marginBottom: '5px', fontWeight: 500 }}>Description (Optional)</label>
                <input
                  type="text"
                  value={recNote}
                  onChange={(e) => setRecNote(e.target.value)}
                  placeholder="e.g., Groceries, Salary, etc."
                  style={{
                    width: '100%',
                    padding: '12px',
                    border: '1px solid #e2e8f0',
                    borderRadius: '8px'
                  }}
                />
              </div>
              
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
                    fontSize: '1rem',
                    fontWeight: '600',
                    cursor: 'pointer'
                  }}
                >
                  Add {recType === 'income' ? 'Income' : 'Expense'}
                </button>
                <button
                  type="button"
                  onClick={() => setShowRecordModal(false)}
                  style={{
                    flex: 1,
                    padding: '12px',
                    background: 'white',
                    color: '#64748b',
                    border: '1px solid #e2e8f0',
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

      {/* AI Chatbot */}
      <AIChatbot 
        isOpen={isChatOpen}
        onClose={() => setIsChatOpen(false)}
        messages={chatMessages}
        input={chatInput}
        setInput={setChatInput}
        onSend={handleChatSend}
        isLoading={isChatLoading}
      />
    </>
  );
}