import { NativeTabs } from 'expo-router/unstable-native-tabs';
import { useColorScheme } from 'react-native';

import { GreenTheme } from '@/constants/theme';

export default function TabsLayout() {
  const scheme = useColorScheme();
  const isDark = scheme === 'dark';

  return (
    <NativeTabs
      backgroundColor={GreenTheme.gradientStart}
      indicatorColor={GreenTheme.gradientMid}
      tintColor={GreenTheme.white}
      labelVisibilityMode="labeled"
      labelStyle={{
        selected: { color: GreenTheme.white, fontWeight: '700' },
        default: { color: isDark ? '#eafaf1' : '#E8F5E9', fontWeight: '600' },
      }}
      iconColor={{ default: '#E8F5E9', selected: GreenTheme.white }}>
      <NativeTabs.Trigger name="home">
        <NativeTabs.Trigger.Label>🏠 Home</NativeTabs.Trigger.Label>
      </NativeTabs.Trigger>

      <NativeTabs.Trigger name="tasks">
        <NativeTabs.Trigger.Label>📋 Tasks</NativeTabs.Trigger.Label>
      </NativeTabs.Trigger>

      <NativeTabs.Trigger name="calendar">
        <NativeTabs.Trigger.Label>📅 Calendar</NativeTabs.Trigger.Label>
      </NativeTabs.Trigger>

      <NativeTabs.Trigger name="settings">
        <NativeTabs.Trigger.Label>⚙️ Settings</NativeTabs.Trigger.Label>
      </NativeTabs.Trigger>
    </NativeTabs>
  );
}
