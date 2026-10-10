import { router } from 'expo-router';
import { Pressable, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ThemedText } from '@/components/themed-text';
import { GreenTheme, Spacing } from '@/constants/theme';

export default function WelcomeScreen() {
  const handleGetStarted = () => {
    router.push('/(tabs)/home' as any);
  };

  return (
    <View style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.content}>
          {/* Task Logo - Placeholder until tasklogo2.png is added */}
          <View style={styles.logoContainer}>
            <View style={styles.logoPlaceholder}>
              <ThemedText style={styles.checkEmoji}>✓</ThemedText>
              <ThemedText style={styles.placeholderText}>Task Manager</ThemedText>
            </View>
          </View>

          {/* Title */}
          <ThemedText type="title" style={styles.title}>
            Manage your daily tasks
          </ThemedText>

          {/* Subtitle */}
          <ThemedText style={styles.subtitle}>
            Personal Task Management App
          </ThemedText>

          {/* Get Started Button */}
          <Pressable
            style={({ pressed }) => [
              styles.button,
              pressed && styles.buttonPressed,
            ]}
            onPress={handleGetStarted}>
            <ThemedText style={styles.buttonText}>Get Started</ThemedText>
          </Pressable>
        </View>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: GreenTheme.white,
  },
  safeArea: {
    flex: 1,
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: Spacing.four,
    gap: Spacing.four,
  },
  logoContainer: {
    width: 300,
    height: 300,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.four,
  },
  logo: {
    width: 280,
    height: 280,
  },
  logoPlaceholder: {
    width: 280,
    height: 280,
    backgroundColor: GreenTheme.pale,
    borderRadius: 30,
    borderWidth: 3,
    borderColor: GreenTheme.primary,
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.two,
  },
  checkEmoji: {
    fontSize: 120,
    color: GreenTheme.primary,
  },
  placeholderText: {
    fontSize: 20,
    fontWeight: '700',
    color: GreenTheme.primary,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    textAlign: 'center',
    color: GreenTheme.text,
    marginTop: Spacing.three,
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
    color: GreenTheme.gray,
    marginBottom: Spacing.four,
  },
  button: {
    backgroundColor: GreenTheme.primary,
    paddingHorizontal: Spacing.six,
    paddingVertical: Spacing.three,
    borderRadius: Spacing.three,
    minWidth: 200,
    alignItems: 'center',
    marginTop: Spacing.three,
  },
  buttonPressed: {
    backgroundColor: GreenTheme.dark,
    opacity: 0.8,
  },
  buttonText: {
    color: GreenTheme.white,
    fontSize: 18,
    fontWeight: '600',
  },
});
