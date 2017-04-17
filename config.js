var config = {
    development: {
        database: {
            name: 'demo-app',
            username: 'root',
            password: '',
            config: {
                host: 'localhost',
                dialect: 'mysql',
                pool: {
                    max: 5,
                    min: 0,
                    idle: 10000
                }
            }
        }
    }
};

// change in case of production
module.exports = config.development;