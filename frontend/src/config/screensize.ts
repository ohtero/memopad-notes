import { useMediaQuery } from 'react-responsive';

type QueryProps = {
  children: React.ReactNode;
};

export function DesktopView({ children }: QueryProps) {
  const isDesktop = useMediaQuery({ minWidth: 1080 });
  return isDesktop ? children : null;
}
export function MobileView({ children }: QueryProps) {
  const isMobileOrTablet = useMediaQuery({ maxWidth: 1079 });
  return isMobileOrTablet ? children : null;
}
