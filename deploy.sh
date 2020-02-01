#!/bin/bash

DEPLOYMENT_KEY=./deploy-key
DEPLOYMENT_SERVER=$EC2_INSTANCE_IP

eval "$(ssh-agent -s)"
chmod 600 "${DEPLOYMENT_KEY}"
ssh-add "${DEPLOYMENT_KEY}"

ssh-keyscan -H "${DEPLOYMENT_SERVER}" >> ~/.ssh/known_hosts
ssh -t "travis@${DEPLOYMENT_SERVER}" "sudo su - bowlegs -c \"cd ./ComputerVisionBowLegs && bash update.sh\""
echo "Deployment finished!"
