import { useEffect, useRef } from 'react';
import { Animated } from 'react-native';
import { AppText } from '@/shared/components/ui/AppText';
import { useConnectivity } from '@/shared/hooks/useConnectivity';
import { useTranslation } from 'react-i18next';
import { styles } from './styles';

export function ConnectivityBanner() {
  const { isConnected } = useConnectivity();
  const { t } = useTranslation();
  const animValue = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (!isConnected) {
      animValue.setValue(-40);
      Animated.timing(animValue, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }).start();
    }
  }, [isConnected, animValue]);

  if (isConnected) return null;

  return (
    <Animated.View style={[styles.banner, { transform: [{ translateY: animValue }] }]}>
      <AppText style={styles.text} maxFontSizeMultiplier={1.3} weight="bold">
        {t('connectivity.offline')}
      </AppText>
    </Animated.View>
  );
}
