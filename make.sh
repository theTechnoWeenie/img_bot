#!/bin/bash

function build() {
  echo "Building application"
  npm install
}

action=$1
if [ -z $action ] ; then 
    action="build"
fi
case "$action" in
  build)
    build
    ;;
  serve)
    node main.js
    ;;
  *)
    echo unrecognized command "$action"
    exit 1
esac