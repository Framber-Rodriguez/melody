import {runtimeEnv,json} from '@/lib/api';
export async function GET(){const e=runtimeEnv();return json({configured:!!e.OPENAI_API_KEY,model:e.OPENAI_MODEL||'gpt-4.1-mini',github:!!e.GITHUB_TOKEN,email:false,desktop:false});}
