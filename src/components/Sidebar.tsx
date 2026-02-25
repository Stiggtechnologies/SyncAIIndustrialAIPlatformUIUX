import { useState } from 'react';
import { motion } from 'framer-motion';
import { useUIStore } from '../store/uiStore';
import {
  Home,
  Factory,
  ClipboardList,
  TrendingUp,
  Package,
  AlertTriangle,
  BarChart3,
  Bot,
  Settings,
} from 'lucide-react';

const menuItems = [
  { icon: Home, label: 'Command', id: 'command' },
  { icon: Factory, label: 'Assets', id: 'assets' },
  { icon: ClipboardList, label: 'Work Orders', id: 'work-orders' },
  { icon: TrendingUp, label: 'Reliability', id: 'reliability' },
  { icon: Package, label: 'Inventory', id: 'inventory' },
  { icon: AlertTriangle, label: 'Risk', id: 'risk' },
  { icon: BarChart3, label: 'Reports', id: 'reports' },
  { icon: Bot, label: 'Agents', id: 'agents' },
  { icon: Settings, label: 'Settings', id: 'settings' },
];

export function Sidebar() {
  const { sidebarExpanded } = useUIStore();
  const [activeItem, setActiveItem] = useState('command');

  return (
    <motion.div
      initial={false}
      animate={{ width: sidebarExpanded ? 240 : 72 }}
      transition={{ duration: 0.15, ease: 'easeInOut' }}
      className="bg-[#11161D] border-r border-[#232A33] flex flex-col overflow-hidden"
    >
      <div className="p-4 border-b border-[#232A33]">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-[#3A8DFF] rounded-lg flex items-center justify-center flex-shrink-0">
            <span className="text-white font-bold text-xl">S</span>
          </div>
          {sidebarExpanded && (
            <motion.span
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-lg font-semibold text-[#E6EDF3]"
            >
              SyncAI
            </motion.span>
          )}
        </div>
      </div>

      <nav className="flex-1 p-3 space-y-1">
        {menuItems.map((item) => {
          const isActive = activeItem === item.id;
          return (
            <motion.button
              key={item.id}
              onClick={() => setActiveItem(item.id)}
              whileHover={{ x: 4 }}
              whileTap={{ scale: 0.98 }}
              className={`w-full flex items-center gap-3 px-3 py-3 rounded-lg transition-colors group relative ${
                isActive
                  ? 'bg-[#3A8DFF]/10 text-[#3A8DFF]'
                  : 'text-[#9BA7B4] hover:bg-[#161C24] hover:text-[#E6EDF3]'
              }`}
            >
              {isActive && (
                <motion.div
                  layoutId="activeIndicator"
                  className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-[#3A8DFF] rounded-r"
                  transition={{ type: "spring", stiffness: 380, damping: 30 }}
                />
              )}
              <item.icon className="w-5 h-5 flex-shrink-0" />
              {sidebarExpanded && (
                <motion.span
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-sm font-medium"
                >
                  {item.label}
                </motion.span>
              )}
            </motion.button>
          );
        })}
      </nav>

      <div className="p-3 border-t border-[#232A33]">
        <div className="flex items-center gap-2 px-3 py-2">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
          {sidebarExpanded && (
            <motion.span
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-xs text-[#9BA7B4]"
            >
              Connected
            </motion.span>
          )}
        </div>
      </div>
    </motion.div>
  );
}
