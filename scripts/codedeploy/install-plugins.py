#!/bin/python3

import os
import boto3
from boto3.dynamodb.conditions import Attr

# set up dynamodb session for getting grafana table
session = boto3.Session()
dynamodb = session.resource('dynamodb', 'us-east-1')
table = dynamodb.Table('grafana_plugins_config')

# table scan for records matching environment run
response = table.scan(
  FilterExpression=Attr(os.environ['DEPLOYMENT_GROUP_NAME'].lower()).eq(True)
)

items = response['Items']

# for each plugin, if it's managed, pull using grafana cli; otherwise git clone/pull the custom repo
for item in items:
  if 'is-managed' in item and item['is-managed'] == True:
    os.system('/usr/sbin/grafana-cli plugins install '+item['repo-name'])
  else:
    if not os.path.exists("/var/lib/grafana/plugins/"+item['repo-name']):
      os.system('git clone -b latest --depth 1 https://'+item['repo-provider']+'/'+item['repo-account']+'/'+item['repo-name']+'.git /var/lib/grafana/plugins/'+item['repo-name'])
    else:
      os.system('cd /var/lib/grafana/plugins/'+item['repo-name']+' && git pull')
    os.system('sudo chgrp -R grafana /var/lib/grafana/plugins/'+item['repo-name'])
