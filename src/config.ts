export const config = {
    logger: {
        durable: false,
        exchangeType: process.env.RMQ_LOGGER_TYPE || 'topic',
        exchange: process.env.RMQ_LOGGER_EXCHANGE || 'blue_stream_logs',
        host: process.env.RMQ_LOGGER_HOST || 'localhost',
        port: +(process.env.RMQ_LOGGER_PORT || 15672),
        password: process.env.RMQ_LOGGER_PASS || 'guest',
        username: process.env.RMQ_LOGGER_USER || 'guest',
        persistent: false,
    },
    server: {
        port: +(process.env.PORT || 3000),
        name: 'authentication',
    },
    cors: {
        allowedOrigins: process.env.ALLOWED_ORIGINS ? process.env.ALLOWED_ORIGINS.split(',') : ['http://localhost:4200'],
    },
    users: {
        endpoint: process.env.USERS_RPC_ENDPOINT || 'http://localhost',
        port: +(process.env.USERS_RPC_PORT || 50051),
        methods: {
            GET_USER_BY_ID: 'getUserById',
            CREATE_USER: 'createUser',
        },
    },
    authentication: {
        required: true,
        secret: process.env.SECRET_KEY || 'pandora@drive', // Don't use static value in production! remove from source control!
        saml: {
            entryPoint: process.env.SAML_ENTRY_POINT || 'http://localhost:8080/simplesaml/saml2/idp/SSOService.php',
            issuer: process.env.SAML_ISSUER || 'http://localhost:3000/metadata.xml',
            callbackUrl: process.env.SAML_CALLBACK_URL || 'http://localhost:3000/metadata.xml/callback',
            authnContext: 'http://schemas.microsoft.com/ws/2008/06/identity/authenticationmethod/windows',
            identifierFormat: undefined,
            signatureAlgorithm: 'sha1',
            acceptedClockSkewMs: -1,
        },
        profileExtractor: {
            id: process.env.PROFILE_EXTRACTOR_ID || 'id',
            firstName: process.env.PROFILE_EXTRACTOR_FIRST_NAME || 'givenName',
            lastName: process.env.PROFILE_EXTRACTOR_LAST_NAME || 'surName',
            mail: process.env.PROFILE_EXTRACTOR_MAIL || 'mail',
        },
    },
    clientEndpoint: process.env.CLIENT_ENDPOINT || 'http://localhost:4200',
};
