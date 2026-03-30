// constants/menuItems.ts — Wird Tijani
//
// Only screens that exist inside Wird Tijani:
//   Daily Awrād: Home · Wird · Wazifa · Haḍra
//   Resources:   Library · Hadara Map
//   Tools:       Stats · Settings · About · Contact

import {
  Heart, BookOpen, BarChart3, Settings, Star, Moon,
  Home, Info, MapPin, Mail,
} from 'lucide-react-native';

export interface MenuItem {
  name:          string;
  route:         string;
  icon:          any;
  description:   string;
  badge?:        number;
  isNew?:        boolean;
  dividerAfter?: boolean;
  color?:        string;
}

export const MENU_ITEMS: MenuItem[] = [
  // ── Daily Awrād ────────────────────────────────────────────────────────────
  { name: 'Home',            route: '/',          icon: Home,     description: 'Main dashboard',                  color: '#059669' },
  { name: 'Wird',            route: '/wird',      icon: Heart,    description: 'Daily litany',                    color: '#DC2626' },
  { name: 'Wazifa',          route: '/wazifa',    icon: Star,     description: 'The daily collective invocation', color: '#D97706' },
  { name: 'Haḍratu-Jumūʿa', route: '/hadra',     icon: Moon,     description: 'Friday sacred gathering',         color: '#7C3AED', dividerAfter: true },

  // ── Resources ─────────────────────────────────────────────────────────────
  { name: 'Library',         route: '/library',   icon: BookOpen, description: 'Resources & sacred texts',        color: '#059669' },
  { name: 'Hadara Map',      route: '/hadra-map', icon: MapPin,   description: 'Find local Zawiya & gatherings',  color: '#059669', dividerAfter: true },

  // ── Tools ──────────────────────────────────────────────────────────────────
  { name: 'Statistics',      route: '/stats',     icon: BarChart3, description: 'Consistency & discipline',       color: '#0891B2' },
  { name: 'Settings',        route: '/settings',  icon: Settings,  description: 'Configuration',                 color: '#475569' },
  { name: 'About',           route: '/about',     icon: Info,      description: 'App information',               color: '#7C3AED' },
  { name: 'Contact Us',      route: '/contact',   icon: Mail,      description: 'Get in touch',                  color: '#0891B2' },
];