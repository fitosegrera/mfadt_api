#!/usr/bin/env node
var art = require('ascii-art');
var Phant = require('phant'),
    app = Phant();

Phant.HttpServer.listen(8080);

// METADATA
// ========
var meta = require('phant-meta-nedb')({
  directory: 'phant_streams'
});

var validator = Phant.Validator({
  metadata: meta
});

// KEYCHAIN
// ========
var keychain = require('phant-keychain-hex')({
  keyLength: 6,
  publicSalt: 'Change this public salt',
  privateSalt: 'Change this private salt',
  deleteSalt: 'Change this delete salt'
});

// STORAGE
// =======
var stream = require('phant-stream-csv')({
  directory: 'phant_streams',
  cap: 52428800,
  chunk: 262144
});

app.registerOutput(stream);

var PhantStreamJson = require('phant-stream-json')({
  directory: 'phant_streams',
  cap: 52428800,
  chunk: 262144
});

app.registerOutput(PhantStreamJson);

var PhantStreamMongodb = require('phant-stream-mongodb')({
  url: 'mongodb://localhost/phant',
  cap: 52428800,
  pageSize: 250
});

app.registerOutput(PhantStreamMongodb);

// INPUTS
// ======
var defaultInput = Phant.HttpInput({
  validator: validator,
  metadata: meta,
  keychain: keychain
});

Phant.HttpServer.use(defaultInput);
app.registerInput(defaultInput);

// OUTPUTS
// =======
var defaultOutput = Phant.HttpOutput({
  validator: validator,
  storage: stream,
  keychain: keychain
});

Phant.HttpServer.use(defaultOutput);
app.registerOutput(defaultOutput);

// MANAGERS
// ========
var defaultManager = Phant.TelnetManager({
  validator: validator,
  port: 8081,
  metadata: meta,
  keychain: keychain
});

app.registerManager(defaultManager);

var PhantManagerHttp = require('phant-manager-http')({
  validator: validator,
  metadata: meta,
  keychain: keychain
});

Phant.HttpServer.use(PhantManagerHttp);
app.registerManager(PhantManagerHttp);

console.log("");
console.log("");
console.log("        ************************");
console.log("        *Internet of Things API*");
console.log("        ************************");
console.log("");
art.font("MFADT", 'Basic', function(rendered){
    console.log(art.style(rendered, 'white+blink'));
});
