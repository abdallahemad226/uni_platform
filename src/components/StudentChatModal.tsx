import React, { useState, useEffect, useRef } from 'react';
import {
  X,
  Send,
  Search,
  MessageSquare,
  User,
  Check,
  CheckCheck,
  Circle,
  Clock,
  Sparkles
} from 'lucide-react';
import { StudentRecord, ChatMessage } from '../types';

interface StudentDirectoryItem {
  seatNumber: string;
  name: string;
  level: string;
  department: string;
  avatar: string;
}

interface StudentChatModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: StudentRecord;
  onUnreadCountChanged?: (count: number) => void;
}

export const StudentChatModal: React.FC<StudentChatModalProps> = ({
  isOpen,
  onClose,
  currentUser,
  onUnreadCountChanged
}) => {
  const [directory, setDirectory] = useState<StudentDirectoryItem[]>([]);
  const [searchDirectory, setSearchDirectory] = useState('');
  const [activePartner, setActivePartner] = useState<StudentDirectoryItem | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [newMessageText, setNewMessageText] = useState('');
  const [isSending, setIsSending] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) {
      fetchDirectory();
      fetchMessages();
    }
  }, [isOpen, currentUser.seatNumber]);

  useEffect(() => {
    if (!isOpen) return;
    const interval = setInterval(() => {
      fetchMessages();
    }, 3000);
    return () => clearInterval(interval);
  }, [isOpen, activePartner?.seatNumber]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, activePartner]);

  const fetchDirectory = async () => {
    try {
      const res = await fetch('/api/students/directory');
      if (res.ok) {
        const list: StudentDirectoryItem[] = await res.json();
        // filter out current user
        const otherStudents = list.filter(s => s.seatNumber !== currentUser.seatNumber);
        setDirectory(otherStudents);
        if (otherStudents.length > 0 && !activePartner) {
          setActivePartner(otherStudents[0]);
        }
      }
    } catch {}
  };

  const fetchMessages = async () => {
    try {
      const res = await fetch(`/api/messages?seatNumber=${currentUser.seatNumber}`);
      if (res.ok) {
        const data: ChatMessage[] = await res.json();
        setMessages(data);

        // calculate unread
        const unread = data.filter(m => m.receiverSeat === currentUser.seatNumber && !m.read).length;
        if (onUnreadCountChanged) onUnreadCountChanged(unread);

        // if active partner, mark as read
        if (activePartner) {
          markAsRead(activePartner.seatNumber);
        }
      }
    } catch {}
  };

  const markAsRead = async (otherSeat: string) => {
    try {
      await fetch('/api/messages/read', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userSeat: currentUser.seatNumber, otherSeat })
      });
    } catch {}
  };

  const handleSelectPartner = (partner: StudentDirectoryItem) => {
    setActivePartner(partner);
    markAsRead(partner.seatNumber);
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessageText.trim() || !activePartner || isSending) return;

    const content = newMessageText.trim();
    setNewMessageText('');
    setIsSending(true);

    try {
      const res = await fetch('/api/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          senderSeat: currentUser.seatNumber,
          receiverSeat: activePartner.seatNumber,
          content
        })
      });

      if (res.ok) {
        const result = await res.json();
        setMessages(prev => [...prev, result.message]);
      }
    } catch {
      alert('تعذر إرسال الرسالة، يرجى المحاولة لاحقاً');
    } finally {
      setIsSending(false);
    }
  };

  if (!isOpen) return null;

  // Filter messages for current partner
  const currentConversation = activePartner
    ? messages.filter(
        m =>
          (m.senderSeat === currentUser.seatNumber && m.receiverSeat === activePartner.seatNumber) ||
          (m.senderSeat === activePartner.seatNumber && m.receiverSeat === currentUser.seatNumber)
      )
    : [];

  const filteredDirectory = directory.filter(s => {
    if (!searchDirectory) return true;
    const q = searchDirectory.toLowerCase();
    return s.name.toLowerCase().includes(q) || s.department.toLowerCase().includes(q) || s.seatNumber.includes(q);
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/80 backdrop-blur-xs">
      <div className="relative w-full max-w-4xl h-[88vh] rounded-xl border border-neutral-300 dark:border-neutral-800 bg-white dark:bg-neutral-950 shadow-2xl flex flex-col overflow-hidden text-neutral-900 dark:text-neutral-100">
        
        {/* Top Modal Bar */}
        <div className="p-3.5 sm:p-4 border-b border-neutral-200 dark:border-neutral-800 flex items-center justify-between bg-neutral-50 dark:bg-neutral-900/50 shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-md bg-neutral-950 text-white dark:bg-white dark:text-neutral-950 flex items-center justify-center font-bold">
              <MessageSquare className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm sm:text-base font-bold leading-tight">
                المحادثات الأكاديمية والرسائل الداخلية
              </h3>
              <p className="text-[11px] text-neutral-500 font-mono">
                أنت مسجل حالياً باسم: {currentUser.name} (رقم الجلوس: {currentUser.seatNumber})
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded text-neutral-400 hover:text-neutral-950 dark:hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Main Chat Interface: 2-Columns */}
        <div className="flex-1 flex overflow-hidden">
          
          {/* Left Column: Students Directory (Sidebar) */}
          <div className="w-72 sm:w-80 border-l border-neutral-200 dark:border-neutral-800 flex flex-col bg-neutral-50/50 dark:bg-neutral-900/30 shrink-0">
            {/* Search Directory */}
            <div className="p-3 border-b border-neutral-200 dark:border-neutral-800">
              <div className="relative">
                <Search className="absolute right-2.5 top-2.5 w-3.5 h-3.5 text-neutral-400" />
                <input
                  type="text"
                  value={searchDirectory}
                  onChange={(e) => setSearchDirectory(e.target.value)}
                  placeholder="ابحث عن زميل بالاسم أو القسم..."
                  className="w-full pr-8 pl-2.5 py-1.5 text-xs bg-white dark:bg-neutral-900 border border-neutral-300 dark:border-neutral-800 rounded-md focus:outline-none"
                />
              </div>
            </div>

            {/* Students List */}
            <div className="flex-1 overflow-y-auto divide-y divide-neutral-150 dark:divide-neutral-850">
              {filteredDirectory.map((student) => {
                const isSelected = activePartner?.seatNumber === student.seatNumber;
                // find unread count from this student
                const unreadFromThis = messages.filter(
                  m => m.senderSeat === student.seatNumber && m.receiverSeat === currentUser.seatNumber && !m.read
                ).length;

                // get last message
                const conv = messages.filter(
                  m =>
                    (m.senderSeat === currentUser.seatNumber && m.receiverSeat === student.seatNumber) ||
                    (m.senderSeat === student.seatNumber && m.receiverSeat === currentUser.seatNumber)
                );
                const lastMsg = conv[conv.length - 1];

                return (
                  <button
                    key={student.seatNumber}
                    onClick={() => handleSelectPartner(student)}
                    className={`w-full p-3 text-right flex items-center gap-3 transition-colors ${
                      isSelected
                        ? 'bg-neutral-200 dark:bg-neutral-800/80 font-semibold'
                        : 'hover:bg-neutral-100 dark:hover:bg-neutral-900'
                    }`}
                  >
                    <div className="relative shrink-0">
                      <img
                        src={student.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80'}
                        alt={student.name}
                        className="w-10 h-10 rounded-full object-cover border border-neutral-300 dark:border-neutral-700"
                      />
                      <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-emerald-500 ring-2 ring-white dark:ring-neutral-950" />
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-neutral-950 dark:text-white truncate">
                          {student.name}
                        </span>
                        {unreadFromThis > 0 && (
                          <span className="w-4 h-4 rounded-full bg-neutral-950 text-white dark:bg-white dark:text-neutral-950 text-[10px] flex items-center justify-center font-mono">
                            {unreadFromThis}
                          </span>
                        )}
                      </div>
                      <div className="text-[10px] text-neutral-500 font-mono truncate">
                        {student.department} · {student.level}
                      </div>
                      {lastMsg && (
                        <div className="text-[11px] text-neutral-600 dark:text-neutral-400 truncate mt-0.5 font-normal">
                          {lastMsg.content}
                        </div>
                      )}
                    </div>
                  </button>
                );
              })}

              {filteredDirectory.length === 0 && (
                <div className="p-6 text-center text-xs text-neutral-500">
                  لم يتم العثور على زميل مطابق.
                </div>
              )}
            </div>
          </div>

          {/* Right Column: Active Conversation Area */}
          <div className="flex-1 flex flex-col bg-white dark:bg-neutral-950">
            {activePartner ? (
              <>
                {/* Partner Header */}
                <div className="p-3.5 border-b border-neutral-200 dark:border-neutral-800 flex items-center justify-between bg-neutral-50/50 dark:bg-neutral-900/20 shrink-0">
                  <div className="flex items-center gap-3">
                    <img
                      src={activePartner.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80'}
                      alt={activePartner.name}
                      className="w-9 h-9 rounded-full object-cover border border-neutral-300 dark:border-neutral-700"
                    />
                    <div>
                      <h4 className="text-xs sm:text-sm font-bold text-neutral-950 dark:text-white">
                        {activePartner.name}
                      </h4>
                      <div className="text-[10px] text-neutral-500 font-mono">
                        {activePartner.department} · {activePartner.level} (رقم جلوس: {activePartner.seatNumber})
                      </div>
                    </div>
                  </div>

                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                    متصل الآن
                  </span>
                </div>

                {/* Messages Stream */}
                <div className="flex-1 overflow-y-auto p-4 space-y-3">
                  {currentConversation.map((msg) => {
                    const isMe = msg.senderSeat === currentUser.seatNumber;
                    return (
                      <div
                        key={msg.id}
                        className={`flex gap-2.5 ${isMe ? 'flex-row-reverse' : 'flex-row'}`}
                      >
                        <img
                          src={isMe ? (currentUser.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80') : (activePartner.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80')}
                          alt=""
                          className="w-7 h-7 rounded-full object-cover shrink-0 mt-1 border border-neutral-200 dark:border-neutral-800"
                        />
                        <div
                          className={`max-w-[75%] rounded-lg p-3 text-xs leading-relaxed ${
                            isMe
                              ? 'bg-neutral-950 text-white dark:bg-white dark:text-neutral-950 rounded-br-none shadow-sm'
                              : 'bg-neutral-100 text-neutral-900 dark:bg-neutral-900 dark:text-neutral-100 rounded-bl-none border border-neutral-200 dark:border-neutral-800'
                          }`}
                        >
                          <div>{msg.content}</div>
                          <div
                            className={`text-[9px] mt-1 font-mono flex items-center justify-end gap-1 ${
                              isMe ? 'text-neutral-300 dark:text-neutral-600' : 'text-neutral-400'
                            }`}
                          >
                            <span>{msg.timestamp}</span>
                            {isMe && (
                              msg.read ? <CheckCheck className="w-3 h-3 text-emerald-400" /> : <Check className="w-3 h-3" />
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                  <div ref={messagesEndRef} />
                </div>

                {/* Chat Input Bar */}
                <form
                  onSubmit={handleSendMessage}
                  className="p-3 border-t border-neutral-200 dark:border-neutral-800 flex items-center gap-2 bg-neutral-50 dark:bg-neutral-900/40 shrink-0"
                >
                  <input
                    type="text"
                    value={newMessageText}
                    onChange={(e) => setNewMessageText(e.target.value)}
                    placeholder={`اكتب رسالة لـ ${activePartner.name}...`}
                    className="flex-1 px-3.5 py-2 text-xs sm:text-sm bg-white dark:bg-neutral-900 border border-neutral-300 dark:border-neutral-800 rounded-md text-neutral-950 dark:text-white focus:outline-none focus:ring-1 focus:ring-neutral-400"
                  />
                  <button
                    type="submit"
                    disabled={!newMessageText.trim() || isSending}
                    className="px-4 py-2 text-xs font-semibold rounded-md bg-neutral-950 text-white dark:bg-white dark:text-neutral-950 hover:bg-neutral-800 disabled:opacity-50 transition-colors flex items-center gap-1.5 shrink-0"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span className="hidden sm:inline">إرسال</span>
                  </button>
                </form>
              </>
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center p-8 text-center text-neutral-500">
                <MessageSquare className="w-12 h-12 stroke-[1.5] text-neutral-300 dark:text-neutral-700 mb-2" />
                <h4 className="text-sm font-bold text-neutral-900 dark:text-white">اختر زميلاً لبدء المحادثة</h4>
                <p className="text-xs text-neutral-500 mt-1">تواصل مباشرة مع زملائك بالكلية وتبادل الأفكار والمشاريع.</p>
              </div>
            )}
          </div>

        </div>

      </div>
    </div>
  );
};
