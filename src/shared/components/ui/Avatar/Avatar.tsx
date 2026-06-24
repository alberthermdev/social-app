import { View, Image, useWindowDimensions } from 'react-native';
import { AppText } from '@/shared/components/ui/AppText';
import { colors } from '@/shared/theme/colors';
import { styles } from './styles';

type Size = 'sm' | 'md' | 'lg' | 'xl';

interface AvatarProps {
  photoURL?: string | null;
  name?: string;
  size?: Size;
  online?: boolean;
  showStatus?: boolean;
}

const sizeMap: Record<Size, number> = {
  sm: 32,
  md: 40,
  lg: 56,
  xl: 96,
};

const fontMap: Record<Size, number> = {
  sm: 14,
  md: 17,
  lg: 24,
  xl: 40,
};

function getInitials(name?: string): string {
  if (!name) return '?';
  return name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
}

export function Avatar({ photoURL, name, size = 'md', online, showStatus }: AvatarProps) {
  const { fontScale } = useWindowDimensions();
  const dimension = sizeMap[size];
  const dotSize = Math.max(8, dimension * 0.2);
  const adjustedFont = fontMap[size] / Math.max(1, fontScale * 0.8);
  const hasImage = Boolean(photoURL);

  return (
    <View style={[styles.container, { width: dimension, height: dimension }]}>
      {hasImage ? (
        <Image source={{ uri: photoURL! }} style={[styles.image, { width: dimension, height: dimension }]} />
      ) : (
        <View style={[styles.placeholder, { width: dimension, height: dimension, borderRadius: dimension / 2 }]}>
          <AppText weight="semiBold" style={[styles.initials, { fontSize: adjustedFont }]} maxFontSizeMultiplier={1.3}>
            {getInitials(name)}
          </AppText>
        </View>
      )}
      {showStatus && (
        <View
          style={[
            styles.statusDot,
            {
              width: dotSize,
              height: dotSize,
              borderRadius: dotSize / 2,
              borderWidth: Math.min(2, dotSize / 4),
              backgroundColor: online ? colors.light.online : colors.light.offline,
            },
          ]}
        />
      )}
    </View>
  );
}
