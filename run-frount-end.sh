#!/bin/bash

# This bash script will run the React App
# If this script does not run it may require a 'chmod 755'

# Change to the directory of this file:
DIR_PATH="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )";
cd "$DIR_PATH";

# Run the React front end
cd "$DIR_PATH/front-end/swin-pharma"
npm install
npm start

