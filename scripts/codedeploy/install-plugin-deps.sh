#!/bin/bash

yum -y install git python3
curl https://bootstrap.pypa.io/get-pip.py -o get-pip.py
python3 get-pip.py
/usr/local/bin/pip install boto3

mkdir /var/lib/grafana/plugins 2>/dev/null
chmod -R 775 /var/lib/grafana/plugins
chown -R ec2-user /var/lib/grafana/plugins/
chgrp -R grafana /var/lib/grafana/plugins/
