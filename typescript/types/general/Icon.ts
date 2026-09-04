import { Icon as IconType, IconProps as IconPropsType } from 'iconsax-reactjs';

export interface IconProps extends Omit<IconPropsType, "color"> {
  IconComponent: IconType;
  toneTwoColor?: string
  className?: string;
}