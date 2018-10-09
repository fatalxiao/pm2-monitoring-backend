#!/usr/bin/env bash

pm2 delete pm2-monitoring-backend

# replace files
if [ -a ./pm2-monitoring-backend ]
then
    rm -rf pm2-monitoring-backend
fi
unzip pm2-monitoring-backend.zip

# start server
cd pm2-monitoring-backend
npm i
pm2 start
