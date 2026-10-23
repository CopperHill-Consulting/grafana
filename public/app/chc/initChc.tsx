// CHC: CopperHill customizations that hook into Grafana at startup.
// Kept in one place so they survive Grafana upgrades without editing core toolbar code.
import customConstants from 'customConstants';

import { t } from '@grafana/i18n';
import { ToolbarButton } from '@grafana/ui';
import { registerDynamicDashNavAction } from 'app/features/dashboard-scene/utils/registerDynamicDashNavAction';

// CHC: Open the screenshot lambda for the current dashboard
function onExport() {
  const gridLayout = document.querySelector<HTMLElement>('.react-grid-layout');
  const domain = window.location.host;

  const redirect = new URL(window.location.href);
  redirect.searchParams.set('kiosk', '1');
  redirect.searchParams.set('__noanimation', 'true');

  const tData = btoa(
    JSON.stringify(
      Object.assign(JSON.parse(atob(customConstants.tData)), {
        r: `${redirect.pathname}${redirect.search}`,
      })
    )
  );
  const urlBase64 = `${window.location.origin}/public/views/auto-login.html?t=${tData}`;

  window.open(
    customConstants.screenshotURL +
      `?viewWidth=` +
      customConstants.defaultScreenshotWidth +
      `&viewHeight=` +
      ((gridLayout?.offsetHeight ?? 0) + 200) +
      `&urlBase64=` +
      btoa(urlBase64) +
      `&deleteCookieName=grafana_session` +
      `&deleteCookieDomain=` +
      domain +
      `&deleteCookiePath=/`
  );
}

export function initChc() {
  // CHC: screenshot service button in the dashboard toolbar
  registerDynamicDashNavAction('right', {
    show: () => true,
    component: () => (
      <ToolbarButton
        tooltip={t('chc.dashboard.export-png', 'Export dashboard to PNG')}
        icon="camera"
        onClick={onExport}
        key="chc-button-export"
      />
    ),
  });
}
