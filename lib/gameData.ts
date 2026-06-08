import type {
  Achievement,
  Business,
  Investment,
  Manager,
  MarketAsset,
  Milestone,
  Mission,
  Synergy,
  Upgrade,
} from "@/types/game";

export const INITIAL_CAPITAL = 100;
export const INITIAL_CLICK_POWER = 1.5;
export const XP_PER_LEVEL = 100;
export const GOLDEN_RUSH_DURATION = 15;
export const GOLDEN_RUSH_METER_MAX = 100;
export const COMBO_DECAY_MS = 2500;
export const AUTOSAVE_INTERVAL_MS = 5000;
export const MARKET_TICK_MS = 3000;
export const PASSIVE_TICK_MS = 100;
export const EVENT_CHECK_MIN_MS = 20000;
export const EVENT_CHECK_MAX_MS = 45000;

export const BUSINESSES: Business[] = [
  { id: "savings", name: "Compte épargne", description: "Intérêts modestes mais sûrs.", category: "finance", baseCost: 50, baseIncome: 0.5, risk: 1, icon: "PiggyBank", unlockAt: 0, multiplier: 1 },
  { id: "freelance", name: "Micro-service freelance", description: "Petits contrats en ligne.", category: "tech", baseCost: 120, baseIncome: 1.2, risk: 2, icon: "Laptop", unlockAt: 0, multiplier: 1 },
  { id: "ecommerce", name: "Boutique e-commerce", description: "Vente en ligne automatisée.", category: "retail", baseCost: 300, baseIncome: 3, risk: 3, icon: "ShoppingCart", unlockAt: 200, multiplier: 1 },
  { id: "youtube", name: "Chaîne YouTube business", description: "Monétisation de contenu.", category: "media", baseCost: 500, baseIncome: 5, risk: 4, icon: "Video", unlockAt: 500, multiplier: 1 },
  { id: "newsletter", name: "Newsletter premium", description: "Abonnements récurrents.", category: "media", baseCost: 800, baseIncome: 8, risk: 2, icon: "Mail", unlockAt: 1000, multiplier: 1 },
  { id: "rental", name: "Appartement locatif", description: "Revenus locatifs stables.", category: "real_estate", baseCost: 1500, baseIncome: 15, risk: 3, icon: "Home", unlockAt: 2000, multiplier: 1 },
  { id: "marketing", name: "Agence marketing", description: "Campagnes pour clients.", category: "retail", baseCost: 2500, baseIncome: 25, risk: 5, icon: "Megaphone", unlockAt: 5000, multiplier: 1 },
  { id: "saas", name: "SaaS B2B", description: "Logiciel en abonnement.", category: "tech", baseCost: 5000, baseIncome: 55, risk: 6, icon: "Cloud", unlockAt: 10000, multiplier: 1 },
  { id: "mobile_app", name: "Application mobile", description: "App avec microtransactions.", category: "tech", baseCost: 8000, baseIncome: 80, risk: 7, icon: "Smartphone", unlockAt: 20000, multiplier: 1 },
  { id: "fashion", name: "Marque de vêtements", description: "Mode et lifestyle.", category: "retail", baseCost: 12000, baseIncome: 120, risk: 6, icon: "Shirt", unlockAt: 50000, multiplier: 1 },
  { id: "franchise", name: "Franchise restaurants", description: "Réseau de restauration.", category: "retail", baseCost: 25000, baseIncome: 250, risk: 5, icon: "UtensilsCrossed", unlockAt: 100000, multiplier: 1 },
  { id: "factory", name: "Usine automatisée", description: "Production industrielle.", category: "industry", baseCost: 50000, baseIncome: 500, risk: 4, icon: "Factory", unlockAt: 250000, multiplier: 1 },
  { id: "fund", name: "Fonds d'investissement", description: "Gestion de capitaux.", category: "finance", baseCost: 100000, baseIncome: 1000, risk: 8, icon: "TrendingUp", unlockAt: 500000, multiplier: 1 },
  { id: "datacenter", name: "Data center", description: "Infrastructure cloud.", category: "tech", baseCost: 250000, baseIncome: 2500, risk: 5, icon: "Server", unlockAt: 1000000, multiplier: 1 },
  { id: "ai_startup", name: "Startup IA", description: "Intelligence artificielle.", category: "tech", baseCost: 500000, baseIncome: 5000, risk: 10, icon: "Brain", unlockAt: 5000000, multiplier: 1 },
  { id: "private_bank", name: "Banque privée", description: "Services haut de gamme.", category: "finance", baseCost: 1000000, baseIncome: 10000, risk: 7, icon: "Landmark", unlockAt: 10000000, multiplier: 1 },
  { id: "quant_fund", name: "Fonds quantitatif", description: "Trading algorithmique.", category: "finance", baseCost: 5000000, baseIncome: 50000, risk: 12, icon: "LineChart", unlockAt: 50000000, multiplier: 1 },
  { id: "holding", name: "Holding internationale", description: "Empire multi-secteurs.", category: "finance", baseCost: 25000000, baseIncome: 250000, risk: 6, icon: "Building2", unlockAt: 250000000, multiplier: 1 },
  { id: "conglomerate", name: "Conglomérat mondial", description: "Domination globale.", category: "industry", baseCost: 100000000, baseIncome: 1000000, risk: 5, icon: "Globe", unlockAt: 1000000000, multiplier: 1 },
  { id: "orbital", name: "Empire orbital", description: "Économie spatiale.", category: "space", baseCost: 500000000, baseIncome: 5000000, risk: 8, icon: "Rocket", unlockAt: 5000000000, multiplier: 1 },
];

export const INVESTMENTS: Investment[] = [
  { id: "livret", name: "Livret sécurisé", description: "Placement sans risque.", avgReturn: 0.02, volatility: 0.001, risk: "low", duration: 30, icon: "Shield", unlockAt: 100 },
  { id: "bonds", name: "Obligations d'État fictives", description: "Rendement stable.", avgReturn: 0.04, volatility: 0.005, risk: "low", duration: 60, icon: "FileText", unlockAt: 500 },
  { id: "etf", name: "ETF Monde fictif", description: "Diversification globale.", avgReturn: 0.08, volatility: 0.02, risk: "medium", duration: 90, icon: "Globe2", unlockAt: 2000 },
  { id: "re_token", name: "Immobilier tokenisé", description: "Parts immobilières digitales.", avgReturn: 0.1, volatility: 0.03, risk: "medium", duration: 120, icon: "Building", unlockAt: 10000 },
  { id: "crypto", name: "Crypto fictive", description: "Monnaie volatile.", avgReturn: 0.15, volatility: 0.15, risk: "high", duration: 30, icon: "Bitcoin", unlockAt: 5000 },
  { id: "early_stage", name: "Startup early-stage", description: "Investissement risqué.", avgReturn: 0.25, volatility: 0.2, risk: "high", duration: 180, icon: "Lightbulb", unlockAt: 25000 },
  { id: "ai_fund", name: "Fonds IA", description: "Technologies émergentes.", avgReturn: 0.18, volatility: 0.12, risk: "high", duration: 90, icon: "Cpu", unlockAt: 100000 },
  { id: "quantum", name: "Fonds quantique", description: "Physique appliquée.", avgReturn: 0.22, volatility: 0.18, risk: "extreme", duration: 120, icon: "Atom", unlockAt: 500000 },
  { id: "commodities", name: "Matières premières", description: "Or, énergie, métaux.", avgReturn: 0.12, volatility: 0.08, risk: "medium", duration: 60, icon: "Gem", unlockAt: 50000 },
  { id: "vc", name: "Capital-risque", description: "Portfolio de startups.", avgReturn: 0.3, volatility: 0.25, risk: "extreme", duration: 365, icon: "Rocket", unlockAt: 1000000 },
];

export const MARKET_ASSETS: MarketAsset[] = [
  { id: "novatech", name: "NovaTech", symbol: "NVT", basePrice: 42, volatility: 0.04, trend: 0.001, icon: "Cpu" },
  { id: "greengrid", name: "GreenGrid", symbol: "GRG", basePrice: 28, volatility: 0.03, trend: 0.002, icon: "Leaf" },
  { id: "moonbank", name: "MoonBank", symbol: "MNB", basePrice: 65, volatility: 0.05, trend: -0.001, icon: "Landmark" },
  { id: "hyperretail", name: "HyperRetail", symbol: "HRT", basePrice: 18, volatility: 0.035, trend: 0.001, icon: "Store" },
  { id: "quantum_motors", name: "Quantum Motors", symbol: "QMT", basePrice: 95, volatility: 0.06, trend: 0.003, icon: "Car" },
  { id: "astromining", name: "AstroMining", symbol: "ASM", basePrice: 12, volatility: 0.08, trend: 0.004, icon: "Pickaxe" },
  { id: "neuralsoft", name: "NeuralSoft", symbol: "NSF", basePrice: 55, volatility: 0.07, trend: 0.005, icon: "Brain" },
  { id: "oceanenergy", name: "OceanEnergy", symbol: "OCE", basePrice: 33, volatility: 0.04, trend: 0.002, icon: "Waves" },
];

export const MILESTONES: Milestone[] = [
  { id: "m1k", amount: 1000, title: "Débutant ambitieux", reward: 50, bonus: 0.02, icon: "Star" },
  { id: "m10k", amount: 10000, title: "Entrepreneur", reward: 200, bonus: 0.03, icon: "Briefcase" },
  { id: "m100k", amount: 100000, title: "Investisseur", reward: 1000, bonus: 0.04, icon: "TrendingUp" },
  { id: "m1m", amount: 1000000, title: "Millionnaire", reward: 5000, bonus: 0.05, icon: "Crown" },
  { id: "m10m", amount: 10000000, title: "Magnat", reward: 25000, bonus: 0.06, icon: "Gem" },
  { id: "m100m", amount: 100000000, title: "Tycoon", reward: 100000, bonus: 0.07, icon: "Castle" },
  { id: "m1b", amount: 1000000000, title: "Milliardaire", reward: 500000, bonus: 0.08, icon: "Trophy" },
  { id: "m1t", amount: 1000000000000, title: "Empire légendaire", reward: 5000000, bonus: 0.1, icon: "Sparkles" },
];

export const UPGRADES: Upgrade[] = [
  { id: "productivity", name: "Productivité personnelle", description: "+25% gain par clic", cost: 100, effect: "click", effectValue: 0.25, category: "active", icon: "Zap", unlockAt: 0, maxLevel: 10 },
  { id: "automation", name: "Automatisation", description: "+20% revenu passif", cost: 250, effect: "passive", effectValue: 0.2, category: "passive", icon: "Cog", unlockAt: 200, maxLevel: 10 },
  { id: "accounting", name: "Comptabilité optimisée", description: "-10% coûts business", cost: 500, effect: "cost", effectValue: 0.1, category: "economy", icon: "Calculator", unlockAt: 500, maxLevel: 5 },
  { id: "network", name: "Réseau premium", description: "+15% récompenses missions", cost: 750, effect: "mission", effectValue: 0.15, category: "social", icon: "Users", unlockAt: 1000, maxLevel: 5 },
  { id: "analysts", name: "Analystes financiers", description: "-10% risque global", cost: 1000, effect: "risk", effectValue: 0.1, category: "finance", icon: "BarChart3", unlockAt: 2000, maxLevel: 5 },
  { id: "viral_marketing", name: "Marketing viral", description: "+30% e-commerce", cost: 1500, effect: "business_ecommerce", effectValue: 0.3, category: "retail", icon: "Share2", unlockAt: 3000, maxLevel: 5 },
  { id: "cloud_scaling", name: "Cloud scaling", description: "+40% SaaS", cost: 3000, effect: "business_saas", effectValue: 0.4, category: "tech", icon: "CloudCog", unlockAt: 10000, maxLevel: 5 },
  { id: "ai_ops", name: "IA opérationnelle", description: "+50% business tech", cost: 5000, effect: "business_tech", effectValue: 0.5, category: "tech", icon: "Bot", unlockAt: 25000, maxLevel: 5 },
  { id: "leverage", name: "Effet de levier", description: "+50% rendement, +15% risque", cost: 8000, effect: "leverage", effectValue: 0.5, category: "finance", icon: "Scale", unlockAt: 50000, maxLevel: 3 },
  { id: "empire_manager", name: "Manager d'empire", description: "+10% tous revenus", cost: 15000, effect: "global", effectValue: 0.1, category: "global", icon: "Crown", unlockAt: 100000, maxLevel: 10 },
  { id: "click_mastery", name: "Maîtrise du clic", description: "+15% combo max", cost: 200, effect: "combo", effectValue: 0.15, category: "active", icon: "MousePointer", unlockAt: 100, maxLevel: 5 },
  { id: "passive_boost", name: "Rendement passif+", description: "+12% revenu passif", cost: 400, effect: "passive", effectValue: 0.12, category: "passive", icon: "Timer", unlockAt: 400, maxLevel: 8 },
  { id: "trade_insight", name: "Vision trading", description: "+20% gains marché", cost: 2000, effect: "market", effectValue: 0.2, category: "trading", icon: "Eye", unlockAt: 5000, maxLevel: 5 },
  { id: "invest_wisdom", name: "Sagesse investisseur", description: "+15% rendement invest.", cost: 3500, effect: "invest", effectValue: 0.15, category: "finance", icon: "BookOpen", unlockAt: 15000, maxLevel: 5 },
  { id: "golden_touch", name: "Toucher d'or", description: "+5% remplissage Golden Rush", cost: 1200, effect: "golden", effectValue: 0.05, category: "special", icon: "Sparkles", unlockAt: 3000, maxLevel: 5 },
  { id: "reputation_boost", name: "Image publique", description: "+10% réputation gains", cost: 2500, effect: "reputation", effectValue: 0.1, category: "social", icon: "Award", unlockAt: 8000, maxLevel: 5 },
  { id: "media_empire", name: "Empire média", description: "+35% revenus media", cost: 4000, effect: "business_media", effectValue: 0.35, category: "media", icon: "Radio", unlockAt: 20000, maxLevel: 5 },
  { id: "real_estate_pro", name: "Pro immobilier", description: "+30% immobilier", cost: 6000, effect: "business_real_estate", effectValue: 0.3, category: "real_estate", icon: "Home", unlockAt: 50000, maxLevel: 5 },
  { id: "industry_scale", name: "Échelle industrielle", description: "+25% industrie", cost: 10000, effect: "business_industry", effectValue: 0.25, category: "industry", icon: "Factory", unlockAt: 100000, maxLevel: 5 },
  { id: "space_pioneer", name: "Pionnier spatial", description: "+40% revenus space", cost: 50000, effect: "business_space", effectValue: 0.4, category: "space", icon: "Rocket", unlockAt: 1000000000, maxLevel: 3 },
];

export const MANAGERS: Manager[] = [
  { id: "mgr_finance", name: "CFO Expert", description: "+20% revenus finance", category: "finance", cost: 5000, bonus: 0.2, rarity: "common", icon: "Landmark", unlockAt: 10000 },
  { id: "mgr_tech", name: "CTO Visionnaire", description: "+25% revenus tech", category: "tech", cost: 15000, bonus: 0.25, rarity: "rare", icon: "Cpu", unlockAt: 50000 },
  { id: "mgr_retail", name: "Directeur Retail", description: "+18% revenus retail", category: "retail", cost: 8000, bonus: 0.18, rarity: "common", icon: "Store", unlockAt: 25000 },
  { id: "mgr_media", name: "Prod. Média", description: "+22% revenus media", category: "media", cost: 6000, bonus: 0.22, rarity: "common", icon: "Video", unlockAt: 15000 },
  { id: "mgr_realestate", name: "Agent Immo Elite", description: "+30% immobilier", category: "real_estate", cost: 20000, bonus: 0.3, rarity: "rare", icon: "Building", unlockAt: 100000 },
  { id: "mgr_industry", name: "Ingénieur Industriel", description: "+28% industrie", category: "industry", cost: 50000, bonus: 0.28, rarity: "epic", icon: "Factory", unlockAt: 500000 },
  { id: "mgr_space", name: "Commandant Orbital", description: "+35% revenus space", category: "space", cost: 500000, bonus: 0.35, rarity: "legendary", icon: "Rocket", unlockAt: 1000000000 },
  { id: "mgr_global", name: "CEO Légendaire", description: "+15% tous revenus", category: "finance", cost: 100000, bonus: 0.15, rarity: "legendary", icon: "Crown", unlockAt: 1000000 },
];

export const SYNERGIES: Synergy[] = [
  { id: "syn_tech_infra", name: "Stack Tech", description: "SaaS B2B + Data Center", businessIds: ["saas", "datacenter"], bonus: 0.25, icon: "Server" },
  { id: "syn_media_reach", name: "Portée Média", description: "YouTube + Newsletter", businessIds: ["youtube", "newsletter"], bonus: 0.2, icon: "Radio" },
  { id: "syn_retail_chain", name: "Chaîne Retail", description: "E-commerce + Franchise", businessIds: ["ecommerce", "franchise"], bonus: 0.22, icon: "ShoppingBag" },
  { id: "syn_finance_power", name: "Puissance Finance", description: "Fonds + Banque privée", businessIds: ["fund", "private_bank"], bonus: 0.3, icon: "Landmark" },
  { id: "syn_ai_future", name: "Futur IA", description: "Startup IA + Data Center", businessIds: ["ai_startup", "datacenter"], bonus: 0.35, icon: "Brain" },
  { id: "syn_empire", name: "Empire Total", description: "Holding + Conglomérat", businessIds: ["holding", "conglomerate"], bonus: 0.4, icon: "Globe" },
  { id: "syn_space_tech", name: "Tech Spatiale", description: "Empire orbital + Data Center", businessIds: ["orbital", "datacenter"], bonus: 0.45, icon: "Rocket" },
  { id: "syn_startup_eco", name: "Écosystème Startup", description: "App mobile + SaaS B2B", businessIds: ["mobile_app", "saas"], bonus: 0.18, icon: "Smartphone" },
];

export const CLICK_INCOME_TYPES = [
  { id: "freelance", name: "Freelance", bonus: 1 },
  { id: "quick_sale", name: "Vente rapide", bonus: 1.1 },
  { id: "negotiation", name: "Négociation", bonus: 1.2 },
  { id: "express_deal", name: "Deal express", bonus: 1.3 },
  { id: "arbitrage", name: "Arbitrage", bonus: 1.5 },
  { id: "consulting", name: "Consulting", bonus: 1.8 },
  { id: "premium_training", name: "Formation premium", bonus: 2 },
  { id: "product_launch", name: "Lancement produit", bonus: 2.5 },
];
