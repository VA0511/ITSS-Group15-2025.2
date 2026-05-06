import React from 'react';

const Badge = ({ children, className = '', variant = 'default' }) => {
    const baseClasses = 'inline-flex items-center px-3 py-1 rounded-full text-xs font-medium';

    const variantClasses = {
        default: 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400',
        primary: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400',
        success: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400',
        warning: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400',
        danger: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400',
    };

    const finalClassName = `${baseClasses} ${variantClasses[variant]} ${className}`;

    return (
        <span className={finalClassName}>
            {children}
        </span>
    );
};

export default Badge;
