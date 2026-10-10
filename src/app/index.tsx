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
          {/* Task Logo or Green Placeholder */}
          <View style={styles.logoContainer}>
            {/* Green placeholder - will be replaced when tasklogo.png is added */}
            <View style={styles.logoPlaceholder}>
              <ThemedText style={styles.logoEmoji}>✓</ThemedText>
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
    width: 200,
    height: 200,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.four,
  },
  logoPlaceholder: {
    width: 150,
    height: 150,
    backgroundColor: GreenTheme.primary,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoEmoji: {
    fontSize: 80,
    color: GreenTheme.white,
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
