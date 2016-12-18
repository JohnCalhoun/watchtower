#! /bin/bash
set -x

STACKNAME=$1
ELASTICSEARCHDOMAIN=$2
ELASTICSEARCHENDPOINT=`aws es describe-elasticsearch-domains    \
                        --domain-names ${ELASTICSEARCHDOMAIN}   \
                        | jq '.DomainStatusList[0].Endpoint'    \
                        | tr -d '"'`

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

read -r SED_EXPR <<-EOF
s#^channelizer: org.apache.tinkerpop.gremlin.server.channel.WebSocketChannelizer\$#channelizer: org.apache.tinkerpop.gremlin.server.channel.HttpChannelizer\
EOF
sed -r "$SED_EXPR" ${INSTALL_DIR}/conf/gremlin-server/gremlin-server.yaml  >> ${INSTALL_DIR}/conf/gremlin-server/gremlin-server.yaml


#download the Titan storage backend properties file
BACKEND_PROPERTIES=${INSTALL_DIR}/conf/gremlin-server/dynamodb.properties

read -r SED_EXPR <<-EOF
s#^storage.dynamodb.prefix=v100\$#storage.dynamodb.prefix=${STACKNAME}#; \
s#^index.search.elasticsearch.ext.discovery.zen.ping.unicast.hosts=host1\$#index.search.elasticsearch.ext.discovery.zen.ping.unicast.hosts=${ELASTICSEARCHENDPOINT}#; \
EOF
sed -r "$SED_EXPR" dynamodb.properties  >> ${BACKEND_PROPERTIES}

#make ec2-user own everything
chown -R ${GREMLIN_SERVER_USERNAME}:${GREMLIN_SERVER_USERNAME} ${INSTALL_DIR}
#start Gremlin Server endpoints 
service gremlin-server start
