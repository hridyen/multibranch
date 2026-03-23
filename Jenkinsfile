pipeline {
    agent { label 'ubuntu-agent' }

    parameters {
        string(name: 'BRANCH_NAME', defaultValue: 'main', description: 'Branch to build')
    }

    environment {
        APP_NAME = "multibranch-singlepipeline"
    }

    stages {

        stage('Checkout') {
            steps {
                git branch: "${params.BRANCH_NAME}",
                    url: 'https://github.com/hridyen/multibranch-singlepipeline.git'
            }
        }

        stage('Build Docker') {
            steps {
                sh "docker build -t ${APP_NAME}:${params.BRANCH_NAME} ."
            }
        }

        stage('Run Container') {
            steps {
                script {

                    def port = ""

                    if (params.BRANCH_NAME == "main") {
                        port = "3004"
                    } else if (params.BRANCH_NAME == "dev") {
                        port = "3005"
                    } else {
                        port = "3006"
                    }

                    sh """
                    docker rm -f ${APP_NAME}-${params.BRANCH_NAME} || true

                    docker run -d -p ${port}:3000 \
                    -e BRANCH=${params.BRANCH_NAME} \
                    --name ${APP_NAME}-${params.BRANCH_NAME} \
                    ${APP_NAME}:${params.BRANCH_NAME}
                    """
                }
            }
        }

        stage('Deploy DEV') {
            when {
                expression { params.BRANCH_NAME == 'dev' }
            }
            steps {
                echo " DEV DEPLOY"
            }
        }

        stage('Deploy PROD') {
            when {
                expression { params.BRANCH_NAME == 'main' }
            }
            steps {
                echo " PROD DEPLOY"
            }
        }
    }
}
