"use client";

import { useState, useEffect } from "react";

export default function AIChatbot({ 
  isOpen, 
  onClose, 
  messages, 
  input, 
  setInput, 
  onSend, 
  isLoading 
}) {
  // Add this for mobile detection
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  if (!isOpen) return null;

  return (
    <div style={{
      position: 'fixed',
      bottom: isMobile ? '70px' : '100px',
      left: isMobile ? '5%' : '280px',
      width: isMobile ? '90%' : '350px',
      height: isMobile ? '60vh' : '500px',
      maxHeight: isMobile ? '500px' : '500px',
      background: 'white',
      borderRadius: '20px',
      boxShadow: '0 10px 40px rgba(0,0,0,0.2)',
      display: 'flex',
      flexDirection: 'column',
      overflow: 'hidden',
      zIndex: 2000
    }}>
      {/* Header with X button */}
      <div style={{
        background: '#10B981',
        color: 'white',
        padding: isMobile ? '12px 15px' : '15px 20px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <span style={{ fontSize: isMobile ? '20px' : '24px' }}>🤖</span>
          <div>
            <h3 style={{ margin: 0, fontSize: isMobile ? '16px' : '18px' }}>Money Pilot AI</h3>
            <span style={{ fontSize: isMobile ? '11px' : '12px', opacity: 0.9 }}>● Online</span>
          </div>
        </div>
        <button 
          onClick={onClose}
          style={{
            background: 'rgba(255,255,255,0.2)',
            border: 'none',
            color: 'white',
            fontSize: isMobile ? '18px' : '20px',
            cursor: 'pointer',
            width: isMobile ? '32px' : '35px',
            height: isMobile ? '32px' : '35px',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          ✕
        </button>
      </div>

      {/* Messages */}
      <div style={{
        flex: 1,
        padding: isMobile ? '12px' : '20px',
        overflowY: 'auto',
        background: '#f8fafc',
        display: 'flex',
        flexDirection: 'column',
        gap: isMobile ? '12px' : '15px'
      }}>
        {messages.map((msg, index) => (
          <div key={index} style={{
            display: 'flex',
            alignItems: 'flex-start',
            gap: '8px',
            flexDirection: msg.role === 'user' ? 'row-reverse' : 'row',
            alignSelf: msg.role === 'user' ? 'flex-end' : 'flex-start',
            maxWidth: isMobile ? '85%' : '80%'
          }}>
            <div style={{
              width: isMobile ? '28px' : '32px',
              height: isMobile ? '28px' : '32px',
              borderRadius: '50%',
              background: msg.role === 'assistant' ? '#ECFDF5' : '#e2e8f0',
              color: msg.role === 'assistant' ? '#10B981' : '#64748b',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: isMobile ? '14px' : '16px',
              flexShrink: 0
            }}>
              {msg.role === 'assistant' ? '🤖' : '👤'}
            </div>
            <div style={{
              padding: isMobile ? '8px 12px' : '12px 16px',
              borderRadius: '18px',
              fontSize: isMobile ? '13px' : '14px',
              lineHeight: '1.5',
              wordWrap: 'break-word',
              background: msg.role === 'assistant' ? 'white' : '#10B981',
              color: msg.role === 'assistant' ? '#1e293b' : 'white',
              border: msg.role === 'assistant' ? '1px solid #e2e8f0' : 'none',
              borderTopLeftRadius: msg.role === 'assistant' ? '4px' : '18px',
              borderTopRightRadius: msg.role === 'user' ? '4px' : '18px'
            }}>
              {msg.content}
            </div>
          </div>
        ))}
        {isLoading && (
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            maxWidth: isMobile ? '85%' : '80%'
          }}>
            <div style={{
              width: isMobile ? '28px' : '32px',
              height: isMobile ? '28px' : '32px',
              borderRadius: '50%',
              background: '#ECFDF5',
              color: '#10B981',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: isMobile ? '14px' : '16px'
            }}>
              🤖
            </div>
            <div style={{
              padding: isMobile ? '8px 12px' : '12px 16px',
              background: 'white',
              borderRadius: '18px',
              border: '1px solid #e2e8f0',
              borderTopLeftRadius: '4px',
              display: 'flex',
              gap: '4px'
            }}>
              <span style={{ width: '8px', height: '8px', background: '#94a3b8', borderRadius: '50%', animation: 'typing 1.4s infinite' }}></span>
              <span style={{ width: '8px', height: '8px', background: '#94a3b8', borderRadius: '50%', animation: 'typing 1.4s infinite', animationDelay: '0.2s' }}></span>
              <span style={{ width: '8px', height: '8px', background: '#94a3b8', borderRadius: '50%', animation: 'typing 1.4s infinite', animationDelay: '0.4s' }}></span>
            </div>
          </div>
        )}
      </div>

      {/* Input */}
      <div style={{
        padding: isMobile ? '12px' : '20px',
        background: 'white',
        borderTop: '1px solid #e2e8f0',
        display: 'flex',
        gap: '10px'
      }}>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && !isLoading && onSend()}
          placeholder="Ask about your finances..."
          disabled={isLoading}
          style={{
            flex: 1,
            padding: isMobile ? '10px' : '12px',
            border: '1px solid #e2e8f0',
            borderRadius: '25px',
            fontSize: isMobile ? '14px' : '14px',
            outline: 'none',
            height: isMobile ? '40px' : 'auto'
          }}
        />
        <button 
          onClick={onSend} 
          disabled={isLoading || !input.trim()}
          style={{
            width: isMobile ? '40px' : '45px',
            height: isMobile ? '40px' : '45px',
            borderRadius: '50%',
            background: '#10B981',
            color: 'white',
            border: 'none',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: isMobile ? '16px' : '18px',
            opacity: isLoading || !input.trim() ? 0.5 : 1
          }}
        >
          ➤
        </button>
      </div>

      <style>{`
        @keyframes typing {
          0%, 60%, 100% { transform: translateY(0); }
          30% { transform: translateY(-10px); }
        }
      `}</style>
    </div>
  );
}