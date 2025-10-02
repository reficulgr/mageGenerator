import React, { useState } from 'react';
import { Character } from './types';
import { generateFullCharacter, generateCharacterPortrait } from './services/geminiService';
import CharacterSheet from './components/CharacterSheet';
import LoadingSpinner from './components/LoadingSpinner';
import { ARCHETYPES, DARK_SECRETS, DISADVANTAGES, ADVANTAGES, TAROT_CARDS } from './npcGenerationConstants';

const App: React.FC = () => {
    const [concept, setConcept] = useState<string>('');
    const [xp, setXp] = useState<number>(0);
    const [character, setCharacter] = useState<Character | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // New state for individual narrative options
    const [tarotCard, setTarotCard] = useState<string>('Random');
    const [archetype, setArchetype] = useState<string>('Random');
    const [advantages, setAdvantages] = useState<string[]>(['Random']);
    const [disadvantage, setDisadvantage] = useState<string>('Random');
    const [darkSecret, setDarkSecret] = useState<string>('Random');

    const handleAdvantageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        // FIX: Explicitly type `option` to resolve the `unknown` type inference issue.
        const selectedOptions = Array.from(e.target.selectedOptions, (option: HTMLOptionElement) => option.value);

        // If "Random" is selected, it becomes the only selection.
        if (selectedOptions.includes('Random')) {
            setAdvantages(['Random']);
            return;
        }
        
        // Filter out "Random" if other options are chosen.
        let newSelection = selectedOptions.filter(opt => opt !== 'Random');

        // Enforce a limit of 3 advantages.
        if (newSelection.length > 3) {
            newSelection = newSelection.slice(0, 3);
        }

        setAdvantages(newSelection.length > 0 ? newSelection : ['Random']);
    };

    const handleGenerate = async () => {
        if (!concept.trim()) {
            setError('Please enter a character concept.');
            return;
        }
        setIsLoading(true);
        setError(null);
        setCharacter(null);

        try {
            const finalAdvantages = advantages.length === 0 ? ['Random'] : advantages;
            // Generate the character data first
            const generatedCharacterData = await generateFullCharacter(
                concept,
                xp,
                tarotCard,
                archetype,
                finalAdvantages,
                disadvantage,
                darkSecret
            );
            
            // Combine with concept and show character sheet with a placeholder for the portrait
            const fullCharacter: Character = {
                ...generatedCharacterData,
                concept: concept,
            };
            setCharacter(fullCharacter);

            // Then, generate the portrait and update the character
            const portraitUrl = await generateCharacterPortrait(fullCharacter.description);
            setCharacter(prev => prev ? { ...prev, portraitUrl } : null);

        } catch (e) {
            console.error(e);
            setError('Failed to generate character. The arcane energies are unstable. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleRestart = () => {
        setCharacter(null);
        setConcept('');
        setXp(0);
        setTarotCard('Random');
        setArchetype('Random');
        setAdvantages(['Random']);
        setDisadvantage('Random');
        setDarkSecret('Random');
        setError(null);
    };

    const renderSelect = (label: string, value: string, onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void, options: {name: string}[]) => (
        <div>
            <label className="block text-sm font-medium text-gray-400 mb-1">{label}</label>
            <select
                value={value}
                onChange={onChange}
                disabled={isLoading}
                className="w-full bg-gray-900 border border-gray-600 rounded-lg p-2 focus:ring-yellow-400 focus:border-yellow-400"
            >
                <option value="Random">Random</option>
                {options.map(opt => <option key={opt.name} value={opt.name}>{opt.name}</option>)}
            </select>
        </div>
    );

    return (
        <div className="min-h-screen bg-gray-900 text-gray-200 p-4 sm:p-6 lg:p-8">
            <div className="max-w-7xl mx-auto">
                <header className="text-center mb-8">
                    <h1 className="text-4xl md:text-5xl font-bold text-yellow-300 drop-shadow-[0_2px_2px_rgba(0,0,0,0.8)]">Mage: The Awakening</h1>
                    <h2 className="text-2xl md:text-3xl text-gray-300">2nd Edition Character Generator</h2>
                </header>
                <main>
                    {character ? (
                        <CharacterSheet character={character} onRestart={handleRestart} />
                    ) : (
                        <div className="max-w-3xl mx-auto bg-gray-800 border border-gray-700 rounded-lg shadow-lg p-6 md:p-8 animate-fade-in">
                            <h3 className="text-2xl font-bold text-yellow-300 mb-4 text-center">Describe Your Mage</h3>
                            <p className="text-gray-400 text-center mb-6">Enter a concept, add optional starting Experience, and choose the narrative seeds for your character.</p>
                            <textarea
                                value={concept}
                                onChange={(e) => setConcept(e.target.value)}
                                placeholder="e.g., A former police detective who awakened after seeing a ghost, now obsessed with the occult underworld."
                                className="w-full h-32 bg-gray-900 border border-gray-600 rounded-lg p-3 focus:ring-yellow-400 focus:border-yellow-400 resize-none"
                                aria-label="Character concept"
                                disabled={isLoading}
                            />
                            <div className="mt-4">
                                <label htmlFor="xp-input" className="block text-sm font-medium text-gray-400 mb-1">Starting Experience (optional)</label>
                                <input
                                    type="number"
                                    id="xp-input"
                                    value={xp}
                                    onChange={(e) => setXp(Math.max(0, parseInt(e.target.value) || 0))}
                                    className="w-full bg-gray-900 border border-gray-600 rounded-lg p-2 focus:ring-yellow-400 focus:border-yellow-400"
                                    aria-label="Starting Experience Points"
                                    disabled={isLoading}
                                    min="0"
                                />
                            </div>

                            <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                                {renderSelect("Tarot Card Theme", tarotCard, (e) => setTarotCard(e.target.value), TAROT_CARDS.map(name => ({name})))}
                                {renderSelect("Archetype", archetype, (e) => setArchetype(e.target.value), ARCHETYPES)}
                                {renderSelect("Disadvantage", disadvantage, (e) => setDisadvantage(e.target.value), DISADVANTAGES)}
                                {renderSelect("Dark Secret", darkSecret, (e) => setDarkSecret(e.target.value), DARK_SECRETS)}
                                
                                <div className="md:col-span-2">
                                     <label className="block text-sm font-medium text-gray-400 mb-1">Advantages</label>
                                      <p className="text-xs text-gray-500 mb-2">Select up to 3, or leave as Random.</p>
                                    <select
                                        multiple
                                        value={advantages}
                                        onChange={handleAdvantageChange}
                                        disabled={isLoading}
                                        className="w-full h-32 bg-gray-900 border border-gray-600 rounded-lg p-2 focus:ring-yellow-400 focus:border-yellow-400"
                                    >
                                        <option value="Random">Random</option>
                                        {ADVANTAGES.map(opt => <option key={opt.name} value={opt.name}>{opt.name}</option>)}
                                    </select>
                                </div>
                            </div>

                            <button
                                onClick={handleGenerate}
                                disabled={isLoading || !concept.trim()}
                                className="mt-6 w-full bg-yellow-500 hover:bg-yellow-600 text-gray-900 font-bold py-3 px-4 rounded-lg transition-all flex items-center justify-center text-lg disabled:bg-gray-600 disabled:cursor-not-allowed"
                            >
                                {isLoading ? (
                                    <>
                                        <LoadingSpinner />
                                        <span className="ml-2">Weaving Destiny...</span>
                                    </>
                                ) : (
                                    "Generate Character"
                                )}
                            </button>
                            {error && <p className="text-red-400 text-center mt-4">{error}</p>}
                        </div>
                    )}
                </main>
            </div>
        </div>
    );
};

export default App;
