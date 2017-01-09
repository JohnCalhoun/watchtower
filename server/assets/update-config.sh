#! /bin/bash

exec > /root/update-config.log 2>&1
set -x

STACKNAME=$1
CONFIG=/usr/local/packages/dynamodb-titan100-storage-backend-1.0.0-hadoop1/conf/gremlin-server/dynamodb.properties

sed -ir "s/^storage.dynamodb.prefix=v100\$/storage.dynamodb.prefix=${STACKNAME}/" $CONFIG
