import { Text, type TextProps } from 'react-native';
import { fontFamilyMap } from './styles';

type AppTextProps = TextProps & {
  weight?: 'regular' | 'medium' | 'semiBold' | 'bold';
};

export function AppText({ style, weight = 'regular', ...props }: AppTextProps) {
  return <Text style={[{ fontFamily: fontFamilyMap[weight] }, style]} {...props} />;
}
