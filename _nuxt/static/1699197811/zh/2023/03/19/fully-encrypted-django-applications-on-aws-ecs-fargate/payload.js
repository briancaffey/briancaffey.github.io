__NUXT_JSONP__("/zh/2023/03/19/fully-encrypted-django-applications-on-aws-ecs-fargate", (function(a,b,c,d,e,f,g,h,i,j,k,l,m,n,o,p,q,r,s,t,u,v,w,x,y,z,A,B,C,D,E,F,G,H,I,J,K,L,M,N,O,P,Q,R,S,T,U,V){return {data:[{article:{slug:"fully-encrypted-django-applications-on-aws-ecs-fargate",description:"Building and deploying fully encrypted Django applications on AWS ECS Fargate",title:"Fully encrypted Django applications on AWS ECS Fargate",date:"2023-03-19",tags:["django","encryption","aws","gunicorn","nginx","ecs","fargate",t,u],draft:v,comments:v,toc:[{id:w,depth:2,text:x},{id:y,depth:r,text:z},{id:A,depth:r,text:B},{id:C,depth:r,text:D},{id:E,depth:r,text:F},{id:t,depth:r,text:G},{id:H,depth:r,text:I},{id:J,depth:r,text:K},{id:u,depth:r,text:L}],body:{type:"root",children:[{type:b,tag:e,props:{},children:[{type:a,value:"This article demonstrates how to build fully encrypted web applications on AWS with ECS Fargate. I'll be using the Django web framework, but the concepts in this article can be implemented in any number of languages, libraries and frameworks. I'll be using Infrastructure as Code to show AWS resource configuration rather than showing how to configure things in the AWS Console. This article will expand on my last article where I build the same Django application on AWS with ECS Fargate using CDK, Terraform and Pulumi. I will be using each of these three tools to demonstrate the configuration of my fully encrypted application infrastructure."}]},{type:a,value:c},{type:b,tag:"h2",props:{id:w},children:[{type:b,tag:f,props:{href:"#what-is-a-fully-encrypted-django-application",ariaHidden:i,tabIndex:j},children:[{type:b,tag:k,props:{className:[l,m]},children:[]}]},{type:a,value:x}]},{type:a,value:c},{type:b,tag:e,props:{},children:[{type:a,value:"Here's a short definition of \"fully encrypted Django application\": each component of the system implements end-to-end encryption."}]},{type:a,value:c},{type:b,tag:e,props:{},children:[{type:a,value:"End-to-end encryption refers to the combination of "},{type:b,tag:h,props:{},children:[{type:a,value:"Encryption in Transit"}]},{type:a,value:" and "},{type:b,tag:h,props:{},children:[{type:a,value:"Encryption at Rest"}]},{type:a,value:M}]},{type:a,value:c},{type:b,tag:e,props:{},children:[{type:b,tag:f,props:{href:N,rel:[n,o,p],target:q},children:[{type:a,value:N}]},{type:a,value:M}]},{type:a,value:c},{type:b,tag:e,props:{},children:[{type:a,value:"Next, we need to think about the different components of our Django web application."}]},{type:a,value:c},{type:b,tag:e,props:{},children:[{type:b,tag:f,props:{href:"#"},children:[{type:a,value:"Diagram of Web Application components"}]}]},{type:a,value:c},{type:b,tag:e,props:{},children:[{type:a,value:"The main components include:"}]},{type:a,value:c},{type:b,tag:g,props:{},children:[{type:a,value:c},{type:b,tag:d,props:{},children:[{type:a,value:"application load balancer (main entrypoint for traffic entering our system)"}]},{type:a,value:c},{type:b,tag:d,props:{},children:[{type:a,value:"ECS services that run the Django web server, worker nodes and task schedulers"}]},{type:a,value:c},{type:b,tag:d,props:{},children:[{type:a,value:"access patterns for opening a shell in a container over a secure connection (ECS Exec)"}]},{type:a,value:c},{type:b,tag:d,props:{},children:[{type:a,value:"RDS database store (in-transit and at-rest encryption)\n"},{type:b,tag:g,props:{},children:[{type:a,value:c},{type:b,tag:d,props:{},children:[{type:a,value:"Encrypted database fields"}]},{type:a,value:c}]},{type:a,value:c}]},{type:a,value:c},{type:b,tag:d,props:{},children:[{type:a,value:"Redis and ElastiCache (in-transit and at-rest encryption)"}]},{type:a,value:c},{type:b,tag:d,props:{},children:[{type:a,value:"S3 (in-transit and at-rest encryption)"}]},{type:a,value:c},{type:b,tag:d,props:{},children:[{type:a,value:"Misc Security concerns (Django's SECRET_KEY, AWS Secrets Manager, KMS, self-signed certificates, OpenSSL)"}]},{type:a,value:c}]},{type:a,value:c},{type:b,tag:e,props:{},children:[{type:a,value:"Wherever possible I'll link to official AWS Documentation that details best practices for using encrypted connections for each of these services. I'm hoping to learn a lot about some finer details of best practices when building standard Django web applications."}]},{type:a,value:c},{type:b,tag:s,props:{id:y},children:[{type:b,tag:f,props:{href:"#application-load-balancer",ariaHidden:i,tabIndex:j},children:[{type:b,tag:k,props:{className:[l,m]},children:[]}]},{type:a,value:z}]},{type:a,value:c},{type:b,tag:g,props:{},children:[{type:a,value:c},{type:b,tag:d,props:{},children:[{type:a,value:"ACM Certificate is used for the outer-most level of encryption"}]},{type:a,value:c},{type:b,tag:d,props:{},children:[{type:a,value:"Traffic from a client uses the ACM Certificate attached to the load balancer"}]},{type:a,value:c}]},{type:a,value:c},{type:b,tag:s,props:{id:A},children:[{type:b,tag:f,props:{href:"#nginx-and-gunicorn-containers",ariaHidden:i,tabIndex:j},children:[{type:b,tag:k,props:{className:[l,m]},children:[]}]},{type:a,value:B}]},{type:a,value:c},{type:b,tag:g,props:{},children:[{type:a,value:c},{type:b,tag:d,props:{},children:[{type:a,value:"Use an NGINX sidecar container\n"},{type:b,tag:g,props:{},children:[{type:a,value:c},{type:b,tag:d,props:{},children:[{type:a,value:"NGINX passes traffic off to gunicorn container that runs on the same task (localhost network)"}]},{type:a,value:c}]},{type:a,value:c}]},{type:a,value:c},{type:b,tag:d,props:{},children:[{type:a,value:"Protocol used to connect with the target is HTTPS"}]},{type:a,value:c},{type:b,tag:d,props:{},children:[{type:a,value:"Load Balancer redirects HTTP traffic to HTTPS"}]},{type:a,value:c},{type:b,tag:d,props:{},children:[{type:a,value:"Load Balancer traffic is sent to target group using HTTPS protocol"}]},{type:a,value:c},{type:b,tag:d,props:{},children:[{type:a,value:"NGINX service listens on port 443"}]},{type:a,value:c},{type:b,tag:d,props:{},children:[{type:a,value:"NGINX is configured with self-signed certificates and private key\n"},{type:b,tag:g,props:{},children:[{type:a,value:c},{type:b,tag:d,props:{},children:[{type:a,value:"The certificate and key are built into the image and are long-lived (thousands of years)"}]},{type:a,value:c},{type:b,tag:d,props:{},children:[{type:a,value:"Created with OpenSSL (see Dockerfile, nginx.conf, v3.ext for full configuration details)"}]},{type:a,value:c}]},{type:a,value:c}]},{type:a,value:c},{type:b,tag:d,props:{},children:[{type:a,value:"NGINX uses "},{type:b,tag:h,props:{},children:[{type:a,value:"proxy_pass"}]},{type:a,value:" to send all traffic to "},{type:b,tag:h,props:{},children:[{type:a,value:"localhost:8000"}]},{type:a,value:" where the gunicorn service is listening"}]},{type:a,value:c},{type:b,tag:d,props:{},children:[{type:a,value:"For each ECS task there is one NGINX container and one gunicorn container"}]},{type:a,value:c}]},{type:a,value:c},{type:b,tag:e,props:{},children:[{type:b,tag:f,props:{href:O,rel:[n,o,p],target:q},children:[{type:a,value:O}]}]},{type:a,value:c},{type:b,tag:e,props:{},children:[{type:a,value:"This SO thread says that there is no good way to add custom headers to ALB directly."}]},{type:a,value:c},{type:b,tag:s,props:{id:C},children:[{type:b,tag:f,props:{href:"#encrypting-gunicorn",ariaHidden:i,tabIndex:j},children:[{type:b,tag:k,props:{className:[l,m]},children:[]}]},{type:a,value:D}]},{type:a,value:c},{type:b,tag:s,props:{id:E},children:[{type:b,tag:f,props:{href:"#ecs-exec",ariaHidden:i,tabIndex:j},children:[{type:b,tag:k,props:{className:[l,m]},children:[]}]},{type:a,value:F}]},{type:a,value:c},{type:b,tag:g,props:{},children:[{type:a,value:c},{type:b,tag:d,props:{},children:[{type:b,tag:f,props:{href:P,rel:[n,o,p],target:q},children:[{type:a,value:P}]}]},{type:a,value:c}]},{type:a,value:c},{type:b,tag:"blockquote",props:{},children:[{type:a,value:c},{type:b,tag:e,props:{},children:[{type:a,value:"By default, the data transferred between your local client and the container uses TLS 1.2 encryption that AWS provides. To further encrypt data using your own KMS key, you must create a KMS key and add the kms:Decrypt permission to your task IAM role. This permission is used by your container to decrypt the data."}]},{type:a,value:c}]},{type:a,value:c},{type:b,tag:s,props:{id:t},children:[{type:b,tag:f,props:{href:"#rds",ariaHidden:i,tabIndex:j},children:[{type:b,tag:k,props:{className:[l,m]},children:[]}]},{type:a,value:G}]},{type:a,value:c},{type:b,tag:e,props:{},children:[{type:a,value:"Encryption in transit requires that the applications (database clients) use secure connections. To do this:"}]},{type:a,value:c},{type:b,tag:g,props:{},children:[{type:a,value:c},{type:b,tag:d,props:{},children:[{type:a,value:c},{type:b,tag:e,props:{},children:[{type:a,value:"clients need to have the correct file"}]},{type:a,value:c}]},{type:a,value:c},{type:b,tag:d,props:{},children:[{type:a,value:c},{type:b,tag:e,props:{},children:[{type:a,value:"the database needs to have "},{type:b,tag:h,props:{},children:[{type:a,value:"storageEncrypted"}]},{type:a,value:Q},{type:b,tag:f,props:{href:R,rel:[n,o,p],target:q},children:[{type:a,value:R}]}]},{type:a,value:c}]},{type:a,value:c},{type:b,tag:d,props:{},children:[{type:a,value:c},{type:b,tag:e,props:{},children:[{type:a,value:"What files to add to container (2019-rds-ca, bundle, etc.)"}]},{type:a,value:c}]},{type:a,value:c},{type:b,tag:d,props:{},children:[{type:a,value:c},{type:b,tag:e,props:{},children:[{type:a,value:"Build these files into the container image \u002F EC2 machines"}]},{type:a,value:c}]},{type:a,value:c},{type:b,tag:d,props:{},children:[{type:a,value:c},{type:b,tag:e,props:{},children:[{type:a,value:"Configure database to use the "},{type:b,tag:h,props:{},children:[{type:a,value:"ssl"}]},{type:a,value:" setting in the Django settings"}]},{type:a,value:c}]},{type:a,value:c}]},{type:a,value:c},{type:b,tag:e,props:{},children:[{type:a,value:"Enforcing encrypted connections to RDS instances"}]},{type:a,value:c},{type:b,tag:g,props:{},children:[{type:a,value:c},{type:b,tag:d,props:{},children:[{type:a,value:c},{type:b,tag:e,props:{},children:[{type:a,value:"Use parameter group setting to require that RDS postgres only accepts encrypted connections"}]},{type:a,value:c}]},{type:a,value:c},{type:b,tag:d,props:{},children:[{type:a,value:c},{type:b,tag:e,props:{},children:[{type:a,value:"MySQL: "},{type:b,tag:f,props:{href:S,rel:[n,o,p],target:q},children:[{type:a,value:S}]},{type:a,value:" (August 2022)"}]},{type:a,value:c}]},{type:a,value:c},{type:b,tag:d,props:{},children:[{type:a,value:c},{type:b,tag:e,props:{},children:[{type:a,value:"Postgres: "},{type:b,tag:f,props:{href:T,rel:[n,o,p],target:q},children:[{type:a,value:T}]},{type:a,value:" (March 2016)"}]},{type:a,value:c}]},{type:a,value:c},{type:b,tag:d,props:{},children:[{type:a,value:c},{type:b,tag:e,props:{},children:[{type:a,value:"Get connection info with "},{type:b,tag:h,props:{},children:[{type:a,value:"select * from pg_stat_ssl;"}]}]},{type:a,value:c}]},{type:a,value:c}]},{type:a,value:c},{type:b,tag:"div",props:{className:["nuxt-content-highlight"]},children:[{type:b,tag:"pre",props:{className:["language-text","line-numbers"]},children:[{type:b,tag:h,props:{},children:[{type:a,value:"psql (13.9 (Debian 13.9-0+deb11u1), server 13.7)\nSSL connection (protocol: TLSv1.2, cipher: ECDHE-RSA-AES256-GCM-SHA384, bits: 256, compression: off)\nType \"help\" for help.\n\npostgres=\u003E\n"}]}]}]},{type:a,value:c},{type:b,tag:e,props:{},children:[{type:a,value:"After removing the "},{type:b,tag:h,props:{},children:[{type:a,value:"2019-rds-ca"}]},{type:a,value:" certificate from the container the connection is still able to be established. Need to look into why this is the case"}]},{type:a,value:c},{type:b,tag:g,props:{},children:[{type:a,value:c},{type:b,tag:d,props:{},children:[{type:b,tag:h,props:{},children:[{type:a,value:"parameterGroupName"}]},{type:a,value:Q},{type:b,tag:f,props:{href:U,rel:[n,o,p],target:q},children:[{type:a,value:U}]}]},{type:a,value:c}]},{type:a,value:c},{type:b,tag:e,props:{},children:[{type:a,value:"Encrypted connection from bastion host"}]},{type:a,value:c},{type:b,tag:g,props:{},children:[{type:a,value:c},{type:b,tag:d,props:{},children:[{type:b,tag:f,props:{href:"https:\u002F\u002Fstackoverflow.com\u002Fa\u002F62283247\u002F6084948",rel:[n,o,p],target:q},children:[{type:a,value:"Installing certificates on EC2 machines"}]}]},{type:a,value:c}]},{type:a,value:c},{type:b,tag:s,props:{id:H},children:[{type:b,tag:f,props:{href:"#encrypted-fields",ariaHidden:i,tabIndex:j},children:[{type:b,tag:k,props:{className:[l,m]},children:[]}]},{type:a,value:I}]},{type:a,value:c},{type:b,tag:g,props:{},children:[{type:a,value:c},{type:b,tag:d,props:{},children:[{type:a,value:"Beyond at-rest and in-transit encryption, we can encrypt individual fields on our database using "},{type:b,tag:f,props:{href:"https:\u002F\u002Fgitlab.com\u002Fguywillett\u002Fdjango-searchable-encrypted-fields",rel:[n,o,p],target:q},children:[{type:a,value:"django-searchable-encrypted-fields"}]}]},{type:a,value:c}]},{type:a,value:c},{type:b,tag:s,props:{id:J},children:[{type:b,tag:f,props:{href:"#redis-and-elasticache",ariaHidden:i,tabIndex:j},children:[{type:b,tag:k,props:{className:[l,m]},children:[]}]},{type:a,value:K}]},{type:a,value:c},{type:b,tag:g,props:{},children:[{type:a,value:c},{type:b,tag:d,props:{},children:[{type:a,value:"Two ways to run redis: ECS service (container) and managed AWS service: ElastiCache"}]},{type:a,value:c},{type:b,tag:d,props:{},children:[{type:a,value:"Both can be encrypted"}]},{type:a,value:c}]},{type:a,value:c},{type:b,tag:s,props:{id:u},children:[{type:b,tag:f,props:{href:"#s3",ariaHidden:i,tabIndex:j},children:[{type:b,tag:k,props:{className:[l,m]},children:[]}]},{type:a,value:L}]},{type:a,value:c},{type:b,tag:g,props:{},children:[{type:a,value:c},{type:b,tag:d,props:{},children:[{type:a,value:"Bucket encryption"}]},{type:a,value:c},{type:b,tag:d,props:{},children:[{type:a,value:"AES256 encryption"}]},{type:a,value:c}]}]},dir:"\u002F2023\u002F03\u002F19",path:"\u002F2023\u002F03\u002F19\u002Ffully-encrypted-django-applications-on-aws-ecs-fargate",extension:".md",createdAt:V,updatedAt:V,raw:"\nThis article demonstrates how to build fully encrypted web applications on AWS with ECS Fargate. I'll be using the Django web framework, but the concepts in this article can be implemented in any number of languages, libraries and frameworks. I'll be using Infrastructure as Code to show AWS resource configuration rather than showing how to configure things in the AWS Console. This article will expand on my last article where I build the same Django application on AWS with ECS Fargate using CDK, Terraform and Pulumi. I will be using each of these three tools to demonstrate the configuration of my fully encrypted application infrastructure.\n\n## What is a \"fully encrypted\" Django application?\n\nHere's a short definition of \"fully encrypted Django application\": each component of the system implements end-to-end encryption.\n\nEnd-to-end encryption refers to the combination of `Encryption in Transit` and `Encryption at Rest`.\n\nhttps:\u002F\u002Fwww.splunk.com\u002Fen_us\u002Fblog\u002Flearn\u002Fend-to-end-encryption.html#:~:text=Encryption%20at%20Rest%20refers%20to%20the%20encryption%20applied,is%20transferred%20between%20two%20nodes%20of%20the%20network.\n\nNext, we need to think about the different components of our Django web application.\n\n[Diagram of Web Application components](#)\n\nThe main components include:\n\n- application load balancer (main entrypoint for traffic entering our system)\n- ECS services that run the Django web server, worker nodes and task schedulers\n- access patterns for opening a shell in a container over a secure connection (ECS Exec)\n- RDS database store (in-transit and at-rest encryption)\n  - Encrypted database fields\n- Redis and ElastiCache (in-transit and at-rest encryption)\n- S3 (in-transit and at-rest encryption)\n- Misc Security concerns (Django's SECRET_KEY, AWS Secrets Manager, KMS, self-signed certificates, OpenSSL)\n\nWherever possible I'll link to official AWS Documentation that details best practices for using encrypted connections for each of these services. I'm hoping to learn a lot about some finer details of best practices when building standard Django web applications.\n\n### Application Load Balancer\n\n- ACM Certificate is used for the outer-most level of encryption\n- Traffic from a client uses the ACM Certificate attached to the load balancer\n\n### NGINX and Gunicorn containers\n\n- Use an NGINX sidecar container\n  - NGINX passes traffic off to gunicorn container that runs on the same task (localhost network)\n- Protocol used to connect with the target is HTTPS\n- Load Balancer redirects HTTP traffic to HTTPS\n- Load Balancer traffic is sent to target group using HTTPS protocol\n- NGINX service listens on port 443\n- NGINX is configured with self-signed certificates and private key\n  - The certificate and key are built into the image and are long-lived (thousands of years)\n  - Created with OpenSSL (see Dockerfile, nginx.conf, v3.ext for full configuration details)\n- NGINX uses `proxy_pass` to send all traffic to `localhost:8000` where the gunicorn service is listening\n- For each ECS task there is one NGINX container and one gunicorn container\n\n[https:\u002F\u002Fstackoverflow.com\u002Fquestions\u002F67883155\u002Fadd-custom-header-to-amazon-aws-alb-request](https:\u002F\u002Fstackoverflow.com\u002Fquestions\u002F67883155\u002Fadd-custom-header-to-amazon-aws-alb-request)\n\nThis SO thread says that there is no good way to add custom headers to ALB directly.\n\n### Encrypting Gunicorn\n\n### ECS Exec\n\n- [https:\u002F\u002Fdocs.aws.amazon.com\u002FAmazonECS\u002Flatest\u002Fdeveloperguide\u002Fecs-exec.html#ecs-exec-logging](https:\u002F\u002Fdocs.aws.amazon.com\u002FAmazonECS\u002Flatest\u002Fdeveloperguide\u002Fecs-exec.html#ecs-exec-logging)\n\n\u003E By default, the data transferred between your local client and the container uses TLS 1.2 encryption that AWS provides. To further encrypt data using your own KMS key, you must create a KMS key and add the kms:Decrypt permission to your task IAM role. This permission is used by your container to decrypt the data.\n\n### RDS\n\nEncryption in transit requires that the applications (database clients) use secure connections. To do this:\n\n- clients need to have the correct file\n- the database needs to have `storageEncrypted` parameter: [https:\u002F\u002Fwww.pulumi.com\u002Fregistry\u002Fpackages\u002Faws\u002Fapi-docs\u002Frds\u002Finstance\u002F#storageencrypted_nodejs](https:\u002F\u002Fwww.pulumi.com\u002Fregistry\u002Fpackages\u002Faws\u002Fapi-docs\u002Frds\u002Finstance\u002F#storageencrypted_nodejs)\n\n- What files to add to container (2019-rds-ca, bundle, etc.)\n- Build these files into the container image \u002F EC2 machines\n- Configure database to use the `ssl` setting in the Django settings\n\nEnforcing encrypted connections to RDS instances\n\n- Use parameter group setting to require that RDS postgres only accepts encrypted connections\n\n- MySQL: [https:\u002F\u002Faws.amazon.com\u002Fabout-aws\u002Fwhats-new\u002F2022\u002F08\u002Famazon-rds-mysql-supports-ssl-tls-connections\u002F](https:\u002F\u002Faws.amazon.com\u002Fabout-aws\u002Fwhats-new\u002F2022\u002F08\u002Famazon-rds-mysql-supports-ssl-tls-connections\u002F) (August 2022)\n\n- Postgres: [https:\u002F\u002Faws.amazon.com\u002Fabout-aws\u002Fwhats-new\u002F2016\u002F03\u002Fenhanced-monitoring-and-option-to-enforce-ssl-connections-is-now-available-for-amazon-rds-for-postgresql\u002F](https:\u002F\u002Faws.amazon.com\u002Fabout-aws\u002Fwhats-new\u002F2016\u002F03\u002Fenhanced-monitoring-and-option-to-enforce-ssl-connections-is-now-available-for-amazon-rds-for-postgresql\u002F) (March 2016)\n\n\n- Get connection info with `select * from pg_stat_ssl;`\n\n```\npsql (13.9 (Debian 13.9-0+deb11u1), server 13.7)\nSSL connection (protocol: TLSv1.2, cipher: ECDHE-RSA-AES256-GCM-SHA384, bits: 256, compression: off)\nType \"help\" for help.\n\npostgres=\u003E\n```\n\nAfter removing the `2019-rds-ca` certificate from the container the connection is still able to be established. Need to look into why this is the case\n\n\n- `parameterGroupName` parameter: [https:\u002F\u002Fwww.pulumi.com\u002Fregistry\u002Fpackages\u002Faws\u002Fapi-docs\u002Frds\u002Finstance\u002F#state_parametergroupname_nodejs](https:\u002F\u002Fwww.pulumi.com\u002Fregistry\u002Fpackages\u002Faws\u002Fapi-docs\u002Frds\u002Finstance\u002F#state_parametergroupname_nodejs)\n\n\nEncrypted connection from bastion host\n\n- [Installing certificates on EC2 machines](https:\u002F\u002Fstackoverflow.com\u002Fa\u002F62283247\u002F6084948)\n\n### Encrypted Fields\n\n- Beyond at-rest and in-transit encryption, we can encrypt individual fields on our database using [django-searchable-encrypted-fields](https:\u002F\u002Fgitlab.com\u002Fguywillett\u002Fdjango-searchable-encrypted-fields)\n\n### Redis and ElastiCache\n\n- Two ways to run redis: ECS service (container) and managed AWS service: ElastiCache\n- Both can be encrypted\n\n### S3\n\n- Bucket encryption\n- AES256 encryption\n"}}],fetch:{},mutations:[]}}("text","element","\n","li","p","a","ul","code","true",-1,"span","icon","icon-link","nofollow","noopener","noreferrer","_blank",3,"h3","rds","s3",true,"what-is-a-fully-encrypted-django-application","What is a \"fully encrypted\" Django application?","application-load-balancer","Application Load Balancer","nginx-and-gunicorn-containers","NGINX and Gunicorn containers","encrypting-gunicorn","Encrypting Gunicorn","ecs-exec","ECS Exec","RDS","encrypted-fields","Encrypted Fields","redis-and-elasticache","Redis and ElastiCache","S3",".","https:\u002F\u002Fwww.splunk.com\u002Fen_us\u002Fblog\u002Flearn\u002Fend-to-end-encryption.html#:~:text=Encryption%20at%20Rest%20refers%20to%20the%20encryption%20applied,is%20transferred%20between%20two%20nodes%20of%20the%20network","https:\u002F\u002Fstackoverflow.com\u002Fquestions\u002F67883155\u002Fadd-custom-header-to-amazon-aws-alb-request","https:\u002F\u002Fdocs.aws.amazon.com\u002FAmazonECS\u002Flatest\u002Fdeveloperguide\u002Fecs-exec.html#ecs-exec-logging"," parameter: ","https:\u002F\u002Fwww.pulumi.com\u002Fregistry\u002Fpackages\u002Faws\u002Fapi-docs\u002Frds\u002Finstance\u002F#storageencrypted_nodejs","https:\u002F\u002Faws.amazon.com\u002Fabout-aws\u002Fwhats-new\u002F2022\u002F08\u002Famazon-rds-mysql-supports-ssl-tls-connections\u002F","https:\u002F\u002Faws.amazon.com\u002Fabout-aws\u002Fwhats-new\u002F2016\u002F03\u002Fenhanced-monitoring-and-option-to-enforce-ssl-connections-is-now-available-for-amazon-rds-for-postgresql\u002F","https:\u002F\u002Fwww.pulumi.com\u002Fregistry\u002Fpackages\u002Faws\u002Fapi-docs\u002Frds\u002Finstance\u002F#state_parametergroupname_nodejs","2023-11-05T15:22:15.515Z")));