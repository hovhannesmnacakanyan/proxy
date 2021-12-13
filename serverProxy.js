const http = require('http');
const request = require('request');
const serverUrl = 'http://192.168.40.18:8081';
// const serverUrl = 'http://3.66.144.229';
const serverPort = 8080;

http
  .createServer(function (req, res) {
    const { method, url } = req;
    const { headers } = req;
    const userAgent = headers['user-agent'];
    const contentType = headers['content-type'];

    let requestUrl = serverUrl + url;

    console.info('***********************');
    console.info('Request: ', requestUrl);

    let body = [];
    req
      .on('data', chunk => {
        body.push(chunk);
      })
      .on('end', () => {
        body = Buffer.concat(body).toString();

        req.on('error', err => {
          console.error(err.stack);
        });

        let options = {
          url: requestUrl,
          method: method,
        };
        if (method !== 'GET') {
          options['body'] = body;
          options['headers'] = {
            'Content-Type': contentType,
            'User-Agent': userAgent,
            Accept: '*/*',
            Connection: 'keep-alive',
          };
        } else {
          options['encoding'] = null;
        }
        console.info('Request options to send to server: ', options);

        // Calling server to perform the request.
        request(requestUrl, options, (err, serRes, serBody) => {
          if (err) {
            return console.log('error:  ', err);
          }
          res.statusCode = serRes.statusCode;

          // Set response headers, from server response headers
          for (var header in serRes.headers) {
            if (serRes.headers[header] && header !== 'content-length') {
              res.setHeader(header, serRes.headers[header]);
            }
          }
          res.setHeader('Via', serverUrl);
          res.write(serBody);
          res.end();
          console.info('Completed handling request!');
        });
      });
  })
  .listen(serverPort);
