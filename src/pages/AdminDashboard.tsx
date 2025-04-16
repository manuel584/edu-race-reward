
import React from 'react';
import Header from '@/components/Header';
import { useAppContext } from '@/context/AppContext';
import { getTranslations } from '@/lib/i18n';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

const AdminDashboard: React.FC = () => {
  const { language } = useAppContext();
  const t = getTranslations(language);
  const navigate = useNavigate();

  return (
    <div className="min-h-screen">
      <Header />
      
      <main className="page-container">
        <div className="mb-8">
          <h1 className="text-3xl font-display font-bold">{t.admin || "Admin Dashboard"}</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">
            {t.adminDesc || "System administration and management"}
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="bg-white dark:bg-gray-800 rounded-lg border p-6 hover:shadow-md transition-shadow">
            <h2 className="text-xl font-semibold mb-4">{t.userManagement || "User Management"}</h2>
            <p className="text-gray-500 dark:text-gray-400 mb-6">
              {t.managementDesc || "Manage user accounts and permissions"}
            </p>
            <Button onClick={() => navigate('/user-management')} variant="default">
              {t.manageUsers || "Manage Users"}
            </Button>
          </div>
          
          <div className="bg-white dark:bg-gray-800 rounded-lg border p-6 hover:shadow-md transition-shadow">
            <h2 className="text-xl font-semibold mb-4">{t.settings || "System Settings"}</h2>
            <p className="text-gray-500 dark:text-gray-400 mb-6">
              {t.settingsDesc || "Configure system settings and preferences"}
            </p>
            <Button onClick={() => navigate('/settings')} variant="default">
              {t.manage || "Manage Settings"}
            </Button>
          </div>
          
          <div className="bg-white dark:bg-gray-800 rounded-lg border p-6 hover:shadow-md transition-shadow">
            <h2 className="text-xl font-semibold mb-4">{t.data || "Data Management"}</h2>
            <p className="text-gray-500 dark:text-gray-400 mb-6">
              {t.dataDesc || "Import and export system data"}
            </p>
            <Button onClick={() => navigate('/import')} variant="default">
              {t.manageData || "Manage Data"}
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;
