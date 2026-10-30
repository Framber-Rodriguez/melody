import {requireOrigin,runtimeEnv,json,failure,readBody} from '@/lib/api';
import {AppError} from '@/lib/salomon.mjs';
export async function POST(request:Request){try{
 requireOrigin(request);const token=runtimeEnv().GITHUB_TOKEN;if(!token)throw new AppError('GitHub is not connected. Add a repository-scoped GITHUB_TOKEN to the backend to enable repository reading.',409,'not_connected');
 const body=await readBody(request);const repo=body.repository;
 if(typeof repo!=='string'||!/^[-\w.]+\/[-\w.]+$/.test(repo))throw new AppError('Use owner/repository format.');
 const allowed=(runtimeEnv().GITHUB_REPOSITORIES||'').split(',').map(s=>s.trim());if(!allowed.includes(repo))throw new AppError('This repository is not in Salomon’s server allowlist.',403);
 const res=await fetch(`https://api.github.com/repos/${repo}`,{headers:{Authorization:`Bearer ${token}`,Accept:'application/vnd.github+json','User-Agent':'Salomon'}});
 if(!res.ok)throw new AppError('GitHub could not read that repository. Check the allowlist and token permissions.',res.status===404?404:502);
 const data=await res.json() as Record<string,unknown>;return json({name:data.full_name,description:data.description,url:data.html_url,private:data.private,defaultBranch:data.default_branch,openIssues:data.open_issues_count,updatedAt:data.updated_at});
 }catch(e){return failure(e);}}
