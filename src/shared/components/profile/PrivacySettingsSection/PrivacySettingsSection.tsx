import { useMemo, useState } from 'react';
import { View, TouchableOpacity, Switch, Modal, FlatList } from 'react-native';
import { AppText } from '@/shared/components/ui/AppText';
import { Ionicons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import { useTheme } from '@/shared/hooks/useTheme';
import { usePrivacyStore, type PrivacyOption } from '@/app/stores/privacyStore';
import { SettingsCard, SettingsRow } from '@/shared/components/profile/SettingsCard';
import { createStyles } from './styles';

const PRIVACY_LABELS: Record<string, string> = {
  everyone: 'profile.everyone',
  contacts: 'profile.contacts',
  nobody: 'profile.nobody',
};

function PickerModal({
  visible,
  title,
  options,
  value,
  onSelect,
  onClose,
}: {
  visible: boolean;
  title: string;
  options: string[];
  value: string;
  onSelect: (v: string) => void;
  onClose: () => void;
}) {
  const { t } = useTranslation();
  const c = useTheme();
  const styles = useMemo(() => createStyles(c), [c]);

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <TouchableOpacity style={styles.overlay} activeOpacity={1} onPress={onClose}>
        <TouchableOpacity activeOpacity={1} style={styles.sheet}>
          <View style={styles.handle} />
          <AppText style={styles.title} maxFontSizeMultiplier={1.3} weight="bold">
            {title}
          </AppText>
          <FlatList
            data={options}
            keyExtractor={(item) => item}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={styles.option}
                onPress={() => {
                  onSelect(item);
                  onClose();
                }}
              >
                <AppText style={[styles.optionText, item === value && styles.selected]} maxFontSizeMultiplier={1.3}>
                  {t(PRIVACY_LABELS[item] || item)}
                </AppText>
                {item === value && <Ionicons name="checkmark" size={20} color={c.primary} />}
              </TouchableOpacity>
            )}
          />
          <TouchableOpacity style={styles.cancelBtn} onPress={onClose}>
            <AppText style={styles.cancelText} maxFontSizeMultiplier={1.3} weight="bold">
              {t('common.cancel')}
            </AppText>
          </TouchableOpacity>
        </TouchableOpacity>
      </TouchableOpacity>
    </Modal>
  );
}

export function PrivacySettingsSection() {
  const { t } = useTranslation();
  const c = useTheme();
  const { lastSeen, profilePhoto, about, readReceipts, setLastSeen, setProfilePhoto, setAbout, setReadReceipts } =
    usePrivacyStore();
  const [picker, setPicker] = useState<{ field: string; title: string; value: string } | null>(null);
  const options = ['everyone', 'contacts', 'nobody'];

  const openPicker = (field: string, title: string, value: string) => setPicker({ field, title, value });
  const handleSelect = (v: string) => {
    if (!picker) return;
    const handlers: Record<string, (v: PrivacyOption) => void> = {
      lastSeen: setLastSeen,
      profilePhoto: setProfilePhoto,
      about: setAbout,
    };
    handlers[picker.field]?.(v as PrivacyOption);
  };

  const pickerConfig = picker
    ? {
        title: picker.title,
        value: picker.value,
        options,
      }
    : null;

  return (
    <SettingsCard title={t('profile.privacy')}>
      <SettingsRow
        label={t('profile.lastSeen')}
        description={t(PRIVACY_LABELS[lastSeen])}
        onPress={() => openPicker('lastSeen', t('profile.lastSeen'), lastSeen)}
      />
      <SettingsRow
        label={t('profile.profilePhoto')}
        description={t(PRIVACY_LABELS[profilePhoto])}
        onPress={() => openPicker('profilePhoto', t('profile.profilePhoto'), profilePhoto)}
      />
      <SettingsRow
        label={t('profile.about')}
        description={t(PRIVACY_LABELS[about])}
        onPress={() => openPicker('about', t('profile.about'), about)}
      />
      <SettingsRow
        label={t('profile.readReceipts')}
        right={
          <Switch
            value={readReceipts}
            onValueChange={setReadReceipts}
            trackColor={{ false: c.border, true: c.primary }}
          />
        }
        last
      />
      {pickerConfig && (
        <PickerModal
          visible={!!picker}
          title={pickerConfig.title}
          options={pickerConfig.options}
          value={pickerConfig.value}
          onSelect={handleSelect}
          onClose={() => setPicker(null)}
        />
      )}
    </SettingsCard>
  );
}
