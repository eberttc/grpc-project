var greets = require('../server/protos/greet_pb')

var service = require('../server/protos/greet_grpc_pb')

var calc = require('../server/protos/calculator_pb')

var calcService = require('../server/protos/calculator_grpc_pb')

var grpc = require('grpc')

function greet(call, callback) {

    var greeting = new greets.GreetResponse()

    greeting.setResult(
        "Hello " + call.request.getGreeting().getFirstName()
    )

    callback(null, greeting)
}

function greetManyTimes(call, callback) {
    var firstName = call.request.getGreeting().getFirstName()

    let count = 0, intervalID = setInterval(function () {

        var greetManyTimesResponse = new greets.GreetManyTimesResponse()

        greetManyTimesResponse.setResult(firstName)

        //setup streaming

        call.write(greetManyTimesResponse)

        if (++count > 9) {
            clearInterval(intervalID)
            call.end() // we have sent all     

        }

    }, 1000)

}

function longGreet(call, callback) {

    call.on('data', request => {

        var fullName = request.getGreet().getFirstName() + ' '
            + request.getGreet().getLastName();

        console.log('Hello ' + fullName)
    })

    call.on('error', (error) => {
        console.error(error)
    })

    call.on('end', () => {

        var resspone = new greets.LongGreetResponse()
        resspone.setResult('Long Greet Client Streaming')
        callback(null, resspone)

    })

}

async function sleep(interval) {
    return new Promise((resolve) => {
        setTimeout(() => resolve(), interval)

    })
}
async function greetEveryone(call, callback) {

    call.on('data', response => {

        var fullName = response.getGreet().getFirstName() + ' ' +
            response.getGreet().getLastName()

        console.log('Hello ' + fullName)

    })


    call.on('error', (error) => {
        console.error(error)
    })

    call.on('end', () => {
        console.log('The end BIdi')
    })

    for (var i = 0; i < 10; i++) {
        //var greeting = new greets.Greeting()
        //greeting.setFirstName('Ebert')
        //greeting.setLasttName('Toribio')

        var request = new greets.GreetEveryoneResponse()
        request.setResult('Ebert Toribio')

        call.write(request)
        await sleep(1000)

    }

    call.end()


}

function squareRoot(call, callback) {

    var number = call.request.getNumber()

    if (number >= 0) {
        var numberRoot = Math.sqrt(number)

        var response = new calc.SquareRootResponse()
        response.setNumberRoot(numberRoot)
        callback(null, response)

    } else {

        return callback({
            code : grpc.status.INVALID_ARGUMENT,
            message: 'the number being sent is not positive'+' Number sent: '+ number
        })
    }

}

function main() {

    var server = new grpc.Server()

    server.addService(calcService.CalculatorServiceService, {
        squareRoot: squareRoot
    })

   /*  server.addService(service.GreetServiceService, {
        greet: greet,
        greetManyTimes: greetManyTimes,
        longGreet: longGreet,
        greetEveryone: greetEveryone
    }) */

    server.bind("127.0.0.1:50051", grpc.ServerCredentials.createInsecure())

    server.start()

    console.log('Server running  on port 127.0.0.1:50051')
}

main()