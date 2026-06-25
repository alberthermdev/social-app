import { useMemo, useState } from 'react';
import { View, StyleSheet, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { AppText } from '@/shared/components/ui/AppText';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useTranslation } from 'react-i18next';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Input } from '@/shared/components/ui/Input';
import { Button } from '@/shared/components/ui/Button';
import { registerSchema, RegisterFormData } from '@/shared/utils/validators';
import { useAuthStore } from '@/app/stores/authStore';
import { useTheme } from '@/shared/hooks/useTheme';
import { ConfirmModal } from '@/shared/components/feedback';
import { spacing, fontSize } from '@/shared/theme/spacing';
import { AuthStackParamList } from '@/app/navigation/types';

type Props = {
  navigation: NativeStackNavigationProp<AuthStackParamList, 'Register'>;
};

export function RegisterScreen({ navigation }: Props) {
  const { t } = useTranslation();
  const c = useTheme();
  const useCases = useAuthStore((s) => s.useCases);
  const [alert, setAlert] = useState<{ title: string; message: string } | null>(null);
  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: { name: '', email: '', password: '' },
  });

  const styles = useMemo(
    () =>
      StyleSheet.create({
        container: { flex: 1, backgroundColor: c.background },
        safeArea: { flex: 1 },
        scrollContent: { flexGrow: 1, justifyContent: 'center', padding: spacing.xxl },
        header: { alignItems: 'center', marginBottom: spacing.xxxl },
        subtitle: { fontSize: fontSize.md, color: c.textSecondary },
        registerButton: { marginTop: spacing.sm },
        footer: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center', marginTop: spacing.xxl },
        footerText: { color: c.textSecondary, fontSize: fontSize.md },
      }),
    [c],
  );

  const onSubmit = async (data: RegisterFormData) => {
    try {
      const user = await useCases.register(data);
      useAuthStore.getState().setUser(user);
    } catch (error) {
      setAlert({ title: t('auth.registerFailed'), message: (error as Error).message });
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 0}
    >
      <SafeAreaView edges={['top', 'bottom']} style={styles.safeArea}>
        <ScrollView contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled">
          <View style={styles.header}>
            <AppText style={styles.subtitle}>{t('auth.createAccount')}</AppText>
          </View>

          <Controller
            control={control}
            name="name"
            render={({ field: { onChange, value } }) => (
              <Input
                label={t('auth.fullName')}
                placeholder={t('auth.namePlaceholder')}
                value={value}
                onChangeText={onChange}
                error={errors.name?.message}
                autoCapitalize="words"
              />
            )}
          />

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

          <Controller
            control={control}
            name="password"
            render={({ field: { onChange, value } }) => (
              <Input
                label={t('auth.password')}
                placeholder={t('auth.passwordPlaceholderRegister')}
                value={value}
                onChangeText={onChange}
                error={errors.password?.message}
                secureTextEntry
              />
            )}
          />

          <Button
            title={t('auth.register')}
            onPress={handleSubmit(onSubmit)}
            loading={isSubmitting}
            size="lg"
            style={styles.registerButton}
          />

          <View style={styles.footer}>
            <AppText style={styles.footerText}>{t('auth.hasAccount')}</AppText>
            <Button title={t('auth.login')} onPress={() => navigation.goBack()} variant="ghost" size="sm" />
          </View>
        </ScrollView>
      </SafeAreaView>

      <ConfirmModal visible={!!alert} title={alert?.title} message={alert?.message} onDismiss={() => setAlert(null)} />
    </KeyboardAvoidingView>
  );
}
