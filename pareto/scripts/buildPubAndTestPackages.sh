#!/usr/bin/env bash

scriptDir=`realpath $(dirname "$0")`
rootDir="$scriptDir/../.."

#pub
$scriptDir/buildPackage.sh "$rootDir/pub" && \
$scriptDir/setFingerprints.sh && \

#test
$scriptDir/buildPackage.sh "$rootDir/test" && \


if [ -d "$rootDir/pub/src/bin" ]
then
    find ../pub/dist/bin/* -name "*.js" -exec chmod 777 {} +
fi
