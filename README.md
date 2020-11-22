# GarageBot

## Instructions for development
* Each feature must be developped on one branch coming from the dev branch
* Each feature must be developped inside the folder component with a folder per feature and a index.ts inside
* Pull request must be done to merge branch to the dev one
* ⚠️⚠️ .env file must be added to the root in order to run the bot ⚠️⚠️
* indentations are set to "space: 2"
* A mysql db must be available without root password through a docker stack or in local

## Instructions for deployment
* Download docker desktop
* RUN 'docker-compose up -d --build' in your terminal