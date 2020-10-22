import React, { FC } from 'react';
import config from 'app/core/config';
import { Icon, IconName } from '@grafana/ui';

export interface FooterLink {
  text: string;
  icon?: string;
  url?: string;
  target?: string;
}

export let getFooterLinks = (): FooterLink[] => {
  return [
    {
      text: 'Documentation',
      icon: 'document-info',
      url: 'https://grafana.com/docs/grafana/latest/?utm_source=grafana_footer',
      target: '_blank',
    },
    {
      text: 'Support',
      icon: 'question-circle',
      url: 'https://grafana.com/products/enterprise/?utm_source=grafana_footer',
      target: '_blank',
    },
    {
      text: 'Community',
      icon: 'comments-alt',
      url: 'https://community.grafana.com/?utm_source=grafana_footer',
      target: '_blank',
    },
  ];
};

export let getVersionLinks = (): FooterLink[] => {
  //const { buildInfo, licenseInfo } = config;
  const { buildInfo } = config;
  const links: FooterLink[] = [];
  //const stateInfo = licenseInfo.stateInfo ? ` (${licenseInfo.stateInfo})` : '';

  // tvadakin-chc: Branding
  //links.push({ text: `${buildInfo.edition}${stateInfo}`, url: licenseInfo.licenseUrl });

  if (buildInfo.hideVersion) {
    return links;
  }

  // tvadakin-chc: Branding
  links.push({ text: `v${buildInfo.version}` });

  //if (buildInfo.hasUpdate) {
  //  links.push({
  //    text: `New version available!`,
  //    icon: 'download-alt',
  //    url: 'https://grafana.com/grafana/download?utm_source=grafana_footer',
  //    target: '_blank',
  //  });
  //}

  return links;
};

export function setFooterLinksFn(fn: typeof getFooterLinks) {
  getFooterLinks = fn;
}

export function setVersionLinkFn(fn: typeof getFooterLinks) {
  getVersionLinks = fn;
}

export const Footer: FC = React.memo(() => {
  // tvadakin-chc: Branding
  const links = getVersionLinks();

  return (
    <footer className="footer">
      <div className="text-center">
        <ul>
          {links.map(link => (
            <li key={link.text}>
              <a href={link.url} target={link.target} rel="noopener">
                <Icon name={link.icon as IconName} /> {link.text}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </footer>
  );
});
