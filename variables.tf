variable "initials" {
  description = "Enter your initials to include in URLs etc"
  default = ""
}

variable "location" {
  description = "The Azure location where all resources in this example should be created, e.g. UK South or West US"
  default = ""
}

variable "appname" {
  description = "The name of the app to display in Contrast TeamServer (no spaces)"
  default = "nodegoat"
}

variable "servername" {
  description = "The name of the server to display in Contrast TeamServer."
  default = ""
}

variable "environment" {
  description = "The Contrast environment for the app. Valid values: development, qa or production"
  default = "development"
}

variable "commands" {
  type        = list(string)
  description = "The commands to run when the container is started"
  default     = ["npm","run","contrast"]
}

variable "application_port" {
  description = "Port upon which the application listens for connections"
  default = 4000
}

variable "session_metadata" {
  description = "See https://docs.contrastsecurity.com/user-vulnerableapps.html#session"
  default = ""
}

variable "python_binary" {
  description = "Path to local Python binary"
  default = "python3"
}

variable "apptags" {
  description = "Tags to be associated with the app in Contrast TeamServer."
  default = ""
}

variable "servertags" {
  description = "Tags to be associated with the server in Contrast TeamServer."
  default = ""
}

