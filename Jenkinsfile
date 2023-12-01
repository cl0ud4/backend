pipeline {
	agent any
	environment {
		PROJECT_ID='cloud-401704'
		CLUSTER_NAME='k8s'
		LOCATION='asia-northeast3-a'
		CREDENTIALS_ID='nemo-gke'
		BUILD_ID='0.1'
	}
	stages {
		stage("Build image") {
			steps {
				script {
					nemoserver = docker.build("listenyoon/nemo:${env.BUILD_ID})
				}

			}
		}
		stage("Push image") {
			steps {
         		       script {
                    			docker.withRegistry('https://registry.hub.docker.com', 'dockerhub') {
                            			nemoserver.push("latest")
			    			nemoserver.push("${env.BUILD_ID}")
                    			}
                		}
            		}
        	}
		stage('Deploy to GKE') {
	    		when {
				branch 'main'
	    		}
	    		steps{
				sh "sed -i 's/nemo:latest/nemo:${env.BUILD_ID}/g' deployment.yaml"
				step([$class: 'KubernetesEngineBuilder', projectId: env.PROJECT_ID, clusterName: env.CLUSTER_NAME, 
				location: env.LOCATION, manifestPattern: 'deployment.yaml', credentialsId: env.CREDENTIALS_ID])
	    		}
		}
	}
}
