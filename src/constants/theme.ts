/**
 * Below are the colors that are used in the app. The colors are defined in the light and dark mode.
 * There are many other ways to style your app. For example, [Nativewind](https://www.nativewind.dev/), [Tamagui](https://tamagui.dev/), [unistyles](https://reactnativeunistyles.vercel.app), etc.
 */

import '@/global.css';

import { Platform } from 'react-native';

export const Colors = {
  light: {
    text: '#000000',
    background: '#ffffff',
    backgroundElement: '#F0F0F3',
    backgroundSelected: '#E0E1E6',
    textSecondary: '#60646C',
  },
  dark: {
    text: '#ffffff',
    background: '#000000',
    backgroundElement: '#212225',
    backgroundSelected: '#2E3135',
    textSecondary: '#B0B4BA',
  },
} as const;

export type ThemeColor = keyof typeof Colors.light & keyof typeof Colors.dark;

export const Fonts = Platform.select({
  ios: {
    /** iOS `UIFontDescriptorSystemDesignDefault` */
    sans: 'system-ui',
    /** iOS `UIFontDescriptorSystemDesignSerif` */
    serif: 'ui-serif',
    /** iOS `UIFontDescriptorSystemDesignRounded` */
    rounded: 'ui-rounded',
    /** iOS `UIFontDescriptorSystemDesignMonospaced` */
    mono: 'ui-monospace',
  },
  default: {
    sans: 'normal',
    serif: 'serif',
    rounded: 'normal',
    mono: 'monospace',
  },
  web: {
    sans: 'var(--font-display)',
    serif: 'var(--font-serif)',
    rounded: 'var(--font-rounded)',
    mono: 'var(--font-mono)',
  },
});

export const Spacing = {
  half: 2,
  one: 4,
  two: 8,
  three: 16,
  four: 24,
  five: 32,
  six: 64,
} as const;

export const BottomTabInset = Platform.select({ ios: 50, android: 80 }) ?? 0;
export const MaxContentWidth = 800;

/**
 * Green theme color palette for the task management app
 */
export const GreenTheme = {
  primary: '#4CAF50',        // Main green color
  dark: '#2E7D32',           // Dark green for emphasis
  medium: '#388E3C',         // Medium green
  light: '#81C784',          // Light green for accents
  pale: '#C8E6C9',           // Very light green for backgrounds
  accent: '#66BB6A',         // Accent green for highlights
  text: '#1B5E20',           // Dark green for text
  // New gradient colors matching the teal-cyan to green to blue gradient
  gradientStart: '#1a8c99',  // Teal/cyan start
  gradientMid: '#3db878',    // Green middle
  gradientEnd: '#2a5f8f',    // Blue end
  white: '#FFFFFF',          // White for contrast
  black: '#000000',          // Black for text
  gray: '#757575',           // Gray for secondary text
  lightGray: '#E0E0E0',      // Light gray for borders
} as const;
