import React from 'react';
import { Arcana, Arcanum, Path } from '../types';
import { ARCANA } from '../constants';

interface ArcanaInputProps {
    arcana: Arcana;
    path: { name: Path, rulingArcana: Arcanum[] };
    onChange: (arcana: Arcana) => void;
}

const ArcanaInput: React.FC<ArcanaInputProps> = ({ arcana, path, onChange }) => {
    const totalPoints = 4;
    // FIX: Use type assertion to ensure TypeScript treats the value as a number, resolving the `unknown` type issue.
    const pointsSpent = Object.values(arcana).reduce((sum, val) => sum + (val as number), 0);

    const handleIncrement = (arcanum: Arcanum) => {
        // FIX: Use type assertion to ensure TypeScript treats the value as a number.
        const currentValue = arcana[arcanum] as number;
        if (currentValue < 5 && pointsSpent < totalPoints) {
            onChange({ ...arcana, [arcanum]: currentValue + 1 });
        }
    };
    
    const handleDecrement = (arcanum: Arcanum) => {
        // FIX: Use type assertion to ensure TypeScript treats the value as a number.
        const currentValue = arcana[arcanum] as number;
        if (currentValue > 0) {
            onChange({ ...arcana, [arcanum]: currentValue - 1 });
        }
    };
    
    const isRuling = (arcanum: Arcanum) => path.rulingArcana.includes(arcanum);
    
    const commonArcana = ARCANA.filter(a => !isRuling(a.name));
    const rulingArcana = ARCANA.filter(a => isRuling(a.name));

    const renderArcanaList = (list: {name: Arcanum}[], title: string) => (
        <div className="bg-gray-700/50 p-4 rounded-lg">
             <h4 className="text-xl text-yellow-400 mb-4">{title}</h4>
            <div className="space-y-3">
                {list.map(({ name }) => (
                    <div key={name} className="flex justify-between items-center">
                        <span className="capitalize">{name}</span>
                        <div className="flex items-center space-x-2">
                            <button onClick={() => handleDecrement(name)} className="bg-gray-600 h-6 w-6 rounded-full flex items-center justify-center">-</button>
                            {/* FIX: Use type assertion to ensure TypeScript treats the value as a number. */}
                            <span className="w-8 text-center font-bold text-lg">{arcana[name] as number}</span>
                            <button onClick={() => handleIncrement(name)} className="bg-gray-600 h-6 w-6 rounded-full flex items-center justify-center">+</button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );

    return (
        <div className="space-y-4">
            <p className="text-center text-gray-400">
                You have <strong>4</strong> points to spend on Arcana. You must put <strong>3</strong> points into your Ruling Arcana, and <strong>1</strong> point into a Common Arcanum. One of your Ruling Arcana must have 2 dots.
            </p>
             <p className="text-center text-lg mb-4">Points Spent: <span className={pointsSpent > totalPoints ? 'text-red-500' : 'text-green-400'}>{pointsSpent} / {totalPoints}</span></p>

            <div className="grid md:grid-cols-2 gap-6">
                {renderArcanaList(rulingArcana, 'Ruling Arcana')}
                {renderArcanaList(commonArcana, 'Common Arcana')}
            </div>
        </div>
    );
};

export default ArcanaInput;
