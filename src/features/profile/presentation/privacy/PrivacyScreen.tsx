import { useState, useMemo } from 'react';
import { ScrollView, View, Switch, Modal, FlatList, TouchableOpacity } from 'react-native';
import { AppText } from '@/shared/components/ui/AppText';
import { Ionicons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import { useTheme } from '@/shared/hooks/useTheme';
import { usePrivacyStore, type PrivacyOption } from '@/app/stores/privacyStore';
import { SettingsCard, SettingsRow } from '@/shared/components/profile';
import { spacing, fontSize, borderRadius } from '@/shared/theme/spacing';
import { createPickerStyles } from './styles';

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
  const s = useMemo(() => createPickerStyles(c), [c]);

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <TouchableOpacity style={s.overlay} activeOpacity={1} onPress={onClose}>
        <TouchableOpacity activeOpacity={1} style={s.sheet}>
          <View style={s.handle} />
          <AppText style={s.title} weight="bold">
            {title}
          </AppText>
          <FlatList
            data={options}
            keyExtractor={(item) => item}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={s.option}
                onPress={() => {
                  onSelect(item);
                  onClose();
                }}
              >
                <AppText style={[s.optionText, item === value && s.selected]}>
                  {t(PRIVACY_LABELS[item] || item)}
                </AppText>
                {item === value && <Ionicons name="checkmark" size={20} color={c.primary} />}
              </TouchableOpacity>
            )}
          />
          <TouchableOpacity style={s.cancelBtn} onPress={onClose}>
            <AppText style={s.cancelText} weight="bold">
              {t('common.cancel')}
            </AppText>
          </TouchableOpacity>
        </TouchableOpacity>
      </TouchableOpacity>
    </Modal>
  );
}

export function PrivacyScreen() {
  const { t } = useTranslation();
  const c = useTheme();
  const {
    lastSeen,
    profilePhoto,
    about,
    readReceipts,
    blockedUsers,
    setLastSeen,
    setProfilePhoto,
    setAbout,
    setReadReceipts,
    removeBlockedUser,
  } = usePrivacyStore();
  const [picker, setPicker] = useState<{ field: string; title: string; value: string } | null>(null);
  const options = ['everyone', 'contacts', 'nobody'];
  const [showBlocked, setShowBlocked] = useState(false);

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

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: c.background }}
      contentContainerStyle={{ paddingBottom: spacing.xxxl }}
    >
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
      </SettingsCard>

      <SettingsCard title={t('profile.blockedUsers')}>
        <TouchableOpacity
          style={{ padding: spacing.lg, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}
          onPress={() => setShowBlocked(true)}
        >
          <AppText style={{ fontSize: fontSize.md, color: c.text }}>
            {blockedUsers.length > 0
              ? `${blockedUsers.length} ${t('profile.blockedUsers').toLowerCase()}`
              : t('profile.none')}
          </AppText>
          <Ionicons name="chevron-forward" size={18} color={c.textTertiary} />
        </TouchableOpacity>
      </SettingsCard>

      <Modal visible={showBlocked} transparent animationType="slide" onRequestClose={() => setShowBlocked(false)}>
        <View style={{ flex: 1, backgroundColor: c.overlay }}>
          <View
            style={{
              flex: 1,
              marginTop: 100,
              backgroundColor: c.surface,
              borderTopLeftRadius: borderRadius.xl,
              borderTopRightRadius: borderRadius.xl,
              paddingTop: spacing.md,
            }}
          >
            <View
              style={{
                width: 36,
                height: 4,
                borderRadius: 2,
                backgroundColor: c.textTertiary,
                alignSelf: 'center',
                marginBottom: spacing.md,
              }}
            />
            <AppText
              style={{ fontSize: fontSize.lg, color: c.text, textAlign: 'center', marginBottom: spacing.md }}
              weight="bold"
            >
              {t('profile.blockedUsers')}
            </AppText>
            {blockedUsers.length === 0 ? (
              <AppText style={{ textAlign: 'center', color: c.textSecondary, padding: spacing.xxl }}>
                {t('profile.none')}
              </AppText>
            ) : (
              blockedUsers.map((uid) => (
                <View
                  key={uid}
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    paddingVertical: spacing.md,
                    paddingHorizontal: spacing.xxl,
                    borderBottomWidth: 0.5,
                    borderBottomColor: c.border,
                  }}
                >
                  <AppText style={{ color: c.text, fontSize: fontSize.md }}>{uid}</AppText>
                  <TouchableOpacity onPress={() => removeBlockedUser(uid)}>
                    <AppText style={{ color: c.error, fontSize: fontSize.sm }}>{t('profile.unblock')}</AppText>
                  </TouchableOpacity>
                </View>
              ))
            )}
            <TouchableOpacity
              style={{ padding: spacing.lg, alignItems: 'center' }}
              onPress={() => setShowBlocked(false)}
            >
              <AppText style={{ color: c.textSecondary }} weight="bold">
                {t('common.close')}
              </AppText>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {picker && (
        <PickerModal
          visible={!!picker}
          title={picker.title}
          options={options}
          value={picker.value}
          onSelect={handleSelect}
          onClose={() => setPicker(null)}
        />
      )}
    </ScrollView>
  );
}
