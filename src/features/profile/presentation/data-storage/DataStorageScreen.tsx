import { useState, useMemo } from 'react';
import { ScrollView, View, TextInput, TouchableOpacity, Modal } from 'react-native';
import { AppText } from '@/shared/components/ui/AppText';
import { Ionicons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '@/shared/hooks/useTheme';
import { useAuthStore } from '@/app/stores/authStore';
import { FirestoreProfileRepository } from '@/features/profile/infrastructure/FirestoreProfileRepository';
import { SettingsCard, SettingsRow } from '@/shared/components/profile';
import { ConfirmModal } from '@/shared/components/feedback';
import { spacing } from '@/shared/theme/spacing';
import { createStyles } from './styles';

export function DataStorageScreen() {
  const { t } = useTranslation();
  const c = useTheme();
  const user = useAuthStore((s) => s.user);
  const authUseCases = useAuthStore((s) => s.useCases);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [confirmText, setConfirmText] = useState('');
  const [alert, setAlert] = useState<{ title: string; message: string } | null>(null);
  const styles = useMemo(() => createStyles(c), [c]);

  const handleExportData = async () => {
    if (!user) return;
    try {
      await FirestoreProfileRepository.exportData(user.id);
      setAlert({ title: t('profile.success'), message: t('profile.exportData') });
    } catch {
      setAlert({ title: t('profile.error'), message: 'Export failed' });
    }
  };

  const handleClearCache = async () => {
    await FirestoreProfileRepository.clearCache();
    setAlert({ title: t('profile.success'), message: t('profile.clearCache') });
  };

  const handleDeleteAccount = async () => {
    if (!user) return;
    try {
      await FirestoreProfileRepository.deleteAccount(user.id);
      await authUseCases.logout();
      useAuthStore.getState().reset();
    } catch {
      setAlert({ title: 'Error', message: 'Failed to delete account' });
    }
  };

  const handleDeleteConfirm = () => {
    if (confirmText === 'ELIMINAR') {
      setShowDeleteModal(false);
      handleDeleteAccount();
    }
  };

  return (
    <SafeAreaView edges={['bottom']} style={{ flex: 1, backgroundColor: c.background }}>
      <ScrollView contentContainerStyle={{ paddingTop: spacing.lg, paddingBottom: spacing.xxxl }}>
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

        <ConfirmModal
          visible={!!alert}
          title={alert?.title}
          message={alert?.message}
          onDismiss={() => setAlert(null)}
        />
      </ScrollView>
    </SafeAreaView>
  );
}
