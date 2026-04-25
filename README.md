## DEPS-FRONTEND

Frontend for the Data Extraction and Processing System

## How to run the project:

After you’ve done with the steps in «How to run the project» section from main repository, navigate to the deps-frontend folder (inside main repo) using command (cd deps-frontend) and execute the following commands:

```
# Install dependencies
yarn

# Starts up dev server with live updates
yarn start
```

This will start webpack-dev-server that will host all the static files of the frontend part of the project. By default it  will be available at http://localhost:8081 (the message with host will appear in console after you start project). 
 
## Available scripts:

    "start"                 -> Run webpack dev server
    "build"                 -> Create production build
    "test:manual"           -> Run only edited tests with watch by default
    "test:auto"             -> Run all unit tests once and collect coverage
    "test:debug"            -> Run only edited tests with watch and ability to attach the debugger
    "test:ci"               -> Run unit tests in GitLab pipeline
    "eslint"                -> Run code check with eslint
    "eslint:fix"            -> Run code check with eslint and fix all founded issues
    "stylelint"             -> Run code check with stylelint
    "stylelint:fix"         -> Run code check with stylelint and fix all founded issues
    "lint"                  -> Run code check with eslint and stylelint
    "lint:fix"              -> Run code check with eslint, stylelint and fix all founded issues
    "do:component"          -> Generate components folder with preset files
    "do:container"          -> Generate containers folder with preset files

## JavaScript Coding Conventions

1. Adhere to StandardJS (https://standardjs.com/rules.html#javascript-standard-style)
1. Overall code style that favours easy merge conflict resolving by putting stuff on multiple lines (e.g. destructuring assignment, HTML/JSX attributes, ternary operator, etc.)
1. JSX file have extension .jsx
1. Heavy use of ES6 goodies (async/await, operator destructuring, etc.)
   - async/await whenever possible. Wrap callback with a Promise.
   - string interpolation instead of string concatenation (e.g. const greeting = \`Hello ${name}\`) 
1. Use const or let instead of var
1. Preference of using lambda function over "binding" method in JSX component
1. Group css properties into the following groups: (positioning, block model, topography, decoration, animations, miscellanea) . Follow the order, specified in the curved braces.


### Run locally using skaffold 
 Make sure that deps-infra (postgres, redis, rabbitmq is up) is up and running

# !Note make sure that context is rancher-desktop
```bash 
kubectl config current-context 
```

Do the following commands

```bash
make skaffold
```

## Enabling/Disabling vault usage
You can enable or disable vault secret usage without modifying kubernetes yaml files. By default vault usage is set to false inside value.yaml file but we override this value with VAULT_ENABLE_DEV, VAULT_ENABLE_QA, VAULT_ENABLE_INS, VAULT_ENABLE_DEMO, VAULT_ENABLE_DS variables from Settings >> CI/CD for each environment. If you change variable value from Settings >> CI/CD you need to manually start new pipeline from CI/CD >> Pipelines.
