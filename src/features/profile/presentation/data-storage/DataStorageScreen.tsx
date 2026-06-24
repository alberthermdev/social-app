import { useState, useMemo } from 'react';
import { ScrollView, View, TextInput, TouchableOpacity, Alert, Modal } from 'react-native';
import { AppText } from '@/shared/components/ui/AppText';
import { Ionicons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import { useTheme } from '@/shared/hooks/useTheme';
import { useAuthStore } from '@/app/stores/authStore';
import { FirestoreProfileRepository } from '@/features/profile/infrastructure/FirestoreProfileRepository';
import { SettingsCard, SettingsRow } from '@/shared/components/profile';
import { createStyles } from './styles';

export function DataStorageScreen() {
  const { t } = useTranslation();
  const c = useTheme();
  const { user, useCases: authUseCases } = useAuthStore();
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [confirmText, setConfirmText] = useState('');
  const styles = useMemo(() => createStyles(c), [c]);

  const handleExportData = async () => {
    if (!user) return;
    try {
      await FirestoreProfileRepository.exportData(user.id);
      Alert.alert(t('profile.success'), t('profile.exportData'));
    } catch {
      Alert.alert(t('profile.error'), 'Export failed');
    }
  };

  const handleClearCache = async () => {
    await FirestoreProfileRepository.clearCache();
    Alert.alert(t('profile.success'), t('profile.clearCache'));
  };

  const handleDeleteAccount = async () => {
    if (!user) return;
    try {
      await FirestoreProfileRepository.deleteAccount(user.id);
      await authUseCases.logout();
      useAuthStore.getState().reset();
    } catch {
      Alert.alert('Error', 'Failed to delete account');
    }
  };

  const handleDeleteConfirm = () => {
    if (confirmText === 'ELIMINAR') {
      setShowDeleteModal(false);
      handleDeleteAccount();
    }
  };

  return (
    <ScrollView style={{ flex: 1, backgroundColor: c.background }} contentContainerStyle={{ paddingBottom: 32 }}>
      <SettingsCard title={t('profile.dataManagement')}>
        <SettingsRow
          label={t('profile.exportData')}
          onPress={handleExportData}
          right={<Ionicons name="download-outline" size={20} color={c.textSecondary} />}
        />
        <SettingsRow
          label={t('profile.clearCache')}
          onPress={handleClearCache}
          right={<Ionicons name="trash-outline" size={20} color={c.textSecondary} />}
        />
        <SettingsRow
          label={t('profile.deleteAccount')}
          onPress={() => setShowDeleteModal(true)}
          right={<Ionicons name="warning-outline" size={20} color={c.error} />}
          last
        />
      </SettingsCard>

      <Modal
        visible={showDeleteModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowDeleteModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <AppText style={styles.modalTitle} weight="bold">
              {t('profile.deleteAccountTitle')}
            </AppText>
            <AppText style={styles.modalDesc}>{t('profile.deleteAccountDesc')}</AppText>
            <TextInput
              style={styles.input}
              value={confirmText}
              onChangeText={setConfirmText}
              placeholder="ELIMINAR"
              placeholderTextColor={c.textTertiary}
              autoCapitalize="characters"
            />
            <TouchableOpacity
              style={[styles.deleteBtn, confirmText !== 'ELIMINAR' && styles.deleteBtnDisabled]}
              onPress={handleDeleteConfirm}
              disabled={confirmText !== 'ELIMINAR'}
            >
              <AppText style={styles.deleteBtnText} weight="bold">
                {t('profile.deleteConfirm')}
              </AppText>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.cancelBtn}
              onPress={() => {
                setShowDeleteModal(false);
                setConfirmText('');
              }}
            >
              <AppText style={styles.cancelText}>{t('common.cancel')}</AppText>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
}
