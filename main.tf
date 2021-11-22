terraform {
  required_providers {
    azurerm = "1.31.0"
  }
}

# Extract the connection from the normal yaml file to pass to the app container
# This yaml file should not be part of the repo, have a second for config other then credentials and URL
data "external" "yaml" {
  program = ["${var.python_binary}", "${path.module}/parseyaml.py"]
}

#Set up a personal resource group for the SE local to them
resource "azurerm_resource_group" "personal" {
  name     = "Sales-Engineer-${var.initials}"
  location = "${var.location}"
}

#Set up a container group
resource "azurerm_container_group" "app" {
  name                = "${var.appname}-${var.initials}"
  location            = "${azurerm_resource_group.personal.location}"
  resource_group_name = "${azurerm_resource_group.personal.name}"
  ip_address_type     = "public"
  dns_name_label      = "${replace(var.appname,"/[^-0-9a-zA-z]/","-")}-${var.initials}"
  os_type             = "linux"

 container {
    name   = "web"
    image  = "contrastsecuritydemo/nodegoat:1.3.0"
    cpu    = "1"
    memory = "1.5"
    ports {
      port      = var.application_port
      protocol  = "TCP"
    }
    commands =  var.commands

#  the following come from contrast_security.yaml that should not be part of the repo
    environment_variables = {
      #do not change localhost, it is correct for an Azure container group
      MONGODB_URI="mongodb://localhost:27017/nodegoat"
      API__API_KEY="${data.external.yaml.result.api_key}"
      API__SERVICE_KEY="${data.external.yaml.result.service_key}"
      API__USER_NAME="${data.external.yaml.result.user_name}"
      API__URL="${data.external.yaml.result.url}"
      APPLICATION__NAME="${var.appname}"
      APPLICATION__SESSION_METADATA="${var.session_metadata}"
      APPLICATION__TAGS="${var.apptags}"
      SERVER__NAME="${var.servername}"
      SERVER__ENVIRONMENT="${var.environment}"
      SERVER__TAGS="${var.servertags}"
    }
  }

  container {    
    name   = "mongo"
    image  = "mongo:latest"
    cpu    = "1"
    memory = "1.5"
    ports {
      port      = 27017
      protocol  = "TCP"
    }
  }
}
