/* eslint-disable node/no-unpublished-import */
/* eslint-disable node/no-path-concat */
import 'dotenv/config';

const gemforceConfig = {
    token: {},
    backup: {},
    imageMaker: {}, 
    schemas: {},
    network: {
        host: process.env.NETWORK_HOST || '127.0.0.1',
        port: process.env.NETWORK_PORT || 443,
        ssl: {
            enabled: process.env.HTTPS_ENABLED || false,
            port: process.env.HTTPS_PORT || 443,
            key: process.env.KEY_FILE || './privatekey.pem',
            cert: process.env.CERT_FILE || './certificate.pem',
        },
    },
    server: {
        host: process.env.NETWORK_HOST || '127.0.0.1',
        port: process.env.NETWORK_PORT || 443,
        appId: process.env.APP_ID || 'appId',
        masterKey: process.env.MASTER_KEY || 'appMasterKey',
        serverURL:  process.env.SERVER_URL || 'https://localhost/parse',
        vercelURL:  process.env.VERCEL_URL || 'https://localhost/parse',
        databaseURI: process.env.MONGODB_URL || 'mongodb+srv://gp:f3GBROgrmg2hj6RV@gp.3vogy.mongodb.net/gemforce_agreementForge',
        cloud: __dirname + '/src/cloud-functions.ts',
        liveQuery: {
            classNames: ['Gem', 'User'],
        },
        disabledServices: ['listener'],
        options: {
            allowClientClassCreation: true,
            ignoreValidation: true,
            enableAnonymousUsers: true,
            allowCustomObjectId: true,
            enableSingleSchemaCache: true,
            sessionLength: 31536000,
            expireInactiveSessions: true,
            revokeSessionOnPasswordReset: true,
        }
    },
    dashboard: {
        dev: true,
        enabled: true,
        path: '/dashboard',
        apps: [
            {
                serverURL: process.env.SERVER_URL || 'https://localhost/parse',
                appId: process.env.APP_ID || 'appId',
                appName: process.env.APP_NAME || 'appName',
                masterKey: process.env.MASTER_KEY || 'appMasterKey',
            },
        ],
        users: [
            {
                user: 'admin',
                pass: process.env.DASHBOARD_PASSWORD ||  'admin',
            },
        ],
    },
    client: {
        host: process.env.NETWORK_HOST || '127.0.0.1',
        port: process.env.NETWORK_PORT || 443,
        serverURL: process.env.SERVER_URL || 'https://localhost/parse',
        appId: process.env.APP_ID || 'appId',
        appName: process.env.APP_NAME || 'appName',
    },
    svg: {
        path: '../../svg',
        route: '/svg',
    },
    apis: {
        path: '../../apis',
    },
    automatic111: {
        path: 'Automatic111',
        every: 60,
        userinfo: {
            username: 'Automatic111',
            password: 'Automatic111',
        }
    },compositing: {
        svg: {
            path: '../../svg',
            route: '/svg',
        },
        img2base64: {
            route: '/img2base64',
        },
    }
} as any;

module.exports = gemforceConfig;
export default gemforceConfig;
