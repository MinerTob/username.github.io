import https from 'https';
import fs from 'fs';
import path from 'path';

// 读取证书文件
const options = {
    key: fs.readFileSync('key/key.pem'),  // 替换为你的私钥文件路径
    cert: fs.readFileSync('key/cert.pem') // 替换为你的证书文件路径
};

// 主机名和端口设置
const hostname = '192.168.200.104'; // 你的局域网名
const port = 443; // 可以使用 80，如果不需要 HTTPS

const server = https.createServer(options, (req, res) => {
    console.log(`Request URL: ${req.url}`); // 输出请求路径

    let filePath = '.' + req.url;
    if (filePath === './') {
        filePath = './index.html'; // 默认返回 index.html
    }

    // 获取文件扩展名并设置 MIME 类型
    const extname = String(path.extname(filePath)).toLowerCase();
    const mimeTypes = {
        '.html': 'text/html',
        '.js': 'text/javascript',
        '.css': 'text/css',
        '.json': 'application/json',
        '.png': 'image/png',
        '.jpg': 'image/jpg',
        '.gif': 'image/gif',
        '.svg': 'image/svg+xml',
        '.wav': 'audio/wav',
        '.mp4': 'video/mp4',
        '.woff': 'application/font-woff',
        '.ttf': 'application/font-ttf',
        '.eot': 'application/vnd.ms-fontobject',
        '.otf': 'application/font-otf',
        '.wasm': 'application/wasm',
        '.xml': 'application/xml',
        '.zip': 'application/zip',
        '.txt': 'text/plain',
        '.exe': 'application/octet-stream' // 添加 .exe 文件的 MIME 类型
    };

    const contentType = mimeTypes[extname] || 'application/octet-stream';

    // 读取请求的文件内容
    fs.readFile(filePath, (error, content) => {
        if (error) {
            if (error.code === 'ENOENT') {
                res.writeHead(404, { 'Content-Type': 'text/html' });
                res.end('<h1>404 Not Found</h1>', 'utf-8');
            } else {
                res.writeHead(500);
                res.end('Sorry, there was an error: ' + error.code + '..\n');
            }
        } else {
            res.writeHead(200, { 'Content-Type': contentType });
            res.end(content, 'utf-8');
        }
    });
});

// 启动服务器
server.listen(port, hostname, () => {
    console.log(`服务器运行在 https://${hostname}:${port}/`);
});
