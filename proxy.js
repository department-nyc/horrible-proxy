const { default: axios } = require('axios');
var http = require('http');
require('axios');
var httpProxy = require('http-proxy');
var path = require('path')

var proxy = httpProxy.createProxyServer({
    target: "http://localhost:3000"
});

const server = http.createServer(async function(req, res) {
    try {
        const hasExt = path.extname(req.url);
        if (hasExt) {
            proxy.web(req, res);
            return
        }
        const url = `http://localhost:3000${req.url}`
        axios.get(url).then(response => {
            const contentType = response.headers['content-type'] ;
            res.writeHead(200, {'Content-Type': contentType });
            const newHost = req.headers.host;
            const data = response.data.replace(/hero\.local/g, newHost);
            res.end(data);
        });
    } catch(ex) {
        console.log('Error')
        res.end()
    }
});
console.log("Listening on 3002")
server.listen(3002);
