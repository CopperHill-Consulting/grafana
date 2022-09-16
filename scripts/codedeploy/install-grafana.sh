#!/bin/bash

yum -y localinstall /home/ec2-user/grafana-dist.rpm

aws s3 cp s3://ch-grafana-resources/grafana.ini.$DEPLOYMENT_GROUP_NAME /etc/grafana/grafana.ini
