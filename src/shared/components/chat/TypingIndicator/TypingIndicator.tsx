import { useEffect, useRef } from 'react';
import { View, Animated } from 'react-native';
import { AppText } from '@/shared/components/ui/AppText';
import { useTheme } from '@/shared/hooks/useTheme';
import { styles } from './styles';

interface TypingIndicatorProps {
  name: string;
  isRecording?: boolean;
}

export function TypingIndicator({ name, isRecording }: TypingIndicatorProps) {
  const c = useTheme();
  const dot1 = useRef(new Animated.Value(0)).current;
  const dot2 = useRef(new Animated.Value(0)).current;
  const dot3 = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const bounce = (dot: Animated.Value, delay: number) =>
      Animated.loop(
        Animated.sequence([
          Animated.delay(delay),
          Animated.timing(dot, { toValue: 1, duration: 300, useNativeDriver: true }),
          Animated.timing(dot, { toValue: 0, duration: 300, useNativeDriver: true }),
        ]),
      );

    const a1 = bounce(dot1, 0);
    const a2 = bounce(dot2, 200);
    const a3 = bounce(dot3, 400);

    a1.start();
    a2.start();
    a3.start();

    return () => {
      a1.stop();
      a2.stop();
      a3.stop();
    };
  }, [dot1, dot2, dot3]);

  const dotStyle = (dot: Animated.Value) => ({
    opacity: dot.interpolate({ inputRange: [0, 1], outputRange: [0.3, 1] }),
    transform: [
      {
        translateY: dot.interpolate({ inputRange: [0, 1], outputRange: [0, -3] }),
      },
    ],
  });

  if (isRecording) {
    return (
      <View style={styles.container}>
        <AppText style={[styles.text, { color: c.textSecondary }]} numberOfLines={1}>
          {name} está grabando un audio...
        </AppText>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <AppText style={[styles.text, { color: c.primary }]} numberOfLines={1}>
        {name} está escribiendo
      </AppText>
      <View style={styles.dots}>
        <Animated.View style={[styles.dot, { backgroundColor: c.primary }, dotStyle(dot1)]} />
        <Animated.View style={[styles.dot, { backgroundColor: c.primary }, dotStyle(dot2)]} />
        <Animated.View style={[styles.dot, { backgroundColor: c.primary }, dotStyle(dot3)]} />
      </View>
    </View>
  );
}
