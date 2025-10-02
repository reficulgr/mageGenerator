import { Arcanum } from './types';

export const XP_COSTS = {
    attribute: 4,
    skill: 2,
    specialty: 1,
    arcanum: {
        ruling: 3,
        common: 4,
        inferior: 5,
    },
    wisdom: 2,
    gnosis: 5,
    rote: 1,
};

// A formatted string of the rules for easy inclusion in the AI prompt.
export const XP_RULES_PROMPT = `
- **Attributes**: ${XP_COSTS.attribute} XP per new dot.
- **Skills**: ${XP_COSTS.skill} XP per new dot.
- **Skill Specialties**: ${XP_COSTS.specialty} XP per new specialty.
- **Ruling Arcanum**: ${XP_COSTS.arcanum.ruling} XP per new dot.
- **Common Arcanum**: ${XP_COSTS.arcanum.common} XP per new dot.
- **Inferior Arcanum**: ${XP_COSTS.arcanum.inferior} XP per new dot (must have Gnosis 3+).
- **Wisdom**: ${XP_COSTS.wisdom} XP per new dot.
- **Gnosis**: ${XP_COSTS.gnosis} XP per new dot.
- **Rotes**: ${XP_COSTS.rote} XP per new rote.
`;
