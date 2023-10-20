# NodeGoat: A deliberately insecure Node.js web application

This sample application is based on https://github.com/OWASP/NodeGoat.git.

**Warning**: The computer running this application will be vulnerable to attacks, please take appropriate precautions.

# Running standalone

You can run NodeGoat locally on any machine with Node.js LTS installed.

1. Place a `contrast_security.yaml` file into the application's root folder.
1. Run `npm install @contrast/agent` for Assess or `npm install @contrast/protect-agent` for Protect .
1. Create Mongo DB:
        * If using local Mongo DB instance, start [mongod](http://docs.mongodb.org/manual/reference/program/mongod/#bin.mongod).
        * Update the `db` property in file `config/env/development.js` to reflect your DB setup. (in format: `mongodb://localhost:27017/<databasename>`)
1. Populate MongoDB with seed data required for the app
    * Run the `npm run db:seed` to populate the DB with seed data required for the application. Pass the desired environment as argument. If not passed, "development" is the default.
1. Start the server using `npm start`, the Contrast agent will already be enabled.
1. Browse the application at http://localhost:4000/NodeGoat/

# Running in Docker

You can run NodeGoat within a Docker container. 

1. Place a `contrast_security.yaml` file into the application's root folder.
1. Build the NodeGoat container image using `docker-compose build`. The Contrast v4 (Assess) agent is added automatically during the Docker build process.
1. Run the container using `docker-compose up`, this will start a local mongodb container and the web server together.
1. Browse the application at http://localhost:4000/NodeGoat/

# Running in Azure (Azure App Service):

## Pre-Requisites

1. Place a `contrast_security.yaml` file into the application's root folder.
1. Install Terraform from here: https://www.terraform.io/downloads.html.
1. Install PyYAML using `pip install PyYAML`.
1. Install the Azure cli tools using `brew update && brew install azure-cli`.
1. Log into Azure to make sure you cache your credentials using `az login`.
1. Edit the [variables.tf](variables.tf) file (or add a terraform.tfvars) to add your initials, preferred Azure location, app name, server name and environment.
1. Run `terraform init` to download the required plugins.
1. Run `terraform plan` and check the output for errors.
1. Run `terraform apply` to build the infrastructure that you need in Azure, this will output the web address for the application. 
1. Run `terraform destroy` when you would like to stop the app service and release the resources.

## Updating the Docker Image

You can re-build the docker image by running two scripts in order:

* image.sh
* deploy.sh

## License
Code licensed under the [Apache License v2.0.](http://www.apache.org/licenses/LICENSE-2.0)