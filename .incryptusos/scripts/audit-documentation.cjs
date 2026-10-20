'use strict';
/* IncryptusOS construction-artifact placement audit; no file moves or mutation. */
const cp=require('node:child_process');
function classify(p){
  const n=String(p).replace(/\\/g,'/');
  if(n==='.incryptusos'||n.startsWith('.incryptusos/'))return 'ALREADY_CORRECT';
  if(/^(README\.md|AGENTS\.md|LICENSE(?:\..*)?|CHANGELOG\.md|CONTRIBUTING\.md|CODEOWNERS)$/i.test(n))return 'COMPAT_ENTRYPOINT';
  if(/^\.github\/(workflows|ISSUE_TEMPLATE|PULL_REQUEST_TEMPLATE)(\/|$)/i.test(n))return 'COMPAT_ENTRYPOINT';
  if(/^(docs?|documentation|agent_comms|agent-comms|handoffs?|plans?|prds?|designs?|research|reviews?|audits?|specs?|prompts?|skills?|rules|harness(?:es)?|\.cursor|\.agents|\.claude)(\/|$)/i.test(n))return 'MOVE_CONSTRUCTION_REVIEW';
  if(/^scripts?\//i.test(n))return 'SCRIPT_REQUIRES_CLASSIFICATION';
  if(/(^|\/)(AGENTS|INSTRUCTIONS|HANDOFF|MISSION|ROADMAP|PRD|ADR)\.md$/i.test(n))return 'MOVE_CONSTRUCTION_REVIEW';
  if(/(^|\/)[^/]+\.(md|mdx|rst|adoc)$/i.test(n))return 'DOCUMENTATION_REQUIRES_CLASSIFICATION';
  return 'PRODUCT_OR_UNKNOWN_KEEP';
}
function suggested(p,c){
  if(c==='ALREADY_CORRECT'||c==='PRODUCT_OR_UNKNOWN_KEEP')return null;
  const n=String(p).replace(/\\/g,'/');
  if(c==='COMPAT_ENTRYPOINT')return '.incryptusos/docs/compatibility/'+n;
  if(n.startsWith('agent_comms/'))return '.incryptusos/agent_comms/'+n.slice('agent_comms/'.length);
  if(n.startsWith('.cursor/'))return '.incryptusos/harness/cursor/'+n.slice('.cursor/'.length);
  if(n.startsWith('docs/'))return '.incryptusos/docs/'+n.slice('docs/'.length);
  if(n.startsWith('scripts/'))return '.incryptusos/scripts/'+n.slice('scripts/'.length);
  if(n.startsWith('harness/'))return '.incryptusos/harness/'+n.slice('harness/'.length);
  return '.incryptusos/docs/legacy/'+n;
}
function git(root,args){
  const x=cp.spawnSync('git',args,{cwd:root,encoding:'buffer',maxBuffer:64*1024*1024});
  if(x.error||x.status!==0)throw Error('git command failed with exit '+x.status);
  return x.stdout.toString('utf8');
}
function collect(root){
  const top=git(root,['rev-parse','--show-toplevel']).trim();
  const sha=git(top,['rev-parse','HEAD']).trim();
  const names=git(top,['ls-files','-z','--cached']).split('\0').filter(Boolean);
  const classifications={};
  const candidates=[];
  for(const name of names){
    const cls=classify(name);
    classifications[cls]=(classifications[cls]||0)+1;
    if(cls!=='ALREADY_CORRECT'&&cls!=='PRODUCT_OR_UNKNOWN_KEEP')
      candidates.push({source:name,classification:cls,proposedDestination:suggested(name,cls),status:'NOT_MOVED_REQUIRES_CONSUMER_REVIEW'});
  }
  return {schema:'inxos.artifact_placement_audit.v1',root:top,sourceSha:sha,trackedFiles:names.length,
    classifications,candidates,mutation:false,recordedAt:new Date().toISOString(),
    notes:['Nonproduct docs/harness/scripts should migrate under root .incryptusos.',
      'Compatibility entrypoints such as root AGENTS/README and .github/workflows need verified references.',
      'No git mv, delete or source change occurs during this audit. Actual migrations require ownership, loader search and tests.']};
}
function run(args){
  const root=args.find(x=>!x.startsWith('-'))||process.cwd();
  const r=collect(root);
  if(args.includes('--json'))process.stdout.write(JSON.stringify(r,null,2)+'\n');
  else{
    process.stdout.write('INCRYPTUSOS_ARTIFACT_AUDIT source='+r.sourceSha+'\n');
    for(const [k,v] of Object.entries(r.classifications))process.stdout.write(k+'='+v+'\n');
    for(const x of r.candidates)process.stdout.write(x.classification+' | '+x.source+' -> '+x.proposedDestination+'\n');
  }
  if(args.includes('--strict')&&r.candidates.some(x=>x.classification==='MOVE_CONSTRUCTION_REVIEW'))process.exitCode=2;
  return r;
}
if(require.main===module)try{run(process.argv.slice(2));}
catch(err){process.stderr.write('Artifact placement audit failed; see local diagnostic: '+err.message+'\n');process.exitCode=2;}
module.exports={classify,suggested,collect,run};
