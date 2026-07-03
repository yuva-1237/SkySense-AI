import React, { useState, useEffect, useRef } from 'react';
import { sendChatMessageStream, fetchChatHistory } from '../services/api';
import { useAuth } from '../contexts/AuthContext';
import { db } from '../lib/firebase';
import {
  collection,
  query,
  orderBy,
  onSnapshot,
  doc,
  setDoc,
  deleteDoc,
  updateDoc
} from 'firebase/firestore';

export default function ChatbotView({ activeLocation }) {
  const { user } = useAuth();
  const [conversations, setConversations] = useState([]);
  const [activeSessionId, setActiveSessionId] = useState(null);
  const [messages, setMessages] = useState([
    {
      role: 'model',
      content: `Hello! I am SkySense AI, your weather intelligence assistant. I am grounded in live meteorological feeds for your active location: **${activeLocation.name}**.\n\nAsk me about current conditions, daily forecasts, clothing advice, health indices, or agricultural suggestions!`,
      timestamp: new Date().toISOString()
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [editingTitleId, setEditingTitleId] = useState(null);
  const [editTitleText, setEditTitleText] = useState('');

  // Audio / Speech State
  const [isRecording, setIsRecording] = useState(false);
  const [speakingMsgId, setSpeakingMsgId] = useState(null);
  const [isPaused, setIsPaused] = useState(false);
  const recognitionRef = useRef(null);

  const messagesEndRef = useRef(null);
  const fileInputRef = useRef(null);

  // Auto-scroll to bottom of conversation
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  // Load chat history & conversations
  useEffect(() => {
    if (user) {
      // ─── Firebase Mode ──────────────────────────────────────────────────────
      const colRef = collection(db, 'users', user.uid, 'conversations');
      const q = query(colRef, orderBy('updatedAt', 'desc'));
      const unsubscribe = onSnapshot(q, (snapshot) => {
        const list = [];
        snapshot.forEach((doc) => {
          list.push({ id: doc.id, ...doc.data() });
        });
        setConversations(list);
      });
      return unsubscribe;
    } else {
      // ─── Local Storage Guest Mode ───────────────────────────────────────────
      const saved = localStorage.getItem('skysense_guest_conversations');
      if (saved) {
        setConversations(JSON.parse(saved));
      }
    }
  }, [user]);

  // When active session changes, load its messages
  useEffect(() => {
    if (!activeSessionId) {
      setMessages([
        {
          role: 'model',
          content: `Hello! I am SkySense AI, your weather intelligence assistant. I am grounded in live meteorological feeds for your active location: **${activeLocation.name}**.\n\nAsk me about current conditions, daily forecasts, clothing advice, health indices, or agricultural suggestions!`,
          timestamp: new Date().toISOString()
        }
      ]);
      return;
    }

    const activeConv = conversations.find(c => c.id === activeSessionId);
    if (activeConv) {
      setMessages(activeConv.messages || []);
    }
  }, [activeSessionId, conversations, activeLocation.name]);

  // Save guest conversations to localStorage
  const saveGuestConversations = (list) => {
    setConversations(list);
    localStorage.setItem('skysense_guest_conversations', JSON.stringify(list));
  };

  // Generate Title based on location and prompt
  const generateTitle = (prompt, locationName) => {
    const loc = locationName || activeLocation.name;
    const cleanPrompt = prompt.toLowerCase();
    if (cleanPrompt.includes('umbrella') || cleanPrompt.includes('rain')) {
      return `Rain Forecast in ${loc}`;
    }
    if (cleanPrompt.includes('wear') || cleanPrompt.includes('cloth') || cleanPrompt.includes('dress')) {
      return `Clothing Suggestions — ${loc}`;
    }
    if (cleanPrompt.includes('temp') || cleanPrompt.includes('hot') || cleanPrompt.includes('cold')) {
      return `Temperature in ${loc}`;
    }
    return `Weather inquiry in ${loc}`;
  };

  // Helper to asynchronously persist conversations, with offline fallback
  const saveConversationToStorage = async (sessionId, msgs, initialPrompt, isNew) => {
    const activeConv = conversations.find(c => c.id === sessionId);
    const title = isNew ? generateTitle(initialPrompt, activeLocation.name) : (activeConv?.title || 'Weather Chat');

    const updatedConv = {
      id: sessionId,
      title,
      messages: msgs,
      isPinned: activeConv?.isPinned || false,
      updatedAt: new Date().toISOString()
    };

    const nextList = [...conversations];
    const idx = nextList.findIndex(c => c.id === sessionId);
    if (idx !== -1) {
      nextList[idx] = updatedConv;
    } else {
      nextList.push(updatedConv);
    }

    // Sort by updatedAt desc
    nextList.sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));

    if (!user) {
      saveGuestConversations(nextList);
      return;
    }

    setConversations(nextList);
    try {
      const docRef = doc(db, 'users', user.uid, 'conversations', sessionId);
      await setDoc(docRef, {
        title,
        messages: msgs,
        isPinned: updatedConv.isPinned,
        updatedAt: updatedConv.updatedAt
      }, { merge: true });
    } catch (err) {
      console.warn('Firestore setDoc failed, saving to local offline backup:', err);
      const offlineKey = `skysense_offline_chats_${user.uid}`;
      localStorage.setItem(offlineKey, JSON.stringify(nextList));
    }
  };

  const handleSend = async (textToSend) => {
    const text = textToSend || inputText;
    if (!text.trim()) return;

    // Interrupt current TTS speaking if any
    stopSpeaking();

    const timestamp = new Date().toISOString();
    const newMessages = [...messages, { role: 'user', content: text, timestamp }];
    
    setMessages(newMessages);
    setInputText('');
    setLoading(true);

    let currentSessionId = activeSessionId;
    let isNewChat = !currentSessionId;
    let accumulatedReply = '';
    let accumulatedSnapshot = null;

    // Set initial model block for streaming target
    setMessages(prev => [...prev, { role: 'model', content: '', timestamp: new Date().toISOString() }]);

    try {
      await sendChatMessageStream(
        text,
        currentSessionId,
        activeLocation.name,
        // Chunk callback
        (chunk) => {
          accumulatedReply += chunk;
          setMessages(prev => {
            const next = [...prev];
            const last = next[next.length - 1];
            if (last && last.role === 'model') {
              last.content = accumulatedReply;
            }
            return next;
          });
        },
        // Meta callback
        async (meta) => {
          if (meta.sessionId && isNewChat) {
            currentSessionId = meta.sessionId;
            setActiveSessionId(meta.sessionId);
            isNewChat = false;
          }

          if (meta.weatherSnapshot) {
            accumulatedSnapshot = meta.weatherSnapshot;
            setMessages(prev => {
              const next = [...prev];
              const last = next[next.length - 1];
              if (last && last.role === 'model') {
                last.snapshot = accumulatedSnapshot;
              }
              return next;
            });
          }
        }
      );

      // Persist conversation synchronously in local list & asynchronously in DB
      const finalMsgs = [...newMessages, { 
        role: 'model', 
        content: accumulatedReply, 
        snapshot: accumulatedSnapshot,
        timestamp: new Date().toISOString() 
      }];
      
      await saveConversationToStorage(currentSessionId, finalMsgs, text, isNewChat);

    } catch (error) {
      console.error('Chat stream error:', error);
      setMessages(prev => {
        const next = [...prev];
        const last = next[next.length - 1];
        if (last && last.role === 'model') {
          last.content = `⚠️ Grounding or API request failed: ${error.message}`;
          last.isError = true;
        }
        return next;
      });
    } finally {
      setLoading(false);
    }
  };

  // ─── Chat Actions ───────────────────────────────────────────────────────────
  const startNewChat = () => {
    stopSpeaking();
    setActiveSessionId(null);
    setMessages([
      {
        role: 'model',
        content: `Hello! I am SkySense AI, your weather intelligence assistant. I am grounded in live meteorological feeds for your active location: **${activeLocation.name}**.\n\nAsk me about current conditions, daily forecasts, clothing advice, health indices, or agricultural suggestions!`,
        timestamp: new Date().toISOString()
      }
    ]);
  };

  const deleteConversation = async (id, e) => {
    e.stopPropagation();
    stopSpeaking();
    if (confirm('Delete this conversation permanently?')) {
      if (user) {
        await deleteDoc(doc(db, 'users', user.uid, 'conversations', id));
      } else {
        const list = conversations.filter(c => c.id !== id);
        saveGuestConversations(list);
      }
      if (activeSessionId === id) {
        startNewChat();
      }
    }
  };

  const togglePinConversation = async (id, e) => {
    e.stopPropagation();
    const conv = conversations.find(c => c.id === id);
    if (!conv) return;
    const newPinnedState = !conv.isPinned;

    if (user) {
      const docRef = doc(db, 'users', user.uid, 'conversations', id);
      await updateDoc(docRef, { isPinned: newPinnedState });
    } else {
      const list = conversations.map(c => c.id === id ? { ...c, isPinned: newPinnedState } : c);
      saveGuestConversations(list);
    }
  };

  const startRenameConversation = (id, title, e) => {
    e.stopPropagation();
    setEditingTitleId(id);
    setEditTitleText(title);
  };

  const saveRenameConversation = async (id) => {
    if (!editTitleText.trim()) return;
    if (user) {
      const docRef = doc(db, 'users', user.uid, 'conversations', id);
      await updateDoc(docRef, { title: editTitleText });
    } else {
      const list = conversations.map(c => c.id === id ? { ...c, title: editTitleText } : c);
      saveGuestConversations(list);
    }
    setEditingTitleId(null);
  };

  // ─── Export / Import JSON ───────────────────────────────────────────────────
  const exportHistory = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(conversations, null, 2));
    const dlAnchorElem = document.createElement('a');
    dlAnchorElem.setAttribute('href', dataStr);
    dlAnchorElem.setAttribute('download', `skysense_chat_history_${new Date().toISOString().split('T')[0]}.json`);
    dlAnchorElem.click();
  };

  const triggerImportFile = () => {
    fileInputRef.current?.click();
  };

  const importHistory = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = async (event) => {
      try {
        const imported = JSON.parse(event.target.result);
        if (Array.isArray(imported)) {
          if (user) {
            for (const c of imported) {
              const docRef = doc(db, 'users', user.uid, 'conversations', c.id || crypto.randomUUID());
              await setDoc(docRef, {
                title: c.title || 'Imported Chat',
                messages: c.messages || [],
                isPinned: c.isPinned || false,
                updatedAt: c.updatedAt || new Date().toISOString()
              }, { merge: true });
            }
          } else {
            saveGuestConversations([...imported, ...conversations]);
          }
          alert('Chat history imported successfully!');
        } else {
          alert('Invalid file format. Must be a JSON array.');
        }
      } catch (err) {
        alert('Failed to parse JSON file.');
      }
    };
    reader.readAsText(file);
  };

  // ─── Voice Input (Speech-to-Text) ───────────────────────────────────────────
  const toggleSpeechRecording = () => {
    if (isRecording) {
      stopSpeechRecognition();
    } else {
      startSpeechRecognition();
    }
  };

  const startSpeechRecognition = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert('Speech recognition is not supported in this browser. Please use Chrome.');
      return;
    }

    const rec = new SpeechRecognition();
    rec.continuous = false;
    rec.interimResults = false;
    rec.lang = 'en-US';

    rec.onstart = () => {
      setIsRecording(true);
    };

    rec.onresult = (e) => {
      const transcript = e.results[0][0].transcript;
      setInputText(transcript);
    };

    rec.onerror = (err) => {
      console.error(err);
      setIsRecording(false);
    };

    rec.onend = () => {
      setIsRecording(false);
    };

    recognitionRef.current = rec;
    rec.start();
  };

  const stopSpeechRecognition = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
    }
  };

  // ─── Voice Output (Text-to-Speech) ──────────────────────────────────────────
  const speakText = (text, msgId) => {
    if ('speechSynthesis' in window) {
      if (speakingMsgId === msgId) {
        if (isPaused) {
          window.speechSynthesis.resume();
          setIsPaused(false);
        } else {
          window.speechSynthesis.pause();
          setIsPaused(true);
        }
        return;
      }

      window.speechSynthesis.cancel();

      const cleanedText = text.replace(/[*#`_]/g, ''); // strip markdown syntax
      const utterance = new SpeechSynthesisUtterance(cleanedText);
      
      utterance.onend = () => {
        setSpeakingMsgId(null);
        setIsPaused(false);
      };
      
      utterance.onerror = () => {
        setSpeakingMsgId(null);
        setIsPaused(false);
      };

      setSpeakingMsgId(msgId);
      setIsPaused(false);
      window.speechSynthesis.speak(utterance);
    }
  };

  const stopSpeaking = () => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      setSpeakingMsgId(null);
      setIsPaused(false);
    }
  };

  // ─── Markdown Inline Parser ─────────────────────────────────────────────────
  const renderInline = (text) => {
    const boldRegex = /\*\*(.*?)\*\*/g;
    const parts = [];
    let lastIndex = 0;
    let match;

    while ((match = boldRegex.exec(text)) !== null) {
      if (match.index > lastIndex) {
        parts.push(text.substring(lastIndex, match.index));
      }
      parts.push(
        <strong key={match.index} className="font-bold text-white">
          {match[1]}
        </strong>
      );
      lastIndex = boldRegex.lastIndex;
    }

    if (lastIndex < text.length) {
      parts.push(text.substring(lastIndex));
    }

    return parts.length > 0 ? parts : text;
  };

  const renderMarkdown = (text) => {
    if (!text) return '';
    const lines = text.split('\n');
    return lines.map((line, idx) => {
      const cleanLine = line.trim();
      if (!cleanLine) return <div key={idx} className="h-2" />;
      if (cleanLine.startsWith('- ') || cleanLine.startsWith('* ')) {
        return (
          <li key={idx} className="list-disc list-inside ml-2 text-on-surface-variant my-0.5">
            {renderInline(cleanLine.substring(2))}
          </li>
        );
      }
      if (/^\d+\.\s/.test(cleanLine)) {
        const parts = cleanLine.split(/^\d+\.\s/);
        return (
          <li key={idx} className="list-decimal list-inside ml-2 text-on-surface-variant my-0.5">
            {renderInline(parts[1])}
          </li>
        );
      }
      return (
        <p key={idx} className="my-1 text-on-surface-variant leading-relaxed">
          {renderInline(line)}
        </p>
      );
    });
  };

  // ─── Sidebar Filtering ──────────────────────────────────────────────────────
  const filteredConversations = conversations.filter(c =>
    c.title?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const pinnedConvs = filteredConversations.filter(c => c.isPinned);
  const recentConvs = filteredConversations.filter(c => !c.isPinned);

  return (
    <div className="glass-panel rounded-xl flex h-[620px] overflow-hidden border border-white/10">
      {/* ─── SIDEBAR: Conversation History ─────────────────────────────────── */}
      <div className="w-[260px] border-r border-white/10 bg-surface-container/20 flex flex-col h-full">
        {/* Sidebar Header */}
        <div className="p-4 border-b border-white/10 flex flex-col gap-3">
          <button
            onClick={startNewChat}
            className="w-full flex items-center justify-center gap-2 py-2 rounded-xl bg-primary text-on-primary hover:bg-primary-fixed transition text-xs font-bold shadow-lg"
          >
            <span className="material-symbols-outlined text-sm">add</span>
            New Chat
          </button>
          
          {/* Search bar */}
          <div className="relative">
            <span className="material-symbols-outlined absolute left-2.5 top-2 text-on-surface-variant/60 text-base">search</span>
            <input
              type="text"
              placeholder="Search chat..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-surface-container-high/40 border border-white/10 rounded-lg pl-8 pr-3 py-1.5 text-[11px] text-on-surface focus:outline-none focus:border-primary/50"
            />
          </div>
        </div>

        {/* Conversations list */}
        <div className="flex-1 overflow-y-auto p-2 space-y-3">
          {/* Pinned Section */}
          {pinnedConvs.length > 0 && (
            <div>
              <span className="text-[9px] font-bold text-primary/70 uppercase tracking-wider px-2 block mb-1">Pinned</span>
              <div className="space-y-1">
                {pinnedConvs.map(c => renderConvRow(c))}
              </div>
            </div>
          )}

          {/* Recent Section */}
          <div>
            {pinnedConvs.length > 0 && <span className="text-[9px] font-bold text-on-surface-variant/50 uppercase tracking-wider px-2 block mb-1 mt-2">Recent</span>}
            <div className="space-y-1">
              {recentConvs.length > 0 ? (
                recentConvs.map(c => renderConvRow(c))
              ) : (
                <div className="text-[10px] text-center text-on-surface-variant/40 py-6">
                  No chats found
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Sidebar Footer */}
        <div className="p-3 border-t border-white/10 bg-surface-container-low/40 flex justify-between gap-2">
          <button
            onClick={exportHistory}
            className="flex-1 py-1.5 rounded-lg border border-white/10 hover:bg-white/5 text-[10px] font-bold text-on-surface flex items-center justify-center gap-1 transition"
          >
            <span className="material-symbols-outlined text-xs">download</span>
            Export
          </button>
          <button
            onClick={triggerImportFile}
            className="flex-1 py-1.5 rounded-lg border border-white/10 hover:bg-white/5 text-[10px] font-bold text-on-surface flex items-center justify-center gap-1 transition"
          >
            <span className="material-symbols-outlined text-xs">upload</span>
            Import
          </button>
          <input
            type="file"
            accept=".json"
            ref={fileInputRef}
            onChange={importHistory}
            className="hidden"
          />
        </div>
      </div>

      {/* ─── CHAT WINDOW: Conversations View ───────────────────────────────── */}
      <div className="flex-1 flex flex-col h-full bg-surface-container/10">
        {/* Active Chat Header */}
        <div className="bg-surface-container/60 border-b border-white/10 px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-primary/10 border border-primary/30 flex items-center justify-center">
              <span className="material-symbols-outlined text-primary text-base">smart_toy</span>
            </div>
            <div>
              <h3 className="font-bold text-white text-xs">
                {activeSessionId
                  ? (conversations.find(c => c.id === activeSessionId)?.title || 'Weather Chat')
                  : 'SkySense Weather AI'}
              </h3>
              <p className="text-[9px] text-green-400 font-semibold flex items-center gap-1">
                <span className="w-1 h-1 rounded-full bg-green-400 animate-ping" />
                Grounded Context: {activeLocation.name}
              </p>
            </div>
          </div>

          {/* TTS Stop Button */}
          {speakingMsgId && (
            <button
              onClick={stopSpeaking}
              className="flex items-center gap-1 text-[10px] font-bold bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20 rounded-full px-3 py-1 transition"
            >
              <span className="material-symbols-outlined text-xs">volume_off</span>
              Stop Voice
            </button>
          )}
        </div>

        {/* Messages Feed */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {messages.map((msg, i) => (
            <div key={i} className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'}`}>
              <div className={`max-w-[85%] rounded-2xl px-4 py-3 text-[11px] leading-relaxed relative group ${
                msg.role === 'user'
                  ? 'bg-primary text-on-primary rounded-tr-none'
                  : msg.isError
                    ? 'bg-error-container/30 border border-error-container text-white rounded-tl-none'
                    : 'bg-surface-container-high/60 border border-white/5 text-on-surface rounded-tl-none'
              }`}>
                {msg.role === 'model' ? renderMarkdown(msg.content) : msg.content}

                {/* Speak speaker button for models */}
                {msg.role === 'model' && msg.content && !msg.isError && (
                  <button
                    onClick={() => speakText(msg.content, i)}
                    className="absolute -right-7 top-1 text-on-surface-variant hover:text-white opacity-0 group-hover:opacity-100 transition p-1"
                    title="Speak Response"
                  >
                    <span className="material-symbols-outlined text-sm">
                      {speakingMsgId === i && !isPaused ? 'pause_circle' : 'volume_up'}
                    </span>
                  </button>
                )}
              </div>

              {/* Weather Snapshot Grounded Card */}
              {msg.role === 'model' && msg.snapshot && i === messages.length - 1 && !loading && (
                <div className="mt-2 glass-panel p-3 rounded-lg flex items-center gap-4 border border-primary/20 bg-primary/5 animate-fade-in w-full max-w-[400px]">
                  <div className="text-left">
                    <span className="text-[9px] font-bold text-primary uppercase tracking-wider block">Grounded Observation</span>
                    <strong className="text-white text-xs">{msg.snapshot.temp_c}°C</strong>
                    <span className="text-[10px] text-on-surface-variant ml-2 capitalize">{msg.snapshot.condition}</span>
                  </div>
                  <div className="h-6 w-px bg-white/10" />
                  <div className="text-[10px] text-on-surface-variant flex-1 text-right">
                    Clothing: <strong>{msg.snapshot.insights?.clothing?.type || 'Casual'}</strong>
                  </div>
                </div>
              )}
            </div>
          ))}

          {/* Loading status */}
          {loading && (
            <div className="flex items-center gap-3 bg-surface-container-high/30 border border-white/5 rounded-2xl px-4 py-3 w-[260px] text-[11px]">
              <div className="w-3.5 h-3.5 rounded-full border-2 border-primary/20 border-t-primary animate-spin" />
              <span className="text-on-surface-variant font-medium">Querying atmospheric data...</span>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input bar */}
        <div className="p-4 border-t border-white/10 bg-surface-container-low/40">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="flex gap-2 items-center"
          >
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              disabled={loading}
              placeholder={isRecording ? 'Listening...' : `Ask about weather in ${activeLocation.name}...`}
              className="flex-1 bg-surface-container/50 border border-white/10 rounded-xl px-4 py-2.5 text-xs text-on-surface focus:outline-none focus:border-primary/50"
            />

            {/* Microphone recording button */}
            <button
              type="button"
              onClick={toggleSpeechRecording}
              className={`p-2.5 rounded-xl border flex items-center justify-center transition ${
                isRecording
                  ? 'bg-red-500/20 border-red-500/40 text-red-400 animate-pulse'
                  : 'bg-white/5 border-white/10 hover:bg-white/10 text-on-surface-variant'
              }`}
              title={isRecording ? 'Stop Recording' : 'Voice Input'}
            >
              <span className="material-symbols-outlined text-lg">
                {isRecording ? 'mic' : 'mic_none'}
              </span>
            </button>

            <button
              type="submit"
              disabled={loading || !inputText.trim()}
              className="bg-primary text-on-primary hover:bg-primary-fixed disabled:opacity-50 disabled:cursor-not-allowed transition p-2.5 rounded-xl flex items-center justify-center"
            >
              <span className="material-symbols-outlined text-base">send</span>
            </button>
          </form>
        </div>
      </div>
    </div>
  );

  // ─── Render Conversation Item Row ──────────────────────────────────────────
  function renderConvRow(conv) {
    const isActive = activeSessionId === conv.id;
    const isEditing = editingTitleId === conv.id;

    return (
      <div
        key={conv.id}
        onClick={() => {
          if (!isEditing) {
            setActiveSessionId(conv.id);
          }
        }}
        className={`group flex items-center justify-between px-3 py-2 rounded-lg text-xs font-semibold cursor-pointer transition ${
          isActive
            ? 'bg-primary/10 border border-primary/20 text-white'
            : 'border border-transparent text-on-surface-variant hover:bg-white/5 hover:text-white'
        }`}
      >
        <div className="flex items-center gap-2 flex-1 min-w-0">
          <span className="material-symbols-outlined text-sm opacity-60">chat_bubble</span>
          {isEditing ? (
            <input
              type="text"
              value={editTitleText}
              onChange={(e) => setEditTitleText(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && saveRenameConversation(conv.id)}
              onClick={(e) => e.stopPropagation()}
              className="bg-surface-container border border-white/10 rounded px-1.5 py-0.5 text-xs text-white w-full focus:outline-none"
              autoFocus
            />
          ) : (
            <span className="truncate">{conv.title || 'Weather Chat'}</span>
          )}
        </div>

        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition pl-1">
          {isEditing ? (
            <button
              onClick={(e) => { e.stopPropagation(); saveRenameConversation(conv.id); }}
              className="text-primary hover:text-white"
            >
              <span className="material-symbols-outlined text-[15px]">check</span>
            </button>
          ) : (
            <>
              <button
                onClick={(e) => startRenameConversation(conv.id, conv.title, e)}
                className="text-on-surface-variant hover:text-white"
                title="Rename"
              >
                <span className="material-symbols-outlined text-[15px]">edit</span>
              </button>
              <button
                onClick={(e) => togglePinConversation(conv.id, e)}
                className={`hover:text-white ${conv.isPinned ? 'text-primary' : 'text-on-surface-variant'}`}
                title={conv.isPinned ? 'Unpin' : 'Pin'}
              >
                <span className="material-symbols-outlined text-[15px]">push_pin</span>
              </button>
              <button
                onClick={(e) => deleteConversation(conv.id, e)}
                className="text-on-surface-variant hover:text-red-400"
                title="Delete"
              >
                <span className="material-symbols-outlined text-[15px]">delete</span>
              </button>
            </>
          )}
        </div>
      </div>
    );
  }
}
