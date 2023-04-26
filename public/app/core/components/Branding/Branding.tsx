import { css, cx } from '@emotion/css';
import { FC } from 'react';

import { colorManipulator } from '@grafana/data';
import { useTheme2 } from '@grafana/ui';
import g8LoginDarkSvg from 'img/g8_login_dark.svg';
import g8LoginLightSvg from 'img/g8_login_light.svg';
import grafanaIconSvg from 'img/grafana_icon.svg';

export interface BrandComponentProps {
  className?: string;
  children?: JSX.Element | JSX.Element[];
}

export const LoginLogo: FC<BrandComponentProps & { logo?: string }> = ({ className, logo }) => {
  return (
    <div>
      <img className={className} src="public/img/ch_icon_white.svg" alt="AIR" />
    </div>
  );
};

const LoginBackground: FC<BrandComponentProps> = ({ className, children }) => {
  const theme = useTheme2();

  const background = css({
    '&:before': {
      content: '""',
      position: 'fixed',
      left: 0,
      right: 0,
      bottom: 0,
      top: 0,
      background: `url(${theme.isDark ? g8LoginDarkSvg : g8LoginLightSvg})`,
      backgroundPosition: 'top center',
      backgroundSize: 'auto',
      backgroundRepeat: 'no-repeat',

      opacity: 0,
      transition: 'opacity 3s ease-in-out',

      [theme.breakpoints.up('md')]: {
        backgroundPosition: 'center',
        backgroundSize: 'cover',
      },
    },
  });

  return <div className={cx(background, className)}>{children}</div>;
};

const MenuLogo: FC<BrandComponentProps> = ({ className }) => {
  // CHC: Branding
  return <img className={className} src="public/img/ch_fav32.png" alt="CopperHill" />;
};

const LoginBoxBackground = () => {
  const theme = useTheme2();
  return css({
    background: colorManipulator.alpha(theme.colors.background.primary, 0.7),
    backgroundSize: 'cover',
  });
};

export class Branding {
  static LoginLogo = LoginLogo;
  static LoginBackground = LoginBackground;
  static MenuLogo = MenuLogo;
  static LoginBoxBackground = LoginBoxBackground;
  static AppTitle = 'CopperHill AIR';
  static LoginTitle = 'Welcome to AIR';
  static HideEdition = true;
  static GetLoginSubTitle = (): null | string => {
    return null;
  };
}
