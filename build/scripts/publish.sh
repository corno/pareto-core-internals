#!/usr/bin/env bash

scriptDir=`realpath $(dirname "$0")`
rootDir="$scriptDir/../.."

if [ -z "$1" ]
  then
    echo "No generation supplied"
    exit 1
fi

#make sure everything is pushed
git push && \

#validate that everything is committed and pushed (to make sure we're not messing with open work)
git diff --exit-code && git log origin/master..master --exit-code && \

node $scriptDir/../node_modules/npm-updatedependencies2latest/dist/index.js $rootDir/pub dependencies && \

$scriptDir/build.sh && \

#validate that everything is still committed after the update and build
git diff --exit-code && git log origin/master..master --exit-code && \

pushd "$rootDir/pub" > /dev/null && \
npm version $1 && \
npm publish