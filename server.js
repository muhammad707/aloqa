const app = require('./app');
const http = require('http');
const server = http.createServer(app);
const models  = require('./models');

const PORT = process.env.PORT || 8080; // PORT


// Connection to database
models.sequelize.sync().then(() => {
    server.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
    });
});

