const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const helmet = require('helmet');
const cors = require('cors');
const path = require('path');

const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/user');
const fileRoutes = require('./routes/file');
const apiRoutes = require('./routes/api');
const dataRoutes = require('./routes/data');
const templateRoutes = require('./routes/template');
const wsRoutes = require('./routes/websocket');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(helmet());
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static('public'));

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.get('/', (req, res) => {
  res.json({
    message: 'Vulnerable Node.js Application - SCA Scanner Test',
    version: '1.0.0',
    endpoints: {
      auth: '/api/auth/*',
      users: '/api/users/*',
      files: '/api/files/*',
      data: '/api/data/*',
      templates: '/api/templates/*',
      api: '/api/external/*',
      websocket: '/ws'
    },
    vulnerabilities: {
      direct: 'Multiple direct vulnerable dependencies',
      transitive: 'Multiple transitive vulnerable dependencies',
      reachable: 'Vulnerabilities used in API endpoints',
      nonReachable: 'Vulnerabilities imported but not used'
    }
  });
});

app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/files', fileRoutes);
app.use('/api/data', dataRoutes);
app.use('/api/templates', templateRoutes);
app.use('/api/external', apiRoutes);

const server = app.listen(PORT, () => {
  console.log(`Vulnerable app running on port ${PORT}`);
  console.log(`⚠️  WARNING: This application contains known vulnerabilities for testing purposes`);
  console.log(`🔒 DO NOT deploy this application in production`);
});

wsRoutes(server);

module.exports = app;

