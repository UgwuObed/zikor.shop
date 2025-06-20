import React from 'react';
import { BiLogOut } from 'react-icons/bi';
import { ArrowLeft } from 'lucide-react';

interface SettingsHeaderProps {
  businessName: string;
  onLogout: () => void;
  onBack: () => void;
  title?: string;
  subtitle?: string;
}

const SettingsHeader: React.FC<SettingsHeaderProps> = ({ businessName, onLogout, onBack, title, subtitle }) => (
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
      <button 
        onClick={onLogout}
        className="flex items-center gap-2 px-3 py-2 md:px-4 md:py-2 bg-white rounded-full shadow-sm hover:shadow text-gray-700 transition-all duration-200 text-sm md:text-base"
      >
        <BiLogOut className="w-4 h-4 md:w-5 md:h-5 text-purple-600" />
        <span className="hidden md:inline">Logout</span>
      </button>
    </div>
  </header>
);

export default SettingsHeader;