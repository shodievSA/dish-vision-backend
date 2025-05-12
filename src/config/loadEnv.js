const path = require('path');
require('dotenv').config();

function loadEnv() {

    const envFilePath = path.resolve(__dirname, '../../.env');

    const result = require('dotenv').config({ path: envFilePath });

    if (result.error) {

        console.log('Failed to load environment variables');
        process.exit(1);

    }

    console.log(`Loaded environment variables from ${envFilePath}`);

}

module.exports = loadEnv;