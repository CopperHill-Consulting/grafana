#!/bin/bash

yum -y install git python3
curl https://bootstrap.pypa.io/get-pip.py -o get-pip.py
python3 get-pip.py
/usr/local/bin/pip install boto3

aws configure set aws_access_key_id AKIA2ZV5MVCVOFMCYKFZ --profile chc
aws configure set aws_secret_access_key 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 --profile chc
aws configure set default.region us-east-1 --profile chc

chmod -R 775 /var/lib/grafana/plugins
chown -R ec2-user /var/lib/grafana/plugins/
chgrp -R grafana /var/lib/grafana/plugins/
