module.exports={
    uploadLambda:{
        command:'aws s3 sync tmp s3://<%= ArtifactsBucket %>/disclosure/lambda --exclude "*" --include "*_latest.zip" '
    },
    uploadCloudformation:{
        command:'aws s3 sync tmp s3://<%= ArtifactsBucket %>/disclosure/cloudformation --exclude "*" --include "CF-*.json" '
    },
    uploadWebsite:{
        command:'aws s3 sync website/build s3://<%= WebsiteBucket %> '
    }
}


