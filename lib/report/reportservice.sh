#!/bin/bash
# This shell can restart the email sender service.

#####Functions
function start_emailsender
{
    forever_list=$(forever list | grep $2)
    if [ "$forever_list" != "" ]; then
        forever restart $1
        exit 0
    else
        forever start --uid "email_sender_service" -l email_sender_forever.log -o email_sender_output.log -e email_sender_error.log $1
        exit 0
    fi
}

######Main
if [ "$1" == "" ]; then
   echo "The program need first argument to specify the file path."
   if ["$2" == ""]; then
       echo "The program need second argument to specify the service name."
   fi
else
   start_emailsender $1 $2
fi