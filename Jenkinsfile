pipeline {
    agent any

    options {
        skipDefaultCheckout(true)
    }

    environment {
        APP_NAME = "multi-branch-project"
    }

    stages {

        stage('Detect Latest Branch') {
            steps {
                script {
                    def branch = sh(
                        script: "git ls-remote origin refs/heads/* --sort='-committerdate' | head -n 1 | awk -F'/' '{print $3}'",
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
                    url: 'https://github.com/hridyen/multi-branch-project.git'
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

                    echo " Running ${env.ACTIVE_BRANCH} on port ${port}"

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

        stage('Deploy Info') {
            steps {
                echo " Deployed ${env.ACTIVE_BRANCH}"
            }
        }
    }
}