#!/bin/bash

# This bash script will run the ASP.NET WEB API
# If this script does not run it may require a 'chmod 755'

# Change to the directory of this file:
DIR_PATH="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )";
cd "$DIR_PATH";

# Run the WEB API:
dotnet run -c Release -p "$DIR_PATH/back-end/web-api/web-api/web-api.csproj"

