## Content
1. About
    - Solution
2. How to get started
    - Pre-requisites
    - How to test
    - How to run locally
    - How to use locally
# About
Create a fault tolerant webhooks-based API to handle requests to sources that may not always be available due to long scheduled maintenance, temporary bad gateway errors due to load etc.

## Solution
This solution adds requests to a queue so that failed requests to the providers API do not immediately retry. Instead a circuit-breaker/request-limiter is used to retry failed requests after a certain amount of time has passed. In this case its 2 seconds but it can be longer if required.

Requests for a single provider and multiple providers are handled via two differnt queues.

A Redis based queuing library (Bull) was used to implement this solution as I did not want to re-invent the wheel and Bull is a well enough established library and is trusted by many users.

The services can be broken down into 3 separate APIs `providersApi`, `webhooksApi` and `callbackApi` which all have their own directories and dockerfiles/services.

# How to get started
### Pre-requisites
Please ensure you have the following installed:
- Docker
- Node.js and NPM
- Git

Then clone the repository and change directory into the project:
```
$ git clone https://github.com/sinacodes95/datahog.git
$ cd datahog
```
## How to test
Tests are located in the `tests/unit` directory.
The purpose of these tests was to follow a TTD approach, although at the time of development only tests that were necessary for the implementation of the functions were added, however, extra tests were included later on to cover certain edge cases.

To run the tests and see a coverage report, run the following in your terminal within the `datahog` directory:

```
$ npm install && npm run build && npm run test
```

## How to run locally
The app is dockerised and if you have docker-compose installed then you may run:
```
$ docker-compose up --build
```
or if on a Mac you may also be able to do:
```
$ docker compose up --build
```

Once the containers are up and running you should see the following on your terminal:
```
Webhooks server listening at http://localhost:4000
```
after which the api is ready for you to make requests to via the `/queue` endpoint.

## How to use locally
I used `curl` while doing manual test but feel free to use other tools if you want.

To make a request and have it be queued you can run:
```
$ curl -X POST http://localhost:4000/queue --header 'Content-Type: application/json' --data-raw '{"providers": ["gas"], "callbackUrl": "callback-api://callback-api:5000"}'
```

The `providers` are given as an array so that more than one provider can be included in the same request.

Once the request is made you should see the logs below -
In this case the request was queued and processed, but the data from the providers API took 2 attempts to be successful as shown by the logs.

Once the data from the providers was retrieved successfully, it was then sent to the callback server using the callback link provided within the initial request.
```
-- Providers data validated --
Request is being processed by consumer
Adding to single queue
Processing a single job with job data:  { provider: 'gas', callbackUrl: 'callback-api://callback-api:5000' }
Attempts made at processing job: 1
Processing a single job with job data:  { provider: 'gas', callbackUrl: 'callback-api://callback-api:5000' }
Attempts made at processing job: 2
Data retrieved from Provider source after 2 attemps:  [
  { billedOn: '2020-04-07T15:03:14.257Z', amount: 22.27 },
  { billedOn: '2020-05-07T15:03:14.257Z', amount: 30 }
]
Sending retrieved data to callbackUrl provided

Post request recieved by callback server!:  {
  gas: [
    { billedOn: '2020-04-07T15:03:14.257Z', amount: 22.27 },
    { billedOn: '2020-05-07T15:03:14.257Z', amount: 30 }
  ]
}
```

A list of 2 providers can also be given, in this case the providers are `"gas"` and `"internet"`.
```
$ curl -X POST http://localhost:4000/queue --header 'Content-Type: application/json' --data-raw '{"providers": ["gas", "internet"], "callbackUrl": "callback-api://callback-api:5000"}'
```

```
-- Providers data validated --
Request is being processed by consumer
Adding to bulk queue
Processing a bulk of jobs
Attempts made at processing each job: 1
Processing a bulk of jobs
Attempts made at processing each job: 1
Processing a bulk of jobs
Attempts made at processing each job: 2
Processing a bulk of jobs
Attempts made at processing each job: 2
Data retrieved from Provider source after 2 attemps:  [
  { billedOn: '2020-04-07T15:03:14.257Z', amount: 22.27 },
  { billedOn: '2020-05-07T15:03:14.257Z', amount: 30 }
]
Processing a bulk of jobs
Attempts made at processing each job: 3
Data retrieved from Provider source after 3 attemps:  [
  { billedOn: '2020-02-07T15:03:14.257Z', amount: 15.12 },
  { billedOn: '2020-03-07T15:03:14.257Z', amount: 15.12 }
]
Sending retrieved data to callbackUrl provided

Post request recieved by callback server!:  {
  gas: [
    { billedOn: '2020-04-07T15:03:14.257Z', amount: 22.27 },
    { billedOn: '2020-05-07T15:03:14.257Z', amount: 30 }
  ],
  internet: [
    { billedOn: '2020-02-07T15:03:14.257Z', amount: 15.12 },
    { billedOn: '2020-03-07T15:03:14.257Z', amount: 15.12 }
  ]
}
```

The data for each provider will be retrieved separately, and aggregated before sending all the data to the callback url within one request.

You may also request data from the callback Api after the data has been sent:
```
$ curl -X GET http://localhost:5000/
```
Which will return any data sent to the webhooks endpoint while the containers have been running.
