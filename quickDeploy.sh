#!/bin/sh

env=$1

cd /root

if [ "$env" == "SIT" ];then

echo '======================================================'
echo 'start update svn resource...'

svn co https://115.28.205.176:8443/svn/imarketingSVN/master/ /var/www/test_NodeJsServer_sit

echo 'update svn resource success!'
echo '======================================================'
echo 'start update config....'

cp /var/www/NodeJsServer_sit/config/sit_cfg.js /var/www/test_NodeJsServer_sit/Config.js

echo 'update config resource success!'
echo '======================================================'
echo 'start npm install....'

cd /var/www/test_NodeJsServer_sit
npm install

echo 'npm install success!'
echo '======================================================'
echo 'start restart forever...'

elif [ "$env" == "PROD" ];then

echo '======================================================'
echo 'start update svn resource...'

svn co https://115.28.205.176:8443/svn/imarketingSVN/master/ /var/www/test_NodeJsServer_prod

echo 'update svn resource success!'
echo '======================================================'
echo 'start update config....'

cp /var/www/NodeJsServer_sit/config/prod_cfg.js /var/www/test_NodeJsServer_prod/Config.js

echo 'update config resource success!'
echo '======================================================'
echo 'start npm install....'
cd /var/www/test_NodeJsServer_prod

npm install

echo 'npm install success!'
echo '======================================================'
echo 'start restart forever...'

else

echo 'There is no parameter'

fi

forever restartall

echo 'restart forever success'
echo '========================================================'

echo 'start to restart redis...'
service redis restart
echo 'redis restart success!'
