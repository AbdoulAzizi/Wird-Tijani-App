// constants/menuItems.ts

import {
  Heart, BookOpen, BarChart3, Settings, Star, Moon, Home, Info,
  Sparkles, Timer, BookMarked, Eye, MapPin, Mail,
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
  { name: 'Home',             route: '/',              icon: Home,       description: 'Main dashboard',                  color: '#059669' },
  { name: 'Wird',             route: '/wird',          icon: Heart,      description: 'Daily litany',                    color: '#DC2626' },
  { name: 'Wazifa',           route: '/wazifa',        icon: Star,       description: 'The daily collective invocation', color: '#D97706' },
  { name: 'Haḍratu-Jumūʿa',  route: '/hadra',         icon: Moon,       description: 'Friday sacred gathering',         color: '#7C3AED' },
  { name: "Sūras of Qur'ān", route: '/suwar',         icon: BookMarked, description: '114 Surahs · Reflect & meditate', color: '#1E3A8A', isNew: true },
  { name: "Asmā' Allāh",     route: '/asmaa-alhusna', icon: Sparkles,   description: 'The 99 Names of Allah',           color: '#1E40AF', isNew: true },
  { name: "Asmā' An-Nabī",   route: '/asmaa-nabi',    icon: Star,       description: '201 Names of the Prophet ﷺ',     color: '#B45309', isNew: true },
  { name: 'Dhikr Counter',   route: '/dhikr-counter', icon: Timer,      description: 'Your dhikr counter',              color: '#0891B2', isNew: true },
  { name: 'Library',         route: '/library',       icon: BookOpen,   description: 'Resources & sacred texts',        color: '#059669', dividerAfter: true },
  { name: 'Hadara Map',      route: '/hadra-map',     icon: MapPin,     description: 'Find local Zawiya & gatherings',  color: '#059669' },
  { name: 'Al-Hadra',        route: '/hadra-station', icon: Eye,        description: 'The Station of Presence',         color: '#C8922A', isNew: true },
  { name: 'Statistics',      route: '/stats',         icon: BarChart3,  description: 'Consistency & discipline',        color: '#0891B2' },
  { name: 'Settings',        route: '/settings',      icon: Settings,   description: 'Configuration',                  color: '#475569' },
  { name: 'About',           route: '/about',         icon: Info,       description: 'App information',                color: '#7C3AED' },
  { name: 'Contact Us',      route: '/contact',       icon: Mail,       description: 'Get in touch',                   color: '#0891B2' },
];