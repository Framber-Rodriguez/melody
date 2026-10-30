import { env } from 'cloudflare:workers';
import { AppError } from './melody.mjs';
export const runtimeEnv = () => env as unknown as Record<string,string>;
export function json(data:unknown,status=200) {return Response.json(data,{status,headers:{'Cache-Control':'private, no-store','X-Content-Type-Options':'nosniff'}});}
export function requireOrigin(request:Request) {
  const origin=request.headers.get('origin');
  if (!origin || origin !== new URL(request.url).origin) throw new AppError('Request must come from Salomon.',403,'forbidden');
}
export async function readBody(request:Request) {
  if (!request.headers.get('content-type')?.includes('application/json')) throw new AppError('Expected JSON.',415);
  const reader=request.body?.getReader(); if(!reader)throw new AppError('Missing request.');
  let size=0;const chunks:Uint8Array[]=[];
  while(true){const {done,value}=await reader.read();if(done)break;size+=value.byteLength;if(size>3000000){await reader.cancel();throw new AppError('Request is too large.',413);}chunks.push(value);}
  const bytes=new Uint8Array(size);let offset=0;for(const chunk of chunks){bytes.set(chunk,offset);offset+=chunk.length;}
  try{return JSON.parse(new TextDecoder().decode(bytes));}catch{throw new AppError('Invalid JSON.');}
}
export function failure(error:unknown){if(error instanceof AppError)return json({error:error.message,code:error.code},error.status);return json({error:'The request could not finish. Please try again.',code:'request_failed'},502);}
