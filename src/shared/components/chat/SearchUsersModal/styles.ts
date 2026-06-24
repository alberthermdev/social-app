import { StyleSheet, Platform } from 'react-native';
import { spacing, fontSize } from '@/shared/theme/spacing';

export const styles = StyleSheet.create({
  modalContainer: { flex: 1 },
  modal: { flex: 1, paddingTop: Platform.OS === 'ios' ? 50 : 0 },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
  },
  input: {
    flex: 1,
    color: '#FFFFFF',
    fontSize: fontSize.lg,
    marginLeft: spacing.md,
    paddingVertical: spacing.sm,
  },
  userItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    borderBottomWidth: 0.5,
    borderBottomColor: '#E9EDEF',
  },
  userInfo: { flex: 1, marginLeft: spacing.md },
  userName: { fontSize: fontSize.md },
  empty: { alignItems: 'center', marginTop: 80 },
  emptyContainer: { flexGrow: 1 },
  emptyText: { fontSize: fontSize.sm, marginTop: spacing.md },
});
