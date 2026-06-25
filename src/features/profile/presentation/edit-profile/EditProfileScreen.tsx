import { useState, useMemo } from 'react';
import { ScrollView, View, TextInput, TouchableOpacity, Modal } from 'react-native';
import { AppText } from '@/shared/components/ui/AppText';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useTranslation } from 'react-i18next';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuthStore } from '@/app/stores/authStore';
import { useTheme } from '@/shared/hooks/useTheme';
import { profileSchema, ProfileFormData } from '@/shared/utils/validators';
import { FirestoreProfileRepository } from '@/features/profile/infrastructure/FirestoreProfileRepository';
import { SettingsCard, ProfileAvatarMenu } from '@/shared/components/profile';
import { ConfirmModal } from '@/shared/components/feedback';
import { STATUS_PRESETS } from '@/shared/constants';
import * as ImagePicker from 'expo-image-picker';
import { Avatar } from '@/shared/components/ui/Avatar';
import { createStyles } from './styles';

export function EditProfileScreen() {
  const { t } = useTranslation();
  const c = useTheme();
  const user = useAuthStore((s) => s.user);
  const setUser = useAuthStore((s) => s.setUser);
  const [about, setAbout] = useState(user?.about || '');
  const [username, setUsername] = useState(user?.username || '');
  const [usernameAvailable, setUsernameAvailable] = useState<boolean | null>(null);
  const [avatarMenuVisible, setAvatarMenuVisible] = useState(false);
  const [showStatusPicker, setShowStatusPicker] = useState(false);
  const [alert, setAlert] = useState<{ title: string; message: string } | null>(null);
  const styles = useMemo(() => createStyles(c), [c]);

  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    defaultValues: { name: user?.name || '', about: user?.about || '' },
  });

  const handleSaveProfile = async (data: ProfileFormData) => {
    if (!user) return;
    try {
      await FirestoreProfileRepository.updateProfile(user.id, {
        name: data.name,
        about: data.about || '',
        username: username || undefined,
      });
      setUser({ ...user, name: data.name, about: data.about || '' });
      setAlert({ title: t('profile.success'), message: t('profile.profileUpdated') });
    } catch {
      setAlert({ title: t('profile.error'), message: t('profile.updateFailed') });
    }
  };

  const checkUsername = async (value: string) => {
    const v = value.replace(/[^a-zA-Z0-9_]/g, '');
    setUsername(v);
    if (v.length < 3) {
      setUsernameAvailable(null);
      return;
    }
    const available = await FirestoreProfileRepository.isUsernameAvailable(v);
    setUsernameAvailable(available);
  };

  const handlePickAvatar = async () => {
    setAvatarMenuVisible(false);
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      quality: 0.8,
    });
    if (!result.canceled && user) {
      try {
        const url = await FirestoreProfileRepository.uploadAvatar(user.id, result.assets[0].uri);
        setUser({ ...user, photoURL: url });
      } catch {
        setAlert({ title: 'Error', message: 'Failed to upload avatar' });
      }
    }
  };

  const handleCameraAvatar = async () => {
    setAvatarMenuVisible(false);
    const permission = await ImagePicker.requestCameraPermissionsAsync();
    if (!permission.granted) return;
    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      quality: 0.8,
    });
    if (!result.canceled && user) {
      try {
        const url = await FirestoreProfileRepository.uploadAvatar(user.id, result.assets[0].uri);
        setUser({ ...user, photoURL: url });
      } catch {
        setAlert({ title: 'Error', message: 'Failed to upload avatar' });
      }
    }
  };

  const handleDeleteAvatar = async () => {
    setAvatarMenuVisible(false);
    if (!user) return;
    try {
      await FirestoreProfileRepository.deleteAvatar(user.id);
      setUser({ ...user, photoURL: null });
    } catch {
      setAlert({ title: 'Error', message: 'Failed to delete avatar' });
    }
  };

  const selectStatus = (status: string) => {
    setAbout(status);
    setShowStatusPicker(false);
  };

  const avatarOptions = [
    { label: t('profile.changePhoto'), icon: 'image-outline' as const, onPress: handlePickAvatar },
    { label: 'Camera', icon: 'camera-outline' as const, onPress: handleCameraAvatar },
    { label: t('profile.deletePhoto'), icon: 'trash-outline' as const, onPress: handleDeleteAvatar, destructive: true },
  ];

  return (
    <SafeAreaView edges={['bottom']} style={[styles.container, { backgroundColor: c.background }]}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <TouchableOpacity style={styles.avatarSection} onPress={() => setAvatarMenuVisible(true)} activeOpacity={0.8}>
          <Avatar photoURL={user?.photoURL} name={user?.name || ''} size="xl" />
          <AppText style={{ color: c.primary, fontSize: 13, marginTop: 12 }}>{t('profile.changePhoto')}</AppText>
        </TouchableOpacity>

        <ProfileAvatarMenu
          visible={avatarMenuVisible}
          options={avatarOptions}
          onClose={() => setAvatarMenuVisible(false)}
        />

        <ConfirmModal
          visible={!!alert}
          title={alert?.title}
          message={alert?.message}
          onDismiss={() => setAlert(null)}
        />

        <SettingsCard title={t('profile.displayName')}>
          <View style={{ padding: 12 }}>
            <Controller
              control={control}
              name="name"
              render={({ field: { onChange, value } }) => (
                <TextInput
                  style={styles.input}
                  value={value}
                  onChangeText={onChange}
                  placeholder={t('profile.namePlaceholder')}
                  placeholderTextColor={c.textTertiary}
                  maxLength={50}
                />
              )}
            />
            {errors.name && (
              <AppText style={{ color: c.error, fontSize: 11, marginTop: 4 }}>{errors.name.message}</AppText>
            )}
          </View>
        </SettingsCard>

        <SettingsCard title={t('profile.about')}>
          <TouchableOpacity style={{ padding: 12 }} onPress={() => setShowStatusPicker(true)}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
              <AppText style={{ fontSize: 15, color: c.text }}>
                {about || user?.about || t('profile.aboutPlaceholder')}
              </AppText>
              <AppText style={{ fontSize: 11, color: c.textSecondary }}>{`${about.length || 0}/150`}</AppText>
            </View>
          </TouchableOpacity>
          <TextInput
            style={[styles.textarea, { marginHorizontal: 12, marginBottom: 12 }]}
            value={about}
            onChangeText={setAbout}
            placeholder={t('profile.aboutPlaceholder')}
            placeholderTextColor={c.textTertiary}
            maxLength={150}
            multiline
          />
        </SettingsCard>

        <SettingsCard title={t('profile.username')}>
          <View style={{ padding: 12 }}>
            <View style={styles.usernameRow}>
              <AppText style={styles.usernamePrefix}>@</AppText>
              <TextInput
                style={{
                  flex: 1,
                  borderWidth: 1,
                  borderColor: c.border,
                  borderRadius: 12,
                  padding: 12,
                  fontSize: 15,
                  color: c.text,
                }}
                value={username}
                onChangeText={checkUsername}
                placeholder={t('profile.usernamePlaceholder')}
                placeholderTextColor={c.textTertiary}
                autoCapitalize="none"
                autoCorrect={false}
                maxLength={20}
              />
            </View>
            {username.length >= 3 && (
              <AppText style={[styles.usernameCheck, usernameAvailable ? styles.usernameOk : styles.usernameBad]}>
                {usernameAvailable ? '✓ Available' : '✗ Taken'}
              </AppText>
            )}
          </View>
        </SettingsCard>

        <TouchableOpacity style={styles.saveBtn} onPress={handleSubmit(handleSaveProfile)} activeOpacity={0.8}>
          <AppText style={styles.saveBtnText} weight="bold">
            {isSubmitting ? t('common.loading') : t('profile.saveChanges')}
          </AppText>
        </TouchableOpacity>

        <Modal
          visible={showStatusPicker}
          transparent
          animationType="slide"
          onRequestClose={() => setShowStatusPicker(false)}
        >
          <TouchableOpacity
            style={styles.statusPickerOverlay}
            activeOpacity={1}
            onPress={() => setShowStatusPicker(false)}
          >
            <TouchableOpacity activeOpacity={1} style={styles.statusPickerSheet}>
              <View style={styles.statusPickerHandle} />
              <AppText style={styles.statusPickerTitle} weight="bold">
                {t('profile.about')}
              </AppText>
              {STATUS_PRESETS.map((status) => (
                <TouchableOpacity key={status} style={styles.statusOption} onPress={() => selectStatus(status)}>
                  <AppText style={[styles.statusOptionText, about === status && styles.statusActive]}>{status}</AppText>
                </TouchableOpacity>
              ))}
              <TextInput
                style={styles.customStatusInput}
                value={about}
                onChangeText={(v) => setAbout(v)}
                placeholder={t('profile.aboutPlaceholder')}
                placeholderTextColor={c.textTertiary}
                maxLength={150}
              />
            </TouchableOpacity>
          </TouchableOpacity>
        </Modal>
      </ScrollView>
    </SafeAreaView>
  );
}
