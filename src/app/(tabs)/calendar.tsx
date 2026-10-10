import { StyleSheet } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Spacing } from '@/constants/theme';

export default function CalendarScreen() {
  return (
    <ThemedView style={styles.container}>
      <ThemedText type="title">Coming Soon</ThemedText>
      <ThemedText style={styles.subtitle}>Calendar feature will be available here</ThemedText>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: Spacing.four,
  },
  subtitle: {
    marginTop: Spacing.two,
    textAlign: 'center',
  },
});
