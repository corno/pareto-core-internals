#!/usr/bin/env bash

projectDir=$1

if [ -d "$projectDir" ]
then
    rm -rf "$projectDir/dist" && \
    tsc -p "$projectDir"
fi