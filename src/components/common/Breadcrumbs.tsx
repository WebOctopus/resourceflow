import { Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';
import { getBreadcrumbs } from '../../lib/utils/routeUtils';

interface BreadcrumbsProps {
  pathname: string;
}

export default function Breadcrumbs({ pathname }: BreadcrumbsProps) {
  const breadcrumbs = getBreadcrumbs(pathname);

  return (
    <nav className="flex" aria-label="Breadcrumb">
      <ol className="flex items-center space-x-2">
        {breadcrumbs.map((crumb, index) => (
          <li key={crumb.path} className="flex items-center">
            {index > 0 && (
              <ChevronRight className="h-4 w-4 text-gray-400 mx-2" aria-hidden="true" />
            )}
            <Link
              to={crumb.path}
              className={`text-sm font-medium ${
                index === breadcrumbs.length - 1
                  ? 'text-gray-700'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              {crumb.label}
            </Link>
          </li>
        ))}
      </ol>
    </nav>
  );
}