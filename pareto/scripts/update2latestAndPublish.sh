#!/usr/bin/env bash
generation=$1

scriptDir=`realpath $(dirname "$0")`
rootDir="$scriptDir/../.."

#validate that everything is committed and pushed (to make sure we're not messing with open work with updatePackage)
git diff --exit-code && git log origin/master..master --exit-code && \

"$scriptDir/update2latestBuildEnvironment.sh" && \
"$scriptDir/update2latestDependencies.sh" && \
"$scriptDir/buildAndTest.sh" && \
git commit -am "u2l" && \
"$scriptDir/publish.sh" "$generation"