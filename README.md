# GarageBot

## Instructions for development
* Each feature must be developped on one branch coming from the dev branch
* Each feature must be developped inside the folder component with a folder per feature and a index.ts inside
* Pull request must be done to merge branch to the dev one
* All logs must be done by using the Logger class (You can instantiate one logger per class and specify 'this' in the constructor), all the logs 
in this class will be then linked to this class
* All private and protected attributes and methods must start by an underscore (_)
* ⚠️⚠️ .env file must be added to the root in order to run the bot ⚠️⚠️
* indentations are set to "space: 2"
* A mysql db must be available without root password through a docker stack or in local

## Instructions for deployment
* Download docker desktop
* RUN 'docker-compose up -d --build' in your terminal

## Instruction for use
* You need to go on the root URL (in dev mode : localhost:3000) to add the bot to your discord server

## Instruction for the Voice Channel Feature
* You have to be adminitrator of your guild to enable this feature
* tap : "!g cvc start" to enable the feature
* tap : "!g cvc stop" to disable the feature
* Once the feature enabled, everyone can click on the + to create a temporary discord vocal channel
* If the creator is already in a vocal channel he will be moved to the new one
* If a vocal channel is empty it will be delete