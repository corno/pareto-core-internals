#!/usr/bin/env bash

scriptDir=`realpath $(dirname "$0")`
rootDir="$scriptDir/../.."

if [ -z "$1" ]
  then
    echo "No generation supplied"
    exit 1
fi

#the scriptsdir will be deleted, change to the root
cd "$rootDir" && \

#make sure everything is pushed
git push && \

#validate that everything is committed and pushed (to make sure we're not messing with open work)
git diff --exit-code && git log origin/master..master --exit-code && \

./build.sh && \

#validate that everything is still committed after the update and build
git diff --exit-code && git log origin/master..master --exit-code && \

pushd "$rootDir/pub" > /dev/null && \
npm version $1 && \
npm publish