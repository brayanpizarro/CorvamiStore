declare module 'lucide-react' {
  import { ComponentType, SVGProps } from 'react';

  export interface IconProps extends SVGProps<SVGSVGElement> {
    size?: number | string;
    color?: string;
    strokeWidth?: number | string;
  }

  export type Icon = ComponentType<IconProps>;

  export const Star: Icon;
  export const ChevronDown: Icon;
  export const Menu: Icon;
  export const X: Icon;
  export const ShoppingCart: Icon;
  export const Search: Icon;
  export const Heart: Icon;
  export const User: Icon;
  export const Check: Icon;
  export const ArrowRight: Icon;
  export const Plus: Icon;
  export const Minus: Icon;
  export const Truck: Icon;
  export const Shield: Icon;
  export const RotateCcw: Icon;
  export const Award: Icon;
  export const ChevronLeft: Icon;
  export const ChevronRight: Icon;
  export const Trash2: Icon;

  // Exportar otros iconos según se necesiten
  const icons: { [key: string]: Icon };
  export default icons;
}