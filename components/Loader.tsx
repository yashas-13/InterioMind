
import React, { useState, useEffect } from 'react';

const messages = [
    "Envisioning your new space...",
    "Selecting the perfect furniture...",
    "Adjusting the lighting...",
    "Adding the finishing touches...",
    "Unrolling the virtual rug...",
    "Hanging digital artwork..."
];

export const Loader: React.FC = () => {
    const [message, setMessage] = useState(messages[0]);

    useEffect(() => {
        let index = 0;
        const intervalId = setInterval(() => {
            index = (index + 1) % messages.length;
            setMessage(messages[index]);
        }, 2500);

        return () => clearInterval(intervalId);
    }, []);


    return (
        <div className="flex flex-col items-center justify-center min-h-[400px] text-center">
            <svg className="animate-spin h-12 w-12 text-primary-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <h2 className="text-2xl font-semibold mt-6 text-gray-700 dark:text-gray-300">Bringing your vision to life...</h2>
            <p className="mt-2 text-gray-500 dark:text-gray-400 transition-opacity duration-500">{message}</p>
        </div>
    );
};
