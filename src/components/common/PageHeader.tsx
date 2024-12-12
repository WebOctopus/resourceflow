import { ReactNode } from 'react';
import Breadcrumbs from './Breadcrumbs';

interface PageHeaderProps {
  title: string;
  description?: string;
  actions?: ReactNode;
  pathname: string;
}

export default function PageHeader({ title, description, actions, pathname }: PageHeaderProps) {
  return (
    <div className="mb-6">
      <Breadcrumbs pathname={pathname} />
      <div className="mt-2 md:flex md:items-center md:justify-between">
        <div className="min-w-0 flex-1">
          <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:truncate sm:text-3xl sm:tracking-tight">
            {title}
          </h2>
          {description && (
            <p className="mt-1 text-sm text-gray-500">
              {description}
            </p>
          )}
        </div>
        {actions && (
          <div className="mt-4 flex md:ml-4 md:mt-0">
            {actions}
          </div>
        )}
      </div>
    </div>
  );
}