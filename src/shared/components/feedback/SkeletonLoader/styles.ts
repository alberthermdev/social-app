import { StyleSheet } from 'react-native';
import type { ThemeColors } from '@/shared/theme/colors';

export const createStyles = (c: { [K in keyof ThemeColors]: string }) =>
  StyleSheet.create({
    skeleton: { backgroundColor: c.skeleton },
  });

export const chatListStyles = StyleSheet.create({
  container: { paddingHorizontal: 16 },
  row: { flexDirection: 'row', alignItems: 'center', paddingVertical: 12 },
  col: { flex: 1, marginLeft: 12 },
});
