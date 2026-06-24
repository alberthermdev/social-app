import { useEffect, useRef, useMemo } from 'react';
import { View, Animated, ViewStyle } from 'react-native';
import { useTheme } from '@/shared/hooks/useTheme';
import { createStyles, chatListStyles } from './styles';

interface SkeletonLoaderProps {
  width?: number;
  height?: number;
  borderRadius?: number;
  style?: ViewStyle;
}

export function SkeletonLoader({ width, height = 20, borderRadius = 4, style }: SkeletonLoaderProps) {
  const c = useTheme();
  const opacity = useRef(new Animated.Value(0.3)).current;

  const dynStyles = useMemo(() => createStyles(c), [c]);

  useEffect(() => {
    const animation = Animated.loop(
      Animated.sequence([
        Animated.timing(opacity, { toValue: 1, duration: 800, useNativeDriver: true }),
        Animated.timing(opacity, { toValue: 0.3, duration: 800, useNativeDriver: true }),
      ]),
    );
    animation.start();
    return () => animation.stop();
  }, [opacity]);

  return (
    <Animated.View style={[dynStyles.skeleton, { width: width as number, height, borderRadius, opacity }, style]} />
  );
}

export function ChatListSkeleton() {
  const c = useTheme();

  return (
    <View style={[chatListStyles.container, { backgroundColor: c.background }]}>
      {Array.from({ length: 8 }).map((_, i) => (
        <View key={i} style={chatListStyles.row}>
          <SkeletonLoader width={56} height={56} borderRadius={28} />
          <View style={chatListStyles.col}>
            <SkeletonLoader height={16} style={{ width: '60%' }} />
            <SkeletonLoader height={14} style={{ width: '85%', marginTop: 6 }} />
          </View>
        </View>
      ))}
    </View>
  );
}
