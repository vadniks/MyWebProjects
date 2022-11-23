
const grpc = require('grpc'),
    packageDefinition = require('@grpc/proto-loader').loadSync('users.proto', {
        keepCase: true,
        longs: String,
        enums: String,
        arrays: true
    }),
    UserService = grpc.loadPackageDefinition(packageDefinition).UserService,
    client = new UserService(
        'localhost:50051',
        grpc.credentials.createInsecure()
    )
module.exports = client
