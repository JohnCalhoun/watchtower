#! /bin/bash

set -x

#install dependencies
yum install -y sqlite-devel java-1.8.0-openjdk
alternatives --set java /usr/lib/jvm/jre-1.8.0-openjdk.x86_64/bin/java

#constants for use in user data script
export REGION=`curl http://169.254.169.254/latest/meta-data/placement/availability-zone | rev | cut -c 2- | rev`
export GREMLIN_SERVER_USERNAME='ec2-user'
export LOG_DIR=/var/log/gremlin-server
export SERVER_DIRNAME=dynamodb-titan100-storage-backend-1.0.0-hadoop1
export SERVER_ZIP=${SERVER_DIRNAME}.zip
export PACKAGES_DIR=/usr/local/packages
export INSTALL_DIR=${PACKAGES_DIR}/${SERVER_DIRNAME}
export SERVICE_SCRIPT=${INSTALL_DIR}/bin/gremlin-server-service.sh
export ZIP_URL="https://dynamodb-titan-$REGION.s3.amazonaws.com/dynamodb-titan100-storage-backend-1.0.0-hadoop1.zip"

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
#download the Titan storage backend properties file
BACKEND_PROPERTIES=${INSTALL_DIR}/conf/gremlin-server/dynamodb.properties
aws s3 cp 
{
Ref: StorageBackendPropertiesFileS3Url
}
 ${BACKEND_PROPERTIES}
#make ec2-user own everything
chown -R ${GREMLIN_SERVER_USERNAME}:${GREMLIN_SERVER_USERNAME} ${INSTALL_DIR}
#start Gremlin Server endpoints 
service gremlin-server start


