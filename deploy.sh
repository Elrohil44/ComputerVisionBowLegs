#!/bin/bash

chmod 400 ./deploy-key

ssh travis@${EC2_INSTANCE_IP}
sudo su - bowlegs
cd ComputerVisionBowLegs
bash ./update.sh

echo "Deployment finished"
