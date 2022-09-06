#!/usr/bin/env bash

scriptDir=`realpath $(dirname "$0")`
rootDir="$scriptDir/../.."



root="`cd "$rootDir";pwd`" # the resolved path to the root dir of the project
rootName=`basename $root`

if [ -d "$rootDir/dev" ]
then
    $scriptDir/buildDevPackage.sh && \
    rm -rf $rootDir/pub/src/generated && \
    rm -rf $rootDir/test/src/generated && \
    node $rootDir/dev/dist/bin/generateCode.js ..
fi \


$scriptDir/buildPubAndTestPackages.sh && \
if [[ $rootName == api-* || $rootName == pareto-core-* ]]
then
    echo "$rootName; no testing for api"
else
    node $rootDir/test/dist/bin/test.js $rootDir/test/data
fi
