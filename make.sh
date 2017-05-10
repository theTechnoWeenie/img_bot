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
  docker)
    if [ -z $2 ]; then
      echo "Must supply a version!"
      exit 1
    fi
    docker build -t img_bot:$2 .
    ;;
  docker-run)
    if [ -z $2 ]; then
      echo "Must supply a run port"
      exit 1
    fi
    docker run -d -p $2:3000 img_bot:latest
    ;;
  *)
    echo unrecognized command "$action"
    exit 1
esac
