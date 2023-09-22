pipeline{
    agent any

    environment {
        SVC_NAME="topo-front-end"
        DEFAULT_WORKSPACE = "${WORKSPACE}"
        YANHUA_HARBOR_SECRET=credentials('yanhua-harbor-secret')
    }

    stages{
        stage("代码编译"){
            agent {
                //默认是从maven中央仓库下载 mvn可以用-s指定配置文件
                docker {
                    image 'node:18'
                    args "-v ${DEFAULT_WORKSPACE}:/home/node"
                }
            }
            steps{
                sh 'echo ${WORKSPACE}'
                echo "========开始检查环境信息========"
                sh 'node -v'
                sh 'npm -v'
                sh 'npm config set registry https://registry.npm.taobao.org'
                sh 'cd /home/node && npm install'
                sh 'cd /home/node && npm run build'
            }
        }

        stage('提交到私仓') {
            steps {
                sh 'echo ${WORKSPACE}'
                sh "ls"
                sh "docker build -t harbor.internal.wise-paas.cn/microservice/${SVC_NAME}:latest -f Dockerfile ."
                sh "docker login -u ${YANHUA_HARBOR_SECRET_USR} -p ${YANHUA_HARBOR_SECRET_PSW} harbor.internal.wise-paas.cn"
                sh "docker push harbor.internal.wise-paas.cn/microservice/${SVC_NAME}:latest"
                sh "rm -rf dist"
            }
        }

        stage("远程分发"){
            steps{
                            ansiblePlaybook (
                                playbook: "${WORKSPACE}/ansible/playbook.yml",
                                inventory: "${WORKSPACE}/ansible/hosts",
                                credentialsId: "yanhua-host-ssh",
                                extraVars:[
                                    deploy_file:'${WORKSPACE}',
                                    svc_name:'${SVC_NAME}'
                                ]
                            )
            }
        }

        stage("重启程序"){
            steps{
                ansiblePlaybook (
                    playbook: "${WORKSPACE}/ansible/restart.yml",
                    inventory: "${WORKSPACE}/ansible/hosts",
                    credentialsId: "yanhua-host-ssh",
                    extraVars:[
                        svc_name:'${SVC_NAME}'
                    ]
                )
            }
        }

        stage('推送企业微信'){
            steps {
                script {
                   sh(script:"curl --location 'https://qyapi.weixin.qq.com/cgi-bin/webhook/send?key=407eda08-1d55-463d-8ab1-0c5042548691' --header 'Content-Type: application/json' --data '{\"msgtype\": \"text\",\"text\": {\"content\": \"任务：${JOB_NAME} 部署结束，访问地址：http://${SVC_NAME}.shanyuan1.wise-insightapm.com\"}}'")
                }
            }
        }
    }
}