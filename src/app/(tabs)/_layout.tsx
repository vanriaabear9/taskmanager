import { NativeTabs } from 'expo-router/unstable-native-tabs';
import { useColorScheme } from 'react-native';

import { Colors, GreenTheme } from '@/constants/theme';

export default function TabsLayout() {
  const scheme = useColorScheme();
  const colors = Colors[scheme === 'unspecified' ? 'light' : scheme];

  return (
    <NativeTabs
      backgroundColor={colors.background}
      indicatorColor={GreenTheme.primary}
      labelStyle={{ 
        selected: { color: GreenTheme.primary },
        default: { color: colors.textSecondary }
      }}>
      {/* Home Button - Functional ✓ */}
      <NativeTabs.Trigger name="home">
        <NativeTabs.Trigger.Label>🏠 Home</NativeTabs.Trigger.Label>
      </NativeTabs.Trigger>

      {/* Tasks Button - Functional ✓ */}
      <NativeTabs.Trigger name="tasks">
        <NativeTabs.Trigger.Label>📋 Tasks</NativeTabs.Trigger.Label>
      </NativeTabs.Trigger>

      {/* Calendar Button - Placeholder (Coming Soon) */}
      <NativeTabs.Trigger name="calendar">
        <NativeTabs.Trigger.Label>📅 Calendar</NativeTabs.Trigger.Label>
      </NativeTabs.Trigger>

      {/* Settings Button - Placeholder (Coming Soon) */}
      <NativeTabs.Trigger name="settings">
        <NativeTabs.Trigger.Label>⚙️ Settings</NativeTabs.Trigger.Label>
      </NativeTabs.Trigger>
    </NativeTabs>
  );
}
