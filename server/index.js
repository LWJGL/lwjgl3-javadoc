'use strict';

// Server
const path = require('path');
const express = require('express');
const compression = require('compression');
const favicon = require('serve-favicon');

// ------------------------------------------------------------------------------
// Initialize & Configure Application
// ------------------------------------------------------------------------------

const app = express();
const config = require('../config.json');

app.set('port', config.port || 8080);
app.enable('case sensitive routing');
app.enable('strict routing');
app.disable('x-powered-by');
app.use(compression());

// Static Assets
app.use(favicon(path.join(__dirname, '../public', 'favicon.ico')));
app.use(
  express.static(path.join(__dirname, '../public'), {
    index: false,
    etag: true,
    immutable: true,
    index: ['index.html'],
    lastModified: true,
    maxAge: 365 * 24 * 60 * 60 * 1000,
  })
);

// ------------------------------------------------------------------------------
// Launch Server
// ------------------------------------------------------------------------------

const launchServer = () => {
  console.log(`Starting JavaDoc in ${app.get('env')} mode`);

  const server = app.listen(app.get('port'), () => {
    let host = server.address().address;
    let port = server.address().port;

    console.log(`JavaDoc listening at http://${host}:${port}`);
  });

  server.on('error', err => {
    if (err.code === 'EADDRINUSE') {
      console.error(`JavaDoc address in use, exiting...`);
      process.exit(1);
    } else {
      console.error(err.stack);
      throw err;
    }
  });

  function shutdown(code) {
    console.log(`Shutting down JavaDoc`);
    server.close();
    process.exit(code || 0);
  }

  process.on('SIGTERM', shutdown);
  process.on('SIGINT', shutdown);

  process.on('uncaughtException', function(err) {
    console.error(err.stack);
    shutdown(1);
  });
};

launchServer();
