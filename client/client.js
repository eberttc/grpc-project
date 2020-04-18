
var greets = require('../server/protos/greet_pb')

var service = require('../server/protos/greet_grpc_pb')


var grpc = require('grpc')


function callGreetManyTime() {

    var client = new service.GreetServiceClient(
        'localhost:50051',
        grpc.credentials.createInsecure()
    )

    //create request
    var request = new greets.GreetManyTimesRequest()

    var greeting = new greets.Greeting()
    greeting.setFirstName('Ebert')
    greeting.setLastName('Toribio')

    request.setGreeting(greeting)

    var call = client.greetManyTimes(request, () => { })

    call.on('data', (response) => {
        console.log('Client Streaming Response:', response.getResult());
    })

    call.on('status', (status) => {
        console.log(status)
    })

    call.on('error', (error) => {
        console.error(error)
    })

    call.on('end', () => {
        console.log('Streaming End')
    })

}

function callLongGreeting() {

    var client = new service.GreetServiceClient(
        "localhost:50051",
        grpc.credentials.createInsecure()
    );

    var request = new greets.LongGreetRequest()

    var call = client.longGreet(request, (error, response) => {
        if (!error) {
            console.log('Server response:' + response.getResult())
        } else {
            console.error(error)
        }

    })

    let count = 0, intervalID = setInterval(function () {

        console.log('Sending message:' + count)

        var request = new greets.LongGreetRequest()

        var greeting = new greets.Greeting()
        greeting.setFirstName('Ebert')
        greeting.setLastName('Toribio')

        request.setGreet(greeting)

        call.write(request)

        if (++count > 3) {
            clearInterval(intervalID)
            call.end()//
        }

    }, 1000)


}

async function sleep(interval) {
    return new Promise((resolve) => {
        setTimeout(() => resolve(), interval)

    })
}

async function callBidirect(interval) {
    var client = new service.GreetServiceClient(
        "localhost:50051",
        grpc.credentials.createInsecure()
    );

    var call = client.greetEveryone(request, (error, response) => {
        console.log('Server Response:' + response)
    })

    call.on('data', (response) => {
        console.log('Hello Client!:', response.getResult());
    })

    call.on('error', (error) => {
        console.error(error)
    })

    call.on('end', () => {
        console.log('Client End')
    })

    for (var i = 0; i < 10; i++) {

        var greeting = new greets.Greeting()
        greeting.setFirstName('Juan')
        greeting.setLastName('Toribio')

        var request = new greets.GreetEveryoneRequest()

        request.setGreet(greeting)

        call.write(request)

        await sleep(1500)

    }

call.end()

}


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

    client.greet(request, (error, response) => {
        if (!error) {
            console.log("Greeting response:", response.getResult());
        }
        else {
            console.log(error);
        }
    })


}


//main()
//callGreetManyTime()
//callLongGreeting()

callBidirect()