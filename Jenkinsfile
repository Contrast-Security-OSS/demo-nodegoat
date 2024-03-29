pipeline {
    agent any
    tools {
        terraform 'terraform'
    }

    stages {
        stage('dependencies') {
            steps {
                script {
                    withCredentials([file(credentialsId: env.contrast_yaml, variable: 'path')]) {
                        def contents = readFile(env.path)
                        writeFile file: 'contrast_security.yaml', text: "$contents"
                    }
                }
                sh '''
                terraform init -upgrade
                npm i @playwright/test@1.32.1 --no-bin-links --no-save
                npx playwright@1.32.1 install --with-deps chromium
                '''
            }
        }
        stage('provision') {
            steps {
                script {
                    withCredentials([azureServicePrincipal('ContrastAzureSponsored')]) {
                        try {
                            sh """
                            export ARM_CLIENT_ID=$AZURE_CLIENT_ID
                            export ARM_CLIENT_SECRET=$AZURE_CLIENT_SECRET
                            export ARM_SUBSCRIPTION_ID=$AZURE_SUBSCRIPTION_ID
                            export ARM_TENANT_ID=$AZURE_TENANT_ID
                            terraform apply -auto-approve \
                                -var "location=$location" \
                                -var "initials=$initials" \
                                -var "environment=qa" \
                                -var "servername=jenkins" \
                                -var 'commands=["sh", "-c", "until nc -z -w 2 localhost 27017 && echo \\"mongo is ready for connections\\" && npm run db:seed && npm run contrast; do sleep 2; done"]' \
                                -var 'session_metadata=branchName=qa,committer=Abdul,buildNumber=${env.BUILD_NUMBER}'
                            """
                        } catch (Exception e) {
                            echo "Terraform refresh failed, deleting state"
                            sh "rm -rf terraform.tfstate"
                            currentBuild.result = "FAILURE"
                            error("Aborting the build.")
                        }
                    }
                }
            }
        }
        stage('sleeping') {
            steps {
                sleep 120
            }
        }
        stage('exercise - qa') {
            steps {
                script {
                    try {
                        timeout(20) {
                            sh """
                            FQDN=\$(terraform output --raw fqdn)
                            BASEURL=\$FQDN npx playwright@1.32.1 test e2e/assess/*.ts
                            """
                        }
                    } catch (Exception e) {
                        echo 'Exercise stage failed, possible timeout'
                    }
                }
            }
        }
        stage('provision - dev') {
            steps {
                script {
                    withCredentials([azureServicePrincipal('ContrastAzureSponsored')]) {
                        try {
                            sh """
                            export ARM_CLIENT_ID=$AZURE_CLIENT_ID
                            export ARM_CLIENT_SECRET=$AZURE_CLIENT_SECRET
                            export ARM_SUBSCRIPTION_ID=$AZURE_SUBSCRIPTION_ID
                            export ARM_TENANT_ID=$AZURE_TENANT_ID
                            terraform apply -auto-approve \
                                -var "location=$location" \
                                -var "initials=$initials" \
                                -var "environment=development" \
                                -var "servername=Macbook-Pro" \
                                -var 'commands=["sh", "-c", "until nc -z -w 2 localhost 27017 && echo \\"mongo is ready for connections\\" && npm run db:seed && npm run contrast; do sleep 2; done"]' \
                                -var 'session_metadata=branchName=feat: add new dashboard,committer=Andros,buildNumber=${env.BUILD_NUMBER}'     
                            """
                        } catch (Exception e) {
                            echo "Terraform refresh failed, deleting state"
                            sh "rm -rf terraform.tfstate"
                            currentBuild.result = "FAILURE"
                            error("Aborting the build.")
                        }
                    }
                }
            }
        }
        stage('sleeping - dev') {
            steps {
                sleep 120
            }
        }
        stage('exercise - dev') {
            steps {
                script {
                    try {
                        timeout(20) {
                            sh """
                            FQDN=\$(terraform output --raw fqdn)
                            BASEURL=\$FQDN npx playwright@1.32.1 test e2e/assess/*.ts
                            """
                        }
                    } catch (Exception e) {
                        echo 'Exercise stage failed, possible timeout'
                    }
                }
            }
        }
        stage('provision - prod') {
            steps {
                script {
                    withCredentials([azureServicePrincipal('ContrastAzureSponsored')]) {
                        try {
                            sh """
                            export ARM_CLIENT_ID=$AZURE_CLIENT_ID
                            export ARM_CLIENT_SECRET=$AZURE_CLIENT_SECRET
                            export ARM_SUBSCRIPTION_ID=$AZURE_SUBSCRIPTION_ID
                            export ARM_TENANT_ID=$AZURE_TENANT_ID
                            terraform apply -auto-approve \
                                -var "location=$location" \
                                -var "initials=$initials" \
                                -var "environment=production" \
                                -var "servername=Prod-01" \
                                -var 'commands=["sh", "-c", "until nc -z -w 2 localhost 27017 && echo \\"mongo is ready for connections\\" && npm run db:seed && npm run contrast; do sleep 2; done"]' 
                            """
                        } catch (Exception e) {
                            echo "Terraform refresh failed, deleting state"
                            sh "rm -rf terraform.tfstate"
                            currentBuild.result = "FAILURE"
                            error("Aborting the build.")
                        }
                    }
                }
            }
        }
        stage('exercise - prod') {
            steps {
                script {
                    try {
                        timeout(20) {
                            sh """
                            FQDN=\$(terraform output --raw fqdn)
                            BASEURL=\$FQDN npx playwright@1.32.1 test e2e/protect/*.ts
                            """
                        }
                    } catch (Exception e) {
                        echo "Attack stage failed, possible timeout"
                    }
                }
                
            }
        }
        stage('destroy') {
            steps {
                withCredentials([azureServicePrincipal('ContrastAzureSponsored')]) {
                    sh """export ARM_CLIENT_ID=$AZURE_CLIENT_ID
                    export ARM_CLIENT_SECRET=$AZURE_CLIENT_SECRET
                    export ARM_SUBSCRIPTION_ID=$AZURE_SUBSCRIPTION_ID
                    export ARM_TENANT_ID=$AZURE_TENANT_ID
                    terraform destroy -auto-approve"""
                }
            }
        }
    }
}
