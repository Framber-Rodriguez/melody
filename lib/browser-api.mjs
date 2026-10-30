/** Static GitHub Pages and same-origin server builds share this client. */
export function validateBackendURL(value) {
  if(!value.trim())return '';
  const url=new URL(value.trim());
  if(url.username||url.password||url.search||url.hash||!['http:','https:'].includes(url.protocol))throw new Error('Use a backend origin without a path, password, or query string.');
  if(url.pathname!=='/'&&url.pathname!=='')throw new Error('Use the backend origin only, such as https://api.example.com.');
  if(url.protocol!=='https:'&&!['localhost','127.0.0.1','[::1]'].includes(url.hostname))throw new Error('Remote backends must use HTTPS.');
  return url.origin;
}
export function isStaticBuild(){return typeof document!=='undefined'&&document.querySelector('meta[name="salomon-mode"]')?.getAttribute('content')==='github-pages';}
/** @param {string} path @param {RequestInit} [options] */
export async function requestAPI(path,options={}) {
  const base=typeof window==='undefined'?'':localStorage.getItem('salomon.backend.origin')||'';
  if(isStaticBuild()&&!base){
    if(path==='/api/status')return Response.json({configured:false,github:false,model:'Backend not connected',backend:false});
    return Response.json({error:'Connect a backend in Settings to enable AI replies. GitHub Pages hosts the interface only.',code:'backend_required'},{status:503});
  }
  const headers=new Headers(options.headers);
  const token=base?sessionStorage.getItem('salomon.backend.access')||'':'';
  if(token)headers.set('Authorization','Bearer '+token);
  return fetch(base+path,{...options,headers,credentials:base?'omit':'same-origin'});
}
