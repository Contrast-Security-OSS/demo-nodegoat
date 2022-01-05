terraform {
  required_providers {
    azurerm = "1.31.0"
  }
}

# Extract the connection from the normal yaml file to pass to the app container
# This yaml file should not be part of the repo, have a second for config other then credentials and URL
data "external" "yaml" {
  program = [var.python_binary, "${path.module}/parseyaml.py"]
}

#Set up a personal resource group for the SE local to them
resource "azurerm_resource_group" "personal" {
  name     = "Sales-Engineer-${var.initials}"
  location = var.location
}

#Set up a container group
resource "azurerm_container_group" "app" {
  name                = "${var.appname}-${var.initials}"
  location            = azurerm_resource_group.personal.location
  resource_group_name = azurerm_resource_group.personal.name
  ip_address_type     = "public"
  dns_name_label      = "${replace(var.appname,"/[^-0-9a-zA-z]/","-")}-${var.initials}"
  os_type             = "linux"

 container {
    name   = "web"
    image  = "contrastsecuritydemo/nodegoat:1.3.0"
    cpu    = "2"
    memory = "3"
    ports {
      port      = var.application_port
      protocol  = "TCP"
    }
    commands =  var.commands

#  the following come from contrast_security.yaml that should not be part of the repo
    environment_variables = {
      #do not change localhost, it is correct for an Azure container group
      MONGODB_URI="mongodb://localhost:27017/nodegoat"
      CONTRAST__API__API_KEY=data.external.yaml.result.api_key
      CONTRAST__API__SERVICE_KEY=data.external.yaml.result.service_key
      CONTRAST__API__USER_NAME=data.external.yaml.result.user_name
      CONTRAST__API__URL=data.external.yaml.result.url
      CONTRAST__APPLICATION__NAME=var.appname
      CONTRAST__APPLICATION__SESSION_METADATA=var.session_metadata
      CONTRAST__APPLICATION__TAGS=var.apptags
      CONTRAST__SERVER__NAME=var.servername
      CONTRAST__SERVER__ENVIRONMENT=var.environment
      CONTRAST__SERVER__TAGS=var.servertags
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
