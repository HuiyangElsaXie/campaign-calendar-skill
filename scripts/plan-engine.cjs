/* Offline planning utilities. No network, LLM, account, publication or scheduling calls. */
const fs = require('node:fs');
const path = require('node:path');
const crypto = require('node:crypto');
const cp = require('node:child_process');
const VERSION = '1.1.2';
const ROOT = path.resolve(__dirname, '..');
const SCHEMA = JSON.parse(fs.readFileSync(path.join(ROOT, 'schemas/plan.schema.json'), 'utf8'));
const REGISTRY = JSON.parse(fs.readFileSync(path.join(ROOT, 'references/downstream-skills.lock.json'), 'utf8'));
const PROFILES = JSON.parse(fs.readFileSync(path.join(ROOT, 'references/industry-profiles.json'), 'utf8'));
const PHASES = ['planning_start', 'planning_deadline', 'production_start', 'production_complete', 'warmup_start', 'start', 'end'];
const LIFECYCLE_PHASES = [...PHASES,'review_date'];
const LABELS = {planning_start:'企划启动 / Planning start',planning_deadline:'企划完成 / Planning deadline',production_start:'制作启动 / Production start',production_complete:'素材完成 / Production complete',warmup_start:'预热启动 / Warm-up',start:'活动开始 / Promo start',end:'活动结束 / Promo end'};
LABELS.review_date='复盘日期 / Review';
const sha = v => crypto.createHash('sha256').update(v).digest('hex');
const clone = v => JSON.parse(JSON.stringify(v));
const seteq = (a,b) => a.length === b.length && [...a].sort().every((x,i)=>x === [...b].sort()[i]);
const validDate = v => typeof v === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(v) && Number.isFinite(Date.parse(v+'T00:00:00Z')) && new Date(v+'T00:00:00Z').toISOString().slice(0,10) === v;
const dateAdd = (v,n) => new Date(Date.parse(v+'T00:00:00Z')+n*86400000).toISOString().slice(0,10);
const dateDiff = (a,b) => Math.round((Date.parse(b+'T00:00:00Z')-Date.parse(a+'T00:00:00Z'))/86400000);
const weekOf = v => {const day=new Date(v+'T00:00:00Z').getUTCDay();return dateAdd(v,-((day+6)%7));};
const round = n => Math.round((n+Number.EPSILON)*100)/100;

// Covers exactly the JSON Schema keywords used in plan.schema.json, not arbitrary schemas.
function schemaErrors(value, schema=SCHEMA, at='$', out=[]) {
  if (schema.$ref) return schemaErrors(value, SCHEMA.$defs[schema.$ref.split('/').pop()], at, out);
  const fail = text => out.push({code:'SCHEMA',path:at,message:text});
  const kind = value===null?'null':Array.isArray(value)?'array':typeof value;
  if (schema.type) {
    const types=Array.isArray(schema.type)?schema.type:[schema.type];
    if (!types.some(t=>t===kind || t==='integer'&&kind==='number'&&Number.isInteger(value))) {fail('Expected '+types.join('/'));return out;}
  }
  if (schema.const!==undefined && value!==schema.const) fail('Expected constant '+schema.const);
  if (schema.enum && !schema.enum.includes(value)) fail('Value outside enum');
  if (kind==='string') {
    if (schema.minLength && value.trim().length<schema.minLength) fail('Empty text is not complete');
    if (schema.pattern && !new RegExp(schema.pattern).test(value)) fail('Pattern mismatch');
    if (schema.format==='date' && !validDate(value)) fail('Invalid full-year date');
  }
  if (kind==='number' && (!Number.isFinite(value) || schema.minimum!==undefined&&value<schema.minimum)) fail('Invalid or negative number');
  if (kind==='array') {
    if (schema.minItems!==undefined&&value.length<schema.minItems) fail('Too few items');
    if (schema.uniqueItems&&new Set(value.map(v=>JSON.stringify(v))).size!==value.length) fail('Duplicate items');
    value.forEach((v,i)=>schemaErrors(v,schema.items,at+'['+i+']',out));
  }
  if (kind==='object') {
    for(const k of schema.required||[]) if(!Object.hasOwn(value,k)) out.push({code:'SCHEMA',path:at+'.'+k,message:'Required field missing'});
    for(const [k,v] of Object.entries(value)) {
      if(schema.properties?.[k]) schemaErrors(v,schema.properties[k],at+'.'+k,out);
      else if(schema.additionalProperties===false) out.push({code:'SCHEMA',path:at+'.'+k,message:'Unknown field'});
      else if(schema.additionalProperties&&typeof schema.additionalProperties==='object') schemaErrors(v,schema.additionalProperties,at+'.'+k,out);
    }
  }
  return out;
}

function runtimeIdentity() {
  function git(...args){try{return cp.execFileSync('git',['-C',ROOT,...args],{encoding:'utf8',stdio:['ignore','pipe','ignore']}).trim();}catch{return null;}}
  const dirty=git('status','--porcelain');
  return {repo:'HuiyangElsaXie/campaign-calendar-skill',ref:git('branch','--show-current'),sha:git('rev-parse','HEAD'),version:VERSION,working_tree_modified:dirty===null?null:!!dirty,engine_sha256:sha(fs.readFileSync(__filename))};
}
function preparePlan(input) {
  const plan=clone(input), actual=runtimeIdentity();
  if(plan.meta&&!Object.hasOwn(plan.meta,'industry_profile')){
    plan.meta.industry_profile='generic';
    plan.meta.input_provenance?.push('No industry profile supplied; using the neutral generic profile. No industry-specific checks inferred.');
  }
  // Backward-compatible span import; never shift a user date or invent a review date.
  if(plan.meta&&['planning_mode','year','date_range','anchor_date'].every(k=>!Object.hasOwn(plan.meta,k))){
    const span=plan.meta.span||{},single=span.start===span.end,year=validDate(span.start)&&span.start.endsWith('-01-01')&&span.end===span.start.slice(0,4)+'-12-31';
    Object.assign(plan.meta,{planning_mode:single?'anchor_date':year?'year':'date_range',year:year?Number(span.start.slice(0,4)):null,date_range:single||year?null:{...span},anchor_date:single?span.start:null});
    plan.meta.input_provenance?.push('Legacy span mapped to explicit '+plan.meta.planning_mode+' scope; no user dates changed. Review date remains unknown unless supplied.');
  }
  if(Array.isArray(plan.campaigns)&&Array.isArray(plan.sources))for(const c of plan.campaigns)if(c.dates&&!Object.hasOwn(c.dates,'review_date')){
    let source=plan.sources.find(s=>s.kind==='unknown');if(!source){source={id:'S-REVIEW-UNKNOWN',kind:'unknown',locator:'review-date-not-supplied',as_of:null,verification:'unverified',statement:'No review date supplied',limitations:'No reminder or review booked',scopes:['unknown']};plan.sources.push(source);}
    c.dates.review_date={value:null,state:'tbc',source_ids:[source.id]};
  }
  if(plan.meta?.generator){if(plan.meta.generator.ref==='AUTO')plan.meta.generator.ref=actual.ref||'unavailable';if(plan.meta.generator.sha==='AUTO')plan.meta.generator.sha=actual.sha;}
  return {plan,actual};
}

function validatePlan(plan, options={}) {
  const errors=schemaErrors(plan), warnings=[];
  const add=(code,p,message)=>errors.push({code,path:p,message});
  const warn=(code,p,message)=>warnings.push({code,path:p,message});
  if(errors.length)return {ok:false,errors,warnings};
  const maps={};
  for(const name of ['sources','scenarios','campaigns','coverage','content','tasks','costs','handoffs']) {
    maps[name]=new Map();
    for(const x of plan[name]) {if(maps[name].has(x.id))add('DUPLICATE_ID',name+'.'+x.id,'ID must be unique');maps[name].set(x.id,x);}
  }
  const sourceIds=new Set(maps.sources.keys()), campaignIds=[...maps.campaigns.keys()], scenarioIds=new Set(maps.scenarios.keys());
  const refs=(values,map,p)=>{for(const id of values)if(!map.has(id))add('UNKNOWN_REFERENCE',p,'Unknown ID '+id);};
  if(!seteq(plan.meta.selected_campaign_ids,campaignIds))add('CAMPAIGN_COMPLETENESS','campaigns','Selected IDs must exactly equal campaign records');
  if(plan.meta.gates.selection==='pending')add('SELECTION_PENDING','meta.gates','Stage 1 selection is not confirmed');
  if(plan.meta.mode==='simulation'&&!plan.meta.simulation_authorization?.trim())add('SIMULATION_PERMISSION','meta','Simulation requires a recorded authorization locator');
  if(plan.meta.span.start>plan.meta.span.end)add('DATE_ORDER','meta.span','Span starts after its end');
  const scope=plan.meta,range=scope.date_range;
  if(scope.planning_mode==='year'){
    if(scope.year===null||range!==null||scope.anchor_date!==null||scope.span.start!==scope.year+'-01-01'||scope.span.end!==scope.year+'-12-31')add('PLANNING_SCOPE','meta','Year mode needs only a year and its exact calendar-year span');
  }else if(scope.planning_mode==='date_range'){
    if(scope.year!==null||scope.anchor_date!==null||!range||range.start>range.end||scope.span.start!==range?.start||scope.span.end!==range?.end)add('PLANNING_SCOPE','meta','Range mode needs only ordered date_range endpoints matching span');
  }else if(scope.year!==null||range!==null||scope.anchor_date===null||scope.span.start!==scope.anchor_date||scope.span.end!==scope.anchor_date)add('PLANNING_SCOPE','meta','Anchor mode needs only anchor_date and the same single-day scope; do not move the anchor');
  try{new Intl.DateTimeFormat('en',{timeZone:plan.meta.timezone});}catch{add('TIMEZONE','meta.timezone','Use a valid IANA timezone');}
  if(plan.meta.generator.sha!==null&&!/^[a-f0-9]{40}$/.test(plan.meta.generator.sha))add('SOURCE_SHA','meta.generator.sha','Resolve AUTO or provide an actual commit SHA / null');
  for(const id of ['low-resource','standard'])if(!scenarioIds.has(id))add('SCENARIO_MISSING','scenarios','Provide low-resource and standard scenarios');
  for(const source of plan.sources)if(source.verification==='verified'&&source.kind==='public'&&(!/^https:\/\//.test(source.locator)||!source.as_of))add('EVIDENCE_RECORD','sources.'+source.id,'Verified public evidence needs URL and checked date');
  function visit(v,p) {
    if(!v||typeof v!=='object')return;
    if(Array.isArray(v)){v.forEach((x,i)=>visit(x,p+'['+i+']'));return;}
    if(Array.isArray(v.source_ids)) {
      for(const id of v.source_ids)if(!sourceIds.has(id))add('SOURCE_MISSING',p,'Missing source '+id);
      if(v.state==='fact'&&!v.source_ids.some(id=>['supplied','public'].includes(maps.sources.get(id)?.kind)))add('FACT_PROVENANCE',p,'Fact needs a supplied or observed source, not only an assumption');
    }
    if(Object.hasOwn(v,'min')&&Object.hasOwn(v,'max')) {
      if((v.min===null)!==(v.max===null)||v.min!==null&&v.min>v.max)add('RANGE',p,'Range endpoints must be ordered or both unknown');
      if(v.state==='tbc'&&(v.min!==null||v.max!==null))add('TBC_NUMBER',p,'Use assumption for hypothetical numbers; TBC endpoints must be null');
      if(v.state!=='tbc'&&(v.min===null||v.max===null))add('NUMBER_STATE',p,'Unknown endpoints need TBC state');
    }
    if(Object.hasOwn(v,'value')&&v.state==='tbc'&&v.value!==null)add('TBC_DATE',p,'Unknown date is null; a provisional date is an assumption');
    if(Object.hasOwn(v,'value')&&v.value===null&&v.state!=='tbc')add('DATE_STATE',p,'Unknown date needs TBC state');
    for(const [k,x] of Object.entries(v))visit(x,p+'.'+k);
  }
  visit(plan,'$');
  for(const campaign of plan.campaigns) {
    const p='campaigns.'+campaign.id,d=campaign.dates;
    const vals=PHASES.map(k=>d[k].value);
    for(let i=1;i<vals.length;i++)if(vals[i]&&vals[i-1]&&(i===4?vals[i-1]>=vals[i]:vals[i-1]>vals[i]))add('DATE_ORDER',p+'.dates',PHASES[i-1]+' must precede '+PHASES[i]+(i===4?' at date-only granularity':''));
    if(d.start.value&&d.end.value&&(d.end.value<plan.meta.span.start||d.start.value>plan.meta.span.end))add('SPAN_OUTSIDE',p,'Promo window does not intersect the business span');
    if(d.end.value&&d.end.value<plan.meta.as_of) {
      if(plan.meta.mode==='planning'&&campaign.recovery.action!=='cancel')add('EXPIRED_CAMPAIGN',p,'Past campaign needs explicit retrospective mode or cancellation');
    } else if(PHASES.slice(0,5).some(k=>d[k].value&&d[k].value<plan.meta.as_of)) {
      if(!['reduce','postpone','cancel'].includes(campaign.recovery.action)||campaign.recovery.options.length<3)add('RECOVERY_REQUIRED',p,'Upcoming/ongoing campaign has past preparation; provide reduce / postpone / cancel alternatives');
      else warn('RECOVERY_PROPOSED',p,campaign.recovery.proposal);
    }
    if(d.start.value===null||d.end.value===null)warn('DATE_UNCONFIRMED',p,'Unknown dates stay in the unscheduled view');
    if(d.review_date.value&&d.end.value&&d.review_date.value<d.end.value)add('DATE_ORDER',p,'Review date cannot precede the activity end');
    if(campaign.cost_basis.complete&&campaign.cost_basis.state==='tbc')add('COST_BASIS',p,'Unknown cost scope cannot be declared complete');
    for(const metric of campaign.measurement)if(metric.baseline.unit!==metric.unit||metric.target.unit!==metric.unit)add('METRIC_UNIT',p,'Baseline and target must use the declared metric unit');
  }
  for(const coverage of plan.coverage){refs([coverage.campaign_id],maps.campaigns,'coverage.'+coverage.id);refs(coverage.required_in,maps.scenarios,'coverage.'+coverage.id);}
  for(const item of plan.content) {
    const p='content.'+item.id;
    refs(item.campaign_ids,maps.campaigns,p);refs(item.scenario_ids,maps.scenarios,p);refs(item.coverage_ids,maps.coverage,p);
    if(item.kind==='core'&&item.parent_id!==null)add('CORE_PARENT',p,'A core has no parent');
    if(item.kind==='variant') {
      const parent=maps.content.get(item.parent_id);
      if(!parent||parent.kind!=='core')add('VARIANT_PARENT',p,'Variant must point to one existing core');
      else {
        if(item.scenario_ids.some(s=>!parent.scenario_ids.includes(s)))add('VARIANT_SCENARIO',p,'Parent core must be present in every variant scenario');
        if(item.order<=parent.order)add('CONTENT_ORDER',p,'Variant follows its parent in the release order');
        if(item.publish_date.value&&parent.publish_date.value&&item.publish_date.value<parent.publish_date.value)add('CONTENT_ORDER',p,'Variant publication cannot precede parent');
      }
    }
    if(item.delivery_due.value&&item.publish_date.value&&item.delivery_due.value>item.publish_date.value)add('ASSET_NOT_READY',p,'Deliverable is due after publication');
    for(const cId of item.campaign_ids){const c=maps.campaigns.get(cId);if(!c)continue;const limit=item.use_phase==='warmup'?c.dates.warmup_start.value:item.use_phase==='launch'?c.dates.start.value:null;if(limit&&item.delivery_due.value&&item.delivery_due.value>=limit)add('ASSET_NOT_READY',p,'Warm-up/launch material must be ready before its phase');if(['warmup','launch'].includes(item.use_phase)&&c.dates.production_complete.value&&item.delivery_due.value&&item.delivery_due.value>c.dates.production_complete.value)add('ASSET_NOT_READY',p,'Initial material delivery cannot exceed the declared production-complete milestone');}
    for(const covId of item.coverage_ids){const cov=maps.coverage.get(covId);if(cov&&!item.campaign_ids.includes(cov.campaign_id))add('COVERAGE_LINK',p,'Coverage belongs to a different campaign');}
    for(const claim of item.evidence_requirements){
      if(!Object.values(PROFILES).some(profile=>profile.claim_kinds.includes(claim.kind)))add('CLAIM_KIND_UNKNOWN',p,'Unknown claim kind '+claim.kind);
      const specific=Object.entries(PROFILES).find(([id,profile])=>id!=='generic'&&profile.claim_kinds.includes(claim.kind));
      if(specific&&plan.meta.industry_profile!==specific[0])add('INDUSTRY_PROFILE_REQUIRED',p,'Claim kind '+claim.kind+' requires explicit '+specific[0]+' profile; do not silently drop or reclassify it');
      if(claim.public_action==='use'&&claim.kind!=='editorial'&&claim.state!=='fact')add('UNSUPPORTED_PUBLIC_CLAIM',p,claim.claim);
    }
  }
  for(const scenario of plan.scenarios) {
    const p='scenarios.'+scenario.id,active=plan.content.filter(c=>c.scenario_ids.includes(scenario.id));
    const roles=scenario.weekly_capacity.map(r=>r.role);if(new Set(roles).size!==roles.length)add('DUPLICATE_CAPACITY',p,'One weekly basis per role');
    for(const r of scenario.weekly_capacity)if(r.hours.unit!=='hours/week')add('CAPACITY_UNIT',p,'Capacity unit must be hours/week, not headcount/FTE');
    for(const cId of campaignIds)if(!active.some(x=>x.campaign_ids.includes(cId)))add('MATRIX_MISSING',p,'No content plan for selected campaign '+cId);
    for(const cId of campaignIds)if(!plan.coverage.some(n=>n.campaign_id===cId&&n.required_in.includes(scenario.id)))add('COVERAGE_MISSING',p,'No required audience-question coverage declared for '+cId);
    for(const need of plan.coverage.filter(c=>c.required_in.includes(scenario.id)))if(!active.some(c=>c.coverage_ids.includes(need.id)))add('COVERAGE_MISSING',p,'Uncovered audience question '+need.id);
    for(const cap of scenario.caps){refs(cap.campaign_ids,maps.campaigns,p);if(cap.amount.unit!==cap.currency)add('CURRENCY_UNIT',p,'Cap currency and unit differ');}
  }
  const outputOwners=new Map();
  for(const h of plan.handoffs){for(const id of h.expected_output_ids){if(outputOwners.has(id))add('HANDOFF_OUTPUT_ID','handoffs.'+h.id,'Output ID reused');outputOwners.set(id,h);}}
  for(const task of plan.tasks) {
    const p='tasks.'+task.id;refs(task.campaign_ids,maps.campaigns,p);refs(task.scenario_ids,maps.scenarios,p);refs(task.depends_on,maps.tasks,p);
    if(task.effort.unit!=='hours')add('EFFORT_UNIT',p,'Task effort must be hours');
    if(task.start.value&&task.due.value&&task.start.value>task.due.value)add('DATE_ORDER',p,'Task starts after due date');
    if(task.content_id!==null) {
      const item=maps.content.get(task.content_id);
      if(!item)add('CONTENT_MISSING',p,'Task content does not exist');
      else {
        if(task.scenario_ids.some(s=>!item.scenario_ids.includes(s)))add('TASK_SCENARIO',p,'Task cannot outlive its content scenario');
        if(task.kind==='research'&&item.kind==='variant')add('REUSE_RESEARCH',p,'A platform variant cannot duplicate independent core research; create a new core when new research is needed');
        if(task.due.value&&item.delivery_due.value&&task.due.value>item.delivery_due.value)add('ASSET_TASK_LATE',p,'Task ends after the asset delivery date');
      }
    }
    for(const depId of task.depends_on){const dep=maps.tasks.get(depId);if(dep?.due.value&&task.start.value&&dep.due.value>task.start.value)add('DEPENDENCY_ORDER',p,'Dependency '+depId+' ends after this task starts');}
    for(const id of task.upstream_output_ids||[]){if(!outputOwners.has(id))add('UPSTREAM_OUTPUT_MISSING',p,'Unknown expected upstream output '+id);else if(outputOwners.get(id).status!=='received')warn('UPSTREAM_PENDING',p,'Not received: '+id);}
  }
  const visiting=new Set(),done=new Set();
  function cycle(id){if(visiting.has(id)){add('DEPENDENCY_CYCLE','tasks.'+id,'Task dependency cycle');return;}if(done.has(id))return;visiting.add(id);for(const dep of maps.tasks.get(id)?.depends_on||[])if(maps.tasks.has(dep))cycle(dep);visiting.delete(id);done.add(id);}
  for(const id of maps.tasks.keys())cycle(id);
  for(const item of plan.content)for(const sId of item.scenario_ids){const work=plan.tasks.filter(t=>t.content_id===item.id&&t.scenario_ids.includes(sId));if(!work.length)add('CONTENT_WORK_MISSING','content.'+item.id,'No task/effort basis in '+sId);if(work.filter(t=>t.kind==='research').length>1)add('RESEARCH_DUPLICATE','content.'+item.id,'Core research counted more than once in one scenario');}
  for(const cost of plan.costs){refs(cost.campaign_ids,maps.campaigns,'costs.'+cost.id);refs(cost.scenario_ids,maps.scenarios,'costs.'+cost.id);if(cost.unit_cost.unit!==cost.currency)add('CURRENCY_UNIT','costs.'+cost.id,'Unit cost currency differs');}
  if(plan.funnel.qualified.unit!==plan.funnel.unit||plan.funnel.conversion.unit!=='ratio'||plan.funnel.conversion.max>1)add('FUNNEL_UNIT','funnel','Use one deduplicated cohort and a 0..1 ratio; not impressions as people');
  for(const handoff of plan.handoffs) {
    const p='handoffs.'+handoff.id,skill=REGISTRY.skills.find(s=>s.id===handoff.skill_id);
    if(!skill)add('SKILL_UNKNOWN',p,'Skill has no inspected pinned interface');refs(handoff.campaign_ids,maps.campaigns,p);refs(handoff.content_ids,maps.content,p);
    if(handoff.status==='received') {
      const receipt=options.receipts?.[handoff.id];
      if(!receipt)add('HANDOFF_RECEIPT_MISSING',p,'Received was claimed without a local receipt');
      else {
        if(receipt.plan_id!==plan.meta.plan_id||receipt.handoff_id!==handoff.id||receipt.skill_sha!==skill?.sha||receipt.end_marker!=='END_HANDOFF')add('HANDOFF_IDENTITY',p,'Receipt plan/skill/SHA/end marker mismatch');
        const outputs=Array.isArray(receipt.outputs)?receipt.outputs:[];
        if(!seteq(handoff.expected_output_ids,outputs.map(o=>o.id)))add('HANDOFF_INCOMPLETE',p,'Expected outputs do not equal returned outputs');
        for(const o of outputs)if(typeof o.body!=='string'||!o.body.trim())add('HANDOFF_EMPTY',p,'Returned draft body missing');
      }
    }
  }
  refs(plan.offline.context_source_ids,maps.sources,'offline');
  for(const card of plan.offline.cards) {
    const p='offline.cards.'+card.id;refs(card.source_ids,maps.sources,p);
    if(card.partner_name!==null&&card.evidence_kind==='idea')add('PARTNER_INVENTED',p,'General ideas cannot name an unresearched organization');
    if(card.partner_name!==null&&!card.source_ids.some(id=>{const s=maps.sources.get(id);return s?.kind==='public'&&s.verification==='verified'&&/^https:\/\//.test(s.locator)&&s.as_of;}))add('PARTNER_EVIDENCE',p,'Named partner needs actually checked public evidence');
    if(card.window_start.value&&card.window_end.value&&card.window_start.value>card.window_end.value)add('DATE_ORDER',p,'Opportunity window starts after its end');
    if(card.effort.unit!=='hours')add('OPPORTUNITY_UNIT',p,'Candidate effort is total hours, not FTE');
    if(card.promoted_campaign_id!==null) {
      if(!maps.campaigns.has(card.promoted_campaign_id)||card.decision!=='approved')add('OPPORTUNITY_NOT_APPROVED',p,'Candidate cannot enter the campaign calendar');
      if(card.partner_name!==null&&(card.evidence_kind!=='acceptance-confirmation'||!card.source_ids.some(id=>{const s=maps.sources.get(id);return s?.scopes?.includes('partner-acceptance')&&['verified','user-supplied'].includes(s.verification);})))add('PARTNER_NOT_ACCEPTED',p,'A public listing is not partner acceptance; record explicit acceptance evidence scope');
      if(card.eligibility.state!=='fact'||!card.window_start.value||!card.window_end.value||card.window_start.state!=='fact'||card.window_end.state!=='fact')add('OPPORTUNITY_UNCONFIRMED',p,'Promotion requires confirmed eligibility and dates');
      if(card.application_deadline.value&&card.application_deadline.value<plan.meta.as_of)add('OPPORTUNITY_EXPIRED',p,'Expired application cannot be promoted');
    }
  }
  return {ok:errors.length===0,errors,warnings};
}

function activeItems(plan,scenario){return {content:plan.content.filter(x=>x.scenario_ids.includes(scenario)),tasks:plan.tasks.filter(x=>x.scenario_ids.includes(scenario)),costs:plan.costs.filter(x=>x.scenario_ids.includes(scenario))};}
function workload(plan,scenario) {
  const config=plan.scenarios.find(s=>s.id===scenario),weeks=new Map(),unknown=[];
  for(const task of activeItems(plan,scenario).tasks) {
    if(!task.start.value||!task.due.value||task.effort.min===null){unknown.push(task.id);continue;}
    const n=dateDiff(task.start.value,task.due.value)+1;
    for(let d=task.start.value;d<=task.due.value;d=dateAdd(d,1)) {
      const key=weekOf(d)+'|'+task.role;
      if(!weeks.has(key))weeks.set(key,{week:weekOf(d),role:task.role,min:0,max:0,task_ids:new Set(),assumed:false});
      const row=weeks.get(key);row.min+=task.effort.min/n;row.max+=task.effort.max/n;row.task_ids.add(task.id);row.assumed ||= task.effort.state!=='fact';
    }
  }
  return {allocation:'uniform-calendar-days into Monday weeks; approximation, not booked working hours',unknown_task_ids:unknown,rows:[...weeks.values()].sort((a,b)=>a.week.localeCompare(b.week)||a.role.localeCompare(b.role)).map(r=>{
    const capacity=config.weekly_capacity.find(c=>c.role===r.role)?.hours;
    const status=!capacity||capacity.min===null?'UNCONFIRMED':r.min>capacity.max?'OVERLOAD':r.max>capacity.min?'RISK':'WITHIN_ASSUMPTIONS';
    return {...r,min:round(r.min),max:round(r.max),task_ids:[...r.task_ids],available_min:capacity?.min??null,available_max:capacity?.max??null,capacity_state:capacity?.state??'tbc',status};
  })};
}
function budget(plan,scenario,campaignId=null) {
  const items=activeItems(plan,scenario).costs.filter(c=>!campaignId||c.campaign_ids.includes(campaignId));
  const groups=new Map();
  for(const c of items) {
    if(!groups.has(c.currency))groups.set(c.currency,{currency:c.currency,materials_min:0,materials_max:0,known_min:0,known_max:0,has_known:false,unknown_ids:[],items:[]});
    const g=groups.get(c.currency),share=campaignId?(c.allocation==='once-at-span'?null:1/c.campaign_ids.length):1;
    const known=c.quantity.min!==null&&c.unit_cost.min!==null&&share!==null;
    const min=known?c.quantity.min*c.unit_cost.min*share:null,max=known?c.quantity.max*c.unit_cost.max*share:null;
    g.items.push({id:c.id,label:c.label,category:c.category,min,max,state:c.quantity.state==='fact'&&c.unit_cost.state==='fact'?'fact':'assumption',allocation:share===null?'span-only':campaignId?'equal-share':'counted-once'});
    if(known){g.has_known=true;g.known_min+=min;g.known_max+=max;if(c.category==='materials'){g.materials_min+=min;g.materials_max+=max;}}else g.unknown_ids.push(c.id);
  }
  const basis=plan.campaigns.filter(c=>!campaignId||c.id===campaignId).every(c=>c.cost_basis.complete);
  return {status:items.length&&basis&&[...groups.values()].every(g=>!g.unknown_ids.length)?'COMPLETE_DECLARED_SCOPE':'INCOMPLETE',groups:[...groups.values()].map(g=>({...g,materials_min:round(g.materials_min),materials_max:round(g.materials_max),known_min:g.has_known?round(g.known_min):null,known_max:g.has_known?round(g.known_max):null,complete:basis&&!g.unknown_ids.length})),caps:plan.scenarios.find(s=>s.id===scenario).caps.filter(c=>!campaignId||c.campaign_ids.length===1&&c.campaign_ids[0]===campaignId).map(cap=>{
    const relevant=items.filter(c=>c.currency===cap.currency&&(cap.scope==='all'||c.category===cap.scope)&&(!cap.campaign_ids.length||c.campaign_ids.some(id=>cap.campaign_ids.includes(id))));
    const share=c=>!cap.campaign_ids.length?1:c.allocation==='equal-share'?c.campaign_ids.filter(id=>cap.campaign_ids.includes(id)).length/c.campaign_ids.length:c.campaign_ids.every(id=>cap.campaign_ids.includes(id))?1:null;
    const known=relevant.filter(c=>c.quantity.min!==null&&c.unit_cost.min!==null&&share(c)!==null),min=known.reduce((n,c)=>n+c.quantity.min*c.unit_cost.min*share(c),0),max=known.reduce((n,c)=>n+c.quantity.max*c.unit_cost.max*share(c),0),complete=relevant.length>0&&known.length===relevant.length&&basis;
    return {id:cap.id,currency:cap.currency,scope:cap.scope,known_min:round(min),known_max:round(max),cap_min:cap.amount.min,cap_max:cap.amount.max,status:cap.amount.max===null?'NO_CONFIRMED_CAP':known.length&&min>cap.amount.max?'AT_LEAST_OVER':!complete?'INCOMPLETE':max<=cap.amount.min?'WITHIN_ASSUMPTIONS':'RISK_OR_OVER'};
  })};
}
function opportunityReview(plan,scenario) {
  if(plan.offline.applicability==='not-applicable')return {status:'N/A',basis:plan.offline.basis,cards:[]};
  const config=plan.scenarios.find(s=>s.id===scenario),booked=workload(plan,scenario),costs=budget(plan,scenario);
  return {status:plan.offline.applicability,basis:plan.offline.basis,cards:plan.offline.cards.map(card=>{
    let assessment='CONDITIONAL';const reasons=[...card.rejection_reasons];
    if(!card.industry_tags.includes('any')&&!card.industry_tags.includes(plan.offline.industry)){assessment='REJECTED';reasons.push('Industry / audience mismatch');}
    if(card.application_deadline.value&&card.application_deadline.value<plan.meta.as_of){assessment='EXPIRED';reasons.push('Application deadline passed; exclude from current candidates');}
    if(card.decision==='declined'){assessment='REJECTED';reasons.push('User declined');}
    const available=config.weekly_capacity.find(c=>c.role===card.role)?.hours;
    let remainingHours=null;
    if(available?.max!==null&&available?.max!==undefined&&card.window_start.value&&card.window_end.value){remainingHours=0;for(let day=card.window_start.value;day<=card.window_end.value;day=dateAdd(day,1)){const row=booked.rows.find(r=>r.week===weekOf(day)&&r.role===card.role);remainingHours+=Math.max(0,available.max-(row?.min||0))/7;}remainingHours=round(remainingHours);}
    if(assessment==='CONDITIONAL'&&remainingHours!==null&&card.effort.min!==null&&card.effort.min>remainingHours){assessment='RESOURCE_DOWNGRADE';reasons.push('Insufficient remaining assumed capacity after selected work; reduce to a small owned Q&A / preparation brief, or defer');}
    if(remainingHours===null||booked.unknown_task_ids.length)reasons.push('Actual/remaining availability is unconfirmed; unknown task effort is not zero');
    if(assessment==='CONDITIONAL'&&card.cost.min!==null&&costs.caps.some(cap=>cap.scope==='all'&&cap.currency===card.cost.unit&&cap.cap_max!==null&&cap.known_min+card.cost.min>cap.cap_max)){assessment='RESOURCE_DOWNGRADE';reasons.push('Candidate plus known selected costs exceed the matching cap lower bound; reduce or defer');}
    if(card.evidence_kind==='idea')reasons.push('General idea only; no named partner, acceptance, venue or permit verified');
    return {...card,assessment,reasons,remaining_assumed_hours_max:remainingHours,committed:false};
  })};
}

function buildProjection(plan,scenario) {
  const active=activeItems(plan,scenario),timeline=plan.campaigns.map(c=>({id:c.id,name:c.name,dates:Object.fromEntries(LIFECYCLE_PHASES.map(k=>[k,c.dates[k].value])),temporal_class:plan.meta.mode==='retrospective'?'RETROSPECTIVE':c.dates.end.value&&c.dates.end.value<plan.meta.as_of&&plan.meta.mode==='simulation'?'HISTORICAL_SIMULATION':c.dates.start.value&&c.dates.start.value<plan.meta.as_of?'ONGOING_PROPOSAL':'PROSPECTIVE_PROPOSAL',recovery:c.recovery}));
  const nodes=[],windows=[],unscheduled=[];
  for(const c of plan.campaigns) {
    for(const key of LIFECYCLE_PHASES){const value=c.dates[key].value;if(value)nodes.push({date:value,campaign_id:c.id,kind:key,label:LABELS[key]});}
    if(!c.dates.start.value||!c.dates.end.value)unscheduled.push({campaign_id:c.id,reason:'Promo endpoints unconfirmed'});
    for(const [kind,a,b] of [['planning','planning_start','planning_deadline'],['production','production_start','production_complete'],['warmup','warmup_start','start'],['promo','start','end']])if(c.dates[a].value&&c.dates[b].value){const end=kind==='warmup'?dateAdd(c.dates[b].value,-1):c.dates[b].value;if(c.dates[a].value<=end)windows.push({campaign_id:c.id,kind,start:c.dates[a].value,end});}
  }
  for(const t of active.tasks)if(t.due.value)for(const id of t.campaign_ids)nodes.push({date:t.due.value,campaign_id:id,kind:'task_due',task_id:t.id,label:t.deliverable});
  for(const c of active.content)if(c.publish_date.value)for(const id of c.campaign_ids)nodes.push({date:c.publish_date.value,campaign_id:id,kind:'content_release',content_id:c.id,label:c.purpose});
  const dates=[plan.meta.span.start,plan.meta.span.end,...nodes.map(n=>n.date)].sort(),months=[];
  for(let m=dates[0].slice(0,7);m<=dates.at(-1).slice(0,7);){const start=m+'-01',next=new Date(start+'T00:00:00Z');next.setUTCMonth(next.getUTCMonth()+1);const nextM=next.toISOString().slice(0,7),end=dateAdd(nextM+'-01',-1);months.push({month:m,nodes:nodes.filter(n=>n.date>=start&&n.date<=end).sort((a,b)=>a.date.localeCompare(b.date)||a.campaign_id.localeCompare(b.campaign_id)),windows:windows.filter(w=>w.end>=start&&w.start<=end)});m=nextM;}
  return {scenario,timeline,calendar:{months,unscheduled},active,workload:workload(plan,scenario),budget:budget(plan,scenario),offline:opportunityReview(plan,scenario),comparison:plan.scenarios.map(s=>{const a=activeItems(plan,s.id),w=workload(plan,s.id);return {id:s.id,label:s.label,cores:a.content.filter(c=>c.kind==='core').length,variants:a.content.filter(c=>c.kind==='variant').length,task_hours_min:round(a.tasks.reduce((n,t)=>n+(t.effort.min||0),0)),task_hours_max:round(a.tasks.reduce((n,t)=>n+(t.effort.max||0),0)),unknown_tasks:w.unknown_task_ids.length,overload_weeks:w.rows.filter(r=>r.status==='OVERLOAD').length,risk_weeks:w.rows.filter(r=>r.status==='RISK').length};})};
}

module.exports={VERSION,ROOT,SCHEMA,REGISTRY,PROFILES,PHASES,LIFECYCLE_PHASES,LABELS,sha,clone,seteq,validDate,dateAdd,dateDiff,weekOf,round,schemaErrors,runtimeIdentity,preparePlan,validatePlan,activeItems,workload,budget,opportunityReview,buildProjection};
