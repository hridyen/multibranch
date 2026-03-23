pipeline {
    agent any

    options {
        skipDefaultCheckout(true)
    }

    environment {
        APP_NAME = "multi-branch-project"
        REPO_URL = "https://github.com/hridyen/multibranch.git"
    }

    stages {

        stage('Init Repo') {
            steps {
                git branch: "main",
                    url: "${REPO_URL}"
            }
        }

        stage('Detect Latest Branch') {
            steps {
                script {
                    def branch = sh(
                        script: "git for-each-ref --sort=-committerdate refs/remotes/origin/ | head -n 1 | sed 's#.*/##'",
                        returnStdout: true
                    ).trim()

                    env.ACTIVE_BRANCH = branch
                    echo " Latest updated branch: ${env.ACTIVE_BRANCH}"
                }
            }
        }

        stage('Checkout Code') {
            steps {
                git branch: "${env.ACTIVE_BRANCH}",
                    url: "${REPO_URL}"
            }
        }

        stage('Build Docker Image') {
            steps {
                sh "docker build -t ${APP_NAME}:${env.ACTIVE_BRANCH} ."
            }
        }

        stage('Run Container') {
            steps {
                script {
                    def port = (env.ACTIVE_BRANCH == "main") ? "3003" : "3004"

                    sh """
                    docker rm -f ${APP_NAME}-${env.ACTIVE_BRANCH} || true

                    docker run -d -p ${port}:3000 \
                    -e BRANCH=${env.ACTIVE_BRANCH} \
                    --name ${APP_NAME}-${env.ACTIVE_BRANCH} \
                    ${APP_NAME}:${env.ACTIVE_BRANCH}
                    """
                }
            }
        }

        stage('Health Check') {
            steps {
                sh "docker ps | grep ${APP_NAME}-${env.ACTIVE_BRANCH}"
            }
        }
    }

    post {
        success {
            echo " SUCCESS for ${env.ACTIVE_BRANCH}"
        }
        failure {
            echo " FAILED"
        }
    }
}