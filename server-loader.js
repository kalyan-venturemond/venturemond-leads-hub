// This file loads environment variables before starting the server
require('dotenv').config({ path: '.env.local' });
require('tsx/cjs').register();
require('./server.ts');
