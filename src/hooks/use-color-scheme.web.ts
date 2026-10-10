import { useSyncExternalStore } from 'react';
import { useColorScheme as useRNColorScheme } from 'react-native';

/**
 * To support static rendering, this value needs to be re-calculated on the client side for web
 */
export function useColorScheme() {
  const colorScheme = useRNColorScheme();

  // Use useSyncExternalStore to handle hydration mismatch
  const isClient = useSyncExternalStore(
    () => () => {},
    () => true,
    () => false
  );

  if (isClient) {
    return colorScheme;
  }

  return 'light';
}
