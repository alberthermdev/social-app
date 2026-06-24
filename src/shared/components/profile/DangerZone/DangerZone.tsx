import { useMemo, useState } from 'react';
import { View, TextInput, TouchableOpacity, Modal } from 'react-native';
import { AppText } from '@/shared/components/ui/AppText';
import { Ionicons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import { useTheme } from '@/shared/hooks/useTheme';
import { SettingsCard, SettingsRow } from '@/shared/components/profile/SettingsCard';
import { createStyles } from './styles';

interface DangerZoneProps {
  onLogout: () => void;
  onDeleteAccount: () => void;
  onExportData: () => void;
  onClearCache: () => void;
  cacheSize?: string;
}

export function DangerZone({ onLogout, onDeleteAccount, onExportData, onClearCache, cacheSize }: DangerZoneProps) {
  const { t } = useTranslation();
  const c = useTheme();
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [confirmText, setConfirmText] = useState('');

  const styles = useMemo(() => createStyles(c), [c]);

  const handleDeleteConfirm = () => {
    if (confirmText === 'ELIMINAR') {
      setShowDeleteModal(false);
      onDeleteAccount();
    }
  };

  return (
    <SettingsCard title={t('profile.dataManagement')}>
      <SettingsRow
        label={t('profile.exportData')}
        onPress={onExportData}
        right={<Ionicons name="download-outline" size={20} color={c.textSecondary} />}
      />
      <SettingsRow
        label={t('profile.clearCache')}
        description={cacheSize ? `${t('profile.currentCache')}: ${cacheSize}` : undefined}
        onPress={onClearCache}
        right={<Ionicons name="trash-outline" size={20} color={c.textSecondary} />}
      />
      <SettingsRow
        label={t('profile.logout')}
        onPress={onLogout}
        right={<Ionicons name="log-out-outline" size={20} color={c.error} />}
      />
      <SettingsRow
        label={t('profile.deleteAccount')}
        onPress={() => setShowDeleteModal(true)}
        right={<Ionicons name="warning-outline" size={20} color={c.error} />}
        last
      />
      <Modal
        visible={showDeleteModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowDeleteModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <AppText style={styles.modalTitle} maxFontSizeMultiplier={1.3} weight="bold">
              {t('profile.deleteAccountTitle')}
            </AppText>
            <AppText style={styles.modalDesc} maxFontSizeMultiplier={1.3}>
              {t('profile.deleteAccountDesc')}
            </AppText>
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
    </SettingsCard>
  );
}
