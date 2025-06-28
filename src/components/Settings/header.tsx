import React from 'react';
import { ArrowLeft } from 'lucide-react';

interface SettingsHeaderProps {
  businessName: string;
 
  onBack: () => void;
  title?: string;
  subtitle?: string;
}

const SettingsHeader: React.FC<SettingsHeaderProps> = ({ businessName,  onBack, title, subtitle }) => (
  <header className="max-w-4xl mx-auto mb-6 px-4">
    <div className="flex justify-between items-center">
      <div className="flex items-center">
        <button
          onClick={onBack}
          className="mr-3 p-2 rounded-full hover:bg-white text-purple-700 transition-colors duration-200 shadow-sm"
          aria-label="Go back"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div>
          <h1 className="text-xl md:text-2xl font-bold text-gray-800">
            {businessName}
          </h1>
          {title && (
            <p className="text-sm text-gray-600 mt-1">{title}</p>
          )}
        </div>
      </div> 
    </div>
  </header>
);

export default SettingsHeader;