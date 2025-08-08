import React from 'react';
import Icon from '../Icon';
import { COLORS } from '../../constants/colors';

// Navigation Icons
export const HomeIcon = ({ size = 24, color = COLORS.secondary, style }: any) => (
  <Icon name="home-outline" size={size} color={color} style={style} />
);

export const SearchIcon = ({ size = 24, color = COLORS.secondary, style }: any) => (
  <Icon name="magnify" size={size} color={color} style={style} />
);

export const AddIcon = ({ size = 24, color = COLORS.secondary, style }: any) => (
  <Icon name="plus-circle-outline" size={size} color={color} style={style} />
);

export const CarIcon = ({ size = 24, color = COLORS.secondary, style }: any) => (
  <Icon name="car-outline" size={size} color={color} style={style} />
);

export const ChatIcon = ({ size = 24, color = COLORS.secondary, style }: any) => (
  <Icon name="chat-outline" size={size} color={color} style={style} />
);

export const ProfileIcon = ({ size = 24, color = COLORS.secondary, style }: any) => (
  <Icon name="account-outline" size={size} color={color} style={style} />
);

export const WalletIcon = ({ size = 24, color = COLORS.secondary, style }: any) => (
  <Icon name="wallet" size={size} color={color} style={style} />
);

// Location Icons
export const LocationIcon = ({ size = 24, color = COLORS.accent, style }: any) => (
  <Icon name="map-marker" size={size} color={color} style={style} />
);

export const LocationCheckIcon = ({ size = 24, color = COLORS.success, style }: any) => (
  <Icon name="map-marker-check" size={size} color={color} style={style} />
);

export const LocationPathIcon = ({ size = 24, color = COLORS.textSecondary, style }: any) => (
  <Icon name="map-marker-path" size={size} color={color} style={style} />
);

// Time Icons
export const ClockIcon = ({ size = 24, color = COLORS.textSecondary, style }: any) => (
  <Icon name="clock-outline" size={size} color={color} style={style} />
);

export const ClockFastIcon = ({ size = 24, color = COLORS.accent, style }: any) => (
  <Icon name="clock-fast" size={size} color={color} style={style} />
);

export const CalendarIcon = ({ size = 24, color = COLORS.accent, style }: any) => (
  <Icon name="calendar" size={size} color={color} style={style} />
);

// User Icons
export const UserIcon = ({ size = 24, color = COLORS.accent, style }: any) => (
  <Icon name="account" size={size} color={color} style={style} />
);

export const UsersIcon = ({ size = 24, color = COLORS.accent, style }: any) => (
  <Icon name="account-multiple" size={size} color={color} style={style} />
);

export const UserEditIcon = ({ size = 24, color = COLORS.accent, style }: any) => (
  <Icon name="account-edit" size={size} color={color} style={style} />
);

// Rating Icons
export const StarIcon = ({ size = 24, color = "#FFD700", style }: any) => (
  <Icon name="star" size={size} color={color} style={style} />
);

export const StarOutlineIcon = ({ size = 24, color = COLORS.textSecondary, style }: any) => (
  <Icon name="star-outline" size={size} color={color} style={style} />
);

// Payment Icons
export const CurrencyIcon = ({ size = 24, color = COLORS.accent, style }: any) => (
  <Icon name="currency-inr" size={size} color={color} style={style} />
);

export const CreditCardIcon = ({ size = 24, color = COLORS.accent, style }: any) => (
  <Icon name="credit-card" size={size} color={color} style={style} />
);

// Vehicle Icons
export const CarSeatIcon = ({ size = 24, color = COLORS.textSecondary, style }: any) => (
  <Icon name="car-seat" size={size} color={color} style={style} />
);

// Communication Icons
export const MessageIcon = ({ size = 24, color = COLORS.success, style }: any) => (
  <Icon name="message-text" size={size} color={color} style={style} />
);

export const BellIcon = ({ size = 24, color = COLORS.error, style }: any) => (
  <Icon name="bell" size={size} color={color} style={style} />
);

export const BellOffIcon = ({ size = 24, color = COLORS.textSecondary, style }: any) => (
  <Icon name="bell-off" size={size} color={color} style={style} />
);

// Action Icons
export const EditIcon = ({ size = 24, color = COLORS.accent, style }: any) => (
  <Icon name="pencil" size={size} color={color} style={style} />
);

export const DeleteIcon = ({ size = 24, color = COLORS.error, style }: any) => (
  <Icon name="delete" size={size} color={color} style={style} />
);

export const CloseIcon = ({ size = 24, color = COLORS.error, style }: any) => (
  <Icon name="close-circle" size={size} color={color} style={style} />
);

export const CheckIcon = ({ size = 24, color = COLORS.success, style }: any) => (
  <Icon name="check-circle" size={size} color={color} style={style} />
);

export const ArrowLeftIcon = ({ size = 24, color = COLORS.secondary, style }: any) => (
  <Icon name="arrow-left" size={size} color={color} style={style} />
);

export const ChevronRightIcon = ({ size = 24, color = COLORS.textSecondary, style }: any) => (
  <Icon name="chevron-right" size={size} color={color} style={style} />
);

// Settings Icons
export const SettingsIcon = ({ size = 24, color = COLORS.textSecondary, style }: any) => (
  <Icon name="cog" size={size} color={color} style={style} />
);

export const HelpIcon = ({ size = 24, color = "#5856D6", style }: any) => (
  <Icon name="help-circle" size={size} color={color} style={style} />
);

export const LogoutIcon = ({ size = 24, color = COLORS.error, style }: any) => (
  <Icon name="logout" size={size} color={color} style={style} />
);

// Refresh Icon
export const RefreshIcon = ({ size = 24, color = COLORS.primary, style }: any) => (
  <Icon name="refresh" size={size} color={color} style={style} />
);

// Preference Icons
export const SnowflakeIcon = ({ size = 24, color = COLORS.accent, style }: any) => (
  <Icon name="snowflake" size={size} color={color} style={style} />
);

export const MusicIcon = ({ size = 24, color = "#FF9500", style }: any) => (
  <Icon name="music" size={size} color={color} style={style} />
);

export const NoSmokingIcon = ({ size = 24, color = COLORS.success, style }: any) => (
  <Icon name="smoking-off" size={size} color={color} style={style} />
);

// Auth Icons
export const EmailIcon = ({ size = 24, color = COLORS.textSecondary, style }: any) => (
  <Icon name="email-outline" size={size} color={color} style={style} />
);

export const LockIcon = ({ size = 24, color = COLORS.textSecondary, style }: any) => (
  <Icon name="lock-outline" size={size} color={color} style={style} />
);

export const GoogleIcon = ({ size = 24, color = "#4285F4", style }: any) => (
  <Icon name="google" size={size} color={color} style={style} />
);

// Quick Action Icons
export const PostRideIcon = ({ size = 24, color = COLORS.accent, style }: any) => (
  <Icon name="car" size={size} color={color} style={style} />
);

export const FindRideIcon = ({ size = 24, color = COLORS.accent, style }: any) => (
  <Icon name="magnify" size={size} color={color} style={style} />
);

export const MyRidesIcon = ({ size = 24, color = COLORS.accent, style }: any) => (
  <Icon name="format-list-bulleted" size={size} color={color} style={style} />
);

export const WalletOutlineIcon = ({ size = 24, color = COLORS.accent, style }: any) => (
  <Icon name="wallet-outline" size={size} color={color} style={style} />
); 