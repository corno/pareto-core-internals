#!/usr/bin/env bash
scriptDir=`realpath $(dirname "$0")`
rootDir="$scriptDir/../.."

npx analysePackage $rootDir > /dev/null #only want the errors