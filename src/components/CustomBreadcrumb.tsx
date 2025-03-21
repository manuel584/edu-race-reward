
import React from 'react';
import { Link } from 'react-router-dom';
import { Home, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface BreadcrumbItem {
  label: React.ReactNode;
  href?: string;
  icon?: React.ReactNode;
  current?: boolean;
}

interface CustomBreadcrumbProps {
  items: BreadcrumbItem[];
  className?: string;
}

const CustomBreadcrumb: React.FC<CustomBreadcrumbProps> = ({ items, className }) => {
  return (
    <nav className={cn("flex", className)} aria-label="Breadcrumb">
      <ol className="inline-flex items-center space-x-1 md:space-x-3">
        {items.map((item, index) => (
          <li key={index} className="inline-flex items-center">
            {index > 0 && (
              <ChevronRight className="mx-2 h-4 w-4 text-gray-400" />
            )}
            
            {item.current ? (
              <span className="flex items-center text-sm font-medium text-gray-700">
                {item.icon && <span className="mr-2">{item.icon}</span>}
                {item.label}
              </span>
            ) : (
              item.href ? (
                <Link 
                  to={item.href} 
                  className="flex items-center text-sm font-medium text-blue-600 hover:text-blue-700"
                >
                  {item.icon && <span className="mr-2">{item.icon}</span>}
                  {item.label}
                </Link>
              ) : (
                <span className="flex items-center text-sm font-medium text-gray-500">
                  {item.icon && <span className="mr-2">{item.icon}</span>}
                  {item.label}
                </span>
              )
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
};

export default CustomBreadcrumb;
