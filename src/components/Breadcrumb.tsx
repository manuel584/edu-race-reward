
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';
import { useAppContext } from '@/context/AppContext';
import { getTranslations } from '@/lib/i18n';

export type BreadcrumbItem = {
  label: string;
  path?: string;
  icon?: React.ReactNode;
};

interface BreadcrumbProps {
  items: BreadcrumbItem[];
}

const Breadcrumb: React.FC<BreadcrumbProps> = ({ items }) => {
  const navigate = useNavigate();
  const { language } = useAppContext();
  const t = getTranslations(language);
  
  const handleClick = (path?: string) => {
    if (!path) return;
    navigate(path);
  };

  return (
    <nav aria-label="breadcrumb" className="mb-4">
      <ol className="flex flex-wrap items-center space-x-2 text-sm text-gray-500">
        {items.map((item, index) => {
          const isLast = index === items.length - 1;
          
          return (
            <React.Fragment key={item.label}>
              <li className="flex items-center">
                {item.path && !isLast ? (
                  <button 
                    onClick={() => handleClick(item.path)}
                    className="flex items-center hover:text-blue-600 transition-colors"
                  >
                    {item.icon && <span className="mr-1">{item.icon}</span>}
                    <span>{item.label}</span>
                  </button>
                ) : (
                  <span className={`flex items-center ${isLast ? 'font-medium text-blue-600' : ''}`}>
                    {item.icon && <span className="mr-1">{item.icon}</span>}
                    <span>{item.label}</span>
                  </span>
                )}
              </li>
              
              {!isLast && (
                <li className="flex items-center">
                  <ChevronRight className="h-4 w-4" />
                </li>
              )}
            </React.Fragment>
          );
        })}
      </ol>
    </nav>
  );
};

export default Breadcrumb;
