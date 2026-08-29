pipeline {
    agent any
    stages {
        stage ('build') {
         steps {
            sh'''
            whoami
            aws ecr get-login-password --region eu-north-1 | docker login --username AWS --password-stdin 109573999282.dkr.ecr.eu-north-1.amazonaws.com
            docker build -t docker-project .
            docker tag docker-project:latest 109573999282.dkr.ecr.eu-north-1.amazonaws.com/docker-project:${BUILD_NUMBER}
            docker push 109573999282.dkr.ecr.eu-north-1.amazonaws.com/docker-project:${BUILD_NUMBER}
            '''

         }   
        }
        stage('deploy') {
                steps {
                    sh '''
                    whoami
                    ssh -i /var/lib/jenkins/ssh-key.pem -o StrictHostKeyChecking=no  ubuntu@ec2-13-53-135-98.eu-north-1.compute.amazonaws.com 'bash -s' < ./deploy.sh \${BUILD_NUMBER}
                    '''

                }
        }
    }
}
