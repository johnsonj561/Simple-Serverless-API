#!/bin/sh
. ./config.sh
. ./scripts/build-lambda.sh
aws lambda update-function-code --function-name $FUNCTION_NAME --zip-file fileb://dist/lambda.zip
