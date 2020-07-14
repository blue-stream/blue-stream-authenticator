export const config = {
    server: {
        port: +(process.env.PORT || 8080),
        name: 'authentication-service',
        endpoint: process.env.SERVER_ENDPOINT || 'http://localhost:8080/auth',
    },
    cors: {
        allowedOrigins: process.env.ALLOWED_ORIGINS ? process.env.ALLOWED_ORIGINS.split(',') : ['http://localhost/'],
    },
    users: {
        endpoint: process.env.USERS_RPC_ENDPOINT || 'http://localhost:50051',
        methods: {
            GET_USER_BY_ID: 'getUserById',
            CREATE_USER: 'createUser',
        },
        defaultLastName: ' ',
    },
    authentication: {
        required: true,
        token: process.env.TOKEN || 'kd-token',
        secret: process.env.SECRET_KEY || 'pandora@drive', // TODO: Don't use static value in production! remove from source control!
        daysExpires: +(process.env.TOKEN_DAYS_EXPIRES || 30),
        saml: {
            entryPoint: process.env.SAML_ENTRY_POINT || 'http://localhost:8080/simplesaml/saml2/idp/SSOService.php',
            issuer: process.env.SAML_ISSUER || 'http://localhost:8080/auth/metadata.xml',
            callbackUrl: process.env.SAML_CALLBACK_URL || 'http://localhost:8080/auth/metadata.xml/callback',
            authContext: 'http://schemas.microsoft.com/ws/2008/06/identity/authenticationmethod/windows',
            identifierFormat: undefined,
            signatureAlgorithm: 'sha1',
            acceptedClockSkewMs: -1,
        },
        profileExtractor: {
            id: process.env.PROFILE_EXTRACTOR_ID || 'id',
            mail: process.env.PROFILE_EXTRACTOR_MAIL || 'mail',
            firstName: process.env.PROFILE_EXTRACTOR_FIRST_NAME || 'givenName',
            lastName: process.env.PROFILE_EXTRACTOR_LAST_NAME || 'surName',
            job: process.env.PROFILE_EXTRACTOR_JOB || 'job',
        },
        strategy: process.env.STRATEGY || 'shraga',
        shragaURL: process.env.SHRAGA_URL || 'http://localhost:3000',
        useEnrichId: process.env.SHRAGA_USE_ENRICH_ID || true,
        allowedProvider: process.env.SHRAGA_PROVIDERS || 'Genesis',
        unauthorized: './401/index.html',
    },
    clientEndpoint: process.env.CLIENT_ENDPOINT || 'http://localhost/',
    support: process.env.UNAUTHORIZED_SUPPORT_URL || 'https://open.rocket.chat',
};
