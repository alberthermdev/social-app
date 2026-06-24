import { useEffect, useRef } from 'react';
import { View, Animated } from 'react-native';
import { useTheme } from '@/shared/hooks/useTheme';
import { styles } from './styles';

function SkeletonRow() {
  const c = useTheme();
  const opacity = useRef(new Animated.Value(0.3)).current;

  useEffect(() => {
    const anim = Animated.loop(
      Animated.sequence([
        Animated.timing(opacity, { toValue: 1, duration: 800, useNativeDriver: true }),
        Animated.timing(opacity, { toValue: 0.3, duration: 800, useNativeDriver: true }),
      ]),
    );
    anim.start();
    return () => anim.stop();
  }, [opacity]);

  return (
    <Animated.View style={[styles.row, { opacity }]}>
      <View style={[styles.avatar, { backgroundColor: c.textTertiary + '40' }]} />
      <View style={styles.lines}>
        <View style={[styles.line1, { backgroundColor: c.textTertiary + '40' }]} />
        <View style={[styles.line2, { backgroundColor: c.textTertiary + '40' }]} />
      </View>
    </Animated.View>
  );
}

export function ChatsSkeleton() {
  return (
    <View style={styles.container}>
      {Array.from({ length: 10 }).map((_, i) => (
        <SkeletonRow key={i} />
      ))}
    </View>
  );
}
