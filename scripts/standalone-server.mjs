import http from 'node:http';
import {readFile} from 'node:fs/promises';
import {resolve,extname,sep} from 'node:path';
import {timingSafeEqual} from 'node:crypto';
import {fileURLToPath} from 'node:url';
import {respond,AppError,apiError} from '../lib/melody.mjs';
const root=resolve(fileURLToPath(new URL('../docs/',import.meta.url)));
export function createSalomonServer(env=process.env){
 const host=env.HOST||'127.0.0.1';const token=env.MELODY_ACCESS_TOKEN||'';
 if(!['127.0.0.1','localhost','::1'].includes(host)&&token.length<24)throw new Error('Remote binding requires MELODY_ACCESS_TOKEN with at least 24 characters.');
 const allowed=(env.ALLOWED_ORIGINS||'').split(',').map(s=>s.trim()).filter(Boolean);
 const buckets=new Map();
 return http.createServer(async(req,res)=>{
  const origin=req.headers.origin||'';const ownOrigin=`http://${req.headers.host}`;const cors=origin&&(origin===ownOrigin||allowed.includes(origin));
  const headers={'Cache-Control':'no-store','X-Content-Type-Options':'nosniff',...(cors?{'Access-Control-Allow-Origin':origin,'Vary':'Origin'}:{})};
  function json(data,status=200){res.writeHead(status,{...headers,'Content-Type':'application/json'});res.end(JSON.stringify(data));}
  const pathname=new URL(req.url,'http://localhost').pathname;
  try{
   if(req.method==='OPTIONS'){if(!cors)throw new AppError('Origin not allowed.',403);res.writeHead(204,{...headers,'Access-Control-Allow-Methods':'GET, POST, OPTIONS','Access-Control-Allow-Headers':'Content-Type, Authorization','Access-Control-Max-Age':'600'});res.end();return;}
   if(pathname.startsWith('/api/')){
    if(origin&&!cors)throw new AppError('Origin not allowed.',403);
    if(token){const supplied=(req.headers.authorization||'').replace(/^Bearer /,'');const a=Buffer.from(supplied),b=Buffer.from(token);if(a.length!==b.length||!timingSafeEqual(a,b))throw new AppError('Backend access code is missing or incorrect.',401);}
    if(pathname==='/api/status'&&req.method==='GET'){json({configured:!!env.OPENAI_API_KEY,github:!!env.GITHUB_TOKEN,model:env.OPENAI_MODEL||'gpt-4.1-mini',backend:true});return;}
    if(req.method!=='POST')throw new AppError('Method not allowed.',405);
    if(!cors)throw new AppError('A trusted Origin header is required.',403);
    const address=req.socket.remoteAddress||'unknown';const now=Date.now();const current=buckets.get(address);const bucket=current&&now-current.start<60000?current:{start:now,count:0};bucket.count++;buckets.set(address,bucket);if(buckets.size>5000)for(const [key,value]of buckets)if(now-value.start>=60000)buckets.delete(key);if(bucket.count>20)throw new AppError('Too many requests. Wait a minute.',429);
    const chunks=[];let size=0;const limit=pathname==='/api/transcribe'?6000000:3000000;
    for await(const chunk of req){size+=chunk.length;if(size>limit)throw new AppError('Request is too large.',413);chunks.push(chunk);}
    const bytes=Buffer.concat(chunks);
    if(pathname==='/api/transcribe'){
     if(!env.OPENAI_API_KEY)throw new AppError('Server API key is not configured.',503);
     const type=(req.headers['content-type']||'').split(';')[0];if(!['audio/webm','audio/mp4','audio/ogg','audio/wav'].includes(type))throw new AppError('Unsupported audio format.');
     const form=new FormData();form.set('file',new File([bytes],`voice.${type.split('/')[1]}`,{type}));form.set('model',env.OPENAI_TRANSCRIBE_MODEL||'gpt-4o-mini-transcribe');
     const response=await fetch('https://api.openai.com/v1/audio/transcriptions',{method:'POST',headers:{Authorization:`Bearer ${env.OPENAI_API_KEY}`},body:form,signal:AbortSignal.timeout(60000)});const data=await response.json();if(!response.ok)throw apiError(response.status,data);json({text:data.text||''});return;
    }
    if(!req.headers['content-type']?.includes('application/json'))throw new AppError('Expected JSON.',415);
    let body;try{body=JSON.parse(bytes.toString());}catch{throw new AppError('Invalid JSON.');}
    if(pathname==='/api/chat'){json(await respond(body,env));return;}
    if(pathname==='/api/github'){
     if(!env.GITHUB_TOKEN)throw new AppError('GitHub is not configured on this backend.',409);
     const repo=body.repository;if(typeof repo!=='string'||!/^[-\w.]+\/[-\w.]+$/.test(repo))throw new AppError('Use owner/repository format.');
     if(!(env.GITHUB_REPOSITORIES||'').split(',').map(s=>s.trim()).includes(repo))throw new AppError('Repository not allowed.',403);
     const response=await fetch(`https://api.github.com/repos/${repo}`,{headers:{Authorization:`Bearer ${env.GITHUB_TOKEN}`,Accept:'application/vnd.github+json','User-Agent':'Salomon'},signal:AbortSignal.timeout(15000)});if(!response.ok)throw new AppError('GitHub could not read this repository.',502);const data=await response.json();json({name:data.full_name,description:data.description,url:data.html_url,private:data.private,defaultBranch:data.default_branch,openIssues:data.open_issues_count,updatedAt:data.updated_at});return;
    }
    throw new AppError('Endpoint not found.',404);
   }
   if(!['GET','HEAD'].includes(req.method))throw new AppError('Method not allowed.',405);
   const file=resolve(root,'.'+decodeURIComponent(pathname==='/'?'/index.html':pathname));if(!file.startsWith(root+sep))throw new AppError('Not found.',404);
   let data=await readFile(file);if(extname(file)==='.html')data=Buffer.from(data.toString().replace('content="github-pages"','content="standalone"'));const types={'.html':'text/html; charset=utf-8','.js':'text/javascript; charset=utf-8','.css':'text/css; charset=utf-8','.svg':'image/svg+xml','.webmanifest':'application/manifest+json','.png':'image/png'};
   res.writeHead(200,{...headers,'Content-Type':types[extname(file)]||'application/octet-stream'});res.end(req.method==='HEAD'?undefined:data);
  }catch(e){json({error:e instanceof AppError?e.message:e?.code==='ENOENT'?'Not found.':'The request could not finish.',code:e instanceof AppError?e.code:'request_failed'},e instanceof AppError?e.status:e?.code==='ENOENT'?404:502);}
 });
}
if(process.argv[1]&&resolve(process.argv[1])===fileURLToPath(import.meta.url)){const port=Number(process.env.PORT||8787),host=process.env.HOST||'127.0.0.1';createSalomonServer().listen(port,host,()=>console.log(`Salomon standalone server: http://${host}:${port}`));}
