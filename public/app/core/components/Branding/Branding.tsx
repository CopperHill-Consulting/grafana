import { css, cx } from '@emotion/css';
import { type FC, type JSX } from 'react';

import { colorManipulator, type GrafanaTheme2, type NavModelItem } from '@grafana/data';
import { selectors } from '@grafana/e2e-selectors';
import { reportInteraction } from '@grafana/runtime';
import { Text, Tooltip, useStyles2, useTheme2 } from '@grafana/ui';
import chFav32Png from 'img/ch_fav32.png';
import chIconWhiteSvg from 'img/ch_icon_white.svg';
import g8LoginDarkSvg from 'img/g8_login_dark.svg';
import g8LoginLightSvg from 'img/g8_login_light.svg';

export interface BrandComponentProps {
  className?: string;
  children?: JSX.Element | JSX.Element[];
}

const LoginLogo: FC<BrandComponentProps & { logo?: string }> = ({ className, logo }) => {
  // CHC: Branding
  return (
    <div>
      <img className={className} src={chIconWhiteSvg} alt="AIR" />
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

      [theme.transitions.handleMotion('no-preference', 'reduce')]: {
        transition: 'opacity 3s ease-in-out',
      },

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
  return <img className={className} src={chFav32Png} alt="CopperHill" />;
};

export function HomeLogo({ homeNav, onClick }: { homeNav?: NavModelItem; onClick?: () => void }) {
  const styles = useStyles2(homeLogoStyles);

  const onHomeClicked = () => {
    reportInteraction('grafana_home_clicked');
    onClick?.();
  };

  return (
    <Tooltip placement="bottom" content={homeNav?.text || 'Home'}>
      <a
        onClick={onHomeClicked}
        data-testid={selectors.components.Breadcrumbs.breadcrumb('Home')}
        className={styles.homeLogo}
        title={homeNav?.text || 'Home'}
        href={homeNav?.url}
      >
        <Branding.MenuLogo />
      </a>
    </Tooltip>
  );
}

function homeLogoStyles(theme: GrafanaTheme2) {
  return {
    homeLogo: css({
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      height: theme.spacing(3),
      width: theme.spacing(3),
      margin: theme.spacing(0, 0.5),
      img: {
        maxHeight: '100%',
        maxWidth: '100%',
      },
    }),
  };
}

export function HomeTitle({ homeNav, onClick }: { homeNav?: NavModelItem; onClick?: () => void }) {
  const styles = useStyles2(homeTitleStyles);

  const onHomeClicked = () => {
    reportInteraction('grafana_home_clicked');
    onClick?.();
  };

  return (
    <a onClick={onHomeClicked} className={styles.homeTitle} title={homeNav?.text || 'Home'} href={homeNav?.url}>
      <Text variant="body" truncate>
        {Branding.AppTitle}
      </Text>
    </a>
  );
}

function homeTitleStyles(theme: GrafanaTheme2) {
  return {
    homeTitle: css({
      borderRadius: theme.shape.radius.default,
      color: theme.colors.text.primary,
      padding: theme.spacing(0.25, 0.75),
      margin: theme.spacing(0, -0.75),
      textDecoration: 'none',

      '&:hover, &:focus': {
        backgroundColor: theme.colors.secondary.transparent,
      },

      [theme.transitions.handleMotion('no-preference', 'reduce')]: {
        transition: theme.transitions.create(['background-color'], {
          duration: theme.transitions.duration.short,
        }),
      },
    }),
  };
}

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
