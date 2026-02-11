
import React from 'react';

const HouseIcon = () => (
    <div className="bg-primary-600 p-3 rounded-2xl shadow-lg shadow-primary-500/30">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" viewBox="0 0 24 24" fill="currentColor">
            <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8h5z" />
        </svg>
    </div>
);

export const Header: React.FC = () => {
    return (
        <header className="w-full text-center py-10 flex flex-col items-center">
            <HouseIcon />
            <h1 className="mt-6 text-4xl sm:text-5xl font-black text-gray-900 dark:text-white tracking-tight">
                Interior AI <span className="text-primary-600">Pro</span>
            </h1>
            <p className="mt-3 text-lg text-gray-500 dark:text-gray-400 font-medium max-w-lg">
                The professional transformation engine for furniture retailers and design firms.
            </p>
        </header>
    );
};
