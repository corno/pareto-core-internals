#!/usr/bin/env bash
scriptDir=`realpath $(dirname "$0")`
rootDir="$scriptDir/../.."

$scriptDir/analyseTypeScriptProject.sh $rootDir/pub/tsconfig.json && \
$scriptDir/analyseTypeScriptProject.sh $rootDir/test/tsconfig.json