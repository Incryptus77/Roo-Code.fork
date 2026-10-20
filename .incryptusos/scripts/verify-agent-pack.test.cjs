'use strict';
const test=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs'),os=require('node:os'),path=require('node:path');
const {inspect,REQUIRED}=require('./verify-agent-pack.cjs');
test('fresh empty directory reports required missing files',()=>{
 const base=fs.mkdtempSync(path.join(os.tmpdir(),'inx-mission-test-'));
 try{const r=inspect(base);assert.equal(r.success,false);assert.equal(r.filesPresent,0);
  assert.ok(r.findings.some(x=>x.includes('MISSING: .incryptusos/AGENTS.md')));}
 finally{fs.rmSync(base,{recursive:true,force:true});}
});
test('recognized skill frontmatter names and agent links are verified',()=>{
 const base=fs.mkdtempSync(path.join(os.tmpdir(),'inx-mission-test-'));
 try{
  for(const rel of REQUIRED){
   const loc=path.join(base,rel);fs.mkdirSync(path.dirname(loc),{recursive:true});
   let data='A non-empty content\n';
   if(rel.endsWith('/SKILL.md'))data='---\nname: '+(rel.includes('complete-mission')?'complete-mission':'normalize-artifacts')+'\ndescription: test\n---\n\nWork.\n';
   else if(rel.endsWith('/openai.yaml'))data='interface:\n  display_name: test\n  short_description: test\n';
   else if(rel==='.incryptusos/AGENTS.md')data='MISSION.md IMPLEMENTATION_PLAN.md INTERFACES_AND_SOURCES.md VERIFICATION.md DOCUMENTATION_AND_HARNESS_MIGRATION.md\n[END OF DOCUMENT: Test]\n';
   else if(rel.endsWith('.md')&&rel!=='.incryptusos/agents.md')data+='[END OF DOCUMENT: Test]\n';
   fs.writeFileSync(loc,data,'utf8');
  }
  const pass=inspect(base);assert.equal(pass.success,true,pass.findings.join('\n'));
  fs.writeFileSync(path.join(base,'.incryptusos/skills/normalize-artifacts/SKILL.md'),
   '---\nname: wrong-skill\ndescription: x\n---\n');
  const fail=inspect(base);assert.equal(fail.success,false);
  assert.ok(fail.findings.some(x=>x.includes('INVALID_SKILL_FRONTMATTER')));
 }finally{fs.rmSync(base,{recursive:true,force:true});}
});
