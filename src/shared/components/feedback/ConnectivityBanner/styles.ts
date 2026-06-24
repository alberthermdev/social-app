import { StyleSheet } from 'react-native';
import { colors } from '@/shared/theme/colors';

export const styles = StyleSheet.create({
  banner: {
    backgroundColor: colors.dark.error,
    paddingVertical: 6,
    alignItems: 'center',
  },
  text: { color: '#FFFFFF', fontSize: 13 },
});
