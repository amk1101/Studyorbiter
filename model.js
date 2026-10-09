(function (root) {
  'use strict';
  // Keep the original key so existing browser records migrate in place.
  const KEY = 'study-orbit:v1';
  const id = () => globalThis.crypto?.randomUUID?.() || Date.now().toString(36) + '-' + Math.random().toString(36).slice(2);
  const text = (x, max = 10000) => typeof x === 'string' ? x.slice(0, max) : '';
  const options = (x, list, fallback) => list.includes(x) ? x : fallback;
  const bounded = (x, low, high, fallback) => Number.isFinite(+x) && +x >= low && +x <= high ? +x : fallback;
  const categories = ['Physics', 'Chemistry', 'Biology', 'Mathematics', 'Other'];
  function today() { const d = new Date(); return [d.getFullYear(), String(d.getMonth() + 1).padStart(2, '0'), String(d.getDate()).padStart(2, '0')].join('-'); }
  function date(x) {
    if (!x) return '';
    if (typeof x !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(x)) throw Error('Use a valid date.');
    const d = new Date(x + 'T12:00:00');
    if (isNaN(d) || d.getFullYear() !== +x.slice(0, 4) || d.getMonth() + 1 !== +x.slice(5, 7) || d.getDate() !== +x.slice(8, 10)) throw Error('Use a valid date.');
    return x;
  }
  function url(x) {
    x = text(x, 2048).trim(); if (!x) return '';
    let u; try { u = new URL(x); } catch { throw Error('Subject links must begin with https:// or http://.'); }
    if (!['https:', 'http:'].includes(u.protocol)) throw Error('Subject links must begin with https:// or http://.');
    return u.href;
  }
  const empty = () => ({ version: 6, subjects: [], courses: [], tasks: [], tests: [], revisions: [], events: [], activity: [], settings: { name: '', collapsed: false, focusMinutes: 25, shortBreak: 5, longBreak: 15, cyclesBeforeLong: 4, autoAdvance: false, categories: [...categories] }, timer: { mode: 'focus', end: null, remaining: 1500, running: false, completedFocus: 0, lastRecordedAt: null } });
  function validate(input) {
    if (!input || ![1, 2, 3, 4, 5, 6].includes(input.version) || !Array.isArray(input.courses) || !Array.isArray(input.tasks)) throw Error('This is not a supported Study Orbit backup.');
    if (input.courses.length > 500 || input.tasks.length > 10000 || (input.tests?.length || 0) > 10000) throw Error('This backup is too large.');
    if (input.tests !== undefined && !Array.isArray(input.tests)) throw Error('Tests must be a list.');
    const identifiers = new Set();
    const unique = x => { if (typeof x !== 'string' || !/^[A-Za-z0-9_-]{1,100}$/.test(x) || identifiers.has(x)) throw Error('Invalid or duplicate record ID.'); identifiers.add(x); return x; };
    const data = empty();
    if(input.subjects!==undefined&&(!Array.isArray(input.subjects)||input.subjects.length>500))throw Error('Invalid subjects list.');
    data.subjects=(input.subjects||[]).map(g=>{if(!g||!text(g.title,200).trim())throw Error('A subject needs a name.');return {id:unique(g.id),title:text(g.title,200).trim(),notes:text(g.notes,20000),started:date(g.started)};});
    data.courses = input.courses.map(c => {
      if (!c || !text(c.title, 200).trim() || !Array.isArray(c.chapters) || c.chapters.length > 500) throw Error('A subject needs a title and chapters list.');
      return {
        id: unique(c.id), subjectId: text(c.subjectId,100)||null, title: text(c.title, 200).trim(), mode: options(c.mode, ['studying', 'testing', 'both'], 'both'), code: text(c.code, 80), teacher: text(c.teacher, 150), type: options(c.type, ['course', 'self-study'], 'self-study'), credits: bounded(c.credits, 0, 100, 5), started: date(c.started), link: url(c.link), assessment: options(c.assessment, ['exam', 'assignment', 'none'], 'none'), assessmentDate: date(c.assessmentDate), assessmentStatus: options(c.assessmentStatus, ['not-started', 'preparing', 'ready', 'completed'], 'not-started'), notes: text(c.notes, 50000),
        chapters: c.chapters.map(ch => {
          if (!ch || !text(ch.title, 300).trim()) throw Error('A chapter needs a title.');
          const progress = bounded(ch.progress, 0, 100, ch.done === true ? 100 : 0),status=options(ch.status,['planned','studying','completed'],progress===100?'completed':progress>0?'studying':'planned');
          return { id: unique(ch.id), title: text(ch.title, 300).trim(), category: text(ch.category, 60).trim() || 'Other', status, firstRevisionScheduled:ch.firstRevisionScheduled===true, progress, done:status==='completed', revised: date(ch.revised), studiedOn: date(ch.studiedOn), intervalWeeks: bounded(ch.intervalWeeks,1,104,1), notes: text(ch.notes, 20000) };
        })
      };
    });
    const subjectIds = new Set(data.courses.map(c => c.id));
    data.tasks = input.tasks.map(t => {
      if (!t || !text(t.title, 300).trim()) throw Error('A task needs a title.');
      return { id: unique(t.id), title: text(t.title, 300).trim(), courseId: subjectIds.has(t.courseId) ? t.courseId : null, chapterId: data.courses.find(c=>c.id===t.courseId)?.chapters.some(ch=>ch.id===t.chapterId)?t.chapterId:null, revisionId: text(t.revisionId,100)||null, due: date(t.due), started: date(t.started), priority: options(t.priority, ['high', 'normal', 'low'], 'normal'), minutes: bounded(t.minutes, 0, 1440, 30), notes: text(t.notes, 20000), done: t.done === true, archived: t.archived === true, focus: t.focus === true };
    });
    data.tests = (input.tests || []).map(t => {
      if (!t || !text(t.title, 300).trim()) throw Error('A test needs a title.');
      const score = Number(t.score), maxScore = Number(t.maxScore);
      if (t.score === '' || t.score === null || !Number.isFinite(score) || !Number.isFinite(maxScore) || maxScore <= 0 || maxScore > 1000000 || score > maxScore || score < -maxScore) throw Error('Use a positive total and a score between minus the total and the total.');
      const subject = data.courses.find(c => c.id === t.subjectId), chapter = subject?.chapters.find(ch => ch.id === t.chapterId),scope=t.scope|| (chapter||text(t.chapterName,300)?'subtopic':subject||text(t.subjectName,200)?'topic':'course');
      if(!['course','subject','topic','subtopic'].includes(scope))throw Error('Choose a valid test coverage level.');
      return { id: unique(t.id), title: text(t.title, 300).trim(), scope, groupId:text(t.groupId,100)||null,groupName:text(t.groupName,200),series: text(t.series, 100).trim() || 'General practice', date: date(t.date) || (() => { throw Error('A test needs a date.'); })(), subjectId: ['topic','subtopic'].includes(scope)?subject?.id||null:null, chapterId:scope==='subtopic'?chapter?.id||null:null, subjectName:['topic','subtopic'].includes(scope)?subject?.title||text(t.subjectName,200):'',chapterName:scope==='subtopic'?chapter?.title||text(t.chapterName,300):'', category: text(t.category, 60).trim() || chapter?.category || 'Other', score, maxScore, minutes: bounded(t.minutes, 0, 1440, 0), notes: text(t.notes, 20000), createdAt: bounded(t.createdAt, 0, Number.MAX_SAFE_INTEGER, 0) };
    });
    if(input.revisions!==undefined&&(!Array.isArray(input.revisions)||input.revisions.length>10000))throw Error('Invalid revision history.');
    data.revisions=(input.revisions||[]).map(r=>{
      if(!r)throw Error('Invalid revision.');const c=data.courses.find(c=>c.id===r.courseId),ch=c?.chapters.find(ch=>ch.id===r.chapterId),status=options(r.status,['planned','done'],'planned');
      if(status==='planned'&&(!c||!ch))throw Error('A planned revision needs a valid subtopic.');
      const completedDate=date(r.completedDate);if(status==='done'&&(!completedDate||completedDate>today()))throw Error('A completed revision needs a date today or earlier.');
      return {id:unique(r.id),courseId:c?.id||null,chapterId:ch?.id||null,topicName:c?.title||text(r.topicName,200),chapterName:ch?.title||text(r.chapterName,300),date:date(r.date)||completedDate||(()=>{throw Error('A revision needs a date.');})(),status,completedDate,notes:text(r.notes,20000),recall:options(r.recall,['again','partial','good',''],''),intervalWeeks:bounded(r.intervalWeeks,1,104,1),origin:options(r.origin,['first','manual'],'manual')};
    });
    if(input.events!==undefined&&(!Array.isArray(input.events)||input.events.length>10000))throw Error('Invalid events list.');
    data.events=(input.events||[]).map(e=>{if(!e||!text(e.title,300).trim())throw Error('An event needs a title.');const time=x=>!x?'':/^([01]\d|2[0-3]):[0-5]\d$/.test(x)?x:(()=>{throw Error('Use a valid event time.');})();return {id:unique(e.id),title:text(e.title,300).trim(),date:date(e.date)||(()=>{throw Error('An event needs a date.');})(),start:time(e.start),end:time(e.end),notes:text(e.notes,20000),done:e.done===true};});
    if(data.events.some(e=>e.start&&e.end&&e.end<=e.start))throw Error('Event end time must be after start time.');
    // Older subjects were actually topics. Group them using their shared category,
    // or an explicit Unsorted subject; keep every topic/subtopic ID and test link.
    for(const c of data.courses){
      if(c.subjectId){if(!data.subjects.some(g=>g.id===c.subjectId))throw Error('Topic has an unknown subject.');continue;}
      const cats=[...new Set(c.chapters.map(ch=>ch.category).filter(x=>x!=='Other'))],title=input.version<4&&cats.length===1?cats[0]:'Unsorted';
      let group=data.subjects.find(g=>g.title===title);if(!group){let candidate='migrated-subject-'+data.subjects.length;while(identifiers.has(candidate))candidate+='x';group={id:unique(candidate),title,notes:'',started:''};data.subjects.push(group);}c.subjectId=group.id;
    }
    for(const t of data.tests){
      if(t.scope==='course'){t.groupId=null;t.groupName='';continue;}
      const topic=data.courses.find(c=>c.id===t.subjectId),g=data.subjects.find(g=>g.id===(topic?.subjectId||t.groupId));
      t.groupId=g?.id||null;t.groupName=g?.title||t.groupName;
      if(t.scope==='subject'&&!g&&!t.groupName)throw Error('A subject test needs a subject.');
      if(['topic','subtopic'].includes(t.scope)&&!topic&&!t.subjectName)throw Error('A topic test needs a topic.');
      if(t.scope==='subtopic'&&!t.chapterId&&!t.chapterName)throw Error('A subtopic test needs a subtopic.');
    }
    if(input.version<4){for(const c of data.courses)for(const ch of c.chapters)if(ch.revised){let candidate='legacy-revision-'+data.revisions.length;while(identifiers.has(candidate))candidate+='x';data.revisions.push({id:unique(candidate),courseId:c.id,chapterId:ch.id,topicName:c.title,chapterName:ch.title,date:ch.revised,completedDate:ch.revised,status:'done',notes:'Imported from the previously saved last-revised date. Earlier revisions were not recorded.',recall:'',intervalWeeks:1,origin:'manual'});}}
    for(const ch of data.courses.flatMap(c=>c.chapters)){const known=data.revisions.filter(r=>r.chapterId===ch.id&&r.status==='done').map(r=>r.completedDate).sort().at(-1);if(known)ch.revised=known;if(data.revisions.some(r=>r.chapterId===ch.id))ch.firstRevisionScheduled=true;}
    const revisionIds=new Set(data.revisions.map(r=>r.id));data.tasks.forEach(t=>{if(!revisionIds.has(t.revisionId))t.revisionId=null;});
    const s = input.settings || {};
    const labels = Array.isArray(s.categories) ? [...new Set(s.categories.map(c => text(c, 60).trim()).filter(Boolean))].slice(0, 100) : [...categories];
    data.settings = { name: text(s.name, 60), collapsed: s.collapsed === true, focusMinutes: bounded(s.focusMinutes, 1, 180, 25), shortBreak: bounded(s.shortBreak, 1, 120, 5), longBreak: bounded(s.longBreak, 1, 180, 15), cyclesBeforeLong: Math.round(bounded(s.cyclesBeforeLong, 1, 12, 4)), autoAdvance: s.autoAdvance === true, categories: labels.length ? labels : [...categories] };
    const t = input.timer || {}, mode = options(t.mode, ['focus', 'short-break', 'long-break'], 'focus');
    data.timer = { mode, end: Number.isFinite(t.end) ? t.end : null, remaining: bounded(t.remaining, 0, 10800, duration(mode, data.settings)), running: t.running === true && Number.isFinite(t.end), completedFocus: Math.floor(bounded(t.completedFocus, 0, 1000000, 0)), lastRecordedAt: Number.isFinite(t.lastRecordedAt) && t.lastRecordedAt >= 0 ? t.lastRecordedAt : null };
    if (input.activity !== undefined && (!Array.isArray(input.activity) || input.activity.length > 10000)) throw Error('Invalid activity history.');
    const days = new Set();
    data.activity = (input.activity || []).map(a => {
      const key = date(a?.date);
      if (!key || days.has(key) || !Number.isFinite(a.studySeconds) || a.studySeconds < 0 || a.studySeconds > 172800 || !Number.isFinite(a.restSeconds) || a.restSeconds < 0 || a.restSeconds > 172800) throw Error('Invalid or duplicate activity day.');
      days.add(key); return { date: key, studySeconds: a.studySeconds, restSeconds: a.restSeconds };
    }).sort((a,b) => a.date.localeCompare(b.date));
    return data;
  }
  function read(storage) { const raw = storage.getItem(KEY); return raw ? validate(JSON.parse(raw)) : empty(); }
  function write(storage, data) { const safe = validate(data); storage.setItem(KEY, JSON.stringify(safe)); return safe; }
  function removeCourse(data, subjectId) {
    const subject = data.courses.find(c => c.id === subjectId);
    data.tests.forEach(t => { if (t.subjectId === subjectId) { t.subjectName = subject?.title || t.subjectName; t.chapterName = subject?.chapters.find(ch => ch.id === t.chapterId)?.title || t.chapterName; t.subjectId = null; t.chapterId = null; } });
    data.revisions=data.revisions.filter(r=>r.courseId!==subjectId||r.status==='done');
    data.revisions.forEach(r=>{if(r.courseId===subjectId){r.courseId=null;r.chapterId=null;}});
    data.tasks=data.tasks.filter(t=>!t.revisionId||data.revisions.some(r=>r.id===t.revisionId));
    data.courses = data.courses.filter(c => c.id !== subjectId);
    data.tasks.forEach(t => { if (t.courseId === subjectId) {t.courseId = null;t.chapterId=null;} });
  }
  function removeChapter(data, subjectId, chapterId) {
    const c = data.courses.find(c => c.id === subjectId), ch = c?.chapters.find(ch => ch.id === chapterId);
    if (!c || !ch) throw Error('Chapter no longer exists.');
    data.tests.forEach(t => { if (t.subjectId === subjectId && t.chapterId === chapterId) { t.chapterName = ch.title; t.chapterId = null; } });
    data.revisions=data.revisions.filter(r=>r.chapterId!==chapterId||r.status==='done');data.revisions.forEach(r=>{if(r.chapterId===chapterId)r.chapterId=null;});
    data.tasks=data.tasks.filter(t=>!t.revisionId||data.revisions.some(r=>r.id===t.revisionId));data.tasks.forEach(t=>{if(t.chapterId===chapterId)t.chapterId=null;});
    c.chapters = c.chapters.filter(ch => ch.id !== chapterId);
  }
  function addDays(value,n){date(value);if(!value||!Number.isInteger(n))throw Error('Choose a date and whole days.');const d=new Date(value+'T12:00:00');d.setDate(d.getDate()+n);return [d.getFullYear(),String(d.getMonth()+1).padStart(2,'0'),String(d.getDate()).padStart(2,'0')].join('-');}
  function planRevisionOn(data,courseId,chapterId,plannedDate,notes='',revisionId=null,origin='manual'){
    const c=data.courses.find(c=>c.id===courseId),ch=c?.chapters.find(ch=>ch.id===chapterId);date(plannedDate);
    if(!ch||!plannedDate)throw Error('Choose a subtopic and revision date.');
    const old=revisionId?data.revisions.find(r=>r.id===revisionId):data.revisions.find(r=>r.courseId===courseId&&r.chapterId===chapterId&&r.status==='planned');
    if(revisionId&&(!old||old.status!=='planned'||old.courseId!==courseId||old.chapterId!==chapterId))throw Error('This planned revision is no longer available.');
    const r={id:old?.id||id(),courseId,chapterId,topicName:c.title,chapterName:ch.title,date:plannedDate,status:'planned',completedDate:'',notes,recall:'',intervalWeeks:ch.intervalWeeks,origin:old?.origin||origin};
    if(old)Object.assign(old,r);else data.revisions.push(r);ch.firstRevisionScheduled=true;
    const task=data.tasks.find(t=>t.revisionId===r.id),values={title:'Revise '+ch.title,courseId,chapterId,revisionId:r.id,due:plannedDate,started:task?.started||today(),minutes:task?.minutes??30,priority:task?.priority||'normal',notes,done:false,archived:false,focus:task?.focus||false};
    if(task)Object.assign(task,values);else data.tasks.push({id:id(),...values});return r;
  }
  function planRevision(data,courseId,chapterId,baseDate,weeks,notes='',revisionId=null,origin='manual'){
    const ch=data.courses.find(c=>c.id===courseId)?.chapters.find(ch=>ch.id===chapterId);weeks=Number(weeks);
    if(!ch||!Number.isFinite(weeks)||weeks<1||weeks>104)throw Error('Choose a subtopic and a gap from 1 to 104 weeks.');
    const plannedDate=addDays(baseDate,Math.round(weeks*7));ch.intervalWeeks=weeks;
    const r=planRevisionOn(data,courseId,chapterId,plannedDate,notes,revisionId,origin);data.tasks.find(t=>t.revisionId===r.id).started=baseDate;return r;
  }
  function markStudied(data,courseId,chapterId,completedDate=today()){
    const ch=data.courses.find(c=>c.id===courseId)?.chapters.find(ch=>ch.id===chapterId);
    date(completedDate);if(!ch||!completedDate||completedDate>today())throw Error('Choose a subtopic and a study date today or earlier.');
    ch.status='completed';ch.done=true;ch.progress=100;if(!ch.studiedOn)ch.studiedOn=completedDate;
    const existing=data.revisions.filter(r=>r.courseId===courseId&&r.chapterId===chapterId);
    if(!ch.firstRevisionScheduled&&!existing.length)return planRevision(data,courseId,chapterId,ch.studiedOn,ch.intervalWeeks,'First revision scheduled when studying was completed.',null,'first');
    if(existing.length)ch.firstRevisionScheduled=true;
    return existing.find(r=>r.status==='planned')||null;
  }
  function setStudyStatus(data,courseId,chapterId,status,completedDate=today()){
    if(!['planned','studying','completed'].includes(status))throw Error('Choose Planned, Studying or Completed.');
    if(status==='completed')return markStudied(data,courseId,chapterId,completedDate);
    const ch=data.courses.find(c=>c.id===courseId)?.chapters.find(ch=>ch.id===chapterId);if(!ch)throw Error('Subtopic no longer exists.');
    ch.status=status;ch.done=false;ch.progress=status==='studying'?50:0;return null;
  }
  function completeRevision(data,revisionId,completedDate=today(),recall='',notes=''){
    const r=data.revisions.find(r=>r.id===revisionId);if(!r)throw Error('Revision no longer exists.');date(completedDate);if(!completedDate||completedDate>today())throw Error('A revision completion must be today or earlier.');
    if(r.status==='done')return r;r.status='done';r.completedDate=completedDate;r.recall=recall;r.notes=notes||r.notes;
    const ch=data.courses.find(c=>c.id===r.courseId)?.chapters.find(ch=>ch.id===r.chapterId);if(ch)ch.revised=[ch.revised,completedDate].filter(Boolean).sort().at(-1);
    data.tasks.forEach(t=>{if(t.revisionId===r.id)t.done=true;});return r;
  }
  function cancelRevision(data,revisionId){const r=data.revisions.find(r=>r.id===revisionId);data.revisions=data.revisions.filter(r=>r.id!==revisionId);data.tasks=data.tasks.filter(t=>t.revisionId!==revisionId);const ch=data.courses.find(c=>c.id===r?.courseId)?.chapters.find(ch=>ch.id===r?.chapterId);if(ch&&r.status==='done')ch.revised=data.revisions.filter(x=>x.chapterId===ch.id&&x.status==='done').map(x=>x.completedDate).sort().at(-1)||'';}
  function agenda(data,day){date(day);return [
    ...data.tasks.filter(t=>!t.done&&!t.archived&&!t.revisionId&&t.due===day).map(item=>({kind:'task',item})),
    ...data.revisions.filter(r=>r.status==='planned'&&r.date===day).map(item=>({kind:'revision',item})),
    ...data.events.filter(e=>!e.done&&e.date===day).map(item=>({kind:'event',item})),
    ...data.courses.filter(c=>c.assessment!=='none'&&c.assessmentStatus!=='completed'&&c.assessmentDate===day).map(item=>({kind:'assessment',item}))
  ];}
  function upcoming(data,day=today()){return Array.from({length:3},(_,i)=>{const d=addDays(day,i);return agenda(data,d).map(e=>({...e,date:d}));}).flat();}
  const progress = c => c.chapters.length ? Math.round(c.chapters.filter(ch=>ch.status==='completed'||(!ch.status&&ch.done)).length/c.chapters.length*100) : 0;
  function orderedTasks(tasks) { const rank = { high: 0, normal: 1, low: 2 }; return [...tasks].sort((a, b) => Number(b.focus) - Number(a.focus) || (a.due || '9999-99-99').localeCompare(b.due || '9999-99-99') || rank[a.priority] - rank[b.priority]); }
  function testPath(test){return test.scope==='course'?'All subjects · whole course':test.scope==='subject'?test.groupName||'Removed subject':[test.groupName,test.subjectName,test.scope==='subtopic'?test.chapterName:''].filter(Boolean).join(' › ')||'Historical result';}
  function filterTests(data,filters={}){
    const cutoff=filters.period&&filters.period!=='all'?addDays(today(),-Number(filters.period)):'';
    return orderedTests(data.tests.filter(t=>(!filters.scope||filters.scope==='all'||t.scope===filters.scope)&&(!filters.group||t.groupId===filters.group)&&(!filters.subject||t.subjectId===filters.subject)&&(!filters.chapter||t.chapterId===filters.chapter)&&(!filters.category||t.category===filters.category)&&(!filters.series||t.series===filters.series)&&(!cutoff||t.date>=cutoff)));
  }
  const percentage = t => t.score / t.maxScore * 100;
  const orderedTests = tests => [...tests].sort((a, b) => a.date.localeCompare(b.date) || a.createdAt - b.createdAt);
  const duration = (mode, settings) => (mode === 'focus' ? settings.focusMinutes : mode === 'long-break' ? settings.longBreak : settings.shortBreak) * 60;
  function settleTimer(data, now = Date.now()) {
    const t = data.timer;
    if (!t.running || !Number.isFinite(t.end)) return 0;
    const until = Math.min(now, t.end);
    // Older timers did not record a start: begin tracking now, never invent history.
    if (!Number.isFinite(t.lastRecordedAt)) { t.lastRecordedAt = until; return 0; }
    if (until <= t.lastRecordedAt) return 0;
    let cursor = Math.max(t.lastRecordedAt, t.end - duration(t.mode, data.settings) * 1000), total = 0;
    while (cursor < until) {
      const d = new Date(cursor), key = [d.getFullYear(), String(d.getMonth()+1).padStart(2,'0'), String(d.getDate()).padStart(2,'0')].join('-');
      const midnight = new Date(d.getFullYear(), d.getMonth(), d.getDate()+1).getTime(), stop = Math.min(midnight, until), seconds = (stop-cursor)/1000;
      let day = data.activity.find(a => a.date === key);
      if (!day) { day = { date:key, studySeconds:0, restSeconds:0 }; data.activity.push(day); }
      day[t.mode === 'focus' ? 'studySeconds' : 'restSeconds'] += seconds;
      total += seconds; cursor = stop;
    }
    t.lastRecordedAt = until;
    return total;
  }
  function monthlyActivity(data, month, now = Date.now()) {
    date(month + '-01');
    const copy = JSON.parse(JSON.stringify(data)); settleTimer(copy, now);
    const last = new Date(month+'-01T12:00:00'); last.setMonth(last.getMonth()+1); last.setDate(0);
    return Array.from({length:last.getDate()},(_,i) => {
      const key = month+'-'+String(i+1).padStart(2,'0'), day = copy.activity.find(a=>a.date===key);
      return day ? {...day} : {date:key,studySeconds:0,restSeconds:0};
    });
  }
  function advanceTimer(data, now = Date.now(), completed = true) {
    settleTimer(data, now);
    const t = data.timer;
    if (t.mode === 'focus' && completed) t.completedFocus++;
    t.mode = t.mode === 'focus' ? (completed && t.completedFocus % data.settings.cyclesBeforeLong === 0 ? 'long-break' : 'short-break') : 'focus';
    t.remaining = duration(t.mode, data.settings);
    t.running = completed && data.settings.autoAdvance;
    t.end = t.running ? now + t.remaining * 1000 : null;
    t.lastRecordedAt = t.running ? now : null;
  }
  root.StudyModel = { KEY, id, today, date, url, empty, validate, read, write, removeCourse, removeChapter, progress, orderedTasks, testPath, filterTests, percentage, orderedTests, duration, settleTimer, monthlyActivity, advanceTimer, addDays, planRevision, planRevisionOn, markStudied, setStudyStatus, completeRevision, cancelRevision, agenda, upcoming };
  if (typeof module !== 'undefined' && module.exports) module.exports = root.StudyModel;
})(typeof window !== 'undefined' ? window : globalThis);
