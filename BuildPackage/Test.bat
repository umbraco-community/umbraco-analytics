set APPVEYOR_BUILD_NUMBER=100
set APPVEYOR_BUILD_VERSION=1.1.0.100

set UMBRACO_PACKAGE_MIN_VERSION=7.1.4
set UMBRACO_PACKAGE_PRERELEASE_SUFFIX=BleedingEdge

REM ** Generally branch should be either master or develop (GitFlow) **
set APPVEYOR_REPO_BRANCH=develop

build.bat