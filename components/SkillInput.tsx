
import React from 'react';
import { Skills, Skill } from '../types';
import { MENTAL_SKILLS, PHYSICAL_SKILLS, SOCIAL_SKILLS } from '../constants';

interface SkillInputProps {
    skills: Skills;
    onChange: (skills: Skills) => void;
}

const SkillCategory: React.FC<{
    title: string;
    skillList: Skill[];
    skills: Skills;
    points: number;
    pointsSpent: number;
    handleIncrement: (skill: Skill) => void;
    handleDecrement: (skill: Skill) => void;
}> = ({ title, skillList, skills, points, pointsSpent, handleIncrement, handleDecrement }) => (
    <div className="bg-gray-700/50 p-4 rounded-lg">
        <h4 className="text-xl text-yellow-400 mb-2">{title}</h4>
        <p className="text-sm mb-4">Points: <span className={pointsSpent > points ? 'text-red-500' : 'text-green-400'}>{pointsSpent} / {points}</span></p>
        <div className="space-y-3">
            {skillList.map(name => (
                <div key={name} className="flex justify-between items-center">
                    <span className="capitalize">{name.replace(/([A-Z])/g, ' $1').trim()}</span>
                    <div className="flex items-center space-x-2">
                        <button onClick={() => handleDecrement(name)} className="bg-gray-600 h-6 w-6 rounded-full flex items-center justify-center">-</button>
                        <span className="w-8 text-center font-bold text-lg">{skills[name]}</span>
                        <button onClick={() => handleIncrement(name)} className="bg-gray-600 h-6 w-6 rounded-full flex items-center justify-center">+</button>
                    </div>
                </div>
            ))}
        </div>
    </div>
);


const SkillInput: React.FC<SkillInputProps> = ({ skills, onChange }) => {
    
    const priorities = [11, 7, 4];

    const mentalSpent = MENTAL_SKILLS.reduce((sum, s) => sum + skills[s], 0);
    const physicalSpent = PHYSICAL_SKILLS.reduce((sum, s) => sum + skills[s], 0);
    const socialSpent = SOCIAL_SKILLS.reduce((sum, s) => sum + skills[s], 0);

    const handleIncrement = (skill: Skill) => {
        if (skills[skill] < 5) {
            onChange({ ...skills, [skill]: skills[skill] + 1 });
        }
    };
    
    const handleDecrement = (skill: Skill) => {
        if (skills[skill] > 0) {
            onChange({ ...skills, [skill]: skills[skill] - 1 });
        }
    };

    return (
        <div className="space-y-4">
            <p className="text-center text-gray-400">Prioritize categories by assigning <strong>11, 7, and 4</strong> points respectively.</p>
            <div className="grid md:grid-cols-3 gap-6">
                <SkillCategory title="Mental" skillList={MENTAL_SKILLS} skills={skills} points={priorities[0]} pointsSpent={mentalSpent} handleIncrement={handleIncrement} handleDecrement={handleDecrement} />
                <SkillCategory title="Physical" skillList={PHYSICAL_SKILLS} skills={skills} points={priorities[1]} pointsSpent={physicalSpent} handleIncrement={handleIncrement} handleDecrement={handleDecrement} />
                <SkillCategory title="Social" skillList={SOCIAL_SKILLS} skills={skills} points={priorities[2]} pointsSpent={socialSpent} handleIncrement={handleIncrement} handleDecrement={handleDecrement} />
            </div>
            <p className="text-center text-gray-400 text-sm pt-2">Tip: To change priorities, reduce points in one category to free them up for another.</p>
        </div>
    );
};

export default SkillInput;
