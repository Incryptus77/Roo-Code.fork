'use strict';
/* Mission-pack verification only. No Git mutation, network calls or remote code execution. */
const fs=require('node:fs');
const path=require('node:path');
const ROOT=path.resolve(process.argv[2]||process.cwd());
const REQUIRED=[
 '.incryptusos/AGENTS.md',
 '.incryptusos/mission/MISSION.md','.incryptusos/mission/IMPLEMENTATION_PLAN.md',
 '.incryptusos/mission/INTERFACES_AND_SOURCES.md','.incryptusos/mission/VERIFICATION.md',
 '.incryptusos/mission/DOCUMENTATION_AND_HARNESS_MIGRATION.md',
 '.incryptusos/agent_comms/START_HERE.md','.incryptusos/rules/REPOSITORY_RULES.md',
 '.incryptusos/commands/OPERATE.md','.incryptusos/harness/EXECUTION.md',
 '.incryptusos/skills/complete-mission/SKILL.md','.incryptusos/skills/complete-mission/agents/openai.yaml',
 '.incryptusos/skills/normalize-artifacts/SKILL.md','.incryptusos/skills/normalize-artifacts/agents/openai.yaml',
 '.incryptusos/scripts/audit-documentation.cjs','.incryptusos/scripts/verify-agent-pack.cjs'];
function inspect(root){
 const findings=[],sizes={},key='NONPRODUCT_AGENTS_DIRECTORY';
 for(const rel of REQUIRED){
  const abs=path.resolve(root,rel),safePrefix=path.join(path.resolve(root),'.incryptusos')+path.sep;
  if(!abs.startsWith(safePrefix)){findings.push('ESCAPE: '+rel);continue;}
  if(!fs.existsSync(abs)){findings.push('MISSING: '+rel);continue;}
  const stat=fs.lstatSync(abs);
  if(stat.isSymbolicLink()||!stat.isFile()){findings.push('UNSUPPORTED_PATH: '+rel);continue;}
  const data=fs.readFileSync(abs,'utf8');sizes[rel]=data.length;
  if(!data.trim())findings.push('EMPTY: '+rel);
  if(rel.endsWith('.md')&&!rel.endsWith('/SKILL.md')){
   if(!data.includes('[END OF DOCUMENT:'))findings.push('END_MARKER: '+rel);
  }
  if(rel.endsWith('/SKILL.md')){
   const name=rel.includes('/complete-mission/')?'complete-mission':'normalize-artifacts';
   if(!new RegExp('^---\\s*\\nname: '+name+'\\s*\\ndescription: .+\\n---','m').test(data))
    findings.push('INVALID_SKILL_FRONTMATTER: '+rel);
  }
  if(rel.endsWith('/openai.yaml')&&!data.includes('interface:'))findings.push('INVALID_SKILL_UI: '+rel);
 }
 if(fs.existsSync(path.join(root,'.incryptusos/AGENTS.md'))){
  const data=fs.readFileSync(path.join(root,'.incryptusos/AGENTS.md'),'utf8');
  for(const name of ['MISSION.md','IMPLEMENTATION_PLAN.md','INTERFACES_AND_SOURCES.md','VERIFICATION.md','DOCUMENTATION_AND_HARNESS_MIGRATION.md'])
   if(!data.includes(name))findings.push('MISSING_AGENT_POINTER: '+name);
 }
 return {schema:'inxos.agent_pack_verification.v1',root:path.resolve(root),success:findings.length===0,
  filesRequired:REQUIRED.length,filesPresent:Object.keys(sizes).length,findings,sizes,
  actualRuntimeVerified:false,projectBuildTested:false,domainEffectVerified:false};
}
if(require.main===module){
 try{const result=inspect(ROOT);process.stdout.write(JSON.stringify(result,null,2)+'\n');if(!result.success)process.exitCode=2;}
 catch(e){process.stderr.write('Mission pack verification failed: '+String(e.message)+'\n');process.exitCode=2;}
}
module.exports={inspect,REQUIRED};
