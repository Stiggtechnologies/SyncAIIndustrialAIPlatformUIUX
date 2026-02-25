import { useState, useEffect } from 'react';
import { supabase } from './lib/supabase';
import { Login } from './pages/Login';
import { Signup } from './pages/Signup';
import { EnterpriseAccess } from './pages/EnterpriseAccess';
import { CommandCenter } from './components/CommandCenter';
import { Pricing } from './pages/Pricing';
import { Security } from './pages/Security';
import { Privacy } from './pages/Privacy';
import { Terms } from './pages/Terms';
import { motion, AnimatePresence } from 'framer-motion';

type Page = 'signin' | 'signup' | 'enterprise' | 'app' | 'pricing' | 'security' | 'privacy' | 'terms';

function App() {
  const [currentPage, setCurrentPage] = useState<Page>('signin');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setIsAuthenticated(!!session);
      if (session) {
        setCurrentPage('app');
      }
      setLoading(false);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setIsAuthenticated(!!session);
      if (session) {
        setCurrentPage('app');
      } else {
        setCurrentPage('signin');
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleAuthSuccess = () => {
    setIsAuthenticated(true);
    setCurrentPage('app');
  };

  const handleTabChange = (tab: Page) => {
    setCurrentPage(tab);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0B0F14] flex items-center justify-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
          className="w-12 h-12 border-2 border-[#3A8DFF] border-t-transparent rounded-full"
        />
      </div>
    );
  }

  const pageTransition = {
    initial: { opacity: 0, y: 10 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -10 },
    transition: { duration: 0.3, ease: 'easeInOut' }
  };

  return (
    <AnimatePresence mode="wait">
      {currentPage === 'signin' && (
        <motion.div key="signin" {...pageTransition}>
          <Login onSuccess={handleAuthSuccess} onTabChange={handleTabChange} />
        </motion.div>
      )}
      {currentPage === 'signup' && (
        <motion.div key="signup" {...pageTransition}>
          <Signup onSuccess={handleAuthSuccess} onTabChange={handleTabChange} />
        </motion.div>
      )}
      {currentPage === 'enterprise' && (
        <motion.div key="enterprise" {...pageTransition}>
          <EnterpriseAccess onSuccess={handleAuthSuccess} onTabChange={handleTabChange} />
        </motion.div>
      )}
      {currentPage === 'app' && isAuthenticated && (
        <motion.div key="app" {...pageTransition}>
          <CommandCenter />
        </motion.div>
      )}
      {currentPage === 'pricing' && (
        <motion.div key="pricing" {...pageTransition}>
          <Pricing />
        </motion.div>
      )}
      {currentPage === 'security' && (
        <motion.div key="security" {...pageTransition}>
          <Security onNavigate={setCurrentPage} />
        </motion.div>
      )}
      {currentPage === 'privacy' && (
        <motion.div key="privacy" {...pageTransition}>
          <Privacy onNavigate={setCurrentPage} />
        </motion.div>
      )}
      {currentPage === 'terms' && (
        <motion.div key="terms" {...pageTransition}>
          <Terms onNavigate={setCurrentPage} />
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default App;
