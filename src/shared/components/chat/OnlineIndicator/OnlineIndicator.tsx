import { View } from 'react-native';
import { styles } from './styles';

interface OnlineIndicatorProps {
  online: boolean;
  size?: number;
}

export function OnlineIndicator({ online, size = 12 }: OnlineIndicatorProps) {
  return (
    <View
      style={[
        styles.dot,
        {
          width: size,
          height: size,
          borderRadius: size / 2,
          backgroundColor: online ? '#3BA55D' : '#747F8D',
          borderWidth: size > 10 ? 2 : 1.5,
        },
      ]}
    />
  );
}
