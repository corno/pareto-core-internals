#!/usr/bin/env bash
workspaceDir=$1


for f in $workspaceDir/*; do
    cd "$f/pareto" && \
    "./scripts/update2latestAndPublish.sh"
done
