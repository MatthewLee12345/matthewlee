import http from 'node:http';
import {createReadStream} from 'node:fs';
import {stat,realpath} from 'node:fs/promises';
import {fileURLToPath} from 'node:url';
import path from 'node:path';
const root=path.dirname(fileURLToPath(import.meta.url));
const mime={'.html':'text/html; charset=utf-8','.css':'text/css; charset=utf-8','.js':'text/javascript; charset=utf-8','.json':'application/json','.svg':'image/svg+xml','.webp':'image/webp','.jpg':'image/jpeg','.jpeg':'image/jpeg','.png':'image/png','.gif':'image/gif','.ttf':'font/ttf','.mp4':'video/mp4','.mp3':'audio/mpeg','.pdf':'application/pdf'};
http.createServer(async(req,res)=>{
  const send=(code,text)=>{res.writeHead(code,{'Content-Type':'text/plain'});res.end(text);};
  try {
    if(!['GET','HEAD'].includes(req.method)) return send(405,'Method not allowed');
    const requested=decodeURIComponent(new URL(req.url,'http://localhost').pathname);
    if(requested.split('/').some(part=>part.startsWith('.'))) return send(404,'Not found');
    let relative=requested==='/'?'index.html':requested.slice(1);
    // Only the published site is available over HTTP, never source/config/secrets.
    const allowed=/^(index|about|dj|projects|film-scoring)\.html$|^(styles\.css|script\.js|resume\.pdf|image[12]\.jpg)$|^assets\/(images|brands|venues|fonts|video)\/.+|^assets\/favicon\.svg$|^Compositions\/.+\.(mp3|pdf)$|^Film Scores\/.+\.jpg$/;
    if(!allowed.test(relative)) return send(404,'Not found');
    const filename=await realpath(path.resolve(root,relative));
    if(!filename.startsWith(root+path.sep)) return send(403,'Forbidden');
    const info=await stat(filename);
    const type=mime[path.extname(filename).toLowerCase()];
    if(!info.isFile()||!type) return send(404,'Not found');
    const headers={'Content-Type':type,'Content-Length':info.size,'Accept-Ranges':'bytes','X-Content-Type-Options':'nosniff','Cache-Control':'no-cache'};
    let start=0,end=info.size-1,status=200;
    if(req.headers.range){
      const range=/^bytes=(\d*)-(\d*)$/.exec(req.headers.range);
      if(!range || (!range[1]&&!range[2])){res.writeHead(416,{'Content-Range':`bytes */${info.size}`});return res.end();}
      if(!range[1]){start=Math.max(0,info.size-Number(range[2]));}else{start=Number(range[1]);end=range[2]?Math.min(Number(range[2]),end):end;}
      if(start>end||start>=info.size){res.writeHead(416,{'Content-Range':`bytes */${info.size}`});return res.end();}
      status=206;headers['Content-Range']=`bytes ${start}-${end}/${info.size}`;headers['Content-Length']=end-start+1;
    }
    res.writeHead(status,headers);
    if(req.method==='HEAD')return res.end();
    createReadStream(filename,{start,end}).on('error',()=>res.destroy()).pipe(res);
  }catch{if(!res.headersSent)send(404,'Not found');else res.destroy();}
}).listen(Number(process.env.PORT)||4173,'127.0.0.1',()=>console.log(`Local preview: http://localhost:${Number(process.env.PORT)||4173}`));
