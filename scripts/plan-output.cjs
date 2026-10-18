const fs=require('node:fs'),path=require('node:path');
const E=require('./plan-engine.cjs');
const escapeHTML=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const cell=v=>String(v??'TBC').replaceAll('|','\\|').replaceAll('\n',' / ');
const range=m=>m.min===null?'TBC ['+m.state+']':(m.min===m.max?m.min:m.min+'–'+m.max)+' '+m.unit+' ['+m.state+']';
const d=v=>(v.value??'TBC')+' ['+v.state+'; '+v.source_ids.join(',')+']';
const amount=(a,b)=>a===null?'TBC':a===b?String(a):a+'–'+b;

function provenanceLog(plan){
  const out=[];
  function visit(v,p){if(!v||typeof v!=='object')return;if(Array.isArray(v)){v.forEach((x,i)=>visit(x,p+'['+i+']'));return;}
    if(v.state)out.push({path:p,state:v.state,source_ids:v.source_ids||[],value:Object.hasOwn(v,'value')?v.value:Object.hasOwn(v,'min')?{min:v.min,max:v.max,unit:v.unit,scope:v.scope}:v.text??v.claim??v.scope});
    for(const [k,x] of Object.entries(v))visit(x,p+'.'+k);
  }visit(plan,'$');return out;
}
function buildReport(plan,p,validation,actual){
  const b=[],heading=(level,text)=>b.push({type:'heading',level,text}),para=text=>b.push({type:'paragraph',text}),table=(columns,rows)=>b.push({type:'table',columns,rows}),list=items=>b.push({type:'list',items}),mark=value=>b.push({type:'marker',value});
  heading(1,plan.meta.title+' — '+p.scenario+' / '+plan.meta.mode);
  para('COMPLETE_DRAFT means all selected records and files are present; it is not approval, actual performance, completed research, publication or scheduled execution. / 完整草稿不等于获批、真实业绩、已调研或已发布。');
  table(['Source / provenance','Value'],[['Plan / span',plan.meta.plan_id+' | '+plan.meta.span.start+' → '+plan.meta.span.end],['Industry profile',plan.meta.industry_profile],['Planning scope',plan.meta.planning_mode+' | '+JSON.stringify({year:plan.meta.year,date_range:plan.meta.date_range,anchor_date:plan.meta.anchor_date})],['Mode / as-of / timezone',plan.meta.mode+' | '+plan.meta.as_of+' | '+plan.meta.timezone],['Actual generator repo/ref/SHA/version',actual.repo+' | '+(actual.ref??'UNKNOWN')+' | '+(actual.sha??'UNKNOWN')+' | '+actual.version],['Working tree modified / engine SHA-256',String(actual.working_tree_modified)+' | '+actual.engine_sha256],['Input declared source',JSON.stringify(plan.meta.generator)],['Selection / timeline gate',plan.meta.gates.selection+' / '+plan.meta.gates.timeline],['Simulation authority',plan.meta.simulation_authorization??'N/A']]);
  heading(2,'业务背景与输入边界 / Reused context');
  table(['Field','Statement','State / sources'],plan.business_context.map(x=>[x.label,x.text,x.state+' | '+x.source_ids.join(',')]));
  list(plan.meta.input_provenance);
  heading(2,'情景比较 / Low-resource and standard');
  table(['Scenario','Independent cores','Platform variants','Unique task hours','Unknown tasks','Overload / risk role-weeks'],p.comparison.map(x=>[x.label,x.cores,x.variants,amount(x.task_hours_min,x.task_hours_max),x.unknown_tasks,x.overload_weeks+' / '+x.risk_weeks]));
  para('Core counts follow audience-question coverage. Variants reuse a core; research is counted once, while adaptation/review hours still count. These are declared scenarios, not a default frequency or inferred FTE.');
  mark('SECTION:TIMELINE');heading(2,'1. Timeline — 单一日期表');
  table(['ID / campaign','Planning start → finish','Production start → complete','Warm-up','Promo start → end','Review','Class / recovery'],p.timeline.map(c=>[c.id+' '+c.name,c.dates.planning_start+' → '+c.dates.planning_deadline,c.dates.production_start+' → '+c.dates.production_complete,c.dates.warmup_start,c.dates.start+' → '+c.dates.end,c.dates.review_date??'TBC',c.temporal_class+' / '+c.recovery.action]));
  for(const c of p.timeline)mark('TIMELINE_ID:'+c.id);
  para('Review dates after the business span are shown only when explicitly supplied. Unknown review dates remain TBC; no review was booked. Costs and cohort units cover the chosen scope, with no automatic annual proration.');
  para('Date-only material completion precedes warm-up; full years are retained. Original/recovery dates are proposed scenarios, never completion records. Earlier preparation remains visible outside the business span.');
  mark('SECTION:CALENDAR');heading(2,'2. Calendar — 按月实际节点与运行窗口');
  for(const m of p.calendar.months){heading(3,m.month);if(m.nodes.length)table(['Date','Campaign','Node / task / content'],m.nodes.map(n=>[n.date,n.campaign_id,n.kind+' | '+(n.task_id??n.content_id??'')+' | '+n.label]));else para('No dated node in this month.');if(m.windows.length)table(['Campaign','Phase','Full window'],m.windows.map(w=>[w.campaign_id,w.kind,w.start+' → '+w.end]));}
  if(p.calendar.unscheduled.length)table(['Unscheduled campaign','Reason'],p.calendar.unscheduled.map(x=>[x.campaign_id,x.reason]));
  heading(3,'未来 30 天节点 / Next 30 days');
  const next=p.calendar.months.flatMap(m=>m.nodes).filter(n=>n.date>=plan.meta.as_of&&n.date<=E.dateAdd(plan.meta.as_of,30));
  table(['Date','Campaign','Proposed node'],next.map(n=>[n.date,n.campaign_id,n.kind+' '+n.label]));
  para('This is a list in a file; no calendar write or automatic notification was created.');
  mark('SECTION:DETAILS');heading(2,'3. 完整活动明细 / Every selected campaign');
  for(const c of plan.campaigns){
    mark('CAMPAIGN_DETAIL:'+c.id);heading(3,c.id+' — '+c.name);
    list(['Objective: '+c.objective,'Audience: '+c.audience,'Strategy: '+c.strategy,'Channels: '+c.channels.join(' / '),'Priority / basis: '+c.priority+' | '+c.source_ids.join(',')]);
    table(['Milestone','Date / state / basis'],E.LIFECYCLE_PHASES.map(k=>[E.LABELS[k],d(c.dates[k])]));
    heading(4,'恢复与前置条件 / Recovery');para(c.recovery.proposal);list(c.recovery.options);if(Object.keys(c.recovery.original_dates).length)table(['Original reference node','Original date'],Object.entries(c.recovery.original_dates));
    const work=p.active.tasks.filter(t=>t.campaign_ids.includes(c.id)),content=p.active.content.filter(x=>x.campaign_ids.includes(c.id)),cost=E.budget(plan,p.scenario,c.id);
    table(['Content scope','IDs / count'],[['Independent cores',content.filter(x=>x.kind==='core').map(x=>x.id).join(', ')||'TBC'],['Adaptations',content.filter(x=>x.kind==='variant').map(x=>x.id).join(', ')||'None'],['Tasks (shared IDs count once at span)',work.map(t=>t.id).join(', ')],['Cost completeness',cost.status+' | '+c.cost_basis.scope+' ['+c.cost_basis.state+']']]);
    if(cost.groups.length)table(['Currency','Known subtotal','Unknown cost IDs'],cost.groups.map(g=>[g.currency,amount(g.known_min,g.known_max),g.unknown_ids.join(', ')||'None declared']));else para('Budget: UNCONFIRMED — no cost basis supplied; not zero cost.');
    para('Capacity: see the same-period role-week workload section. Headcount does not establish feasibility. Unknown hours and overloads remain conditions.');
    table(['Metric','Definition / deduplication','Baseline / target','Source / decision'],c.measurement.map(m=>[m.name,m.numerator+' / '+m.denominator+' | '+m.dedupe_key+' | '+m.window,range(m.baseline)+' / '+range(m.target),m.source+' | '+m.decision_rule]));
    heading(4,'Data / Plan B / follow-up');list(c.plan_b);list(c.follow_up);
    mark('END_CAMPAIGN_DETAIL:'+c.id);
  }
  mark('SECTION:MATRIX');heading(2,'4. 内容矩阵 / Core themes and platform reuse');
  const profile=E.PROFILES[plan.meta.industry_profile];
  para(profile.notice[plan.meta.language]);
  if(profile.checks.length){heading(3,'行业适用检查 / Applicable profile checks');list(profile.checks.map(c=>c[plan.meta.language==='zh-CN'?'zh-CN':'en']));}
  for(const core of p.active.content.filter(c=>c.kind==='core')){
    mark('CONTENT:'+core.id);heading(3,core.id+' — '+core.pillar);
    list(['Campaigns: '+core.campaign_ids.join(', ')+' | sequence '+core.order,'Audience / problem: '+core.audience+' | '+core.question,'Subtopics: '+core.subtopics.join('；'),'Deliverable / purpose: '+core.asset_type+' | '+core.purpose,'Funnel / CTA: '+core.funnel+' | '+core.cta+' | destination '+(core.destination??'TBC / no invented URL'),'Primary channel / role: '+core.channel+' | '+core.role,'Delivery / release: '+d(core.delivery_due)+' / '+d(core.publish_date),'Reuse: '+core.reuse_notes]);
    table(['Claim / condition','State / evidence','Public-copy action'],core.evidence_requirements.map(c=>[c.claim,c.state+' | '+c.source_ids.join(','),c.public_action]));
    const variants=p.active.content.filter(c=>c.parent_id===core.id);
    if(variants.length)table(['Variant / channel','Adaptation purpose / CTA','Sequence / delivery / release','Role / reuse'],variants.map(v=>[v.id+' | '+v.channel,v.purpose+' | '+v.cta,v.order+' | '+d(v.delivery_due)+' | '+d(v.publish_date),v.role+' | '+v.reuse_notes]));
    for(const v of variants)mark('CONTENT:'+v.id);
  }
  heading(3,'覆盖检查 / Audience-question coverage');
  table(['Need / campaign','Pillar / question','Covered by active core / variant'],plan.coverage.filter(n=>n.required_in.includes(p.scenario)).map(n=>[n.id+' | '+n.campaign_id,n.pillar+' | '+n.question,p.active.content.filter(c=>c.coverage_ids.includes(n.id)).map(c=>c.id).join(', ')||'MISSING']));
  mark('SECTION:TASKS');heading(2,'5. 交付物、角色、截止与依赖 / Unique task backlog');
  table(['Task / content / campaigns','Deliverable / acceptance','Role / owner','Start → due','Hours / dependencies'],p.active.tasks.map(t=>[t.id+' | '+(t.content_id??'coordination')+' | '+t.campaign_ids.join(','),t.deliverable+' | '+t.acceptance,t.role+' | '+t.owner,d(t.start)+' → '+d(t.due),range(t.effort)+' | '+t.depends_on.join(',')+' | upstream '+(t.upstream_output_ids||[]).join(',')]));
  mark('SECTION:CAPACITY');heading(2,'6. 工时与资源约束 / Capacity');
  para(p.workload.allocation+'; assumed ranges are not actual staffing/FTE. All shared task IDs are counted once.');
  table(['Week / role','Required hours','Available hours / state','Status','Task IDs'],p.workload.rows.map(w=>[w.week+' | '+w.role,amount(w.min,w.max),amount(w.available_min,w.available_max)+' ['+w.capacity_state+']',w.status,w.task_ids.join(',')]));
  if(p.workload.unknown_task_ids.length)para('UNCONFIRMED effort/date tasks: '+p.workload.unknown_task_ids.join(', '));
  para('OVERLOAD / RISK requires scope reduction, reuse, a new proposed date or an explicitly confirmed resource change. A scenario total cannot certify a real team.');
  mark('SECTION:BUDGET');heading(2,'7. 币种、物料小计与完整成本 / Budget boundary');
  para('Completeness: '+p.budget.status+'. Currency groups never combine without an explicit conversion policy. Candidate offline opportunities are not committed costs.');
  for(const g of p.budget.groups){heading(3,g.currency);table(['Cost ID / category','Scope label','Amount','Basis'],g.items.map(i=>[i.id+' | '+i.category,i.label,amount(i.min,i.max)+' '+g.currency,i.state+' | '+i.allocation]));para('Materials known subtotal: '+amount(g.materials_min,g.materials_max)+'; all known costs: '+amount(g.known_min,g.known_max)+'; unresolved: '+(g.unknown_ids.join(',')||'none declared')+'; complete declared scope: '+g.complete);}
  if(!p.budget.groups.length)para('UNCONFIRMED — no costs supplied, not a zero-cost plan.');
  if(p.budget.caps.length)table(['Cap ID / currency / scope','Known amount / cap','Assessment'],p.budget.caps.map(c=>[c.id+' | '+c.currency+' | '+c.scope,amount(c.known_min,c.known_max)+' / '+amount(c.cap_min,c.cap_max),c.status]));else para('No explicit matching cap supplied. No whole-plan WITHIN claim is made.');
  heading(3,'去重漏斗情景 / Auditable funnel');
  list(['Unit / window: '+plan.funnel.unit+' | '+plan.funnel.window,'Deduplication: '+plan.funnel.dedupe_key,'Attribution: '+plan.funnel.attribution,'Qualified cohort: '+range(plan.funnel.qualified),'Conversion: '+range(plan.funnel.conversion),'Scenario converted cohort: '+(plan.funnel.qualified.min===null||plan.funnel.conversion.min===null?'TBC':Math.floor(plan.funnel.qualified.min*plan.funnel.conversion.min)+'–'+Math.ceil(plan.funnel.qualified.max*plan.funnel.conversion.max))+' '+plan.funnel.unit,'Caveat: '+plan.funnel.caveat]);
  mark('SECTION:OFFLINE');heading(2,'8. 线下候选机会 / Applicability-first opportunities');
  para(p.offline.status+' | '+p.offline.basis+'; candidate ideas are separate from calendar, selected campaign totals and commitments.');
  for(const c of p.offline.cards){heading(3,c.id+' — '+c.type+' / '+c.assessment);list(['Goal / fit: '+c.goal+' | '+c.fit_reason,'Partner: '+(c.partner_name??'No concrete organization researched')+' | profile '+c.partner_profile,'Value exchange: us — '+c.value_for_us+'; partner — '+c.value_for_partner,'Format / audience / region: '+c.format+' | '+c.audience+' | '+c.region,'Resources: '+range(c.effort)+' '+c.role+'; candidate cost '+range(c.cost),'Window / application deadline: '+d(c.window_start)+' → '+d(c.window_end)+' | '+d(c.application_deadline),'Evidence: '+c.evidence_kind+' | '+c.source_ids.join(',')+' (URLs/checked dates in source ledger)','Eligibility: '+c.eligibility.text+' ['+c.eligibility.state+']','Status / decision: '+c.status+' / '+c.decision,'Next: '+c.next_step]);list([...c.risks,...c.reasons]);}
  mark('SECTION:HANDOFFS');heading(2,'9. 可选下游交接 / Pinned skill handoffs');
  for(const h of plan.handoffs){const s=E.REGISTRY.skills.find(s=>s.id===h.skill_id);heading(3,h.id+' — '+h.status);para(s.repo+' @ '+s.sha+' | '+s.entrypoint+' | '+s.version);para('Expected outputs: '+h.expected_output_ids.join(', ')+'; content '+h.content_ids.join(', ')+'; fallback '+h.fallback);para(s.boundary+' Rights: '+s.license);}
  if(!plan.handoffs.length)para('No downstream call claimed. The local content matrix / task briefs are the fallback.');
  mark('SECTION:ASSUMPTIONS');heading(2,'10. 完整依据、假设与缺口 / Provenance and completeness');
  const log=provenanceLog(plan),group=new Map();for(const x of log.filter(x=>x.state!=='fact')){const key=x.state+' | '+x.source_ids.join(',');group.set(key,(group.get(key)||0)+1);}
  table(['State / source IDs','Number of fields in complete ledger'],[...group.entries()]);
  para('Every field-level provenance record is saved in assumptions.json (not truncated). The normalized-plan.json retains each value, scope, unit and source reference.');
  table(['Source','Kind / verification / date','Locator','Statement / limits'],plan.sources.map(s=>[s.id,s.kind+' / '+s.verification+' / '+(s.as_of??'unknown'),s.locator,s.statement+' | '+s.limitations]));
  if(validation.warnings.length)table(['Validation warning','Location / condition'],validation.warnings.map(w=>[w.code,w.path+' | '+w.message]));
  para('Selected = Timeline = detailed report IDs = '+plan.meta.selected_campaign_ids.join(', ')+'. All selected IDs are represented in Calendar nodes/windows or the explicit unscheduled bucket. Manifest hashes and end markers detect loss after generation.');
  mark('END_REPORT:'+plan.meta.plan_id+':'+p.scenario+':'+plan.meta.selected_campaign_ids.length);
  return b;
}

function toMarkdown(blocks){return blocks.map(b=>b.type==='heading'?'#'.repeat(b.level)+' '+b.text:b.type==='paragraph'?b.text:b.type==='list'?b.items.map(x=>'- '+x).join('\n'):b.type==='marker'?'<!-- '+b.value+' -->':'| '+b.columns.map(cell).join(' | ')+' |\n| '+b.columns.map(()=>'---').join(' | ')+' |\n'+b.rows.map(r=>'| '+r.map(cell).join(' | ')+' |').join('\n')).join('\n\n')+'\n';}
function toHTML(blocks,language){const body=blocks.map(b=>b.type==='heading'?'<h'+b.level+'>'+escapeHTML(b.text)+'</h'+b.level+'>':b.type==='paragraph'?'<p>'+escapeHTML(b.text)+'</p>':b.type==='list'?'<ul>'+b.items.map(x=>'<li>'+escapeHTML(x)+'</li>').join('')+'</ul>':b.type==='marker'?'<!-- '+b.value+' -->':'<div class="table-wrap"><table><thead><tr>'+b.columns.map(x=>'<th>'+escapeHTML(x)+'</th>').join('')+'</tr></thead><tbody>'+b.rows.map(r=>'<tr>'+r.map(x=>'<td>'+escapeHTML(x)+'</td>').join('')+'</tr>').join('')+'</tbody></table></div>').join('\n');return '<!doctype html>\n<html lang="'+language+'"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Campaign plan — complete draft</title><style>body{font:15px/1.65 system-ui,"Microsoft YaHei",sans-serif;color:#18252f;max-width:1250px;margin:32px auto;padding:0 24px}h1{font-size:28px}h2{margin-top:40px;border-bottom:2px solid #12656b;padding-bottom:8px}h3{margin-top:28px;color:#12656b}p,li{overflow-wrap:anywhere}.table-wrap{overflow:auto;margin:14px 0}table{border-collapse:collapse;width:100%;font-size:13px}th,td{border:1px solid #ccd8dc;padding:7px;vertical-align:top;text-align:left;overflow-wrap:anywhere}th{background:#edf5f4}tr:nth-child(even){background:#f7f9fa}@media print{@page{size:A4 landscape;margin:14mm}body{margin:0;padding:0;font-size:10pt;max-width:none}.table-wrap{overflow:visible}table{font-size:8pt}thead{display:table-header-group}tr{break-inside:avoid}h2,h3,h4{break-after:avoid}}</style></head><body>\n'+body+'\n</body></html>\n';}

function handoffRequest(plan,h){const skill=E.REGISTRY.skills.find(s=>s.id===h.skill_id),campaigns=plan.campaigns.filter(c=>h.campaign_ids.includes(c.id)),content=plan.content.filter(c=>h.content_ids.includes(c.id)),sourceIds=new Set(h.source_ids);function collect(v){if(!v||typeof v!=='object')return;if(Array.isArray(v)){v.forEach(collect);return;}for(const id of v.source_ids||[])sourceIds.add(id);Object.values(v).forEach(collect);}collect([campaigns,content,plan.business_context]);return {handoff_id:h.id,plan_id:plan.meta.plan_id,mode:plan.meta.mode,timezone:plan.meta.timezone,skill:{...skill,url:'https://github.com/'+skill.repo+'/blob/'+skill.sha+'/'+skill.entrypoint},privacy:'Local-only request. No permission to export unrelated private data or contact/publish.',business_context:plan.business_context,campaigns,content,sources:plan.sources.filter(s=>sourceIds.has(s.id)),expected_output_ids:h.expected_output_ids,return_envelope:{handoff_id:h.id,plan_id:plan.meta.plan_id,skill_sha:skill.sha,outputs:h.expected_output_ids.map(id=>({id,body:'editable draft or precise blocker; never fabricate completion'})),end_marker:'END_HANDOFF'},stop:'Return requested drafts/notes only; do not expand annual scope, imply approval, research not performed or actual assets not produced.',fallback:h.fallback};}

function writeBundle(input,scenario,out,options={}) {
  const {plan,actual}=E.preparePlan(input),validation=E.validatePlan(plan,{receipts:options.receipts});
  if(!validation.ok){const e=new Error('Plan validation failed');e.validation=validation;throw e;}
  if(!plan.scenarios.some(s=>s.id===scenario))throw Error('Unknown scenario');
  const p=E.buildProjection(plan,scenario),blocks=buildReport(plan,p,validation,actual),files={};
  const json=v=>JSON.stringify(v,null,2)+'\n';
  files['normalized-plan.json']=json(plan);files['timeline.json']=json({meta:plan.meta,rows:p.timeline});files['calendar.json']=json({meta:plan.meta,...p.calendar});files['analysis.json']=json({scenario,actual,validation,budget:p.budget,workload:p.workload,comparison:p.comparison,offline:p.offline});files['assumptions.json']=json(provenanceLog(plan));files['report.md']=toMarkdown(blocks);files['report.html']=toHTML(blocks,plan.meta.language);
  for(const h of plan.handoffs){files['handoffs/'+h.id+'.request.json']=json(handoffRequest(plan,h));if(h.status==='received')files['handoffs/'+h.id+'.result.json']=json(options.receipts[h.id]);}
  fs.mkdirSync(out,{recursive:true});
  for(const name of [...Object.keys(files),'manifest.json'])if(fs.existsSync(path.join(out,name))&&!options.overwrite)throw Error('Existing output; use explicit overwrite: '+name);
  for(const [name,bytes] of Object.entries(files)){const target=path.join(out,name);fs.mkdirSync(path.dirname(target),{recursive:true});fs.writeFileSync(target,bytes);}
  const manifest={version:E.VERSION,status:'writing',plan_id:plan.meta.plan_id,scenario,selected_campaign_ids:plan.meta.selected_campaign_ids,source:actual,mode:plan.meta.mode,timezone:plan.meta.timezone,input_sha256:E.sha(json(input)),files:Object.entries(files).map(([name,bytes])=>({name,bytes:Buffer.byteLength(bytes),sha256:E.sha(bytes)})),end_marker:'END_MANIFEST'};
  fs.writeFileSync(path.join(out,'manifest.json'),json(manifest));
  const check=verifyBundle(out,{allowWriting:true});if(!check.ok){const e=new Error('Generated bundle is incomplete');e.validation=check;throw e;}
  manifest.status='complete-draft';fs.writeFileSync(path.join(out,'manifest.json'),json(manifest));
  return {out:path.resolve(out),status:manifest.status,selected:plan.meta.selected_campaign_ids.length,cores:p.active.content.filter(c=>c.kind==='core').length,variants:p.active.content.filter(c=>c.kind==='variant').length,source:actual,validation_warnings:validation.warnings.length};
}

function verifyBundle(dir,options={}) {
  const errors=[],fail=message=>errors.push(message);let manifest,plan,timeline,calendar;
  try{manifest=JSON.parse(fs.readFileSync(path.join(dir,'manifest.json'),'utf8'));if(manifest.end_marker!=='END_MANIFEST'||manifest.status!=='complete-draft'&&!(options.allowWriting&&manifest.status==='writing'))fail('Manifest is unfinished');
    for(const name of ['normalized-plan.json','timeline.json','calendar.json','analysis.json','assumptions.json','report.md','report.html'])if(!manifest.files.some(f=>f.name===name))fail('Required manifest file missing: '+name);
    for(const f of manifest.files){const target=path.resolve(dir,f.name);if(!target.startsWith(path.resolve(dir)+path.sep)){fail('Unsafe manifest path');continue;}const bytes=fs.readFileSync(target);if(bytes.length!==f.bytes||E.sha(bytes)!==f.sha256)fail('Bytes/hash mismatch: '+f.name);}
    plan=JSON.parse(fs.readFileSync(path.join(dir,'normalized-plan.json'),'utf8'));timeline=JSON.parse(fs.readFileSync(path.join(dir,'timeline.json'),'utf8'));calendar=JSON.parse(fs.readFileSync(path.join(dir,'calendar.json'),'utf8'));
    const ids=plan.meta.selected_campaign_ids;if(!E.seteq(ids,manifest.selected_campaign_ids)||!E.seteq(ids,timeline.rows.map(r=>r.id)))fail('Selected IDs != Timeline IDs');
    const log=JSON.parse(fs.readFileSync(path.join(dir,'assumptions.json'),'utf8'));if(JSON.stringify(log)!==JSON.stringify(provenanceLog(plan)))fail('Field-level assumptions ledger is incomplete');
    const analysis=JSON.parse(fs.readFileSync(path.join(dir,'analysis.json'),'utf8'));if(!analysis.budget?.status||!Array.isArray(analysis.workload?.rows)||!analysis.actual?.version)fail('Budget/capacity/source status missing');
    const expected=E.buildProjection(plan,manifest.scenario);if(JSON.stringify({months:calendar.months,unscheduled:calendar.unscheduled})!==JSON.stringify(expected.calendar))fail('Calendar differs from the complete model projection');
    const blocks=buildReport(plan,expected,analysis.validation,analysis.actual);if(fs.readFileSync(path.join(dir,'report.md'),'utf8')!==toMarkdown(blocks)||fs.readFileSync(path.join(dir,'report.html'),'utf8')!==toHTML(blocks,plan.meta.language))fail('Report body differs from the complete model projection');
    if(JSON.stringify(analysis.budget)!==JSON.stringify(expected.budget)||JSON.stringify(analysis.workload)!==JSON.stringify(expected.workload))fail('Budget/capacity differs from the complete model projection');
    const allNodes=calendar.months.flatMap(m=>m.nodes),allWindows=calendar.months.flatMap(m=>m.windows),calendarIds=[...new Set([...allNodes.map(n=>n.campaign_id),...allWindows.map(w=>w.campaign_id),...calendar.unscheduled.map(x=>x.campaign_id)])];if(!E.seteq(ids,calendarIds))fail('Selected IDs != Calendar IDs');
    for(const c of plan.campaigns){const t=timeline.rows.find(t=>t.id===c.id);for(const key of E.LIFECYCLE_PHASES){const date=c.dates[key].value;if(t?.dates[key]!==date)fail('Timeline date drift: '+c.id+'/'+key);if(date&&!allNodes.some(n=>n.campaign_id===c.id&&n.kind===key&&n.date===date))fail('Calendar dated node missing: '+c.id+'/'+key);}}
    for(const name of ['report.md','report.html']){const text=fs.readFileSync(path.join(dir,name),'utf8'),details=[...text.matchAll(/<!-- CAMPAIGN_DETAIL:([A-Za-z0-9_.-]+) -->/g)].map(m=>m[1]),ends=[...text.matchAll(/<!-- END_CAMPAIGN_DETAIL:([A-Za-z0-9_.-]+) -->/g)].map(m=>m[1]);if(!E.seteq(ids,details)||!E.seteq(ids,ends))fail('Report detail IDs truncated or duplicated: '+name);for(const s of ['TIMELINE','CALENDAR','DETAILS','MATRIX','TASKS','CAPACITY','BUDGET','OFFLINE','HANDOFFS','ASSUMPTIONS'])if(!text.includes('<!-- SECTION:'+s+' -->'))fail('Required section missing: '+name+'/'+s);if(!text.includes('<!-- END_REPORT:'+plan.meta.plan_id+':'+manifest.scenario+':'+ids.length+' -->'))fail('Report end marker missing: '+name);}
  }catch(e){fail(e.message);}
  return {ok:errors.length===0,errors,selected:plan?.meta?.selected_campaign_ids.length??null};
}
module.exports={provenanceLog,buildReport,toMarkdown,toHTML,handoffRequest,writeBundle,verifyBundle};
