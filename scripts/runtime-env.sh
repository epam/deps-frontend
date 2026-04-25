#!/bin/bash

INITIAL_STRING_TO_CONCAT='window._env_ = {'
FINAL_STRING_TO_CONCAT='};'
COMMENT_PATTERN='^\s*#'
NUMERIC_PATTERN='^[+-]?[0-9]+([.][0-9]+)?$'
BOOL_PATTERN='^(true|false)$'

contains() {
    local list="$1[@]"
    local elem="$2"
    for i in "${!list}"; do
        if [ "$i" == "${elem}" ]; then
            echo 1
            return
        fi
    done
    echo 0
}

splitStrAndGetByIndex() {
    local string="$1"
    local delimiter="$2"
    local index="$3"
    local result=()
    local IFS="$delimiter"
    read -ra result <<<"$string"
    echo "${result[$index]}"
}

readFile() {
    while read -r line; do
        echo "$line"
    done <"$1"
}

readAndSetRuntimeEnv() {
    local str="$INITIAL_STRING_TO_CONCAT"
    local fileToParse="$1"
    local fileToWrite="$2"

    local envFileContent=$(readFile "$fileToParse")
    local envFileContentWithoutComments=$(echo "$envFileContent" | grep -v "$COMMENT_PATTERN")

    for line in $envFileContentWithoutComments; do
        local key=$(splitStrAndGetByIndex "$line" '=' 0)
        local envValue=$(printenv "$key")

        # check for isEmpty value
        if [[ -z $envValue ]]; then
            str+="$key: '',"
            continue
        fi

        if (grep -q -E -i "$NUMERIC_PATTERN" <<<"$envValue") || (grep -q -E -i "$BOOL_PATTERN" <<<"$envValue"); then
            str+="$key: $envValue,"
        else
            str+="$key: '$envValue',"
        fi
    done

    str+="$FINAL_STRING_TO_CONCAT"
    echo "$str" >"$fileToWrite"
}

from="$1"
to="$2"

readAndSetRuntimeEnv "$from" "$to"
