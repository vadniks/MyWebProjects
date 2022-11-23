
const grpc = require('grpc'),
    protoLoader = require('@grpc/proto-loader'),
    packageDefinition = protoLoader.loadSync('users.proto', {
        keepCase: true,
        longs: String,
        enums: String,
        arrays: true
    }),
    usersProto = grpc.loadPackageDefinition(packageDefinition),
    server = new grpc.Server(),
    users = [
        {
            id: 0,
            name: 'a',
            password: 'aa'
        },
        {
            id: 1,
            name: 'b',
            password: 'bb'
        }
    ]

// noinspection JSUnresolvedVariable
server.addService(usersProto.UserService.service, {
    getAll: (_, callback) => {
        callback(null, { users });
    },
    get: (call, callback) => {
        const user = users.find(user => user.id === call.request.id)
        if (user)
            callback(null, user)
        else callback({
            code: grpc.status.NOT_FOUND,
            details: 'Not found'
        })
    },
    insert: (call, callback) => {
        const user = call.request

        let id = 0
        users.forEach(user => id = user.id > id ? user.id : id)
        user.id = id + 1

        users.push(user)
        callback(null, user)
    },
    update: (call, callback) => {
        const user = users.find(user => user.id === call.request.id)
        if (user) {
            user.name = call.request.name
            user.password = call.request.password
            callback(null, user)
        } else callback({
            code: grpc.status.NOT_FOUND,
            details: 'Not found'
        })
    },
    remove: (call, callback) => {
        const index = users.findIndex(user => user.id === call.request.id)
        if (index !== -1) {
            users.splice(index, 1)
            callback(null, {})
        } else callback({
            code: grpc.status.NOT_FOUND,
            details: 'Not found'
        })
    },
    greetings: (call, callback) => {
        const user = users.find(user =>
            user.name === call.request.name && user.password === call.request.password)
        if (user)
            callback(null, { name: user.name })
        else callback({
            code: grpc.status.NOT_FOUND,
            details: 'Not found'
        })
    }
})
server.bind('127.0.0.1:50051', grpc.ServerCredentials.createInsecure())
server.start()
