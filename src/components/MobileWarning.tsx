import { AlertTriangle } from 'lucide-react';

interface MobileWarningProps {
  message: string;
}

export default function MobileWarning({ message }: MobileWarningProps) {
  return (
    <div className="fixed inset-x-0 bottom-0 p-4 bg-yellow-50 border-t border-yellow-200">
      <div className="flex items-center">
        <AlertTriangle className="h-5 w-5 text-yellow-600 mr-2" />
        <p className="text-sm text-yellow-700">{message}</p>
      </div>
    </div>
  );
}