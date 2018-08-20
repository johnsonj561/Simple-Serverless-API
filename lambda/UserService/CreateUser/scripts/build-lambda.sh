#!/bin/sh
. ./config.sh
# remove old build
rm ./dist/lambda.zip
# copy common files into lambda directory
cp -r ../models ./
cp ../../lambda-utility.js ./utils/lambda-utility.js
# zip into dist directory
zip -r ./dist/lambda.zip *