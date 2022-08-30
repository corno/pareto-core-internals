#!/usr/bin/env bash

scriptDir=`realpath $(dirname "$0")`
rootDir="$scriptDir/../.."

if [ -d "$rootDir/dev" ]
then
    $scriptDir/buildDevPackage.sh && \
    rm -rf $rootDir/pub/src/generated && \
    rm -rf $rootDir/test/src/generated && \
    node $rootDir/dev/dist/bin/generateCode.js ..
fi \


$scriptDir/buildPubAndTestPackages.sh && \
if [ -d "$rootDir/test" ]
then
    node $rootDir/test/dist/bin/index.js $rootDir/test/data
fi \

