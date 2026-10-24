/**
 * Apex Multi-Franchise Industrial Operating System Profile Store
 * 
 * Supports dynamic switching between multi-plant franchise profiles:
 * - High-Tech Electronics & Smart Hardware Franchise (Austin, TX)
 * - Automotive EV Powertrain & Battery Packs Franchise (Stuttgart, Germany)
 * - Industrial Automation & Robotics Franchise (Singapore Innovation District)
 * - Consumer Goods & High-Speed Process Packaging Franchise (Chicago, IL)
 * - Precision Medical Devices & Diagnostics Franchise (Basel, Switzerland)
 */

export interface FranchiseProfile {
  id: string;
  name: string;
  plantName: string;
  city: string;
  country: string;
  flag: string;
  primaryIndustry: string;
  currency: string;
  currencySymbol: string;
  annualCapacity: string;
  operatingLines: number;
  totalWorkforce: number;
  isoStandard: string;
  accentColor: string;
}

export const FRANCHISE_PROFILES: FranchiseProfile[] = [
  {
    id: 'franchise-electronics',
    name: 'Electronics & Smart Devices Franchise',
    plantName: 'Plant 1: Austin Advanced Electronics Facility',
    city: 'Austin, Texas',
    country: 'USA',
    flag: '🇺🇸',
    primaryIndustry: 'Discrete Electronics & Smart Hardware',
    currency: 'USD',
    currencySymbol: '$',
    annualCapacity: '1,200,000 Units',
    operatingLines: 6,
    totalWorkforce: 420,
    isoStandard: 'ISO 9001 / ISO 14001',
    accentColor: 'blue',
  },
  {
    id: 'franchise-ev',
    name: 'Automotive EV Powertrain Franchise',
    plantName: 'Plant 2: Stuttgart EV Battery & Inverter Hub',
    city: 'Stuttgart',
    country: 'Germany',
    flag: '🇩🇪',
    primaryIndustry: 'Automotive E-Mobility & Battery Systems',
    currency: 'EUR',
    currencySymbol: '€',
    annualCapacity: '450,000 Packs',
    operatingLines: 8,
    totalWorkforce: 580,
    isoStandard: 'IATF 16949 / ISO 26262',
    accentColor: 'emerald',
  },
  {
    id: 'franchise-robotics',
    name: 'Industrial Robotics & Automation Franchise',
    plantName: 'Plant 3: Jurong Precision Machinery Complex',
    city: 'Jurong',
    country: 'Singapore',
    flag: '🇸🇬',
    primaryIndustry: 'Precision Robotics & Motion Controls',
    currency: 'USD',
    currencySymbol: '$',
    annualCapacity: '85,000 Robotic Arms',
    operatingLines: 4,
    totalWorkforce: 290,
    isoStandard: 'ISO 13849 / CE Machinery',
    accentColor: 'indigo',
  },
  {
    id: 'franchise-fmcg',
    name: 'Process Packaging & FMCG Franchise',
    plantName: 'Plant 4: Midwest Automated Bottling & Packaging',
    city: 'Chicago, Illinois',
    country: 'USA',
    flag: '🇺🇸',
    primaryIndustry: 'Consumer Goods & Process Manufacturing',
    currency: 'USD',
    currencySymbol: '$',
    annualCapacity: '12,500,000 Cans/Bottles',
    operatingLines: 10,
    totalWorkforce: 350,
    isoStandard: 'ISO 22000 / HACCP / GMP',
    accentColor: 'amber',
  },
  {
    id: 'franchise-medtech',
    name: 'Medical Devices & Diagnostics Franchise',
    plantName: 'Plant 5: Basel Bio-Medical Micro-Assembly',
    city: 'Basel',
    country: 'Switzerland',
    flag: '🇨🇭',
    primaryIndustry: 'Class III Medical Devices & Sensor Implants',
    currency: 'CHF',
    currencySymbol: 'CHF',
    annualCapacity: '250,000 Sterile Kits',
    operatingLines: 4,
    totalWorkforce: 180,
    isoStandard: 'ISO 13485 / FDA 21 CFR 820',
    accentColor: 'cyan',
  },
];

const STORAGE_KEY = 'apex_active_franchise_profile_v1';
const EVENT_KEY = 'apex_franchise_changed';

class FranchiseStoreService {
  private activeProfileId: string = 'franchise-electronics';

  constructor() {
    this.loadFromStorage();
  }

  private loadFromStorage() {
    if (typeof window === 'undefined') return;
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored && FRANCHISE_PROFILES.some((f) => f.id === stored)) {
        this.activeProfileId = stored;
      }
    } catch {
      this.activeProfileId = 'franchise-electronics';
    }
  }

  public getActiveProfile(): FranchiseProfile {
    this.loadFromStorage();
    return (
      FRANCHISE_PROFILES.find((f) => f.id === this.activeProfileId) ||
      FRANCHISE_PROFILES[0]
    );
  }

  public getAllProfiles(): FranchiseProfile[] {
    return [...FRANCHISE_PROFILES];
  }

  public setActiveProfile(profileId: string) {
    if (!FRANCHISE_PROFILES.some((f) => f.id === profileId)) return;
    this.activeProfileId = profileId;
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem(STORAGE_KEY, profileId);
        window.dispatchEvent(new Event(EVENT_KEY));
      } catch (e) {
        console.error(e);
      }
    }
  }
}

export const franchiseStore = new FranchiseStoreService();
