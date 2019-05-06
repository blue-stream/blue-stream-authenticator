export const config = {
    logger: {
        elasticsearch: process.env.LOGGER_ELASTICSEARCH && {
            hosts: process.env.LOGGER_ELASTICSEARCH.split(','),
        },
        indexPrefix: process.env.LOGGER_ELASTICSEARCH_PREFIX || 'blue-stream-logs',
    },
    server: {
        port: +(process.env.PORT || 3000),
        name: 'blue-stream-authenticator',
        endpoint: process.env.SERVER_ENDPOINT || 'http://localhost:3000/auth',
    },
    cors: {
        allowedOrigins: process.env.ALLOWED_ORIGINS ? process.env.ALLOWED_ORIGINS.split(',') : ['http://localhost:4200'],
    },
    users: {
        endpoint: process.env.USERS_RPC_ENDPOINT || 'http://localhost',
        port: +(process.env.USERS_RPC_PORT || 6000),
        methods: {
            GET_USER_BY_ID: 'getUserById',
            CREATE_USER: 'createUser',
        },
    },
    authentication: {
        required: true,
        secret: process.env.SECRET_KEY || 'bLue5tream@2018', // Don't use static value in production! remove from source control!
        daysExpires: +(process.env.DAYS_EXPIRES || 30),
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
    apm: {
        server: process.env.APM_SERVER || 'http://apm:8200',
        isActive: +(process.env.APM_ACTIVE || 1),
    },
    clientEndpoint: process.env.CLIENT_ENDPOINT || 'http://localhost:4200',
};
