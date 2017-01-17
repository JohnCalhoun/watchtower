module.exports={
    options:{
        stderr:true
    },
    metalsmith:{
        command:'node ./html/metalsmith.js'
    },
    favicon:{
        command:'convert -size 16x16 xc:<%= primary_color %> assets/favicon.gif'
    },
    getSdk:{
        command:[
            "aws apigateway get-sdk --rest-api-id <%= ApiId %> --stage-name production --sdk-type javascript tmp/sdk.zip",
            "unzip  -u tmp/sdk.zip -d tmp"
            ].join(';')
    },
    getCognitoSdk:{
        command:[
                    "wget https://raw.githubusercontent.com/aws/amazon-cognito-identity-js/master/dist/amazon-cognito-identity.min.js -O tmp/cognito-ID-sdk.js",
                    "wget https://raw.githubusercontent.com/aws/amazon-cognito-identity-js/master/dist/aws-cognito-sdk.min.js -O tmp/cognito-sdk.js",
                    "wget http://www-cs-students.stanford.edu/~tjw/jsbn/jsbn.js -O tmp/jsbn.js",
                    "wget http://www-cs-students.stanford.edu/~tjw/jsbn/jsbn2.js -O tmp/jsbn2.js",
                    "wget https://github.com/bitwiseshiftleft/sjcl/archive/master.zip -O tmp/sjcl.zip",
                        "cd tmp",
                        "unzip -o sjcl.zip",
                        "cd sjcl-master",
                        "./configure --with-codecBytes",
                        "make",
                        "cp sjcl.js ..",
                        "cd ../..",
                    "wget http://momentjs.com/downloads/moment.min.js -O tmp/moment.js"
                ].join(';')
    },
    uploadWebsite:{
        command:"aws s3 sync ./website/build <%= WebsiteBucket %>"
    }
}
