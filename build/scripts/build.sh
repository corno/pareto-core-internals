#!/usr/bin/env bash

scriptDir=`realpath $(dirname "$0")`
rootDir="$scriptDir/../.."

rm -rf "$rootDir/pub/dist" && \
pushd "$rootDir/pub" && \
tsc && \
popd