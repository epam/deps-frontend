#!/bin/bash

echo "$1"

icon="--"

if [[ "$1" == "Success" ]]
then
  icon="&#x2705;"
elif [[ "$1" == "Failure" ]]
then
  icon="&#x274C;"
fi

curl -H "Content-Type: application/json" -d "{\"text\": \" $icon $1: Deployment in ${CI_PROJECT_NAME} pipeline ${CI_PIPELINE_URL} by <b>${GITLAB_USER_NAME} (${GITLAB_USER_EMAIL})</b> on branch ${CI_COMMIT_BRANCH}.\"}" "${TEAMS_WEBHOOK_URL}"
