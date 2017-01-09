#! /bin/bash

exec > /root/titandb.log 2>&1
set -x

yum update -y
yum install -y git sqlite-devel java-1.8.0-openjdk jq
alternatives --set java /usr/lib/jvm/jre-1.8.0-openjdk.x86_64/bin/java

cd /root
ASSETBUCKET='s3://jmc-artifacts'
aws s3 cp ${ASSETBUCKET}/disclosure/server/ . --recursive

#install dependencies
#constants for use in user data script
export GREMLIN_SERVER_USERNAME='ec2-user'
export LOG_DIR=/var/log/gremlin-server
export SERVER_DIRNAME=dynamodb-titan100-storage-backend-1.0.0-hadoop1
export SERVER_ZIP=${SERVER_DIRNAME}.zip
export PACKAGES_DIR=/usr/local/packages
export INSTALL_DIR=${PACKAGES_DIR}/${SERVER_DIRNAME}
export SERVICE_SCRIPT=${INSTALL_DIR}/bin/gremlin-server-service.sh
export ZIP_URL="https://dynamodb-titan-us-east-1.s3.amazonaws.com/dynamodb-titan100-storage-backend-1.0.0-hadoop1.zip"

#set up directories
mkdir -p ${LOG_DIR}
mkdir -p ${INSTALL_DIR}
chown -R ${GREMLIN_SERVER_USERNAME}:${GREMLIN_SERVER_USERNAME} ${LOG_DIR}

#download package
pushd ${PACKAGES_DIR}
curl -o ./${SERVER_ZIP} ${ZIP_URL}
unzip -qq ${SERVER_ZIP}
chmod u+x ${SERVICE_SCRIPT}

#install as a service
ln -s ${SERVICE_SCRIPT} /etc/init.d/gremlin-server
chkconfig --add gremlin-server

cp /root/gremlin-server.yaml ${INSTALL_DIR}/conf/gremlin-server/gremlin-server.yaml
cp /root/dynamodb.properties ${INSTALL_DIR}/conf/gremlin-server/dynamodb.properties

#make ec2-user own everything
chown -R ${GREMLIN_SERVER_USERNAME}:${GREMLIN_SERVER_USERNAME} ${INSTALL_DIR}
