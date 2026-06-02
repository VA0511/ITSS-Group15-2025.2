import React from 'react';
import { NavLink } from 'react-router-dom';
import * as LucideIcons from 'lucide-react';
import { useTranslation } from 'react-i18next';
import useAuthStore from '@/store/useAuthStore';
import useUIStore from '@/store/useUIStore';
import { menus } from '@/utils/menuConfig';
import { cn } from '@/lib/utils';
import { Dumbbell } from 'lucide-react';

const IconRender = ({ iconName }) => {
  const IconComponent = LucideIcons[iconName] || LucideIcons.Circle;
  return <IconComponent className="h-5 w-5" />;
};

const Sidebar = () => {
  const { t } = useTranslation('layout');
  const user = useAuthStore((state) => state.user);
  const isSidebarOpen = useUIStore((state) => state.isSidebarOpen);

  const userRole = user?.role || 'member';
  const roleMenus = menus[userRole] || [];

  return (
    <aside
      className={cn(
        "fixed inset-y-0 left-0 z-50 flex w-64 flex-col border-r border-gray-200 bg-white transition-transform duration-300 ease-in-out dark:border-gray-800 dark:bg-gray-950 lg:static lg:translate-x-0 shadow-sm",
        isSidebarOpen ? "translate-x-0" : "-translate-x-full"
      )}
    >
      {/* Logo */}
      <div className="flex h-16 shrink-0 items-center justify-center border-b border-gray-200 px-6 dark:border-gray-800">
        <div className="flex items-center gap-2.5 text-blue-600 dark:text-blue-500">
          <Dumbbell className="h-7 w-7" />
          <span className="text-xl font-bold tracking-tight text-gray-900 dark:text-white uppercase">
            Active<span className="text-blue-600 dark:text-blue-500">Gym</span>
          </span>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-1.5 overflow-y-auto px-4 py-6 custom-scrollbar">
        <div className="mb-2 px-3 text-xs font-semibold uppercase tracking-wider text-gray-400 dark:text-gray-500">
          {t('sidebar.nav_label')}
        </div>
        {roleMenus.map((item, index) => (
          <NavLink
            key={index}
            to={item.path}
            className={({ isActive }) =>
              cn(
                "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                isActive
                  ? "bg-blue-50 text-blue-700 dark:bg-blue-900/40 dark:text-blue-400 font-semibold"
                  : "text-gray-600 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-800/60 dark:hover:text-gray-200"
              )
            }
          >
            <IconRender iconName={item.icon} />
            {t(item.title)}
          </NavLink>
        ))}
      </nav>

      {/* Support box */}
      <div className="border-t border-gray-200 p-4 dark:border-gray-800">
        <div className="rounded-xl bg-gray-50 p-4 dark:bg-gray-900/60 border border-gray-100 dark:border-gray-800">
          <p className="text-sm font-semibold text-gray-900 dark:text-gray-100">
            {t('sidebar.support_title')}
          </p>
          <p className="mt-1 text-xs text-gray-500 dark:text-gray-400 leading-relaxed">
            {t('sidebar.support_desc')}
          </p>
          <a href="mailto:support@activegym.vn" className="mt-2 inline-block text-xs font-medium text-blue-600 hover:underline dark:text-blue-400">
            {t('sidebar.support_link')}
          </a>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
