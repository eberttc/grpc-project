var fs = require('fs')
var grpc = require('grpc')

const credentials = grpc.credentials.createSsl(
    fs.readFileSync('./certs/tls.crt')
)


const DEV_HOST = 'api.dev.b89.internal:443';

function callOnboarding(){
    var PROTO_PATH = __dirname + '/../protos/onboarding.proto';
    var grpc = require('grpc');
    var protoLoader = require('@grpc/proto-loader');
    var packageDefinition = protoLoader.loadSync(
        PROTO_PATH,
        {keepCase: true,
            longs: String,
            enums: String,
            defaults: true,
            oneofs: true
        });

    let protoDescriptor = grpc.loadPackageDefinition(packageDefinition);

    var client = new protoDescriptor.b89.onboarding.v2.OnboardingService(HOST,
        credentials);
    let contador=0;

    const executor=setInterval(() =>{
        contador++
        let request={
            req_id:contador
        }
        client.ListOnboardingSteps(request, (error, response) => {
            if (!error) {
                console.log("Response Success:", new Date().toISOString(),request.req_id,response.host);
            }
            else {
                console.log("Response Error:", new Date().toISOString(),error);
            }
        })
        if(request.req_id===600){
            clearInterval(executor)
        }

    },300);

    executor;

}

callOnboarding()
