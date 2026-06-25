import { useMemo } from 'react';
import { Modal, View, TouchableOpacity, StyleSheet } from 'react-native';
import { AppText } from '@/shared/components/ui/AppText';
import { useTheme } from '@/shared/hooks/useTheme';
import { spacing, fontSize, borderRadius } from '@/shared/theme/spacing';

interface AlertButton {
  text: string;
  onPress?: () => void;
  style?: 'cancel' | 'destructive' | 'default';
}

interface ConfirmModalProps {
  visible: boolean;
  title?: string;
  message?: string;
  buttons?: AlertButton[];
  onDismiss?: () => void;
}

export function ConfirmModal({ visible, title, message, buttons, onDismiss }: ConfirmModalProps) {
  const c = useTheme();
  const styles = useMemo(() => createStyles(c), [c]);

  if (!visible) return null;

  return (
    <Modal visible transparent animationType="fade" onRequestClose={onDismiss}>
      <TouchableOpacity style={styles.overlay} activeOpacity={1} onPress={onDismiss}>
        <TouchableOpacity activeOpacity={1} style={styles.dialog} onPress={() => {}}>
          {title ? (
            <AppText style={styles.title} weight="bold">
              {title}
            </AppText>
          ) : null}
          {message ? <AppText style={styles.message}>{message}</AppText> : null}
          <View style={styles.buttonRow}>
            {(buttons ?? [{ text: 'OK', onPress: onDismiss }]).map((btn, i) => (
              <TouchableOpacity
                key={i}
                style={[
                  styles.button,
                  btn.style === 'destructive' && styles.buttonDestructive,
                  btn.style === 'cancel' && styles.buttonCancel,
                  i > 0 && styles.buttonBorder,
                ]}
                onPress={() => {
                  btn.onPress?.();
                }}
                activeOpacity={0.7}
              >
                <AppText
                  style={[
                    styles.buttonText,
                    btn.style === 'destructive' && styles.buttonTextDestructive,
                    btn.style === 'cancel' && styles.buttonTextCancel,
                  ]}
                  weight="bold"
                >
                  {btn.text}
                </AppText>
              </TouchableOpacity>
            ))}
          </View>
        </TouchableOpacity>
      </TouchableOpacity>
    </Modal>
  );
}

function createStyles(c: ReturnType<typeof useTheme>) {
  return StyleSheet.create({
    overlay: {
      flex: 1,
      backgroundColor: c.overlay,
      justifyContent: 'center',
      alignItems: 'center',
      padding: spacing.xxl,
    },
    dialog: {
      backgroundColor: c.surface,
      borderRadius: borderRadius.lg,
      width: '100%',
      maxWidth: 320,
      paddingTop: spacing.xxl,
    },
    title: {
      fontSize: fontSize.lg,
      color: c.text,
      textAlign: 'center',
      marginBottom: spacing.sm,
      paddingHorizontal: spacing.xxl,
    },
    message: {
      fontSize: fontSize.md,
      color: c.textSecondary,
      textAlign: 'center',
      marginBottom: spacing.xxl,
      lineHeight: 20,
      paddingHorizontal: spacing.xxl,
    },
    buttonRow: {
      flexDirection: 'row',
      borderTopWidth: 0.5,
      borderTopColor: c.border,
    },
    button: {
      flex: 1,
      paddingVertical: spacing.md,
      alignItems: 'center',
      justifyContent: 'center',
    },
    buttonDestructive: {},
    buttonCancel: {},
    buttonBorder: {
      borderLeftWidth: 0.5,
      borderLeftColor: c.border,
    },
    buttonText: {
      fontSize: fontSize.md,
      color: c.primary,
    },
    buttonTextDestructive: {
      color: c.error,
    },
    buttonTextCancel: {
      color: c.textSecondary,
    },
  });
}
