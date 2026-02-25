import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sidebar } from './Sidebar';
import { Toast } from './Toast';
import { useTrialStore } from '../store/trialStore';
import { useUIStore } from '../store/uiStore';
import { Send, Menu, LogOut, Sparkles, AlertCircle } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { createTypewriterEffect } from '../utils/typewriter';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  insights?: {
    summary?: string;
    risk?: string;
    financial?: string;
    actions?: string[];
    confidence?: string;
  };
}

export function CommandCenter() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [userName, setUserName] = useState('Orville');
  const [firstLogin, setFirstLogin] = useState(true);

  const { sessionsRemaining, decrementSession, sessionCount } = useTrialStore();
  const { toggleSidebar, executiveMode, toggleExecutiveMode } = useUIStore();

  useEffect(() => {
    const loadUserProfile = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user?.user_metadata?.full_name) {
        const firstName = user.user_metadata.full_name.split(' ')[0];
        setUserName(firstName);
      }
    };
    loadUserProfile();
  }, []);

  const showToastNotification = (message: string) => {
    setToastMessage(message);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  const handleExecutiveModeToggle = () => {
    toggleExecutiveMode();
    if (!executiveMode) {
      showToastNotification('Executive Intelligence Mode Activated');
    }
  };

  const suggestedPrompts = [
    'Identify downtime drivers',
    'Simulate PM optimization',
    'Analyze rotating asset risk',
    'Generate ISO 55000 gap assessment',
    'Build 3-year asset strategy',
  ];

  const handleSendMessage = async () => {
    if (!input.trim() || sessionsRemaining === 0) {
      if (sessionsRemaining === 0) {
        setShowUpgradeModal(true);
      }
      return;
    }

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input,
    };

    setMessages((prev) => [...prev, userMessage]);
    const currentInput = input;
    setInput('');
    setIsTyping(true);
    setFirstLogin(false);
    decrementSession();

    const currentSessionCount = sessionCount + 1;

    if (currentSessionCount === 7) {
      setTimeout(() => {
        const fullContent = `Based on your inputs, projected downtime reduction is between 11–17%. Would you like a full operational assessment report?`;
        const messageId = (Date.now() + 1).toString();

        const tempMessage: Message = {
          id: messageId,
          role: 'assistant',
          content: '',
          insights: {
            summary: 'Analysis of your 7 operational queries reveals consistent optimization patterns.',
            financial: 'Estimated annual savings opportunity: $840K - $1.2M through systematic improvements.',
            actions: [
              'Generate comprehensive operational assessment report',
              'Schedule strategic planning session with your team',
              'Review capital allocation for high-ROI interventions',
            ],
            confidence: 'High',
          },
        };

        setMessages((prev) => [...prev, tempMessage]);
        setIsTyping(false);

        createTypewriterEffect(
          fullContent,
          (displayedText) => {
            setMessages((prev) =>
              prev.map((msg) =>
                msg.id === messageId ? { ...msg, content: displayedText } : msg
              )
            );
          },
          () => {
            setTimeout(() => setShowUpgradeModal(true), 2000);
          }
        );
      }, 1500);
      return;
    }

    setTimeout(() => {
      const fullContent = executiveMode
        ? `Based on your query regarding "${currentInput}", I've analyzed the operational intelligence layer.`
        : `I've analyzed your request: "${currentInput}". Here's what the data reveals:`;

      const messageId = (Date.now() + 1).toString();
      const assistantMessage: Message = {
        id: messageId,
        role: 'assistant',
        content: '',
        insights: {
          summary: executiveMode
            ? 'Strategic analysis indicates 14-18% operational efficiency improvement opportunity through targeted reliability interventions.'
            : 'Analysis of failure patterns shows clustering in rotating equipment with elevated PM variance.',
          risk: executiveMode
            ? 'Risk-adjusted exposure indicates $2.4M annual EBITDA vulnerability from current maintenance strategy.'
            : 'High-criticality assets showing 23% elevated failure probability in Q2.',
          financial: executiveMode
            ? 'Projected EBITDA lift of $3.8M through optimized asset strategy. Capital efficiency improvement: 16%.'
            : 'Estimated downtime cost reduction: $480K annually through PM optimization.',
          actions: executiveMode
            ? [
                'Initiate strategic reliability program across critical asset class',
                'Allocate $850K capital for proactive interventions',
                'Establish executive KPI dashboard for EBITDA tracking',
              ]
            : [
                'Increase PM frequency on rotating assets by 15%',
                'Deploy condition monitoring on 8 critical pumps',
                'Schedule detailed inspection on units P-101, P-103',
              ],
          confidence: 'High',
        },
      };
      setMessages((prev) => [...prev, assistantMessage]);
      setIsTyping(false);

      createTypewriterEffect(
        fullContent,
        (displayedText) => {
          setMessages((prev) =>
            prev.map((msg) =>
              msg.id === messageId ? { ...msg, content: displayedText } : msg
            )
          );
        },
        () => {}
      );
    }, 1500);
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    window.location.reload();
  };

  return (
    <div className="h-screen flex bg-[#0B0F14]">
      <Toast message={toastMessage} show={showToast} onClose={() => setShowToast(false)} />
      <Sidebar />

      <div className="flex-1 flex flex-col">
        {sessionsRemaining === 2 && (
          <div className="bg-[#3A8DFF]/10 border-b border-[#3A8DFF]/30 px-6 py-3">
            <div className="flex items-center justify-center gap-2 text-sm">
              <AlertCircle className="w-4 h-4 text-[#3A8DFF]" />
              <span className="text-[#E6EDF3]">You're approaching your exploration limit.</span>
            </div>
          </div>
        )}

        {/* Header */}
        <div className="bg-[#11161D] border-b border-[#232A33] px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={toggleSidebar}
                className="p-2 hover:bg-[#161C24] rounded-lg transition-colors"
              >
                <Menu className="w-5 h-5 text-[#9BA7B4]" />
              </button>
              <div>
                <h1 className="text-lg font-semibold text-[#E6EDF3]">SyncAI Operator</h1>
                <p className="text-sm text-[#9BA7B4]">
                  Connected to Industrial Intelligence Layer
                </p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <button
                onClick={handleExecutiveModeToggle}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-150 ${
                  executiveMode
                    ? 'bg-[#3A8DFF] text-white'
                    : 'bg-[#161C24] text-[#9BA7B4] hover:text-[#E6EDF3] hover:bg-[#1A222C]'
                }`}
              >
                {executiveMode ? 'Executive View' : 'Operator View'}
              </button>

              <div className="px-4 py-2 bg-[#161C24] rounded-lg border border-[#232A33] transition-all duration-150 hover:border-[#3A8DFF]/50">
                <span className="text-sm text-[#9BA7B4]">
                  Trial — <span className="text-[#3A8DFF] font-semibold">{sessionsRemaining}</span>{' '}
                  Sessions Remaining
                </span>
              </div>

              <button
                onClick={() => setShowUpgradeModal(true)}
                className="px-4 py-2 bg-[#3A8DFF] hover:bg-[#2E7AE6] text-white text-sm font-medium rounded-lg transition-all duration-150 hover:shadow-lg hover:shadow-[#3A8DFF]/20"
              >
                Upgrade
              </button>

              <button
                onClick={handleLogout}
                className="p-2 hover:bg-[#161C24] rounded-lg transition-colors"
              >
                <LogOut className="w-5 h-5 text-[#9BA7B4]" />
              </button>
            </div>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-6">
          {messages.length === 0 ? (
            <div className="max-w-3xl mx-auto mt-12">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center mb-12"
              >
                <div className="inline-flex items-center justify-center w-16 h-16 bg-[#3A8DFF]/10 rounded-2xl mb-6">
                  <Sparkles className="w-8 h-8 text-[#3A8DFF]" />
                </div>
                <h2 className="text-2xl font-semibold text-[#E6EDF3] mb-3">
                  {firstLogin ? `Good evening, ${userName}.` : `Welcome back, ${userName}.`}
                </h2>
                <p className="text-[#9BA7B4] mb-8">
                  {firstLogin ? (
                    <>
                      Your industrial profile has been initialized.
                      <br />
                      What operational constraint would you like to address?
                    </>
                  ) : (
                    'What would you like to analyze next?'
                  )}
                </p>

                <div className="flex flex-wrap gap-3 justify-center">
                  {suggestedPrompts.map((prompt) => (
                    <button
                      key={prompt}
                      onClick={() => setInput(prompt)}
                      className="px-4 py-2 bg-[#161C24] hover:bg-[#1A222C] border border-[#232A33] hover:border-[#3A8DFF]/30 rounded-lg text-sm text-[#E6EDF3] transition-all duration-150"
                    >
                      {prompt}
                    </button>
                  ))}
                </div>
              </motion.div>
            </div>
          ) : (
            <div className="max-w-3xl mx-auto space-y-6">
              {messages.map((message) => (
                <motion.div
                  key={message.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={message.role === 'user' ? 'flex justify-end' : ''}
                >
                  {message.role === 'user' ? (
                    <div className="bg-[#3A8DFF] text-white px-4 py-3 rounded-lg max-w-[80%]">
                      {message.content}
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <div className="text-[#E6EDF3] leading-relaxed">{message.content}</div>
                      {message.insights && (
                        <div className="grid gap-4 mt-4">
                          {message.insights.summary && (
                            <div className="bg-[#161C24] border border-[#232A33] rounded-lg p-4">
                              <h3 className="text-sm font-semibold text-[#3A8DFF] mb-2">
                                Executive Summary
                              </h3>
                              <p className="text-sm text-[#E6EDF3]">{message.insights.summary}</p>
                            </div>
                          )}
                          {message.insights.risk && (
                            <div className="bg-[#161C24] border border-[#232A33] rounded-lg p-4">
                              <h3 className="text-sm font-semibold text-[#3A8DFF] mb-2">
                                Risk Exposure
                              </h3>
                              <p className="text-sm text-[#E6EDF3]">{message.insights.risk}</p>
                            </div>
                          )}
                          {message.insights.financial && (
                            <div className="bg-[#161C24] border border-[#232A33] rounded-lg p-4">
                              <h3 className="text-sm font-semibold text-[#3A8DFF] mb-2">
                                Financial Impact
                              </h3>
                              <p className="text-sm text-[#E6EDF3]">{message.insights.financial}</p>
                            </div>
                          )}
                          {message.insights.actions && (
                            <div className="bg-[#161C24] border border-[#232A33] rounded-lg p-4">
                              <h3 className="text-sm font-semibold text-[#3A8DFF] mb-2">
                                Recommended Actions
                              </h3>
                              <ul className="space-y-2">
                                {message.insights.actions.map((action, i) => (
                                  <li key={i} className="text-sm text-[#E6EDF3] flex gap-2">
                                    <span className="text-[#3A8DFF]">{i + 1}.</span>
                                    <span>{action}</span>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          )}
                          {message.insights.confidence && (
                            <div className="text-xs text-[#9BA7B4]">
                              Confidence Level: {message.insights.confidence}
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  )}
                </motion.div>
              ))}
              {isTyping && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex gap-2 text-[#9BA7B4]"
                >
                  <div className="w-2 h-2 bg-[#9BA7B4] rounded-full animate-bounce"></div>
                  <div
                    className="w-2 h-2 bg-[#9BA7B4] rounded-full animate-bounce"
                    style={{ animationDelay: '0.2s' }}
                  ></div>
                  <div
                    className="w-2 h-2 bg-[#9BA7B4] rounded-full animate-bounce"
                    style={{ animationDelay: '0.4s' }}
                  ></div>
                </motion.div>
              )}
            </div>
          )}
        </div>

        {/* Input */}
        <div className="border-t border-[#232A33] p-6">
          <div className="max-w-3xl mx-auto">
            <div className="flex gap-3">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                disabled={sessionsRemaining === 0}
                placeholder={
                  sessionsRemaining === 0
                    ? 'Trial limit reached - upgrade to continue'
                    : 'Describe the operational constraint...'
                }
                className="flex-1 px-4 py-3 bg-[#161C24] border border-[#232A33] rounded-lg text-[#E6EDF3] placeholder-[#9BA7B4] focus:outline-none focus:border-[#3A8DFF] focus:ring-1 focus:ring-[#3A8DFF] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              />
              <button
                onClick={handleSendMessage}
                disabled={!input.trim() || sessionsRemaining === 0}
                className="px-6 py-3 bg-[#3A8DFF] hover:bg-[#2E7AE6] text-white rounded-lg transition-all duration-150 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 hover:shadow-lg hover:shadow-[#3A8DFF]/20"
              >
                <Send className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Upgrade Modal */}
      <AnimatePresence>
        {showUpgradeModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 flex items-center justify-center p-6 z-50"
            onClick={() => setShowUpgradeModal(false)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-[#161C24] border border-[#232A33] rounded-xl p-8 max-w-md w-full"
            >
              <h2 className="text-2xl font-semibold text-[#E6EDF3] mb-3">
                Exploration Limit Reached
              </h2>
              <p className="text-[#9BA7B4] mb-6 leading-relaxed">
                SyncAI has identified measurable operational optimization potential. Upgrade to
                activate continuous monitoring and multi-agent execution.
              </p>
              <div className="space-y-3">
                <button className="w-full py-3 px-4 bg-[#3A8DFF] hover:bg-[#2E7AE6] text-white font-medium rounded-lg transition-all duration-150 hover:shadow-lg hover:shadow-[#3A8DFF]/20">
                  Upgrade to Professional
                </button>
                <button className="w-full py-3 px-4 bg-[#11161D] hover:bg-[#161C24] border border-[#232A33] hover:border-[#3A8DFF]/30 text-[#E6EDF3] font-medium rounded-lg transition-all duration-150">
                  Speak With Enterprise Team
                </button>
                <button
                  onClick={() => setShowUpgradeModal(false)}
                  className="w-full py-2 text-sm text-[#9BA7B4] hover:text-[#E6EDF3]"
                >
                  Maybe later
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
