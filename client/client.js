var grpc = require('grpc')


var service = require('../server/protos/dummy_grpc_pb')


function main() {
    console.log('Hello from client')
    var client = new service.DummyServiceClient(
        'localhost:50051',
        grpc.credentials.createInsecure())


    console.log('client',client)    
}


main()