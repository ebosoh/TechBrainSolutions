import { ReactNode } from 'react';
import { FaBrain, FaDatabase, FaCode, FaShoppingCart, FaBullhorn, FaCogs } from 'react-icons/fa';

interface IconProps {
  name: string;
  className?: string;
}

export const Icon = ({ name, className = "w-6 h-6" }: IconProps): ReactNode => {
  switch (name) {
    case 'brain':
      return <FaBrain className={className} />;
    case 'database':
      return <FaDatabase className={className} />;
    case 'code':
      return <FaCode className={className} />;
    case 'shopping-cart':
      return <FaShoppingCart className={className} />;
    case 'bullhorn':
      return <FaBullhorn className={className} />;
    case 'cogs':
      return <FaCogs className={className} />;
    default:
      return null;
  }
};
