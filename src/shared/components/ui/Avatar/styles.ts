import { StyleSheet } from 'react-native';
import { colors } from '@/shared/theme/colors';
import { borderRadius } from '@/shared/theme/spacing';

export const styles = StyleSheet.create({
  container: {
    position: 'relative',
  },
  image: {
    borderRadius: borderRadius.full,
  },
  placeholder: {
    backgroundColor: colors.light.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  initials: {
    color: '#FFFFFF',
  },
  statusDot: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    borderColor: '#FFFFFF',
  },
});
