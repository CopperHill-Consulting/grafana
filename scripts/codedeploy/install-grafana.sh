#!/bin/bash

rpm -Uvh --force /home/ec2-user/grafana-dist.rpm

yum install git -y

/usr/sbin/grafana-cli plugins install briangann-gauge-panel
/usr/sbin/grafana-cli plugins install digrich-bubblechart-panel
/usr/sbin/grafana-cli plugins install fatcloud-windrose-panel
/usr/sbin/grafana-cli plugins install westc-chartjs-panel
/usr/sbin/grafana-cli plugins install grafana-piechart-panel
/usr/sbin/grafana-cli plugins install grafana-worldmap-panel
/usr/sbin/grafana-cli plugins install michaeldmoore-annunciator-panel
/usr/sbin/grafana-cli plugins install natel-discrete-panel
/usr/sbin/grafana-cli plugins install natel-plotly-panel
/usr/sbin/grafana-cli plugins install novalabs-annotations-panel
/usr/sbin/grafana-cli plugins install ryantxu-ajax-panel
/usr/sbin/grafana-cli plugins install savantly-heatmap-panel
/usr/sbin/grafana-cli plugins install snuids-radar-panel
/usr/sbin/grafana-cli plugins install snuids-trafficlights-panel
/usr/sbin/grafana-cli plugins install yesoreyeram-boomtable-panel

cd /var/lib/grafana/plugins

if [! -d grafana-chartjs-panel]
then
	git clone -b latest --depth 1 https://github.com/CopperHill-Consulting/grafana-funnelChart-panel.git
else
	cd grafana-chartjs-panel
	git pull
	cd /var/lib/grafana/plugins
fi

if [! -d grafana-customTables-panel]
then
	git clone -b latest --depth 1 https://github.com/CopperHill-Consulting/grafana-customTables-panel.git
else
	cd grafana-customTables-panel
	git pull
	cd /var/lib/grafana/plugins
fi	

if [! -d grafana-funnelChart-panel-master]
then
	git clone -b latest --depth 1 https://github.com/CopperHill-Consulting/grafana-funnelChart-panel.git
else
	cd grafana-funnelChart-panel-master
	git pull
	cd /var/lib/grafana/plugins
fi
