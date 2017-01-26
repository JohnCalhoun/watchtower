module.exports={
    uploadLambda:{
        command:'aws s3 sync tmp s3://<%= ArtifactsBucket %>/watchtower/lambda --exclude "*" --include "*_latest.zip" '
    },
    uploadCloudformation:{
        command:'aws s3 sync tmp s3://<%= ArtifactsBucket %>/watchtower/cloudformation --exclude "*" --include "CF-*.json" '
    },
    uploadWebsite:{
        command:'aws s3 sync website/build s3://<%= WebsiteBucket %> '
    },
    buildLambda:{
        command:'for dir in lambda/*; do cd lambda/RDSProxy; grunt build;cd ../..; done'
    }
}


