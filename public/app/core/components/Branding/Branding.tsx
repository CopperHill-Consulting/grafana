import React, { FC } from 'react';
import { css, cx } from 'emotion';
import { useTheme } from '@grafana/ui';

export interface BrandComponentProps {
  className?: string;
  children?: JSX.Element | JSX.Element[];
}

const LoginLogo: FC<BrandComponentProps> = ({ className }) => {
  // tvadakin-chc: Branding
  return (
    <div>
      <img className={className} src="public/img/ch_icon_white.svg" alt="AIR" />
    </div>
  );
};

const LoginBackground: FC<BrandComponentProps> = ({ className, children }) => {
  const theme = useTheme();
  const background = css`
    background: url(public/img/login_background_${theme.isDark ? 'dark' : 'light'}.svg);
    background-size: cover;
  `;

  return <div className={cx(background, className)}>{children}</div>;
};

const MenuLogo: FC<BrandComponentProps> = ({ className }) => {
  // tvadakin-chc: Branding
  return <img className={className} src="public/img/ch_fav32.png" alt="CopperHill" />;
};

const LoginBoxBackground = () => {
  const theme = useTheme();
  return css`
    background: ${theme.isLight ? 'rgba(6, 30, 200, 0.1 )' : 'rgba(18, 28, 41, 0.65)'};
    background-size: cover;
  `;
};

export class Branding {
  static LoginLogo = LoginLogo;
  static LoginBackground = LoginBackground;
  static MenuLogo = MenuLogo;
  static LoginBoxBackground = LoginBoxBackground;
  // tvadakin-chc: Branding
  static AppTitle = 'CopperHill AIR';
  static LoginTitle = 'Welcome to AIR';
  static GetLoginSubTitle = () => {
    const slogans = ['Save time.', 'Prevent errors.', 'Take Action.'];
    const count = slogans.length;
    return slogans[Math.floor(Math.random() * count)];
  };
}
