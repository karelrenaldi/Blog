const mongoose = require("mongoose");
const dotenv = require("dotenv");
const app = require("./app");
const fs = require('fs');
const http = require('http');
const https = require('https');

dotenv.config({ path: "./config/config.env" });

/* Databases */
const db = process.env.DATABASE;
(async () => {
  await mongoose.connect(db, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true,
  });
  console.log("Database connection successful");
})().catch(() => console.log("DB connection failed"));

const privateKey = fs.readFileSync('/etc/letsencrypt/live/swadayaganesha.com/privkey.pem', 'utf8');
const certificate = fs.readFileSync('/etc/letsencrypt/live/swadayaganesha.com/cert.pem', 'utf8');
const ca = fs.readFileSync('/etc/letsencrypt/live/swadayaganesha.com/chain.pem', 'utf8');

const credentials = {
	key: privateKey,
	cert: certificate,
	ca: ca
};

const httpServer = http.createServer(app);
const httpsServer = https.createServer(credentials, app);

httpServer.listen(80, () => {
	console.log('HTTP Server running on port 80');
});

httpsServer.listen(443, () => {
	console.log('HTTPS Server running on port 443');
});



