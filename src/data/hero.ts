export type HeroSlide = {
  id: string;
  image: string;
  name: string;
  subtitle: string;
  glow: string;
};

export const HERO_SLIDES_STORAGE_KEY = 'aad_admin_hero_slides';

export const defaultHeroSlides = (): HeroSlide[] => [
  {
    id: 'hero-1',
    image: '/ChatGPT_Image_May_13,_2026,_10_25_47_PM.png',
    name: 'Electric Blue Hypercar',
    subtitle: 'Neon-Lit Performance',
    glow: '#0088FF',
  },
  {
    id: 'hero-2',
    image: '/ChatGPT_Image_May_13,_2026,_10_26_47_PM.png',
    name: 'Crimson Apex GT',
    subtitle: 'Pure Italian Fury',
    glow: '#CC0000',
  },
  {
    id: 'hero-3',
    image: '/ChatGPT_Image_May_13,_2026,_10_30_05_PM.png',
    name: 'Rolls-Royce Wraith',
    subtitle: 'Midnight Black Edition',
    glow: '#888888',
  },
  {
    id: 'hero-4',
    image: '/ChatGPT_Image_May_13,_2026,_10_31_08_PM.png',
    name: 'Rolls-Royce Ghost',
    subtitle: 'Emerald Prestige',
    glow: '#00AA44',
  },
  {
    id: 'hero-5',
    image: '/ChatGPT_Image_May_13,_2026,_10_33_52_PM.png',
    name: 'Mercedes-AMG G63',
    subtitle: 'Stealth Luxury SUV',
    glow: '#AAAAAA',
  },
];

export const getHeroSlides = (): HeroSlide[] => {
  if (typeof window === 'undefined') return defaultHeroSlides();
  try {
    const raw = localStorage.getItem(HERO_SLIDES_STORAGE_KEY);
    if (!raw) return defaultHeroSlides();
    const parsed = JSON.parse(raw) as HeroSlide[];
    return Array.isArray(parsed) && parsed.length > 0
      ? parsed
      : defaultHeroSlides();
  } catch {
    return defaultHeroSlides();
  }
};
