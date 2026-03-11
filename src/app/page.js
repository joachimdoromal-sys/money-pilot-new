"use client";

import { useEffect, useState } from "react";
import supabase from "../lib/supabaseClient";
import LandingPage from "./components/LandingPage";
import LoginScreen from "./components/LoginScreen";
import Dashboard from "./components/Dashboard";

export default function Home() {
  const [showLanding, setShowLanding] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  
  // Auth states
  const [isSignUp, setIsSignUp] = useState(false);
  const [fullName, setFullName] = useState('');
  const [dob, setDob] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [authError, setAuthError] = useState('');

  // Data states - initialize with icons for goals
  const [budgets, setBudgets] = useState([]);
  const [debts, setDebts] = useState([]);
  const [goals, setGoals] = useState([
    { 
      id: 1, 
      name: "Tsting", 
      target: 12121, 
      saved: 0, 
      date: "2026-03-12", 
      icon: "fa-pen" 
    },
    { 
      id: 2, 
      name: "Asus monitor", 
      target: 17901, 
      saved: 0, 
      date: "2026-06-11", 
      icon: "fa-computer" 
    },
    { 
      id: 3, 
      name: "Christmas Dinner", 
      target: 3000, 
      saved: 0, 
      date: "2026-12-21", 
      icon: "fa-utensils" 
    },
  ]);
  const [planner, setPlanner] = useState({ mainGoal: 50000, period: "Monthly", items: [] });
  const [records, setRecords] = useState([]);

  // Load data from Supabase on mount
  useEffect(() => {
    async function loadData() {
      try {
        const { data: budgetData } = await supabase.from('budgets').select('*');
        const { data: debtData } = await supabase.from('debts').select('*');
        const { data: goalData } = await supabase.from('goals').select('*');
        const { data: recordData } = await supabase.from('records').select('*');
        
        // Handle planner data separately
        const { data: plannerData } = await supabase.from('planner').select('*');
        const { data: plannerItemsData } = await supabase.from('planner_items').select('*');
        
        if (budgetData) setBudgets(budgetData);
        if (debtData) setDebts(debtData);
        if (goalData) setGoals(goalData);
        if (recordData) setRecords(recordData);
        
        if (plannerData && plannerData.length > 0) {
          setPlanner({
            ...plannerData[0],
            items: plannerItemsData || []
          });
        }
      } catch (error) {
        console.error('Error loading data:', error);
      }
    }
    loadData();
  }, []);

  useEffect(() => {
    async function loadScripts() {
      window.supabase = supabase;
      window.appData = { budgets, debts, goals, records, planner };
      
     const scripts = [];
  
      for (const src of scripts) {
        await new Promise((resolve) => {
          const script = document.createElement("script");
          script.src = src;
          script.onload = resolve;
          document.body.appendChild(script);
        });
      }
    }
    loadScripts();
  }, []);

  const handleAuth = (e) => {
    e.preventDefault();
    if (isSignUp) {
      if (!fullName || !dob || !email || !password) {
        setAuthError('Please fill in all fields');
        return;
      }
      setIsLoggedIn(true);
      setAuthError('');
    } else {
      if (email === 'hans@example.com' && password === 'password123') {
        setIsLoggedIn(true);
        setAuthError('');
        setFullName('Hans');
      } else {
        setAuthError('Invalid email or password');
      }
    }
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setIsSignUp(false);
    setFullName('');
    setDob('');
    setEmail('');
    setPassword('');
  };

  // Utility functions
  const formatPHP = (num) => '₱' + parseFloat(num).toLocaleString('en-PH', { minimumFractionDigits: 2 });
  
  const formatDate = (dateStr) => {
    if (!dateStr) return '';
    const d = new Date(dateStr);
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  // CRUD operations with Supabase
  const addBudget = async (budget) => {
    const { data } = await supabase.from('budgets').insert([budget]).select();
    if (data) setBudgets([...budgets, data[0]]);
  };

  const deleteBudget = async (id) => {
    if (confirm('Delete this budget?')) {
      await supabase.from('budgets').delete().eq('id', id);
      setBudgets(budgets.filter(b => b.id !== id));
    }
  };

  const addDebt = async (debt) => {
    const { data } = await supabase.from('debts').insert([debt]).select();
    if (data) setDebts([...debts, data[0]]);
  };

  const deleteDebt = async (id) => {
    if (confirm('Mark this debt as paid?')) {
      await supabase.from('debts').delete().eq('id', id);
      setDebts(debts.filter(d => d.id !== id));
    }
  };

  const addGoal = async (goal) => {
    const { data } = await supabase.from('goals').insert([goal]).select();
    if (data) setGoals([...goals, data[0]]);
  };

  const deleteGoal = async (id) => {
    if (confirm('Delete this goal?')) {
      await supabase.from('goals').delete().eq('id', id);
      setGoals(goals.filter(g => g.id !== id));
    }
  };

  const addRecord = async (record) => {
    const { data } = await supabase.from('records').insert([record]).select();
    if (data) setRecords([...records, data[0]]);
  };

  const deleteRecord = async (id) => {
    if (confirm('Delete this record?')) {
      await supabase.from('records').delete().eq('id', id);
      setRecords(records.filter(r => r.id !== id));
    }
  };

  const updatePlanner = async (newPlanner) => {
    const { data } = await supabase.from('planner').upsert([newPlanner]).select();
    if (data) setPlanner(data[0]);
  };

  const addPlannerItem = async (item) => {
    const { data } = await supabase.from('planner_items').insert([item]).select();
    if (data) {
      setPlanner({
        ...planner,
        items: [...planner.items, data[0]]
      });
    }
  };

  const deletePlannerItem = async (id) => {
    await supabase.from('planner_items').delete().eq('id', id);
    setPlanner({
      ...planner,
      items: planner.items.filter(i => i.id !== id)
    });
  };

  if (showLanding) {
    return <LandingPage onGetStarted={() => setShowLanding(false)} />;
  }

  if (!isLoggedIn) {
    return (
      <LoginScreen 
        isSignUp={isSignUp}
        setIsSignUp={setIsSignUp}
        fullName={fullName}
        setFullName={setFullName}
        dob={dob}
        setDob={setDob}
        email={email}
        setEmail={setEmail}
        password={password}
        setPassword={setPassword}
        authError={authError}
        handleAuth={handleAuth}
        onBackToHome={() => setShowLanding(true)}
      />
    );
  }

  return (
    <Dashboard 
      userData={{ fullName, email }}
      onLogout={handleLogout}
      onBackToHome={() => setShowLanding(true)}
      budgets={budgets}
      setBudgets={setBudgets}
      debts={debts}
      setDebts={setDebts}
      goals={goals}
      setGoals={setGoals}
      planner={planner}
      setPlanner={setPlanner}
      records={records}
      setRecords={setRecords}
      formatPHP={formatPHP}
      formatDate={formatDate}
      deleteBudget={deleteBudget}
      deleteDebt={deleteDebt}
      deleteGoal={deleteGoal}
      deletePlannerItem={deletePlannerItem}
      addBudget={addBudget}
      addDebt={addDebt}
      addGoal={addGoal}
      addRecord={addRecord}
      addPlannerItem={addPlannerItem}
    />
  );
}