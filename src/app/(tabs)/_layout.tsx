import { NativeTabs } from 'expo-router/unstable-native-tabs';

import { GreenTheme } from '@/constants/theme';

export default function TabsLayout() {
  return (
    <NativeTabs
      backgroundColor={GreenTheme.gradientStart}
      indicatorColor={GreenTheme.gradientMid}
      tintColor={GreenTheme.white}
      labelVisibilityMode="labeled"
      labelStyle={{
        selected: { color: GreenTheme.white },
        default: { color: 'rgba(255,255,255,0.8)' },
      }}
      iconColor={{
        default: 'rgba(255,255,255,0.8)',
        selected: GreenTheme.white,
      }}>
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
