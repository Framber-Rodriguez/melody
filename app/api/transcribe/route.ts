import {requireOrigin,runtimeEnv,json,failure} from '@/lib/api';
import {AppError,apiError} from '@/lib/salomon.mjs';
export async function POST(request:Request){try{
 requireOrigin(request);const key=runtimeEnv().OPENAI_API_KEY;if(!key)throw new AppError('Salomon’s server key is missing.',503);
 // Browser speech recognition is the primary voice path; this route supports bounded recorded audio.
 if(Number(request.headers.get('content-length')||0)>6000000)throw new AppError('Recording is too large.',413);
 const bytes=await request.arrayBuffer();if(bytes.byteLength>6000000)throw new AppError('Recording is too large.',413);
 const type=request.headers.get('content-type')?.split(';')[0]||'';
 if(!['audio/webm','audio/mp4','audio/ogg','audio/wav'].includes(type))throw new AppError('Unsupported recording format.');
 const form=new FormData();form.set('file',new File([bytes],`voice.${type==='audio/mp4'?'mp4':type.split('/')[1]}`,{type}));form.set('model',runtimeEnv().OPENAI_TRANSCRIBE_MODEL||'gpt-4o-mini-transcribe');
 const response=await fetch('https://api.openai.com/v1/audio/transcriptions',{method:'POST',headers:{Authorization:`Bearer ${key}`},body:form,signal:AbortSignal.timeout(60000)});
 const data=await response.json() as {text?:string};if(!response.ok)throw apiError(response.status,data);return json({text:data.text||''});
 }catch(e){return failure(e);}}
