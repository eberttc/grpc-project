
var greets = require('../server/protos/greet_pb')

var service = require('../server/protos/greet_grpc_pb')


var grpc = require('grpc')



function main() {
    console.log('Hello from client')

    // Create our server client
    var client = new service.GreetServiceClient(
        'localhost:50051',
        grpc.credentials.createInsecure())


    //console.log('client', client)

    // Create our request

    var request = new greets.GreetRequest()


    //create a protocol buffer
    var greeting = new greets.Greeting()

    greeting.setFirstName("Ebert")

    greeting.setLastName("Toribio")

    request.setGreeting(greeting)

    client.greet(request, (error, response) =>{
        if(!error){
            console.log("Greeting response:",response.getResult());
        }
        else{
            console.log(error);
        }
    })






}


main()