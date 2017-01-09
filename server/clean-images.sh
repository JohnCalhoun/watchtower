#! /bin/bash

REGIONCOUNT=`cat config.json | jq '.builders[0].ami_regions' | jq length`
REGIONCOUNT=$((REGIONCOUNT+1))
echo $REGIONCOUNT

CONFIG='../cloudformation/mappings'

for artifact in `cat build.log | tail -n${REGIONCOUNT} | tr -d ' '`;do
    region=`echo $artifact | cut -d ':' -f1`
    id=`echo $artifact | cut -d ':' -f2`
    aws ec2 deregister-image --image-id $id --region $region
done
