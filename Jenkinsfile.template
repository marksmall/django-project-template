def DOCKER_NETWORK = UUID.randomUUID().toString()
def DOCKER_CONTAINER_NAME = UUID.randomUUID().toString().replaceAll('-|[a-z]|0', '')
def POSTGRESQL_PORT = new Random().nextInt((65534 - 49151) + 1) + 49151

pipeline {

  agent {
    label 'master'
  }

  environment {
    SYS_ENV="ci"
    CODECOV_TOKEN="2a9495a8-8f5d-407a-809e-66e1ab15228c"
    DJANGO_SETTINGS_MODULE="core.settings"
    DJANGO_SETTING_DATABASE_HOST="${DOCKER_CONTAINER_NAME}"
    DJANGO_SETTING_DATABASE_PORT="${POSTGRESQL_PORT}"
    GIT_COMMIT_TRUNCATED="${GIT_COMMIT}".take(7)
    DOCKER_REPOSITORY="339570402237.dkr.ecr.eu-west-1.amazonaws.com/company/{project_name}}"
  }

  stages{
    stage("Prepare environment") {
      steps {
        sh "docker network create ${DOCKER_NETWORK}"
        sh """docker run -h ${DJANGO_SETTING_DATABASE_HOST} --network ${DOCKER_NETWORK} \
            --name ${DJANGO_SETTING_DATABASE_HOST} \
            -p ${DJANGO_SETTING_DATABASE_PORT}:5432 -d -t \
            -e POSTGRES_USER={project_name}}_user -e POSTGRES_PASS={project_name}}_password \
            -e ALLOW_IP_RANGE=0.0.0.0/0 -e POSTGRES_DBNAME={project_name}}_db kartoza/postgis:9.6-2.4"""
      }
    }

    stage("Frontend: Tests and build") {
      agent {
        docker {
          image 'node:10.15.3'
          args '-u root'
          label 'master'
        }
      }
      steps {
        dir("client") {
          sh "yarn install"
          sh "yarn test --coverage --watchAll=false"
          sh "./node_modules/.bin/codecov --clear -F frontend"
          sh "yarn build"
        }
      }
    }

    stage("Backend: Tests") {
      agent {
        dockerfile {
          args "-u root --network ${DOCKER_NETWORK} --link ${DOCKER_CONTAINER_NAME} --entrypoint=''"
          label 'master'
        }
      }
      steps {
        dir("server") {
          sh "mkdir -p /var/log/{project_name}}/"
          sh "touch /var/log/{project_name}}/django.log"
          sh "./manage.py collectstatic --noinput"
          sh "DJANGO_SETTINGS_MODULE=${DJANGO_SETTINGS_MODULE} pytest ./"
          sh "codecov -F backend"
          sh "rm -f coverage.xml"
        }
      }
    }

    stage("Docker: Build and tag image") {
      agent {
        label 'master'
      }
      steps{
        sh """docker build -t ${DOCKER_REPOSITORY}:${GIT_COMMIT_TRUNCATED} \
                    -t ${DOCKER_REPOSITORY}:${BRANCH_NAME} \
                    --build-arg COMMIT_HASH=${GIT_COMMIT_TRUNCATED} \
                    --build-arg GIT_BRANCH=${BRANCH_NAME} ."""
      }
    }

    stage("Frontend: E2E Cypress Tests") {
      agent {
        label 'master'
      }
      steps {
        withCredentials([file(credentialsId: 'company.{project_name}}.env.local', variable: '{project_name}}_ENV_LOCAL_FILE')]) {
          sh "rm -f .env.local || true"
          sh "cp \${project_name}}_ENV_LOCAL_FILE .env.local"
        }

        sh "./scripts/run-cypress-tests.sh || true # FIXME: Remove '|| true' when we are ready to fail when the tests fail"
        sh "rm -f .env.local"
        junit 'client/reports/*.xml'
      }
    }

    stage("Docker: Push image") {
      agent {
        label 'master'
      }
      when {
        expression {
          return BRANCH_NAME ==~ /master|v[0-9]{1,3}(.[0-9]{1,3}.[0-9]{1,3})/
        }
      }
      steps {
        sh "docker push ${DOCKER_REPOSITORY}:${GIT_COMMIT_TRUNCATED}"
        sh "docker push ${DOCKER_REPOSITORY}:${BRANCH_NAME}"
      }
    }

    stage("Deploy: Testing") {
      when {
        expression {
            return BRANCH_NAME ==~ /master|v[0-9]{1,3}(.[0-9]{1,3}.[0-9]{1,3})/
        }
      }
      steps{
        build job: '/{project_name}}/deploy-to-swarm', propagate: false, parameters: [
            [$class: 'StringParameterValue', name: 'ENVIRONMENT', value: "testing"],
            [$class: 'StringParameterValue', name: 'ARTIFACT', value: "${GIT_COMMIT_TRUNCATED}"]
        ]
      }
    }
  }

  post {
    always {
      sh "docker rm --force ${DJANGO_SETTING_DATABASE_HOST}"
      sh "docker network rm ${DOCKER_NETWORK}"
      cleanWs()
    }
    success {
      slackSend channel: '#{project_name}}-code', color: 'good', message: "{project_name}}: Successful build of ${BRANCH_NAME}!"
    }
    failure {
      slackSend channel: '#{project_name}}-code', color: 'warning', message: "{project_name}}: Unsuccessful build of ${BRANCH_NAME} :finnadie: ${JOB_URL}"
    }
  }
}
