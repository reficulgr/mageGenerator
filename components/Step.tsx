
import React from 'react';

interface StepProps {
    title: string;
    children: React.ReactNode;
    onNext?: () => void;
    onPrev?: () => void;
}

const Step: React.FC<StepProps> = ({ title, children, onNext, onPrev }) => {
    return (
        <div className="bg-gray-800 border border-gray-700 rounded-lg shadow-lg p-6 md:p-8 animate-fade-in">
            <h2 className="text-3xl font-bold text-yellow-300 mb-6 text-center">{title}</h2>
            <div className="mb-8">
                {children}
            </div>
            <div className="flex justify-between items-center">
                {onPrev ? (
                    <button onClick={onPrev} className="bg-gray-600 hover:bg-gray-500 text-white font-bold py-2 px-6 rounded-lg transition-all">
                        Previous
                    </button>
                ) : <div />}
                {onNext && (
                     <button onClick={onNext} className="bg-yellow-500 hover:bg-yellow-600 text-gray-900 font-bold py-2 px-6 rounded-lg transition-all">
                        Next
                    </button>
                )}
            </div>
        </div>
    );
};

export default Step;
