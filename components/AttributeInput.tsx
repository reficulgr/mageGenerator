
import React from 'react';
import { Attributes, Attribute } from '../types';
import { ATTRIBUTES } from '../constants';

interface AttributeInputProps {
    attributes: Attributes;
    onChange: (attributes: Attributes) => void;
}

const AttributeCategory: React.FC<{
    title: string;
    category: 'Mental' | 'Physical' | 'Social';
    attributes: Attributes;
    points: number;
    pointsSpent: number;
    handleIncrement: (attr: Attribute) => void;
    handleDecrement: (attr: Attribute) => void;
}> = ({ title, category, attributes, points, pointsSpent, handleIncrement, handleDecrement }) => {
    const categoryAttributes = ATTRIBUTES.filter(attr => attr.category === category);

    return (
        <div className="bg-gray-700/50 p-4 rounded-lg">
            <h4 className="text-xl text-yellow-400 mb-2">{title}</h4>
            <p className="text-sm mb-4">Points: <span className={pointsSpent > points ? 'text-red-500' : 'text-green-400'}>{pointsSpent} / {points}</span></p>
            <div className="space-y-3">
                {categoryAttributes.map(({ name }) => (
                    <div key={name} className="flex justify-between items-center">
                        <span className="capitalize">{name}</span>
                        <div className="flex items-center space-x-2">
                            <button onClick={() => handleDecrement(name)} className="bg-gray-600 h-6 w-6 rounded-full flex items-center justify-center">-</button>
                            <span className="w-8 text-center font-bold text-lg">{attributes[name]}</span>
                            <button onClick={() => handleIncrement(name)} className="bg-gray-600 h-6 w-6 rounded-full flex items-center justify-center">+</button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

const AttributeInput: React.FC<AttributeInputProps> = ({ attributes, onChange }) => {
    
    const priorities = [5, 4, 3];

    const mentalSpent = ATTRIBUTES.filter(a => a.category === 'Mental').reduce((sum, a) => sum + attributes[a.name] - 1, 0);
    const physicalSpent = ATTRIBUTES.filter(a => a.category === 'Physical').reduce((sum, a) => sum + attributes[a.name] - 1, 0);
    const socialSpent = ATTRIBUTES.filter(a => a.category === 'Social').reduce((sum, a) => sum + attributes[a.name] - 1, 0);

    const handleIncrement = (attr: Attribute) => {
        if (attributes[attr] < 5) {
            onChange({ ...attributes, [attr]: attributes[attr] + 1 });
        }
    };
    
    const handleDecrement = (attr: Attribute) => {
        if (attributes[attr] > 1) {
            onChange({ ...attributes, [attr]: attributes[attr] - 1 });
        }
    };

    return (
        <div className="space-y-4">
            <p className="text-center text-gray-400">Prioritize categories by assigning <strong>5, 4, and 3</strong> points respectively. All attributes start with 1 dot for free.</p>
            <div className="grid md:grid-cols-3 gap-6">
                <AttributeCategory title="Mental" category="Mental" attributes={attributes} points={priorities[0]} pointsSpent={mentalSpent} handleIncrement={handleIncrement} handleDecrement={handleDecrement} />
                <AttributeCategory title="Physical" category="Physical" attributes={attributes} points={priorities[1]} pointsSpent={physicalSpent} handleIncrement={handleIncrement} handleDecrement={handleDecrement} />
                <AttributeCategory title="Social" category="Social" attributes={attributes} points={priorities[2]} pointsSpent={socialSpent} handleIncrement={handleIncrement} handleDecrement={handleDecrement} />
            </div>
             <p className="text-center text-gray-400 text-sm pt-2">Tip: To change priorities, reduce points in one category to free them up for another.</p>
        </div>
    );
};

export default AttributeInput;
