// contexts/LayoutActionsContext.ts
import { createContext } from 'react';

export interface LayoutActions {
  openDrawer:        () => void;
  handleBack:        () => void;
  handleNotifications: () => void;
  unreadCount:       number;
}

export const LayoutActionsContext = createContext<LayoutActions>({
  openDrawer:          () => {},
  handleBack:          () => {},
  handleNotifications: () => {},
  unreadCount:         0,
});