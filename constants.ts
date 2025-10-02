import { Path, Order, Attribute, Skill, Arcanum } from './types';

export const PATHS = [
    { name: Path.Acanthus, rulingArcana: [Arcanum.Fate, Arcanum.Time], inferiorArcanum: Arcanum.Forces, description: "Witches and Enchanters who see the Supernal through the Lunargent Thorn." },
    { name: Path.Mastigos, rulingArcana: [Arcanum.Mind, Arcanum.Space], inferiorArcanum: Arcanum.Matter, description: "Warlocks and Psychonauts who see the Supernal through the Iron Gauntlet." },
    { name: Path.Moros, rulingArcana: [Arcanum.Death, Arcanum.Matter], inferiorArcanum: Arcanum.Spirit, description: "Necromancers and Alchemists who see the Supernal through the Leaden Coin." },
    { name: Path.Obrimos, rulingArcana: [Arcanum.Forces, Arcanum.Prime], inferiorArcanum: Arcanum.Death, description: "Theurges and Diviners who see the Supernal through the Golden Key." },
    { name: Path.Thyrsus, rulingArcana: [Arcanum.Life, Arcanum.Spirit], inferiorArcanum: Arcanum.Mind, description: "Shamans and Ecstatics who see the Supernal through the Singing Stone." },
];

export const ORDERS = [
    { name: Order.AdamantineArrow, description: "Masters of conflict, sworn to protect the Mysteries." },
    { name: Order.FreeCouncil, description: "Modernists and democrats seeking to bring magic to the masses." },
    { name: Order.GuardiansOfTheVeil, description: "Spies and secret police who guard the Veil between worlds." },
    { name: Order.Mysterium, description: "Scholars and explorers of occult lore and forgotten places." },
    { name: Order.SilverLadder, description: "Leaders and visionaries who seek to build a new Atlantis." },
    { name: Order.Unaligned, description: "Mages who operate outside the structure of the Pentacle Orders." },
    { name: Order.SeersOfTheThrone, description: "Servants of the Exarchs who enforce the Lie and hunt other mages." },
    { name: Order.Banishers, description: "Mages who have come to hate their own power and seek to destroy all magic." },
];

export const ATTRIBUTES: { name: Attribute; category: 'Mental' | 'Physical' | 'Social' }[] = [
    { name: Attribute.Intelligence, category: 'Mental' }, { name: Attribute.Wits, category: 'Mental' }, { name: Attribute.Resolve, category: 'Mental' },
    { name: Attribute.Strength, category: 'Physical' }, { name: Attribute.Dexterity, category: 'Physical' }, { name: Attribute.Stamina, category: 'Physical' },
    { name: Attribute.Presence, category: 'Social' }, { name: Attribute.Manipulation, category: 'Social' }, { name: Attribute.Composure, category: 'Social' },
];

export const MENTAL_SKILLS = [Skill.Academics, Skill.Computer, Skill.Crafts, Skill.Investigation, Skill.Medicine, Skill.Occult, Skill.Politics, Skill.Science];
export const PHYSICAL_SKILLS = [Skill.Athletics, Skill.Brawl, Skill.Drive, Skill.Firearms, Skill.Larceny, Skill.Stealth, Skill.Survival, Skill.Weaponry];
export const SOCIAL_SKILLS = [Skill.AnimalKen, Skill.Empathy, Skill.Expression, Skill.Intimidation, Skill.Persuasion, Skill.Socialise, Skill.Streetwise, Skill.Subterfuge];

export const SKILLS: { name: Skill; category: 'Mental' | 'Physical' | 'Social' }[] = [
    ...MENTAL_SKILLS.map(s => ({ name: s, category: 'Mental' as const })),
    ...PHYSICAL_SKILLS.map(s => ({ name: s, category: 'Physical' as const })),
    ...SOCIAL_SKILLS.map(s => ({ name: s, category: 'Social' as const })),
];

export const ARCANA: { name: Arcanum }[] = [
    { name: Arcanum.Death }, { name: Arcanum.Fate }, { name: Arcanum.Forces },
    { name: Arcanum.Life }, { name: Arcanum.Matter }, { name: Arcanum.Mind },
    { name: Arcanum.Prime }, { name: Arcanum.Space }, { name: Arcanum.Spirit }, { name: Arcanum.Time },
];