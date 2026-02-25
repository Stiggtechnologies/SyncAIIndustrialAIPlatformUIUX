import { motion } from 'framer-motion';

export function Privacy() {
  return (
    <div className="min-h-screen bg-[#0B0F14] py-16 px-6">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12"
        >
          <h1 className="text-4xl font-semibold text-[#E6EDF3] mb-4">Privacy Policy</h1>
          <p className="text-[#9BA7B4]">Last updated: February 2026</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-[#161C24] border border-[#232A33] rounded-xl p-8 space-y-6"
        >
          <section>
            <h2 className="text-xl font-semibold text-[#E6EDF3] mb-3">Data Collection</h2>
            <p className="text-[#9BA7B4] leading-relaxed">
              SyncAI collects operational data necessary to provide intelligence services: asset
              performance, maintenance records, work orders, and reliability metrics.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-[#E6EDF3] mb-3">Data Security</h2>
            <p className="text-[#9BA7B4] leading-relaxed">
              All data is encrypted at rest (AES-256) and in transit (TLS 1.3). We implement
              row-level security, role-based access control, and comprehensive audit logging.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-[#E6EDF3] mb-3">Data Usage</h2>
            <p className="text-[#9BA7B4] leading-relaxed">
              Your operational data is used exclusively to power AI-driven insights and
              recommendations. We do not sell data to third parties.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-[#E6EDF3] mb-3">Compliance</h2>
            <p className="text-[#9BA7B4] leading-relaxed">
              SyncAI maintains SOC 2 Type II, ISO 27001, and GDPR compliance standards.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-[#E6EDF3] mb-3">Contact</h2>
            <p className="text-[#9BA7B4] leading-relaxed">
              For privacy inquiries, contact{' '}
              <a href="mailto:privacy@syncai.com" className="text-[#3A8DFF] hover:underline">
                privacy@syncai.com
              </a>
            </p>
          </section>
        </motion.div>
      </div>
    </div>
  );
}
