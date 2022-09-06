#!/usr/bin/env bash

scriptDir=`realpath $(dirname "$0")`
rootDir="$scriptDir/../.."

#make sure everything is pushed
git push && \

#validate that everything is committed and pushed (to make sure we're not messing with open work with updatePackage)
git diff --exit-code && git log origin/master..master --exit-code && \

#make sure latest buildenvironment is installed
"$scriptDir/update2latestBuildEnvironment.sh" && \

"$scriptDir/clean.sh" && \

#make sure latest packages are installed
"$scriptDir/update2latestDependencies.sh" && \

#buildAndTest
#"$scriptDir/buildAndTest.sh" && \ <- building is done by update2latestDependencies

#validate that everything is still committed after the update and build
git diff --exit-code && git log origin/master..master --exit-code && \

#bump version and store in variable
pushd "$rootDir/pub" > /dev/null && \

interfaceVersion=`npm pkg get interface-fingerprint` && \
if [ $interfaceVersion == "{}" ]
then
    #no interface fingerprint

    "$scriptDir/publishIfContentChanged.sh" "minor"

else
    name=$(npm pkg get name | cut -c2- | rev | cut -c2- |rev) && \

    localFingerprint=$(npm pkg get interface-fingerprint | cut -c2- | rev | cut -c2- |rev) && \
    remoteFingerprint=$(npm view $name@latest interface-fingerprint) && \

    if [ $localFingerprint != $remoteFingerprint ]
    then
        "$scriptDir/publishWithoutChecks.sh" "minor"
    else
        "$scriptDir/publishIfContentChanged.sh" "patch"
    fi
fi