import { useMemo } from 'react';
import { View, StyleSheet, Alert, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { AppText } from '@/shared/components/ui/AppText';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useTranslation } from 'react-i18next';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Input } from '@/shared/components/ui/Input';
import { Button } from '@/shared/components/ui/Button';
import { loginSchema, LoginFormData } from '@/shared/utils/validators';
import { useAuthStore } from '@/app/stores/authStore';
import { useTheme } from '@/shared/hooks/useTheme';
import { spacing, fontSize, fontFamily } from '@/shared/theme/spacing';
import { AuthStackParamList } from '@/app/navigation/types';

type Props = {
  navigation: NativeStackNavigationProp<AuthStackParamList, 'Login'>;
};

export function LoginScreen({ navigation }: Props) {
  const { t } = useTranslation();
  const c = useTheme();
  const { useCases } = useAuthStore();
  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: '', password: '' },
  });

  const styles = useMemo(
    () =>
      StyleSheet.create({
        container: { flex: 1, backgroundColor: c.background },
        safeArea: { flex: 1 },
        scrollContent: { flexGrow: 1, justifyContent: 'center', padding: spacing.xxl },
        header: { alignItems: 'center', marginBottom: spacing.xxxl },
        appName: { fontSize: fontSize.xxl, fontFamily: fontFamily.bold, color: c.primary, marginBottom: spacing.sm },
        subtitle: { fontSize: fontSize.md, color: c.textSecondary },
        loginButton: { marginTop: spacing.sm },
        forgotButton: { marginTop: spacing.sm, alignSelf: 'center' },
        footer: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center', marginTop: spacing.xxl },
        footerText: { color: c.textSecondary, fontSize: fontSize.md },
      }),
    [c],
  );

  const onSubmit = async (data: LoginFormData) => {
    try {
      const user = await useCases.login(data);
      useAuthStore.getState().setUser(user);
    } catch (error) {
      Alert.alert(t('auth.loginFailed'), (error as Error).message);
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
            <AppText style={styles.appName}>{t('app.name')}</AppText>
            <AppText style={styles.subtitle}>{t('auth.welcomeBack')}</AppText>
          </View>

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
                placeholder={t('auth.passwordPlaceholder')}
                value={value}
                onChangeText={onChange}
                error={errors.password?.message}
                secureTextEntry
              />
            )}
          />

          <Button
            title={t('auth.login')}
            onPress={handleSubmit(onSubmit)}
            loading={isSubmitting}
            size="lg"
            style={styles.loginButton}
          />

          <Button
            title={t('auth.forgotPassword')}
            onPress={() => navigation.navigate('ForgotPassword')}
            variant="ghost"
            size="sm"
            style={styles.forgotButton}
          />

          <View style={styles.footer}>
            <AppText style={styles.footerText}>{t('auth.noAccount')}</AppText>
            <Button
              title={t('auth.signUp')}
              onPress={() => navigation.navigate('Register')}
              variant="ghost"
              size="sm"
            />
          </View>
        </ScrollView>
      </SafeAreaView>
    </KeyboardAvoidingView>
  );
}
