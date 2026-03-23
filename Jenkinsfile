pipeline {
    agent { label 'ubuntu-agent' }

    parameters {
        choice(
            name: 'BRANCH_NAME',
            choices: ['main', 'dev'],
            description: 'Select branch'
        )
    }

    environment {
        APP_NAME = "multi-branch-project"
    }

    stages {

        stage('Checkout') {
            steps {
                git branch: "${params.BRANCH_NAME}",
                    url: 'https://github.com/hridyen/multi-branch-project.git'
            }
        }

        stage('Build Docker Image') {
            steps {
                sh "docker build -t ${APP_NAME}:${params.BRANCH_NAME} ."
            }
        }

        stage('Run Container') {
            steps {
                script {

                    def port = ""

                    if (params.BRANCH_NAME == "main") {
                        port = "3003"
                    } else if (params.BRANCH_NAME == "dev") {
                        port = "3004"
                    }

                    echo "Running ${params.BRANCH_NAME} on port ${port}"

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
                echo "DEV DEPLOY"
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

    post {
        success {
            echo " Pipeline SUCCESS for ${params.BRANCH_NAME}"
        }
    }
}
