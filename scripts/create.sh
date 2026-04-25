#!/bin/bash

STYLED_FLAG='--styles'
SECTION=$1
NAME=$2
STYLED=false

mkdir -p src/$SECTION/$NAME

for arg in "$@"
do
    if [ "$arg" = $STYLED_FLAG ]; then
        STYLED=true
    fi
done

touch src/$SECTION/$NAME/index.js
touch src/$SECTION/$NAME/$NAME.jsx
touch src/$SECTION/$NAME/$NAME.test.js

if [ "$STYLED" = true ] ; then
    touch src/$SECTION/$NAME/$NAME.styles.js
fi

echo "export * from './$NAME'" >> src/$SECTION/$NAME/index.js

cat <<EOF >> src/$SECTION/$NAME/$NAME.jsx
import PropTypes from 'prop-types'

const $NAME = () => {

}

$NAME.propTypes = {

}

export {
  $NAME,
}
EOF
