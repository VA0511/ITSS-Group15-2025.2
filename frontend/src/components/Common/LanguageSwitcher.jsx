import React from 'react';
import { useTranslation } from 'react-i18next';

const LANGUAGES = [
  { code: 'vi', label: 'VI' },
  { code: 'en', label: 'EN' },
  { code: 'ja', label: 'JA' },
];

const LanguageSwitcher = () => {
  const { i18n } = useTranslation();
  const current = i18n.language?.slice(0, 2) || 'vi';

  return (
    <div className="flex items-center gap-0.5 rounded-lg border border-gray-200 bg-gray-50 p-1 dark:border-gray-700 dark:bg-gray-800">
      {LANGUAGES.map(({ code, label }) => (
        <button
          key={code}
          onClick={() => i18n.changeLanguage(code)}
          className={`rounded-md px-2 py-0.5 text-xs font-semibold transition-colors focus:outline-none ${
            current === code
              ? 'bg-blue-600 text-white shadow-sm'
              : 'text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white'
          }`}
        >
          {label}
        </button>
      ))}
    </div>
  );
};

export default LanguageSwitcher;
