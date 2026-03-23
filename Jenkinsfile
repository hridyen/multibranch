pipeline {
    agent { label 'ubuntu-agent' }

    options {
        skipDefaultCheckout(true)
    }

    parameters {
        choice(
            name: 'BRANCH_NAME',
            choices: ['main', 'dev'],
            description: 'Select branch to deploy'
        )
    }

    environment {
        APP_NAME = "multi-branch-project"
    }

    stages {

        stage('Checkout Code') {
            steps {
                git branch: "${params.BRANCH_NAME}",
                    url: 'https://github.com/hridyen/multi-branch-project.git'
            }
        }

        stage('Build Docker Image') {
            steps {
                echo "🔨 Building Docker image for ${params.BRANCH_NAME}"
                sh "docker build -t ${APP_NAME}:${params.BRANCH_NAME} ."
            }
        }

        stage('Run Container') {
            steps {
                script {

                    // 🔥 Fixed ports
                    def port = (params.BRANCH_NAME == "main") ? "3003" : "3004"

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
                echo " DEV DEPLOY SUCCESS on port 3004"
            }
        }

        stage('Deploy PROD') {
            when {
                expression { params.BRANCH_NAME == 'main' }
            }
            steps {
                echo "PROD DEPLOY SUCCESS on port 3003"
            }
        }

        stage('Health Check') {
            steps {
                echo " Checking running container..."
                sh "docker ps | grep ${APP_NAME}-${params.BRANCH_NAME}"
            }
        }
    }

    post {
        success {
            echo "Pipeline SUCCESS for ${params.BRANCH_NAME}"
        }
        failure {
            echo " Pipeline FAILED for ${params.BRANCH_NAME}"
        }
    }
}
