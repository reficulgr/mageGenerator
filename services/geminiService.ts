import { GoogleGenAI, Type } from '@google/genai';
import { Character, Path, Order, Arcanum, Attribute, Skill } from '../types';
import { PATHS } from '../constants';
import { ROTES } from '../rotes';
import { XP_RULES_PROMPT } from '../advancement';
import { ARCHETYPES, DARK_SECRETS, DISADVANTAGES, ADVANTAGES } from '../npcGenerationConstants';

if (!process.env.API_KEY) {
    throw new Error("API_KEY environment variable not set");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

// Helper function to format rotes for the prompt
const generateRoteListForPrompt = (): string => {
    // Group rotes by arcanum and then by rank
    const groupedRotes = ROTES.reduce((acc, rote) => {
        const { arcanum, rank, name } = rote;
        if (!acc[arcanum]) {
            acc[arcanum] = {};
        }
        if (!acc[arcanum][rank]) {
            acc[arcanum][rank] = [];
        }
        acc[arcanum][rank].push(name);
        return acc;
    }, {} as Record<Arcanum, Record<number, string[]>>);

    // Get the canonical order of arcana from the Arcanum enum
    const arcanumOrder = Object.values(Arcanum);

    // Build the string from the grouped rotes, following the canonical order
    const roteListString = arcanumOrder
        .filter(arcanum => groupedRotes[arcanum]) // Only include arcana that have rotes
        .map(arcanum => {
            const ranks = groupedRotes[arcanum];
            const capitalizedArcanum = arcanum.charAt(0).toUpperCase() + arcanum.slice(1);
            return Object.entries(ranks)
                .sort(([rankA], [rankB]) => Number(rankA) - Number(rankB))
                .map(([rank, names]) => {
                    const roteNames = names.join(', ');
                    return `                *   **${capitalizedArcanum} ${rank}:** ${roteNames}`;
                })
                .join('\n');
        })
        .join('\n');

    return roteListString;
};

export const generateFullCharacter = async (
    concept: string, 
    xp: number = 0,
    tarotCard: string,
    archetype: string,
    advantages: string[],
    disadvantage: string,
    darkSecret: string
): Promise<Character> => {
    
    const arcanaDetails = PATHS.map(p => `- ${p.name}: Ruling Arcana are ${p.rulingArcana.join(' and ')}. Inferior Arcanum is ${p.inferiorArcanum}.`).join('\n');
    const roteList = generateRoteListForPrompt();

    // Dynamically build the narrative prompt based on user input
    let narrativePrompt = `
**Narrative Element Generation:**
Before creating the Mage character, you MUST establish several narrative elements based on the following instructions. These elements will define the character's core identity and should heavily influence all subsequent choices.
`;

    // Tarot Card
    if (tarotCard === 'Random') {
        narrativePrompt += `\n- **Tarot Card**: Choose one card at random from the 78-card tarot deck. Decide if it's upright or reversed. This is the central theme. State the chosen card and orientation in the 'tarotCard' field.`;
    } else {
        narrativePrompt += `\n- **Tarot Card**: The character's theme is the **${tarotCard}** card. Decide if it's upright or reversed. State the chosen card and orientation in the 'tarotCard' field.`;
    }
    
    // Archetype
    if (archetype === 'Random') {
        narrativePrompt += `\n- **Archetype**: Choose one archetype from this list that complements the tarot card: ${ARCHETYPES.map(a => a.name).join(', ')}. Populate the 'archetype' field.`;
    } else {
        narrativePrompt += `\n- **Archetype**: The character's archetype is **${archetype}**. Populate the 'archetype' field.`;
    }
    
    // Occupation (Always AI-driven, based on the above)
    narrativePrompt += `\n- **Occupation**: Based on the tarot card and archetype, determine a fitting modern-day occupation and place it in the 'occupation' field.`;

    // Dark Secret
    if (darkSecret === 'Random') {
        narrativePrompt += `\n- **Dark Secret**: Choose one dark secret from this list: ${DARK_SECRETS.map(d => d.name).join(', ')}. Populate the 'darkSecret' field.`;
    } else {
        narrativePrompt += `\n- **Dark Secret**: The character's dark secret is **${darkSecret}**. Populate the 'darkSecret' field.`;
    }
    
    // Disadvantage
    if (disadvantage === 'Random') {
        narrativePrompt += `\n- **Disadvantage**: Choose one disadvantage from this list: ${DISADVANTAGES.map(d => d.name).join(', ')}. Populate the 'disadvantage' field.`;
    } else {
        narrativePrompt += `\n- **Disadvantage**: The character's disadvantage is **${disadvantage}**. Populate the 'disadvantage' field.`;
    }

    // Advantages
    if (advantages.length === 1 && advantages[0] === 'Random') {
        narrativePrompt += `\n- **Advantages**: Choose exactly three advantages from this list: ${ADVANTAGES.map(a => a.name).join(', ')}. Populate the 'advantages' field as a JSON array of strings.`;
    } else {
        narrativePrompt += `\n- **Advantages**: The character has the following advantages: ${advantages.join(', ')}. Populate the 'advantages' field with these exact values in a JSON array.`;
    }

    narrativePrompt += `\n
**Integration:**
After establishing the narrative elements, proceed with the Mage: The Awakening 2nd Edition character creation rules below. Ensure that the character's Name, Description, Path, Order, Attributes, Skills, Arcana, and Rotes are all heavily influenced by the narrative elements you just established. The user's concept should be blended with these elements.
`;

    let xpPromptSection = `
    9.  **No Advancement**:
        *   Since 0 XP was provided, this is a standard starting character.
        *   You MUST set the "xp" field to 0 and the "xpLog" field to an empty array [] in the final JSON output.
    `;

    if (xp > 0) {
        xpPromptSection = `
        9. **Character Advancement (${xp} XP)**:
            *   After creating the complete starting character according to all the rules above, you will now spend exactly ${xp} Experience Points (XP) to advance them.
            *   You MUST spend all ${xp} XP.
            *   You MUST adhere strictly to the following costs for purchasing new traits. The cost is per new dot (e.g., raising a Skill from 2 to 3 costs 2 XP).
            *   **XP Costs:**
${XP_RULES_PROMPT}
            *   Update the final character sheet values to reflect these purchases. Remember that dots purchased with XP can exceed the normal starting limits (e.g., an Arcanum can be raised above 3).
            *   You MUST provide a detailed log of every single XP expenditure in the 'xpLog' field. Each entry must be a human-readable string detailing the purchase and its cost (e.g., "Increased Intelligence from 3 to 4 (4 XP)"). The total cost of all items in the log MUST equal exactly ${xp}.
            *   You MUST set the "xp" field to ${xp} in the final JSON output.
`;
    }

    const prompt = `
        You are an expert storyteller and rules master for the tabletop RPG "Mage: The Awakening 2nd Edition".
        Your task is to generate a complete, rules-compliant starting character based on a user-provided concept and narrative seeds, and then advance them using a specified amount of experience points (XP).

        ${narrativePrompt}

        **User Concept:**
        "${concept}"

        **Character Creation & Advancement Rules:**
        You MUST follow these rules strictly in order.

        1.  **Name, Description, Aspirations, Nimbus**:
            *   Create a fitting character name.
            *   Describe the mage's Nimbus (2-3 sentences). This is the subtle, personal magical aura that surrounds them and the flare of their spellcasting. It should reflect their personality, Path, and magic.
            *   Write a concise physical description (1-2 sentences) suitable for generating a character portrait. Focus on visual details like appearance, clothing, and mood.
            *   Define three distinct, actionable aspirations (short or long-term goals) for the character.

        2.  **Path & Order Selection**:
            *   Based on the concept and narrative elements, choose the most appropriate Path: ${Object.values(Path).join(', ')}.
            *   Based on the concept and narrative elements, choose the most appropriate Order from the following list. Note that Seers of the Throne are antagonists who serve the tyrannical Exarchs, and Banishers are mages who hate magic and seek to destroy it. Choose one of these only if the concept strongly implies an antagonistic or self-hating character. The list is: ${Object.values(Order).join(', ')}.

        3.  **Attributes (5/4/3 Point Allocation)**:
            *   **Step 1: Base Dots.** Every one of the 9 attributes (Intelligence, Wits, etc.) begins with a score of 1.
            *   **Step 2: Prioritize Categories.** Based on the character concept, decide which category (Mental, Physical, Social) is primary, secondary, and tertiary.
            *   **Step 3: Distribute Additional Dots.**
                *   Add **5 dots** among the three attributes in the primary category.
                *   Add **4 dots** among the three attributes in the secondary category.
                *   Add **3 dots** among the three attributes in the tertiary category.
            *   The final score for any single attribute cannot exceed 5 at character creation.

        4.  **Skills (11/7/4 Point Allocation)**:
            *   **Step 1: Base Dots.** All 24 skills (Academics, Athletics, etc.) start with a score of 0.
            *   **Step 2: