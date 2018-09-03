#!/bin/bash

# This bash script will run both the ASP.NET WEB API
# If this script does not run it may require a 'chmod 755'

# Change to the directory of this file:
DIR_PATH="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )";
cd "$DIR_PATH";

# Run the WEB API: (is a better command avilable??)
dotnet run -p "$DIR_PATH/back-end/web-api/web-api/web-api.csproj"

