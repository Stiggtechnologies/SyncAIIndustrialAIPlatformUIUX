import { motion } from 'framer-motion';
import { ArrowLeft } from 'lucide-react';

interface TermsProps {
  onNavigate: (page: 'signin' | 'signup' | 'enterprise' | 'app' | 'pricing' | 'security' | 'privacy' | 'terms') => void;
}

export function Terms({ onNavigate }: TermsProps) {
  return (
    <div className="min-h-screen bg-[#0B0F14] py-16 px-6">
      <div className="max-w-4xl mx-auto">
        <button
          onClick={() => onNavigate('signin')}
          className="flex items-center gap-2 text-[#9BA7B4] hover:text-[#E6EDF3] mb-8 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Sign In
        </button>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12"
        >
          <h1 className="text-4xl font-semibold text-[#E6EDF3] mb-4">Terms of Service</h1>
          <p className="text-[#9BA7B4]">Last updated: February 2026</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-[#161C24] border border-[#232A33] rounded-xl p-8 space-y-6"
        >
          <section>
            <h2 className="text-xl font-semibold text-[#E6EDF3] mb-3">1. Service Agreement</h2>
            <p className="text-[#9BA7B4] leading-relaxed">
              By accessing SyncAI, you agree to these terms. SyncAI provides industrial intelligence
              infrastructure for asset-intensive enterprises.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-[#E6EDF3] mb-3">2. Usage Restrictions</h2>
            <p className="text-[#9BA7B4] leading-relaxed">
              You may not misuse the service, attempt unauthorized access, or use the platform in
              violation of applicable laws.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-[#E6EDF3] mb-3">3. Data Ownership</h2>
            <p className="text-[#9BA7B4] leading-relaxed">
              You retain all rights to your operational data. SyncAI processes data solely to provide
              the service and maintain platform security.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-[#E6EDF3] mb-3">4. Service Level</h2>
            <p className="text-[#9BA7B4] leading-relaxed">
              Enterprise customers receive 99.9% uptime SLA. Free trial users receive best-effort
              availability.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-[#E6EDF3] mb-3">5. Contact</h2>
            <p className="text-[#9BA7B4] leading-relaxed">
              For questions about these terms, contact{' '}
              <a href="mailto:legal@syncai.com" className="text-[#3A8DFF] hover:underline">
                legal@syncai.com
              </a>
            </p>
          </section>
        </motion.div>
      </div>
    </div>
  );
}
