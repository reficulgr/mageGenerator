

export enum Path {
    Acanthus = "Acanthus",
    Mastigos = "Mastigos",
    Moros = "Moros",
    Obrimos = "Obrimos",
    Thyrsus = "Thyrsus",
}

export enum Order {
    AdamantineArrow = "Adamantine Arrow",
    FreeCouncil = "Free Council",
    GuardiansOfTheVeil = "Guardians of the Veil",
    Mysterium = "Mysterium",
    SilverLadder = "Silver Ladder",
    Unaligned = "Unaligned",
    SeersOfTheThrone = "Seers of the Throne",
    Banishers = "Banishers",
}

export enum Attribute {
    // Mental
    Intelligence = "intelligence",
    Wits = "wits",
    Resolve = "resolve",
    // Physical
    Strength = "strength",
    Dexterity = "dexterity",
    Stamina = "stamina",
    // Social
    Presence = "presence",
    Manipulation = "manipulation",
    Composure = "composure",
}

export enum Skill {
    // Mental
    Academics = "academics",
    Computer = "computer",
    Crafts = "crafts",
    Investigation = "investigation",
    Medicine = "medicine",
    Occult = "occult",
    Politics = "politics",
    Science = "science",
    // Physical
    Athletics = "athletics",
    Brawl = "brawl",
    Drive = "drive",
    Firearms = "firearms",
    Larceny = "larceny",
    Stealth = "stealth",
    Survival = "survival",
    Weaponry = "weaponry",
    // Social
    AnimalKen = "animalKen",
    Empathy = "empathy",
    Expression = "expression",
    Intimidation = "intimidation",
    Persuasion = "persuasion",
    Socialise = "socialise",
    Streetwise = "streetwise",
    Subterfuge = "subterfuge",
}

export enum Arcanum {
    Death = "death",
    Fate = "fate",
    Forces = "forces",
    Life = "life",
    Matter = "matter",
    Mind = "mind",
    Prime = "prime",
    Space = "space",
    Spirit = "spirit",
    Time = "time",
}

export interface Rote {
  name: string;
  arcanum: Arcanum;
  rank: number;
}

export type Attributes = Record<Attribute, number>;
export type Skills = Record<Skill, number>;
export type Arcana = Record<Arcanum, number>;

export interface Character {
    name: string;
    concept: string;
    path: Path | null;
    order: Order | null;
    attributes: Attributes;
    skills: Skills;
    arcana: Arcana;
    gnosis: number;
    wisdom: number;
    meritKeywords: string;
    specialties: string[];
    aspirations: string[];
    description: string;
    portraitUrl: string;
    nimbus: string;
    rotes: string[];
    xp: number;
    xpLog: string[];
    // New optional fields for narrative generation
    tarotCard?: string;
    archetype?: string;
    occupation?: string;
    darkSecret?: string;
    disadvantage?: string;
    advantages?: string[];
}

export enum Step {
    PATH_ORDER,
    ATTRIBUTES,
    SKILLS,
    ARCANA,
    FINISHING_TOUCHES,
    SHEET,
}