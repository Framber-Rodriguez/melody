import { respond } from '@/lib/salomon.mjs';
import { requireOrigin,readBody,runtimeEnv,json,failure } from '@/lib/api';
export async function POST(request:Request){try{requireOrigin(request);return json(await respond(await readBody(request),runtimeEnv()));}catch(e){return failure(e);}}
