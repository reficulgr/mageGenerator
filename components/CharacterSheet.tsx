

import React from 'react';
import { Character, Attribute, Skill } from '../types';
import { ATTRIBUTES, MENTAL_SKILLS, PHYSICAL_SKILLS, SOCIAL_SKILLS, ARCANA } from '../constants';
import LoadingSpinner from './LoadingSpinner';

// --- Reusable Sub-components defined internally for this specific layout ---

const DotRating: React.FC<{ value: number; maxValue?: number }> = ({ value, maxValue = 5 }) => {
    const dots = [];
    for (let i = 1; i <= maxValue; i++) {
        dots.push(
            <span key={i} className={`text-xl leading-none ${i <= value ? 'text-yellow-300' : 'text-gray-600'}`}>
                ●
            </span>
        );
    }
    return <div className="flex items-center space-x-1">{dots}</div>;
};

const StatItem: React.FC<{ name: string; value: number; specialties?: string[]; maxValue?: number }> = ({ name, value, specialties, maxValue = 5 }) => (
    <div className="flex justify-between items-center py-1 border-b border-gray-700/50">
        <div>
            <span className="capitalize text-base">{name.replace(/([A-Z])/g, ' $1').trim()}</span>
            {specialties && specialties.length > 0 && (
                <p className="text-xs text-gray-400 pl-2">↳ {specialties.join(', ')}</p>
            )}
        </div>
        <DotRating value={value} maxValue={maxValue} />
    </div>
);

const TraitItem: React.FC<{name: string; value: number | string}> = ({name, value}) => (
    <div className="flex justify-between text-sm py-1">
        <span>{name}</span>
        <span className="font-bold text-yellow-200">{value}</span>
    </div>
)

const Section: React.FC<{title: string; children: React.ReactNode}> = ({title, children}) => (
    <div className="bg-gray-800 p-4 rounded-lg">
        <h3 className="text-xl text-yellow-300 mb-2 border-b border-gray-600 pb-2 font-bold">{title}</h3>
        {children}
    </div>
)

// --- Main Character Sheet Component ---

const CharacterSheet: React.FC<{ character: Character; onRestart: () => void }> = ({ character, onRestart }) => {
    
    // --- Derived Stats Calculation ---
    const health = character.attributes.stamina + 5;
    const willpower = character.attributes.resolve + character.attributes.composure;
    const mana = 10 + (character.gnosis - 1) * 5;
    const speed = character.attributes.strength + character.attributes.dexterity + 5;
    const defense = Math.min(character.attributes.wits, character.attributes.dexterity) + character.skills.athletics;
    const initiative = character.attributes.dexterity + character.attributes.composure;

    // --- Specialties Parsing ---
    const specialtiesMap = React.useMemo(() => 
        character.specialties.reduce((acc, spec) => {
            const match = spec.match(/(\w+)\s\((.+)\)/);
            if (match) {
                const skillName = match[1];
                // Convert to camelCase to match enum keys
                const skillKey = skillName.charAt(0).toLowerCase() + skillName.slice(1);
                const specialty = match[2];
                if (!acc[skillKey]) {
                    acc[skillKey] = [];
                }
                acc[skillKey].push(specialty);
            }
            return acc;
        }, {} as Record<string, string[]>), [character.specialties]);
    
    // --- Export Function ---
    const handleExport = () => {
        const formatSection = (title: string, lines: (string|undefined)[]) => {
            const filteredLines = lines.filter(Boolean);
            if (filteredLines.length === 0) return "";
            return `== ${title} ==\n${filteredLines.join('\n')}\n\n`;
        };

        const titleCase = (str: string) => str.replace(/([A-Z])/g, ' $1').trim().replace(/^\w/, c => c.toUpperCase());

        const nonZeroAttributes = Object.entries(character.attributes)
            .map(([key, value]) => `${titleCase(key)}: ${value}`);
    
        const nonZeroSkills = Object.entries(character.skills)
            .filter(([, value]) => Number(value) > 0)
            .map(([key, value]) => `${titleCase(key)}: ${value}`);
    
        const nonZeroArcana = Object.entries(character.arcana)
            .filter(([, value]) => Number(value) > 0)
            .map(([key, value]) => `${titleCase(key)}: ${value}`);

        let content = "== Mage: The Awakening 2E Character ==\n\n";
        content += `Name: ${character.name}\n`;
        content += `Concept: ${character.concept}\n`;
        content += `Path: ${character.path}\n`;
        content += `Order: ${character.order}\n`;
        if (character.tarotCard) content += `Tarot Theme: ${character.tarotCard}\n`;
        if (character.archetype) content += `Archetype: ${character.archetype}\n`;
        if (character.occupation) content += `Occupation: ${character.occupation}\n`;
        if (character.xp > 0) {
            content += `Total Experience Spent: ${character.xp}\n`;
        }
        content += `\n`;


        content += formatSection("Traits", [
            `Gnosis: ${character.gnosis}`,
            `Wisdom: ${character.wisdom}`,
            `Health: ${health}`,
            `Willpower: ${willpower}`,
            `Size: 5`,
            `Speed: ${speed}`,
            `Defense: ${defense}`,
            `Initiative: ${initiative}`,
            `Max Mana: ${mana}`
        ]);
        
        const narrativeTraits = [
          character.darkSecret && `Dark Secret: ${character.darkSecret}`,
          character.disadvantage && `Disadvantage: ${character.disadvantage}`,
        ];
        content += formatSection("Narrative Traits", narrativeTraits);
        
        if (character.advantages && character.advantages.length > 0) {
            content += formatSection("Advantages", character.advantages.map(adv => `- ${adv}`));
        }

        content += formatSection("Attributes", nonZeroAttributes);
        
        const skillsContent = [...nonZeroSkills];
        if (character.specialties.length > 0) {
            skillsContent.push("\nSpecialties:");
            character.specialties.forEach(spec => skillsContent.push(`- ${spec}`));
        }
        content += formatSection("Skills", skillsContent);
        
        content += formatSection("Arcana", nonZeroArcana);

        content += formatSection("Rotes", character.rotes.map(rote => `- ${rote}`));

        const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `${character.name.replace(/\s+/g, '_')}_mechanics.txt`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
    };

    // --- Data Grouping for Rendering ---
    const mentalAttrs = ATTRIBUTES.filter(a => a.category === 'Mental').map(a => a.name as Attribute);
    const physicalAttrs = ATTRIBUTES.filter(a => a.category === 'Physical').map(a => a.name as Attribute);
    const socialAttrs = ATTRIBUTES.filter(a => a.category === 'Social').map(a => a.name as Attribute);
    
    return (
        <div className="bg-gray-900/50 border border-gray-700 rounded-lg shadow-lg p-4 md:p-6 animate-fade-in">
            {/* --- HEADER --- */}
            <header className="text-center mb-6 border-b-2 border-yellow-400 pb-4">
                <h2 className="text-4xl text-yellow-300">{character.name}</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-x-4 text-gray-300 mt-2">
                    <span><strong>Path:</strong> {character.path}</span>
                    <span><strong>Order:</strong> {character.order}</span>
                    <span className="truncate"><strong>Concept:</strong> {character.concept}</span>
                </div>
            </header>
            
            {/* --- MAIN CONTENT GRID --- */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                {/* --- COLUMN 1: ATTRIBUTES & TRAITS --- */}
                <div className="space-y-6">
                    <Section title="Attributes">
                        <h4 className="text-lg text-yellow-400 mt-2">Mental</h4>
                        {mentalAttrs.map(attr => <StatItem key={attr} name={attr} value={character.attributes[attr]}/>)}
                        <h4 className="text-lg text-yellow-400 mt-4">Physical</h4>
                        {physicalAttrs.map(attr => <StatItem key={attr} name={attr} value={character.attributes[attr]}/>)}
                        <h4 className="text-lg text-yellow-400 mt-4">Social</h4>
                        {socialAttrs.map(attr => <StatItem key={attr} name={attr} value={character.attributes[attr]}/>)}
                    </Section>
                    
                    <Section title="Traits">
                        <div className="grid grid-cols-2 gap-x-4">
                            <div>
                               <h4 className="text-lg text-yellow-400 mb-2">Supernal</h4>
                               <StatItem name="Gnosis" value={character.gnosis} maxValue={10}/>
                               <StatItem name="Wisdom" value={character.wisdom} maxValue={10}/>
                               <TraitItem name="Max Mana" value={mana}/>
                            </div>
                             <div>
                               <h4 className="text-lg text-yellow-400 mb-2">Mundane</h4>
                               <TraitItem name="Health" value={health}/>
                               <TraitItem name="Willpower" value={willpower}/>
                               <TraitItem name="Size" value={5}/>
                               <TraitItem name="Speed" value={speed}/>
                               <TraitItem name="Defense" value={defense}/>
                               <TraitItem name="Initiative" value={initiative}/>
                            </div>
                        </div>
                    </Section>

                     <Section title="Aspirations">
                        <ul className="list-disc list-inside space-y-2 text-gray-300">
                            {character.aspirations.map((asp, index) => <li key={index}>{asp}</li>)}
                        </ul>
                    </Section>
                </div>

                {/* --- COLUMN 2: SKILLS & STORY --- */}
                <div className="space-y-6">
                    {(character.tarotCard || character.archetype) && (
                        <Section title="Narrative Profile">
                            <div className="space-y-2 text-sm">
                                {character.tarotCard && (
                                    <div className="flex justify-between items-start gap-4">
                                        <span className="text-gray-400 flex-shrink-0">Tarot Theme:</span>
                                        <span className="font-bold text-right">{character.tarotCard}</span>
                                    </div>
                                )}
                                {character.archetype && (
                                    <div className="flex justify-between items-start gap-4">
                                        <span className="text-gray-400 flex-shrink-0">Archetype:</span>
                                        <span className="font-bold text-right">{character.archetype}</span>
                                    </div>
                                )}
                                {character.occupation && (
                                    <div className="flex justify-between items-start gap-4">
                                        <span className="text-gray-400 flex-shrink-0">Occupation:</span>
                                        <span className="font-bold text-right">{character.occupation}</span>
                                    </div>
                                )}
                                {character.darkSecret && (
                                    <div className="flex justify-between items-start gap-4">
                                        <span className="text-gray-400 flex-shrink-0">Dark Secret:</span>
                                        <span className="font-bold text-right">{character.darkSecret}</span>
                                    </div>
                                )}
                            </div>
                        </Section>
                    )}

                    {(character.disadvantage || (character.advantages && character.advantages.length > 0)) && (
                         <Section title="Advantages & Disadvantage">
                             {character.disadvantage && (
                                 <div>
                                    <h4 className="text-lg text-yellow-400 mb-1">Disadvantage</h4>
                                    <p className="text-gray-300">{character.disadvantage}</p>
                                 </div>
                             )}
                              {character.advantages && character.advantages.length > 0 && (
                                 <div className={character.disadvantage ? 'mt-4' : ''}>
                                    <h4 className="text-lg text-yellow-400 mb-1">Advantages</h4>
                                    <ul className="list-disc list-inside space-y-1 text-gray-300">
                                        {character.advantages.map((adv, index) => <li key={index}>{adv}</li>)}
                                    </ul>
                                 </div>
                             )}
                         </Section>
                    )}

                     <Section title="Skills">
                        <h4 className="text-lg text-yellow-400 mt-2">Mental</h4>
                        {MENTAL_SKILLS.map(skill => <StatItem key={skill} name={skill} value={character.skills[skill]} specialties={specialtiesMap[skill]}/>)}
                        <h4 className="text-lg text-yellow-400 mt-4">Physical</h4>
                        {PHYSICAL_SKILLS.map(skill => <StatItem key={skill} name={skill} value={character.skills[skill]} specialties={specialtiesMap[skill]}/>)}
                        <h4 className="text-lg text-yellow-400 mt-4">Social</h4>
                        {SOCIAL_SKILLS.map(skill => <StatItem key={skill} name={skill} value={character.skills[skill]} specialties={specialtiesMap[skill]}/>)}
                    </Section>
                    
                    <Section title="Backstory">
                        <p className="text-gray-300 whitespace-pre-wrap leading-relaxed text-sm">{character.backstory}</p>
                    </Section>

                     <Section title="Description">
                        <p className="text-gray-300 whitespace-pre-wrap leading-relaxed text-sm">{character.description}</p>
                    </Section>
                </div>
                
                {/* --- COLUMN 3: ARCANA & FLUFF --- */}
                <div className="space-y-6">
                    {character.portraitUrl ? (
                        <img src={character.portraitUrl} alt={`Portrait of ${character.name}`} className="rounded-lg w-full h-auto aspect-square object-cover border-4 border-gray-600 shadow-lg" />
                    ) : (
                        <div className="rounded-lg w-full aspect-square border-4 border-gray-600 bg-gray-900 flex flex-col items-center justify-center">
                           <LoadingSpinner />
                           <p className="mt-4 text-gray-400">Weaving Portrait...</p>
                        </div>
                    )}
                    <Section title="Arcana">
                       {ARCANA.map(({name}) => (
                           <StatItem key={name} name={name} value={character.arcana[name]} />
                       ))}
                    </Section>

                    <Section title="Rotes">
                        <ul className="list-disc list-inside space-y-2 text-gray-300">
                            {character.rotes.map((rote, index) => <li key={index}>{rote}</li>)}
                        </ul>
                    </Section>

                    <Section title="Nimbus">
                        <p className="text-gray-300 whitespace-pre-wrap leading-relaxed text-sm">{character.nimbus}</p>
                    </Section>

                    {character.xp > 0 && character.xpLog && character.xpLog.length > 0 && (
                        <Section title="Character Advancement">
                            <p className="text-sm text-gray-400 mb-2">Total XP Spent: <strong>{character.xp}</strong></p>
                            <ul className="list-disc list-inside space-y-1 text-gray-300 text-sm">
                                {character.xpLog.map((log, index) => <li key={index}>{log}</li>)}
                            </ul>
                        </Section>
                    )}
                </div>
            </div>

            <div className="text-center mt-8 flex flex-wrap justify-center items-center gap-4">
                 <button onClick={onRestart} className="bg-yellow-500 hover:bg-yellow-600 text-gray-900 font-bold py-3 px-8 rounded-lg transition-all text-lg">
                    Create Another Character
                </button>
                <button onClick={handleExport} className="bg-gray-600 hover:bg-gray-500 text-white font-bold py-2 px-6 rounded-lg transition-all text-base">
                    Export Mechanics
                </button>
            </div>
        </div>
    );
};

export default CharacterSheet;
