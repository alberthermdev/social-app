import { useState, useMemo } from 'react';
import { View, StyleSheet, KeyboardAvoidingView, Platform } from 'react-native';
import { AppText } from '@/shared/components/ui/AppText';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useTranslation } from 'react-i18next';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Input } from '@/shared/components/ui/Input';
import { Button } from '@/shared/components/ui/Button';
import { forgotPasswordSchema, ForgotPasswordFormData } from '@/shared/utils/validators';
import { useAuthStore } from '@/app/stores/authStore';
import { useTheme } from '@/shared/hooks/useTheme';
import { ConfirmModal } from '@/shared/components/feedback';
import { spacing, fontSize, fontFamily } from '@/shared/theme/spacing';
import { AuthStackParamList } from '@/app/navigation/types';

type Props = {
  navigation: NativeStackNavigationProp<AuthStackParamList, 'ForgotPassword'>;
};

export function ForgotPasswordScreen({ navigation }: Props) {
  const { t } = useTranslation();
  const c = useTheme();
  const useCases = useAuthStore((s) => s.useCases);
  const [alert, setAlert] = useState<{ title: string; message: string } | null>(null);
  const [sent, setSent] = useState(false);
  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ForgotPasswordFormData>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: { email: '' },
  });

  const styles = useMemo(
    () =>
      StyleSheet.create({
        container: { flex: 1, backgroundColor: c.background },
        safeArea: { flex: 1 },
        content: { flex: 1, justifyContent: 'center', padding: spacing.xxl },
        title: {
          fontSize: fontSize.xl,
          fontFamily: fontFamily.bold,
          color: c.text,
          marginBottom: spacing.sm,
          textAlign: 'center',
        },
        description: { fontSize: fontSize.md, color: c.textSecondary, textAlign: 'center', marginBottom: spacing.xxl },
        backButton: { marginTop: spacing.lg, alignSelf: 'center' },
      }),
    [c],
  );

  const onSubmit = async (data: ForgotPasswordFormData) => {
    try {
      await useCases.sendPasswordReset(data.email);
      setSent(true);
      setAlert({ title: t('auth.emailSent'), message: t('auth.emailSentMessage') });
    } catch (error) {
      setAlert({ title: t('auth.error'), message: (error as Error).message });
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 0}
    >
      <SafeAreaView edges={['top', 'bottom']} style={styles.safeArea}>
        <View style={styles.content}>
          <AppText style={styles.title}>{t('auth.resetPassword')}</AppText>
          <AppText style={styles.description}>{t('auth.resetDescription')}</AppText>

          <Controller
            control={control}
            name="email"
            render={({ field: { onChange, value } }) => (
              <Input
                label={t('auth.email')}
                placeholder={t('auth.emailPlaceholder')}
                value={value}
                onChangeText={onChange}
                error={errors.email?.message}
                keyboardType="email-address"
                autoCapitalize="none"
              />
            )}
          />

          <Button
            title={sent ? t('auth.resendEmail') : t('auth.sendResetLink')}
            onPress={handleSubmit(onSubmit)}
            loading={isSubmitting}
            size="lg"
          />

          <Button
            title={t('auth.backToLogin')}
            onPress={() => navigation.goBack()}
            variant="ghost"
            size="sm"
            style={styles.backButton}
          />
        </View>
      </SafeAreaView>

      <ConfirmModal visible={!!alert} title={alert?.title} message={alert?.message} onDismiss={() => setAlert(null)} />
    </KeyboardAvoidingView>
  );
}
