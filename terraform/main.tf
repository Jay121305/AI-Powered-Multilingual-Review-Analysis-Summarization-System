# Terraform Configuration for Multi-Cloud Deployment

terraform {
  required_version = ">= 1.0"
  
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
    azurerm = {
      source  = "hashicorp/azurerm"
      version = "~> 3.0"
    }
    google = {
      source  = "hashicorp/google"
      version = "~> 5.0"
    }
  }

  backend "s3" {
    bucket = "product-analyzer-terraform-state"
    key    = "prod/terraform.tfstate"
    region = "us-east-1"
  }
}

# Variables
variable "environment" {
  type    = string
  default = "production"
}

variable "gemini_api_key" {
  type      = string
  sensitive = true
}

variable "aws_region" {
  type    = string
  default = "us-east-1"
}

# AWS Provider
provider "aws" {
  region = var.aws_region
}

# Azure Provider
provider "azurerm" {
  features {}
}

# GCP Provider
provider "google" {
  project = "your-gcp-project"
  region  = "us-central1"
}

# AWS Infrastructure
module "aws_infrastructure" {
  source = "./modules/aws"
  
  environment     = var.environment
  gemini_api_key = var.gemini_api_key
  
  # Networking
  vpc_cidr = "10.0.0.0/16"
  
  # Compute
  instance_type = "t3.medium"
  min_size      = 2
  max_size      = 10
  desired_size  = 3
  
  # Database
  db_instance_class = "db.t3.micro"
  db_storage_gb     = 20
  
  # Cache
  redis_node_type = "cache.t3.micro"
}

# Azure Infrastructure (Alternative/Backup)
module "azure_infrastructure" {
  source = "./modules/azure"
  
  environment     = var.environment
  gemini_api_key = var.gemini_api_key
  location       = "East US"
  
  # App Service
  app_service_plan_tier = "P1v2"
  
  # Database
  postgresql_sku = "GP_Gen5_2"
  
  # Redis Cache
  redis_capacity = 1
  redis_family   = "C"
  redis_sku      = "Standard"
}

# GCP Infrastructure (Alternative/Multi-region)
module "gcp_infrastructure" {
  source = "./modules/gcp"
  
  environment     = var.environment
  gemini_api_key = var.gemini_api_key
  region         = "us-central1"
  
  # Compute
  machine_type     = "e2-medium"
  min_replicas     = 2
  max_replicas     = 10
  target_cpu_usage = 0.7
  
  # Database
  db_tier = "db-f1-micro"
  
  # Redis
  redis_memory_size_gb = 1
}

# Global CDN (CloudFlare)
resource "cloudflare_zone" "main" {
  zone = "yourproductanalyzer.com"
}

resource "cloudflare_record" "www" {
  zone_id = cloudflare_zone.main.id
  name    = "www"
  value   = module.aws_infrastructure.alb_dns
  type    = "CNAME"
  proxied = true
}

# Monitoring & Alerting
module "monitoring" {
  source = "./modules/monitoring"
  
  environment = var.environment
  
  # AWS CloudWatch
  aws_alarms_enabled = true
  
  # Datadog Integration
  datadog_api_key = var.datadog_api_key
  
  # PagerDuty Integration
  pagerduty_integration_key = var.pagerduty_key
}

# Outputs
output "aws_load_balancer_url" {
  value = module.aws_infrastructure.alb_dns
}

output "azure_app_service_url" {
  value = module.azure_infrastructure.app_service_url
}

output "gcp_load_balancer_ip" {
  value = module.gcp_infrastructure.load_balancer_ip
}

output "cdn_url" {
  value = "https://www.yourproductanalyzer.com"
}
