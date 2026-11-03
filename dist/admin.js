// HR prototype data is browser-local. No credentials or server-side access control.
const adminNavs=[['admin-home','工作台','home'],['admin-courses','课程管理','book'],['admin-plans','培训计划','exam'],['admin-learning','学习管理','history'],['admin-exams','考试测评','exam'],['admin-people','人员管理','award'],['admin-data','培训数据','chart'],['admin-config','首页配置','spark']];
const defaultAdminData={
 courses:[{id:'c1',title:'企业文化与价值观',category:'企业文化',students:28,status:'已发布'},{id:'c2',title:'信息安全培训',category:'安全合规',students:148,status:'已发布'},{id:'c3',title:'产品基础介绍',category:'产品知识',students:36,status:'已发布'},{id:'c4',title:'AI 工具应用实战',category:'能力提升',students:0,status:'已发布'},{id:'c5',title:'数据分析入门',category:'能力提升',students:0,status:'已发布'},{id:'c6',title:'跨部门协作实践',category:'通用能力',students:0,status:'草稿'},{id:'c7',title:'职场表达技巧',category:'通用能力',students:0,status:'草稿'}],
 plans:[{id:'p1',title:'2026 年 11 月新员工培训',audience:'11 月新员工',courses:'5 门课程',deadline:'11 月 16 日',progress:72,status:'进行中'},{id:'p2',title:'全员信息安全培训',audience:'全体员工',courses:'1 门课程',deadline:'11 月 15 日',progress:84,status:'进行中'},{id:'p3',title:'产品知识提升计划',audience:'产品与销售团队',courses:'3 门课程',deadline:'11 月 30 日',progress:42,status:'进行中'}],
 exams:[{id:'e1',title:'新员工入职考试',audience:'新员工',deadline:'11 月 16 日',status:'进行中',participants:28},{id:'e2',title:'信息安全知识测评',audience:'全体员工',deadline:'11 月 15 日',status:'进行中',participants:148},{id:'e3',title:'产品知识基础测评',audience:'产品与销售团队',deadline:'11 月 30 日',status:'草稿',participants:36}],
 people:[{id:'u1',name:'Sienna',department:'产品部',role:'员工',progress:72},{id:'u2',name:'李晨',department:'产品部',role:'员工',progress:100},{id:'u3',name:'陈可',department:'市场部',role:'员工',progress:88},{id:'u4',name:'王宁',department:'技术部',role:'员工',progress:54},{id:'u5',name:'林小雅',department:'人力资源部',role:'员工',progress:92}]
};
const demoTrainingRecords={
 u1:[{title:'企业文化与价值观',minutes:45,passed:true},{title:'信息安全培训',minutes:18,passed:false},{title:'产品基础介绍',minutes:20,passed:false}],
 u2:[{title:'企业文化与价值观',minutes:45,passed:true},{title:'信息安全培训',minutes:30,passed:true},{title:'产品基础介绍',minutes:50,passed:true}],
 u3:[{title:'企业文化与价值观',minutes:45,passed:true},{title:'信息安全培训',minutes:30,passed:true},{title:'产品基础介绍',minutes:35,passed:false}],
 u4:[{title:'企业文化与价值观',minutes:25,passed:false},{title:'信息安全培训',minutes:16,passed:false}],
 u5:[{title:'企业文化与价值观',minutes:45,passed:true},{title:'信息安全培训',minutes:30,passed:true},{title:'产品基础介绍',minutes:40,passed:false}]
};
let adminData;try{adminData=JSON.parse(localStorage.getItem('learning-admin-v1')||'null')||structuredClone(defaultAdminData)}catch{adminData=JSON.parse(JSON.stringify(defaultAdminData))}
let adminView={filter:'全部',period:'本月',department:null,courseFilters:{query:'',category:'',audience:''},listFilters:{learning:{query:'',department:'',status:''},exams:{query:'',audience:'',status:''},people:{query:'',department:'',role:''}}};
function saveAdmin(){try{localStorage.setItem('learning-admin-v1',JSON.stringify(adminData))}catch{}}
const adminKpis=[['进行中培训','6','plans','#fff0c2','exam'],['培训完成率','84%','learning','#dcecff','chart'],['待催学','12 人','learning','#e9e1fa','history'],['待考试','2 场','exams','#def3e9','exam']];
function loginPage(){return `<main class="login-page"><div class="login-decor decor-one"></div><div class="login-decor decor-two"></div><div class="login-shell"><div class="login-intro"><span class="login-brand">${icon('logo')} 学习空间</span><p class="login-kicker">LEARNING SPACE</p><h1>培训平台</h1><p class="login-subtitle">员工端 · HR 管理端</p><div class="login-art" aria-hidden="true"><div class="ring"></div><div class="orb"></div><div class="pill"></div></div></div><section class="login-card" aria-labelledby="login-title"><div class="login-icon">${icon('book')}</div><h2 id="login-title">欢迎进入学习空间</h2><p>选择体验身份，进入对应页面。</p><form id="login-form"><fieldset class="role-choice"><legend>体验身份</legend><label class="role-option"><input type="radio" name="role" value="employee" checked><span class="role-symbol">${icon('book')}</span><span><strong>员工端</strong><small>学习课程、参加考试、查看记录</small></span><span class="role-radio"></span></label><label class="role-option"><input type="radio" name="role" value="hr"><span class="role-symbol hr">${icon('chart')}</span><span><strong>HR 管理端</strong><small>发布培训、跟进学习、查看数据</small></span><span class="role-radio"></span></label></fieldset><button class="primary login-submit" type="submit">进入演示 ${icon('arrow')}</button></form><p class="login-note">原型演示入口，不连接企业账号。</p></section></div></main>`}
function adminButton(label,action,id,kind='soft'){return `<button class="admin-btn ${kind}" data-admin-action="${action}" ${id?`data-id="${esc(id)}"`:''}>${label}</button>`}
function status(text){return `<span class="admin-status ${text==='已发布'||text==='进行中'?'live':text==='已完成'?'done':'draft'}">${esc(text)}</span>`}
function adminTable(head,rows,empty='暂无内容'){return `<div class="admin-table-wrap"><table class="admin-table"><thead><tr>${head.map(h=>`<th>${h}</th>`).join('')}</tr></thead><tbody>${rows.length?rows.join(''):`<tr><td colspan="${head.length}" class="admin-empty">${empty}</td></tr>`}</tbody></table></div>`}
function adminPanel(title,body,action=''){return `<section class="admin-panel"><div class="admin-panel-head"><h2>${title}</h2>${action}</div>${body}</section>`}
function adminHeader(title,desc,action=''){return `<div class="admin-page-head"><div><p class="admin-eyebrow">HR WORKSPACE</p><h2>${title}</h2><p>${desc}</p></div>${action}</div>`}
function adminHome(){return `${adminHeader('上午好，HR 管理员','今天的培训进展与待处理事项一目了然。')}<div class="admin-kpis">${adminKpis.map(([label,value,target,color,ic])=>`<button class="admin-kpi" data-nav="admin-${target}" style="background:${color}"><span>${icon(ic)}${label}</span><strong>${value}</strong><small>查看详情 ${icon('arrow')}</small></button>`).join('')}</div><div class="admin-home-grid">${adminPanel('待处理',`<div class="admin-todo"><span class="todo-mark yellow">01</span><div><strong>12 位员工待完成信息安全培训</strong><p>截止 11 月 15 日</p></div>${adminButton('查看名单','view-learning','')}</div><div class="admin-todo"><span class="todo-mark blue">02</span><div><strong>新员工入职考试即将截止</strong><p>截止 11 月 16 日 · 28 人参与</p></div>${adminButton('查看考试','view-exams','')}</div><div class="admin-todo"><span class="todo-mark purple">03</span><div><strong>2 门新课程等待发布</strong><p>跨部门协作实践、职场表达技巧</p></div>${adminButton('查看课程','view-courses','')}</div>`)}${adminPanel('培训进度',adminData.plans.map(p=>`<button class="plan-progress" data-admin-edit="plan" data-id="${p.id}"><span><strong>${esc(p.title)}</strong><small>${p.progress}%</small></span><span class="admin-track"><i style="width:${p.progress}%"></i></span></button>`).join(''))}</div><div class="admin-lower-grid">${adminPanel('即将截止',`<div class="admin-deadline"><span>11.15</span><strong>全员信息安全培训</strong>${status('进行中')}</div><div class="admin-deadline"><span>11.16</span><strong>新员工入职考试</strong>${status('进行中')}</div>`)}${adminPanel('快捷入口',`<div class="admin-quick"><button data-admin-action="new-plan">${icon('exam')}新建培训计划 ${icon('arrow')}</button><button data-admin-action="new-course">${icon('book')}添加课程 ${icon('arrow')}</button><button data-nav="admin-config">${icon('spark')}配置员工首页 ${icon('arrow')}</button></div>`)}</div>`}
function courseAudience(course){const target=course?.audienceTarget;return target&&['all','departments','people'].includes(target.mode)?{mode:target.mode,values:Array.isArray(target.values)?target.values.map(String):[]}:{mode:'unset',values:[]}}
function courseAudienceLabel(course){const target=courseAudience(course);if(target.mode==='unset')return '未指定';if(target.mode==='all')return `全体员工 · ${adminData.people.length} 人`;if(target.mode==='departments'){const names=target.values;const count=adminData.people.filter(p=>names.includes(p.department)).length;return `${names.join('、')||'未选择部门'} · ${count} 人`}const people=adminData.people.filter(p=>target.values.includes(p.id));return `${people.slice(0,2).map(p=>p.name).join('、')||'未选择员工'}${people.length>2?'等':''} · ${people.length} 人`}
function filteredAdminCourses(){
 const {query,category,audience}=adminView.courseFilters;
 const keyword=query.trim().toLocaleLowerCase();
 return adminData.courses.filter(course=>
  (adminView.filter==='全部'||course.status===adminView.filter)&&
  (!keyword||String(course.title).toLocaleLowerCase().includes(keyword))&&
  (!category||course.category===category)&&
  (!audience||courseAudience(course).mode===audience)
 );
}
function hasCourseFilters(){const {query,category,audience}=adminView.courseFilters;return adminView.filter!=='全部'||Boolean(query||category||audience)}
function adminCourseTable(list){
 const rows=list.map(c=>`<tr><td><strong>${esc(c.title)}</strong></td><td>${esc(c.category)}</td><td class="course-audience-cell">${esc(courseAudienceLabel(c))}</td><td>${c.students} 人</td><td>${status(c.status)}</td><td><button class="admin-link" data-admin-edit="course" data-id="${esc(c.id)}">编辑</button>${c.status==='草稿'?`<button class="admin-link" data-admin-action="publish-course" data-id="${esc(c.id)}">发布</button>`:''}</td></tr>`);
 const empty=adminData.courses.length?'<div class="course-filter-empty"><strong>没有符合条件的课程</strong><p>试试其他课程名称或放宽筛选条件。</p><button class="admin-btn soft" type="button" data-reset-course-filters>清空筛选</button></div>':'<div class="course-filter-empty"><strong>暂无课程</strong><p>点击右上角「添加课程」，建立第一门课程。</p></div>';
 return adminTable(['课程名称','分类','面向学员','学习人数','状态','操作'],rows,empty);
}
function courseFilterCount(list){return `显示 ${list.length} / 共 ${adminData.courses.length} 门课程`}
function adminCourses(){
 const filters=adminView.courseFilters,list=filteredAdminCourses();
 const categories=[...new Set([...adminData.courses.map(c=>c.category).filter(Boolean),...(filters.category?[filters.category]:[])])].sort((a,b)=>a.localeCompare(b,'zh-CN'));
 const controls=`<div class="course-filter-bar" role="search" aria-label="课程筛选">
  <label class="course-filter-search" for="admin-course-query"><span>课程名称</span><span class="course-filter-input">${icon('search')}<input id="admin-course-query" type="search" placeholder="输入课程名称" value="${esc(filters.query)}" maxlength="120" aria-controls="admin-course-results"></span></label>
  <label for="admin-course-category"><span id="course-category-label">课程分类</span><select id="admin-course-category" data-course-filter="category" aria-labelledby="course-category-label" aria-controls="admin-course-results"><option value="">全部分类</option>${categories.map(category=>`<option value="${esc(category)}" ${filters.category===category?'selected':''}>${esc(category)}</option>`).join('')}</select></label>
  <label for="admin-course-audience"><span id="course-audience-label">面向学员</span><select id="admin-course-audience" data-course-filter="audience" aria-labelledby="course-audience-label" aria-controls="admin-course-results"><option value="">全部范围</option>${[['unset','未指定'],['all','全体员工'],['departments','指定部门'],['people','指定员工']].map(([value,label])=>`<option value="${value}" ${filters.audience===value?'selected':''}>${label}</option>`).join('')}</select></label>
  <button id="reset-course-filters" class="course-filter-reset" type="button" data-reset-course-filters ${hasCourseFilters()?'':'disabled'}>重置筛选</button>
 </div><p id="course-filter-count" class="course-filter-count" role="status" aria-live="polite" aria-atomic="true">${courseFilterCount(list)}</p><div id="admin-course-results">${adminCourseTable(list)}</div>`;
 return `${adminHeader('课程管理','维护课程内容与发布状态。',adminButton('＋ 添加课程','new-course','','primary'))}<div class="admin-filters" role="group" aria-label="课程发布状态">${['全部','已发布','草稿'].map(f=>`<button data-admin-tab="${f}" class="${adminView.filter===f?'active':''}" aria-pressed="${adminView.filter===f}">${f}</button>`).join('')}</div>${adminPanel('课程列表',controls)}`;
}
function updateAdminCourseResults(){
 const results=document.getElementById('admin-course-results');if(!results)return;
 const list=filteredAdminCourses();results.innerHTML=adminCourseTable(list);
 document.getElementById('course-filter-count').textContent=courseFilterCount(list);
 document.getElementById('reset-course-filters').disabled=!hasCourseFilters();
}
function updateCourseQuery(event){
 if(event.target.id!=='admin-course-query'||event.isComposing)return;
 adminView.courseFilters.query=event.target.value;updateAdminCourseResults();
}
document.addEventListener('input',updateCourseQuery);
document.addEventListener('compositionend',updateCourseQuery);
document.addEventListener('change',event=>{
 const field=event.target.dataset.courseFilter;
 if(!['category','audience'].includes(field))return;
 adminView.courseFilters[field]=event.target.value;updateAdminCourseResults();
});
document.addEventListener('click',event=>{
 if(!event.target.closest('button[data-reset-course-filters]'))return;
 adminView.filter='全部';adminView.courseFilters={query:'',category:'',audience:''};render();
 document.getElementById('admin-course-query')?.focus();
});
function planAudienceTarget(plan){if(plan?.audienceTarget?.mode==='unset')return{mode:'unset',values:[]};const target=courseAudience(plan);return target.mode==='unset'&&plan?.audience==='全体员工'?{mode:'all',values:[]}:target}
function planAudienceLabel(plan){const target=planAudienceTarget(plan);return target.mode==='unset'?(plan.audienceTarget?'未指定':plan.audience||'未指定'):courseAudienceLabel({audienceTarget:target})}
function planCourseLabel(plan){if(!Array.isArray(plan.courseIds))return plan.courses||'未选择课程';const names=plan.courseIds.map(id=>adminData.courses.find(c=>c.id===id)?.title).filter(Boolean);return names.length?names.join('、'):'未选择课程'}
function normalizePlanDate(value){const text=String(value||'').trim();if(/^\d{4}-\d{2}-\d{2}$/.test(text))return text;const match=text.match(/(?:(\d{4})\s*年\s*)?(\d{1,2})\s*月\s*(\d{1,2})\s*日/);if(!match)return '';const year=Number(match[1]||new Date().getFullYear()),month=Number(match[2]),day=Number(match[3]);const date=new Date(year,month-1,day);return date.getFullYear()===year&&date.getMonth()===month-1&&date.getDate()===day?`${year}-${String(month).padStart(2,'0')}-${String(day).padStart(2,'0')}`:''}
function planDeadlineLabel(value){const date=normalizePlanDate(value);if(!date)return String(value||'未设置');const [year,month,day]=date.split('-').map(Number);return `${year} 年 ${month} 月 ${day} 日`}
function adminPlans(){return `${adminHeader('培训计划','选择课程与对象，安排培训时间。',adminButton('＋ 新建计划','new-plan','','primary'))}<div class="admin-plan-grid">${adminData.plans.map(p=>`<article class="admin-plan-card"><div class="admin-plan-top">${status(p.status)}<span>${esc(planDeadlineLabel(p.deadline))} 截止</span></div><h3>${esc(p.title)}</h3><p class="plan-card-details">${esc(planAudienceLabel(p))} · ${esc(planCourseLabel(p))}</p><div class="progress-caption"><span>完成进度</span><b>${p.progress}%</b></div><div class="track"><span style="width:${p.progress}%"></span></div><button data-admin-edit="plan" data-id="${p.id}">查看计划 ${icon('arrow')}</button></article>`).join('')}</div>`}
function learningStatus(person){const progress=Number(person.progress)||0;return progress===100?'已完成':progress<60?'需跟进':'进行中'}
function managementListConfig(kind){
 const people={data:adminData.people,queryLabel:'姓名 / 工号',placeholder:'输入姓名或工号',queryFields:['name','employeeId'],unit:'人',subject:'员工',fields:[['department','部门','全部部门'],[kind==='learning'?'status':'role',kind==='learning'?'学习状态':'角色',kind==='learning'?'全部状态':'全部角色']]};
 return kind==='exams'?{data:adminData.exams,queryLabel:'考试名称',placeholder:'输入考试名称',queryFields:['title'],unit:'场考试',subject:'考试',fields:[['audience','参与对象','全部对象'],['status','考试状态','全部状态']]}:people;
}
function managementField(item,key,kind){
 if(kind==='learning'&&key==='status')return learningStatus(item);
 if(key==='department')return String(item.department||'未分组');
 if(key==='role')return String(item.role||'员工');
 return String(item[key]||'未指定');
}
function filteredManagementList(kind){
 const config=managementListConfig(kind),filters=adminView.listFilters[kind],keyword=filters.query.trim().toLocaleLowerCase();
 return config.data.filter(item=>(!keyword||config.queryFields.some(key=>String(item[key]??'').toLocaleLowerCase().includes(keyword)))&&config.fields.every(([key])=>!filters[key]||managementField(item,key,kind)===filters[key]));
}
function managementEmployeeName(person){return `<strong>${esc(person.name)}</strong>${person.employeeId?`<small class="list-employee-id">工号 ${esc(person.employeeId)}</small>`:''}`}
function managementListTable(kind,list){
 let head,rows;
 if(kind==='exams'){
  head=['考试名称','对象','截止日期','参与人数','状态','操作'];
  rows=list.map(e=>`<tr><td><strong>${esc(e.title)}</strong></td><td>${esc(managementField(e,'audience',kind))}</td><td>${esc(e.deadline)}</td><td>${e.participants} 人</td><td>${status(e.status)}</td><td><button class="admin-link" data-admin-edit="exam" data-id="${esc(e.id)}">查看</button></td></tr>`);
 }else if(kind==='learning'){
  head=['员工','部门','学习进度','状态','操作'];
  rows=list.map(p=>`<tr><td>${managementEmployeeName(p)}</td><td>${esc(managementField(p,'department',kind))}</td><td><div class="admin-inline-progress"><span class="admin-track"><i style="width:${Number(p.progress)||0}%"></i></span>${Number(p.progress)||0}%</div></td><td>${learningStatus(p)==='需跟进'?'<span class="admin-status warn">需跟进</span>':status(learningStatus(p))}</td><td><button class="admin-link" data-admin-action="remind" data-id="${esc(p.id)}">提醒演示</button></td></tr>`);
 }else{
  head=['员工','部门','角色','学习进度','操作'];
  rows=list.map(p=>`<tr><td>${managementEmployeeName(p)}</td><td>${esc(managementField(p,'department',kind))}</td><td>${esc(managementField(p,'role',kind))}</td><td>${p.progress}%</td><td><button class="admin-link" data-admin-edit="person" data-id="${esc(p.id)}">查看</button></td></tr>`);
 }
 const config=managementListConfig(kind);
 const empty=config.data.length?`<div class="course-filter-empty"><strong>没有符合条件的${config.subject}</strong><p>试试其他关键词或放宽筛选条件。</p><button type="button" class="admin-btn soft" data-reset-list="${kind}">清空筛选</button></div>`:`<div class="course-filter-empty"><strong>暂无${config.subject}</strong><p>${kind==='exams'?'点击右上角「新建考试」添加考试。':'可在人员管理中添加员工或上传人员名单。'}</p></div>`;
 return adminTable(head,rows,empty);
}
function managementListCount(kind,list){const config=managementListConfig(kind);return `显示 ${list.length} / 共 ${config.data.length} ${config.unit}`}
function managementHasFilters(kind){return Object.values(adminView.listFilters[kind]).some(Boolean)}
function managementFilterPanel(kind){
 const config=managementListConfig(kind),filters=adminView.listFilters[kind],list=filteredManagementList(kind),prefix=`admin-${kind}`;
 const selectFields=config.fields.map(([key,label,all])=>{
  const options=[...new Set([...config.data.map(item=>managementField(item,key,kind)),...(filters[key]?[filters[key]]:[])])].sort((a,b)=>a.localeCompare(b,'zh-CN'));
  return `<label for="${prefix}-${key}"><span id="${prefix}-${key}-label">${label}</span><select id="${prefix}-${key}" data-list-kind="${kind}" data-list-field="${key}" aria-labelledby="${prefix}-${key}-label" aria-controls="${prefix}-results"><option value="">${all}</option>${options.map(value=>`<option value="${esc(value)}" ${filters[key]===value?'selected':''}>${esc(value)}</option>`).join('')}</select></label>`;
 }).join('');
 return `<div class="course-filter-bar" role="search" aria-label="${kind==='learning'?'学习进度':kind==='exams'?'考试':'人员'}筛选"><label for="${prefix}-query"><span>${config.queryLabel}</span><span class="course-filter-input">${icon('search')}<input type="search" id="${prefix}-query" data-list-kind="${kind}" data-list-field="query" placeholder="${config.placeholder}" maxlength="120" value="${esc(filters.query)}" aria-controls="${prefix}-results"></span></label>${selectFields}<button type="button" id="${prefix}-reset" class="course-filter-reset" data-reset-list="${kind}" ${managementHasFilters(kind)?'':'disabled'}>重置筛选</button></div><p id="${prefix}-count" class="course-filter-count" role="status" aria-live="polite" aria-atomic="true">${managementListCount(kind,list)}</p><div id="${prefix}-results">${managementListTable(kind,list)}</div>`;
}
function updateManagementList(kind){
 const results=document.getElementById(`admin-${kind}-results`);if(!results)return;
 const list=filteredManagementList(kind);results.innerHTML=managementListTable(kind,list);
 document.getElementById(`admin-${kind}-count`).textContent=managementListCount(kind,list);
 document.getElementById(`admin-${kind}-reset`).disabled=!managementHasFilters(kind);
}
function handleManagementFilter(event){
 const {listKind:kind,listField:field}=event.target.dataset;
 if(!Object.hasOwn(adminView.listFilters,kind)||!Object.hasOwn(adminView.listFilters[kind],field)||event.isComposing)return;
 if(field==='query'&&event.type==='change'||field!=='query'&&event.type!=='change')return;
 adminView.listFilters[kind][field]=event.target.value;updateManagementList(kind);
}
document.addEventListener('input',handleManagementFilter);
document.addEventListener('compositionend',handleManagementFilter);
document.addEventListener('change',handleManagementFilter);
document.addEventListener('click',event=>{
 const kind=event.target.closest('button[data-reset-list]')?.dataset.resetList;
 if(!Object.hasOwn(adminView.listFilters,kind))return;
 for(const key of Object.keys(adminView.listFilters[kind]))adminView.listFilters[kind][key]='';
 render();document.getElementById(`admin-${kind}-query`)?.focus();
});
function adminLearning(){return `${adminHeader('学习管理','查看员工进度，识别需要跟进的任务。')}${adminPanel('员工学习进度',managementFilterPanel('learning'))}`}
function adminExams(){return `${adminHeader('考试测评','管理考试安排与参与情况。',adminButton('＋ 新建考试','new-exam','','primary'))}${adminPanel('考试列表',managementFilterPanel('exams'))}`}
function adminPeople(){return `${adminHeader('人员管理','查看参与培训的员工与部门。',`<div class="admin-head-actions">${adminButton('上传人员名单','upload-people')}${adminButton('＋ 添加员工','new-person','','primary')}</div>`)}${adminPanel('员工列表',managementFilterPanel('people'))}`}
function adminDataPage(){const selected=adminView.department;const visiblePeople=selected?adminData.people.filter(p=>p.department===selected):adminData.people;const deptRows=departmentProgress().map(([label,val])=>`<button class="admin-bar admin-bar-button ${selected===label?'selected':''}" data-admin-action="filter-department" data-id="${esc(label)}" aria-pressed="${selected===label}"><span>${esc(label)}</span><span class="admin-track"><i style="width:${val}%"></i></span><strong>${val}%</strong>${icon('arrow')}</button>`).join('');const peopleRows=visiblePeople.map(p=>{const info=personTraining(p);return `<tr><td><strong>${esc(p.name)}</strong></td><td>${esc(p.department)}</td><td>${info.hasRecords?`${info.minutes} 分钟`:'—'}</td><td>${info.hasRecords?`${info.passed.length} 门`:'—'}</td><td class="passed-course-cell">${info.hasRecords?(info.passed.length?esc(info.passed.map(r=>r.title).join('、')):'暂无通过课程'):'暂无学习记录'}</td><td><button class="admin-link" data-admin-action="view-person-training" data-id="${esc(p.id)}">查看明细</button></td></tr>`});return `${adminHeader('培训数据','按部门查看每位员工的学习情况。',adminButton(selected?'导出本部门员工数据':'导出全部员工数据','export-data','','primary'))}<div class="admin-filters">${['本月','本季度'].map(x=>`<button data-admin-tab="${x}" class="${adminView.period===x?'active':''}">${x}</button>`).join('')}</div><div class="admin-kpis data-kpis">${[['培训覆盖率','96%'],['课程完成率','84%'],['考试通过率','91%'],['平均学习时长','4.8h']].map(([k,v],i)=>`<div class="admin-kpi" style="background:${['#fff0c2','#dcecff','#e9e1fa','#def3e9'][i]}"><span>${k}</span><strong>${v}</strong><small>${adminView.period} · 示例指标</small></div>`).join('')}</div>${adminPanel('部门完成情况',`<div class="admin-bars">${deptRows}</div><p class="admin-hint">点击部门查看员工明细。上方比例为部门员工的平均学习进度。</p>`)}<div class="training-detail-panel">${adminPanel(selected?`${esc(selected)} · 员工培训明细`:'全部员工 · 培训明细',`<div class="training-detail-meta"><span>共 ${visiblePeople.length} 人 · 个人学习记录为累计演示数据 · 导出按当前部门筛选</span>${selected?adminButton('查看全部部门','filter-department'):''}</div>${adminTable(['员工','部门','观看时长','通过课程','已通过课程名称','操作'],peopleRows,'该部门暂无员工')}`)}</div>`}
function adminConfig(){return `${adminHeader('员工首页配置','管理员工端欢迎语与运营 Banner 的展示内容。')}<div class="admin-config-grid">${adminPanel('展示内容',`<form id="config-form" class="admin-form"><label>欢迎语<input name="welcome" maxlength="60" value="${esc(homeConfig.welcome)}" required></label><label>Banner 标题<input name="title" maxlength="32" value="${esc(homeConfig.banner.title)}" required></label><label>按钮文字<input name="action" maxlength="12" value="${esc(homeConfig.banner.action)}" required></label><label>上方标记<input name="eyebrow" maxlength="25" value="${esc(homeConfig.banner.eyebrow)}"></label><button class="primary" type="submit">保存展示内容</button></form>`)}${adminPanel('员工端预览',`<div class="admin-banner-preview"><small>${esc(homeConfig.banner.eyebrow)}</small><h3>${esc(homeConfig.banner.title)}</h3><span>${esc(homeConfig.banner.action)} →</span></div><p class="admin-preview-welcome">${esc(homeConfig.welcome)}</p><p class="admin-hint">保存后切换至员工端即可查看效果。内容仅保存在本浏览器。</p>${adminButton('恢复管理端演示数据','reset-demo')}`)}</div>`}
function adminPage(){switch(state.page){case'admin-home':return adminHome();case'admin-courses':return adminCourses();case'admin-plans':return adminPlans();case'admin-learning':return adminLearning();case'admin-exams':return adminExams();case'admin-people':return adminPeople();case'admin-data':return adminDataPage();case'admin-config':return adminConfig();default:return adminHome()}}
function renderAdmin(){const title=adminNavs.find(x=>x[0]===state.page)?.[1]||'工作台';app.innerHTML=`<aside class="sidebar admin-sidebar"><button class="logo" data-nav="admin-home" aria-label="HR 工作台">${icon('logo')}</button><nav class="nav" aria-label="HR 主导航">${adminNavs.map(([id,label,ic])=>`<button data-nav="${id}" class="${state.page===id?'active':''}" ${state.page===id?'aria-current="page"':''}>${icon(ic)}<span>${label}</span></button>`).join('')}</nav><span class="sidebar-bottom">HR WORKSPACE</span></aside><main class="workspace admin-workspace"><header class="topbar admin-topbar"><div class="admin-top-title"><small>管理工作台 / ${title}</small><h1>${title}</h1></div><button class="admin-role-switch" data-logout>切换体验身份</button><button class="iconbtn" data-notifications aria-label="消息">${icon('bell')}<span class="notification-dot"></span></button><button class="avatar admin-avatar" data-profile aria-label="个人资料">H</button></header><div id="page" class="admin-main">${adminPage()}</div></main>`}
window.renderPortal=function(){if(!state.role){app.innerHTML=loginPage();return}if(state.role==='hr'){renderAdmin();return}window.renderPortal=null;render();window.renderPortal=portalRenderer;const topbar=app.querySelector('.topbar');topbar.insertAdjacentHTML('beforeend','<button class="admin-role-switch employee-switch" data-logout>切换体验身份</button>')};
const portalRenderer=window.renderPortal;
window.navigatePortal=function(page){const valid=state.role==='hr'?adminNavs.some(x=>x[0]===page):navs.some(x=>x[0]===page);if(!valid)return;state.page=page;state.query='';location.hash=page;render();window.scrollTo(0,0)};
window.logoutPortal=function(){state.role=null;state.page='home';state.query='';sessionStorage.removeItem('learning-demo-role');history.replaceState(null,'',location.pathname);close();render()};
window.adminTab=function(tab){if(['全部','已发布','草稿'].includes(tab))adminView.filter=tab;else adminView.period=tab;render()};
function formField(label,name,value='',required=true,type='text'){return `<label>${label}<input name="${name}" type="${type}" value="${esc(value)}" ${required?'required':''}></label>`}
function audienceField(item,kind='course'){
 const target=kind==='plan'?planAudienceTarget(item):courseAudience(item),mode=item?target.mode:'all';
 const departments=[...new Set(adminData.people.map(p=>p.department).filter(Boolean))].sort((a,b)=>a.localeCompare(b,'zh-CN'));
 const choices=[['unset','暂未指定'],['all','全体员工'],['departments','按部门选择'],['people','指定员工']];
 if(kind==='plan'&&!item)choices.shift();
 const legend=kind==='plan'?'培训对象':'面向学员 <small>· 需要学习的人员</small>';
 const hint=kind==='plan'?'可选择全体员工、部门或具体员工。':'这里保存课程的目标人群；学习人数仍按已有学习记录展示。';
 const legacy=kind==='plan'&&item&&!item.audienceTarget&&target.mode==='unset'&&item.audience?`<p class="plan-legacy-note">原计划培训对象为「${esc(item.audience)}」。不重新选择时保留原记录。</p>`:'';
 return `<fieldset class="course-audience"><legend>${legend}</legend>${legacy}<div class="audience-modes">${choices.map(([value,label])=>`<label class="audience-mode"><input type="radio" name="audienceMode" value="${value}" ${mode===value?'checked':''}><span>${label}</span></label>`).join('')}</div><div class="course-audience-options" data-mode="departments"><span class="audience-option-title">选择部门</span><div class="audience-choice-list">${departments.map(d=>`<label><input type="checkbox" name="audienceDepartment" value="${esc(d)}" ${target.mode==='departments'&&target.values.includes(d)?'checked':''}><span>${esc(d)}</span></label>`).join('')||'<p>暂无部门，请先在人员管理添加员工。</p>'}</div></div><div class="course-audience-options" data-mode="people"><span class="audience-option-title">选择员工</span><div class="audience-choice-list">${adminData.people.map(p=>`<label><input type="checkbox" name="audiencePerson" value="${esc(p.id)}" ${target.mode==='people'&&target.values.includes(p.id)?'checked':''}><span>${esc(p.name)}<small>${esc(p.department)}</small></span></label>`).join('')||'<p>暂无员工，请先在人员管理添加员工。</p>'}</div></div><p class="audience-hint">${hint}</p><p class="audience-error" role="alert" hidden></p></fieldset>`
}
function planCoursesField(item){
 const selected=Array.isArray(item?.courseIds)?item.courseIds:[];
 const legacy=item&&!Array.isArray(item.courseIds)?`<p class="plan-legacy-note">原计划记录为「${esc(item.courses||'未指定')}」。可在下方选择具体课程；不选择时保留原记录。</p>`:'';
 return `<fieldset class="plan-courses-field"><legend>课程安排</legend>${legacy}<div class="plan-course-list">${adminData.courses.map(c=>`<label class="plan-course-option"><input type="checkbox" name="planCourse" value="${esc(c.id)}" ${selected.includes(c.id)?'checked':''} ${c.status==='已发布'?'':'disabled'}><span><strong>${esc(c.title)}</strong><small>${esc(c.category)} · ${esc(c.status)}</small></span></label>`).join('')||'<p>暂无课程，请先在课程管理添加课程。</p>'}</div><p class="plan-course-count">已选择 ${selected.length} 门课程</p><p class="plan-course-error" role="alert" hidden></p></fieldset>`
}
function syncAudienceSelection(form){
 if(!form||!['course','plan'].includes(form.dataset.kind))return;
 const mode=form.querySelector('input[name="audienceMode"]:checked')?.value;
 form.querySelectorAll('.course-audience-options').forEach(group=>{group.hidden=group.dataset.mode!==mode});
 const error=form.querySelector('.audience-error');if(error){error.hidden=true;error.textContent=''}
}
function syncPlanCourseCount(form){
 if(form?.dataset.kind!=='plan')return;
 const count=form.querySelectorAll('input[name="planCourse"]:checked').length;
 const label=form.querySelector('.plan-course-count');if(label)label.textContent=`已选择 ${count} 门课程`;
 const error=form.querySelector('.plan-course-error');if(error){error.hidden=true;error.textContent=''}
}
function planDateField(item){const value=normalizePlanDate(item?.deadline);return `<div class="plan-date-field"><span>截止日期</span><input type="hidden" name="deadline" value="${esc(value)}"><button type="button" class="plan-date-trigger" data-plan-calendar="toggle" aria-expanded="false" aria-label="选择截止日期"><span>${value?esc(planDeadlineLabel(value)):'请选择日期'}</span><span aria-hidden="true">▦</span></button><div class="plan-calendar" hidden></div><p class="plan-date-error" role="alert" hidden></p></div>`}
function renderPlanCalendar(form){
 const field=form?.querySelector('.plan-date-field');if(!field)return;
 const selected=field.querySelector('input[name="deadline"]').value;
 const monthValue=field.dataset.month||selected.slice(0,7)||`${new Date().getFullYear()}-${String(new Date().getMonth()+1).padStart(2,'0')}`;
 const [year,month]=monthValue.split('-').map(Number);
 const first=(new Date(year,month-1,1).getDay()+6)%7,count=new Date(year,month,0).getDate();
 const cells=Array.from({length:Math.ceil((first+count)/7)*7},(_,index)=>{const day=index-first+1;if(day<1||day>count)return '<span class="plan-calendar-empty"></span>';const date=`${year}-${String(month).padStart(2,'0')}-${String(day).padStart(2,'0')}`;return `<button type="button" data-plan-calendar="day" data-date="${date}" class="${selected===date?'selected':''}" aria-label="${year} 年 ${month} 月 ${day} 日" aria-pressed="${selected===date}">${day}</button>`}).join('');
 field.querySelector('.plan-calendar').innerHTML=`<div class="plan-calendar-head"><button type="button" data-plan-calendar="prev" aria-label="上个月">‹</button><strong>${year} 年 ${month} 月</strong><button type="button" data-plan-calendar="next" aria-label="下个月">›</button></div><div class="plan-calendar-grid">${['一','二','三','四','五','六','日'].map(day=>`<span class="plan-calendar-weekday">${day}</span>`).join('')}${cells}</div><button type="button" class="plan-calendar-today" data-plan-calendar="today">选择今天</button>`;
}
function handlePlanCalendar(button){
 const form=button.closest('form'),field=form?.querySelector('.plan-date-field');if(!field)return;
 const action=button.dataset.planCalendar,popup=field.querySelector('.plan-calendar'),trigger=field.querySelector('.plan-date-trigger');
 if(action==='toggle'){popup.hidden=!popup.hidden;trigger.setAttribute('aria-expanded',String(!popup.hidden));if(!popup.hidden)renderPlanCalendar(form);return}
 if(action==='prev'||action==='next'){const current=field.dataset.month||field.querySelector('input[name="deadline"]').value.slice(0,7)||`${new Date().getFullYear()}-${String(new Date().getMonth()+1).padStart(2,'0')}`;const [year,month]=current.split('-').map(Number);const next=new Date(year,month-1+(action==='next'?1:-1),1);field.dataset.month=`${next.getFullYear()}-${String(next.getMonth()+1).padStart(2,'0')}`;renderPlanCalendar(form);return}
 const date=action==='today'?`${new Date().getFullYear()}-${String(new Date().getMonth()+1).padStart(2,'0')}-${String(new Date().getDate()).padStart(2,'0')}`:button.dataset.date;
 field.querySelector('input[name="deadline"]').value=date;field.dataset.month=date.slice(0,7);trigger.querySelector('span').textContent=planDeadlineLabel(date);popup.hidden=true;trigger.setAttribute('aria-expanded','false');const error=field.querySelector('.plan-date-error');error.hidden=true;error.textContent=''
}
function adminForm(kind,item){
 if(kind==='course')return `<form id="admin-edit-form" data-kind="course" data-id="${item?.id||''}" class="admin-form"><h2>${item?'编辑课程':'添加课程'}</h2>${formField('课程名称','title',item?.title)}${formField('分类','category',item?.category||'通用能力')}${audienceField(item)}<button class="primary" type="submit">保存课程</button></form>`;
 if(kind==='plan')return `<form id="admin-edit-form" data-kind="plan" data-id="${item?.id||''}" class="admin-form"><h2>${item?'培训计划':'新建培训计划'}</h2>${formField('计划名称','title',item?.title)}${audienceField(item,'plan')}${planCoursesField(item)}${planDateField(item)}<button class="primary" type="submit">保存计划</button></form>`;
 if(kind==='exam')return `<form id="admin-edit-form" data-kind="exam" data-id="${item?.id||''}" class="admin-form"><h2>${item?'考试安排':'新建考试'}</h2>${formField('考试名称','title',item?.title)}${formField('参与对象','audience',item?.audience||'全体员工')}${formField('截止日期','deadline',item?.deadline||'11 月 30 日')}<button class="primary" type="submit">保存考试</button></form>`;
 return `<form id="admin-edit-form" data-kind="person" data-id="${item?.id||''}" class="admin-form"><h2>${item?'员工资料':'添加员工'}</h2>${formField('姓名','name',item?.name)}${formField('部门','department',item?.department||'产品部')}<button class="primary" type="submit">保存员工</button></form>`
}
window.adminEdit=function(kind,id){
 const key={course:'courses',plan:'plans',exam:'exams',person:'people'}[kind];
 const item=adminData[key]?.find(x=>x.id===id);
 modal(adminForm(kind,item),true);
 const form=document.getElementById('admin-edit-form');syncAudienceSelection(form);syncPlanCourseCount(form)
};
document.addEventListener('change',e=>{
 if(e.target.name==='audienceMode')syncAudienceSelection(e.target.closest('form'));
 if(e.target.name==='planCourse')syncPlanCourseCount(e.target.closest('form'))
});
document.addEventListener('click',e=>{const button=e.target.closest('button[data-plan-calendar]');if(button)handlePlanCalendar(button)});
window.adminAction=function(action,id){if(action==='upload-people')return openPeopleImport();if(action==='template-people')return downloadPeopleTemplate();if(action==='confirm-import')return confirmPeopleImport();if(action==='export-data')return exportTrainingData();if(action==='filter-department'){adminView.department=adminView.department===id?null:(id||null);render();document.querySelector('.training-detail-panel')?.scrollIntoView({behavior:'smooth',block:'start'});return}if(action==='view-person-training')return openPersonTraining(id);if(action==='reset-demo'){adminData=JSON.parse(JSON.stringify(defaultAdminData));saveAdmin();render();toast('已恢复管理端演示数据');return}if(action.startsWith('view-'))return navigate('admin-'+action.slice(5));if(action.startsWith('new-'))return window.adminEdit(action.slice(4));if(action==='publish-course'){const item=adminData.courses.find(c=>c.id===id);if(item){item.status='已发布';saveAdmin();render();toast('课程已在原型中发布')}return}if(action==='remind'){const p=adminData.people.find(p=>p.id===id);toast(`已生成对 ${p?.name||'员工'} 的提醒演示；不会发送实际消息`)}};
window.adminSubmit=function(e){if(e.target.id==='login-form'){e.preventDefault();state.role=new FormData(e.target).get('role')==='hr'?'hr':'employee';state.page=state.role==='hr'?'admin-home':'home';sessionStorage.setItem('learning-demo-role',state.role);history.replaceState(null,'','#'+state.page);render();return true}if(e.target.id==='config-form'){e.preventDefault();const f=new FormData(e.target);homeConfig.welcome=String(f.get('welcome')).trim();homeConfig.banner.title=String(f.get('title')).trim();homeConfig.banner.action=String(f.get('action')).trim();homeConfig.banner.eyebrow=String(f.get('eyebrow')).trim();try{localStorage.setItem('learning-home-config-v1',JSON.stringify(homeConfig))}catch{}render();toast('员工首页展示内容已保存');return true}if(e.target.id==='admin-edit-form'){
 e.preventDefault();
 const form=e.target,kind=form.dataset.kind,id=form.dataset.id,f=new FormData(form);
 const key={course:'courses',plan:'plans',exam:'exams',person:'people'}[kind];
 const obj=adminData[key].find(x=>x.id===id);
 if(kind==='course'){
  const mode=String(f.get('audienceMode')||'unset');
  const values=mode==='departments'?f.getAll('audienceDepartment').map(String):mode==='people'?f.getAll('audiencePerson').map(String):[];
  if((mode==='departments'||mode==='people')&&!values.length){
   const error=form.querySelector('.audience-error');error.textContent=mode==='departments'?'请至少选择一个部门。':'请至少选择一位员工。';error.hidden=false;return true;
  }
  const updates={title:String(f.get('title')||'').trim(),category:String(f.get('category')||'').trim(),audienceTarget:{mode,values}};
  if(obj)Object.assign(obj,updates);
  else adminData.courses.unshift({id:`c${Date.now()}`,students:0,status:'草稿',...updates});
 }else if(kind==='plan'){
  const mode=String(f.get('audienceMode')||'unset');
  const values=mode==='departments'?f.getAll('audienceDepartment').map(String):mode==='people'?f.getAll('audiencePerson').map(String):[];
  if((mode==='departments'||mode==='people')&&!values.length||mode==='unset'&&!obj){
   const error=form.querySelector('.audience-error');error.textContent=mode==='departments'?'请至少选择一个部门。':mode==='people'?'请至少选择一位员工。':'请选择培训对象。';error.hidden=false;return true;
  }
  const courseIds=f.getAll('planCourse').map(String).filter(courseId=>adminData.courses.some(c=>c.id===courseId&&c.status==='已发布'));
  if(!courseIds.length&&(!obj||Array.isArray(obj.courseIds))){
   const error=form.querySelector('.plan-course-error');error.textContent='请至少选择一门已发布课程。';error.hidden=false;return true;
  }
  const deadline=String(f.get('deadline')||'');
  if(normalizePlanDate(deadline)!==deadline){const error=form.querySelector('.plan-date-error');error.textContent='请选择截止日期。';error.hidden=false;return true}
  const updates={title:String(f.get('title')||'').trim(),deadline};
  if(mode!=='unset'||obj?.audienceTarget)updates.audienceTarget={mode,values};
  if(mode==='all')updates.audience='全体员工';
  if(mode==='departments')updates.audience=values.join('、');
  if(mode==='people')updates.audience=adminData.people.filter(p=>values.includes(p.id)).map(p=>p.name).join('、');
  if(mode==='unset'&&obj?.audienceTarget)updates.audience='未指定';
  if(courseIds.length){updates.courseIds=courseIds;updates.courses=`${courseIds.length} 门课程`}
  if(obj)Object.assign(obj,updates);
  else adminData.plans.unshift({id:`p${Date.now()}`,progress:0,status:'进行中',...updates});
 }else if(obj){for(const [k,v] of f.entries())obj[k]=String(v).trim()}
 else{const newId=`${kind[0]}${Date.now()}`;const extra={plan:{progress:0,status:'进行中'},exam:{status:'草稿',participants:0},person:{role:'员工',progress:0}}[kind];adminData[key].unshift({id:newId,...extra,...Object.fromEntries([...f.entries()].map(([k,v])=>[k,String(v).trim()]))})}
 saveAdmin();close();render();toast('已保存至本浏览器的原型数据');return true
}return false};
try{const config=JSON.parse(localStorage.getItem('learning-home-config-v1')||'null');if(config){homeConfig.welcome=config.welcome||homeConfig.welcome;Object.assign(homeConfig.banner,config.banner||{})}}catch{}
state.role=sessionStorage.getItem('learning-demo-role');if(!['hr','employee'].includes(state.role))state.role=null;if(state.role){const hash=location.hash.slice(1);state.page=state.role==='hr'?(adminNavs.some(n=>n[0]===hash)?hash:'admin-home'):(navs.some(n=>n[0]===hash)?hash:'home')}else{history.replaceState(null,'',location.pathname)}
window.addEventListener('hashchange',()=>{if(!state.role)return;const hash=location.hash.slice(1);const allowed=state.role==='hr'?adminNavs:navs;if(allowed.some(n=>n[0]===hash)){state.page=hash;render()}});
render();

function departmentProgress(){const buckets=new Map();for(const p of adminData.people){const key=String(p.department||'未分组');if(!buckets.has(key))buckets.set(key,[]);buckets.get(key).push(Number(p.progress)||0)}return [...buckets].map(([name,values])=>[name,Math.round(values.reduce((a,b)=>a+b,0)/values.length)]).sort((a,b)=>b[1]-a[1])}
let pendingPeopleImport=null;
function openPeopleImport(){pendingPeopleImport=null;modal(`<div class="import-dialog"><h2>上传人员名单</h2><p>支持 .xlsx、.csv、.tsv，最多 2,000 行。文件只在当前浏览器读取，确认后才加入人员列表。</p><div class="import-guide"><strong>表格列</strong><span>必填：姓名、部门</span><span>可选：工号、角色、学习进度</span></div><label class="import-drop">${icon('book')}<strong>选择人员名单文件</strong><small>Excel 或 CSV · 最大 5 MB</small><input id="people-file" type="file" accept=".xlsx,.csv,.tsv" aria-label="选择人员名单文件"></label><button class="admin-link" data-admin-action="template-people">下载 Excel 模板</button><div id="import-result" aria-live="polite"></div></div>`,true)}
function downloadPeopleTemplate(){const blob=sheetIO.workbook([['人员名单',[['工号','姓名','部门','角色','学习进度']]]]);sheetIO.download(blob,'人员名单导入模板.xlsx');toast('人员名单模板已下载')}
function normalizeHeader(s){return String(s||'').trim().toLowerCase().replace(/[\s_\-（）()]/g,'')}
function parsePeopleRows(rows){if(!rows.length)throw Error('表格没有内容');const header=rows[0].map(normalizeHeader),lookup=aliases=>header.findIndex(h=>aliases.includes(h));const cols={employeeId:lookup(['工号','员工编号','员工id','employeeid','id']),name:lookup(['姓名','员工姓名','员工','name']),department:lookup(['部门','所属部门','department']),role:lookup(['角色','岗位','职位','职务','role']),progress:lookup(['学习进度','进度','完成率','progress'])};if(cols.name<0||cols.department<0)throw Error('首行需要包含“姓名”和“部门”列');const nonempty=rows.slice(1).filter(r=>r.some(v=>String(v||'').trim()));if(nonempty.length>2000)throw Error('一次最多导入 2,000 人');const known=new Set(adminData.people.flatMap(p=>[...(p.employeeId?[`id:${String(p.employeeId).trim()}`]:[]),`name:${String(p.name).trim()}|${String(p.department).trim()}`]));const seen=new Set();return nonempty.map((r,i)=>{const val=k=>cols[k]<0?'':String(r[cols[k]]||'').trim(),person={employeeId:val('employeeId'),name:val('name'),department:val('department'),role:val('role')||'员工',progress:0};let issue='';if(!person.name||!person.department)issue='姓名或部门为空';if(person.name.length>80||person.department.length>80||person.role.length>80||person.employeeId.length>80)issue='字段长度不能超过 80 字';const raw=val('progress');if(raw){const n=Number(raw.replace('%','').replace('％',''));const percent=raw.includes('%')||raw.includes('％')?n:n>0&&n<=1?n*100:n;if(!Number.isFinite(percent)||percent<0||percent>100)issue='学习进度须为 0–100%';else person.progress=Math.round(percent)}const keys=[...(person.employeeId?[`id:${person.employeeId}`]:[]),`name:${person.name}|${person.department}`];let status=issue?'错误':keys.some(k=>known.has(k)||seen.has(k))?'重复':'可导入';if(!issue)keys.forEach(k=>seen.add(k));return{row:i+2,person,status,issue}})}
function importPreviewHtml(items,filename){const ready=items.filter(x=>x.status==='可导入').length,duplicates=items.filter(x=>x.status==='重复').length,errors=items.filter(x=>x.status==='错误').length;return `<div class="import-summary"><strong>${esc(filename)}</strong><span>可导入 ${ready} · 重复 ${duplicates} · 错误 ${errors}</span></div><div class="admin-table-wrap import-table"><table class="admin-table"><thead><tr><th>行号</th><th>姓名</th><th>部门</th><th>工号</th><th>状态</th></tr></thead><tbody>${items.slice(0,30).map(x=>`<tr><td>${x.row}</td><td>${esc(x.person.name)||'—'}</td><td>${esc(x.person.department)||'—'}</td><td>${esc(x.person.employeeId)||'—'}</td><td><span class="admin-status ${x.status==='可导入'?'done':x.status==='错误'?'warn':'draft'}">${x.issue?esc(x.issue):x.status}</span></td></tr>`).join('')}</tbody></table></div>${items.length>30?`<p class="admin-hint">仅预览前 30 行，共 ${items.length} 行。错误行不会导入。</p>`:''}<button class="primary import-confirm" data-admin-action="confirm-import" ${ready?'':'disabled'}>确认导入 ${ready} 人</button><p class="admin-hint">同工号或同姓名＋部门的记录会跳过，不覆盖现有人员。</p>`}
document.addEventListener('change',async e=>{if(e.target.id!=='people-file')return;const file=e.target.files?.[0],result=document.getElementById('import-result');if(!file||!result)return;result.innerHTML='<p class="admin-hint">正在读取表格…</p>';try{const rows=await sheetIO.readRows(file);pendingPeopleImport=parsePeopleRows(rows);result.innerHTML=importPreviewHtml(pendingPeopleImport,file.name)}catch(err){pendingPeopleImport=null;result.innerHTML=`<p class="import-error" role="alert">${esc(err.message||'读取失败，请检查文件格式')}</p>`}});
function confirmPeopleImport(){if(!pendingPeopleImport)return;const valid=pendingPeopleImport.filter(x=>x.status==='可导入');if(!valid.length)return;for(const x of valid)adminData.people.push({id:`u${Date.now()}-${x.row}`,...x.person});saveAdmin();pendingPeopleImport=null;close();render();toast(`已导入 ${valid.length} 人；重复或错误行已跳过`)}
function personTraining(person){const records=Array.isArray(person.trainingRecords)?person.trainingRecords:(demoTrainingRecords[person.id]||[]);const passed=records.filter(r=>r.passed);return{records,passed,minutes:records.reduce((sum,r)=>sum+(Number(r.minutes)||0),0),hasRecords:records.length>0}}
function openPersonTraining(id){const p=adminData.people.find(person=>person.id===id);if(!p)return;const data=personTraining(p);const rows=data.records.map(r=>`<tr><td><strong>${esc(r.title)}</strong></td><td>${Number(r.minutes)||0} 分钟</td><td>${r.passed?'<span class="admin-status done">已通过</span>':'学习中'}</td></tr>`);modal(`<div class="person-training-drawer"><p class="admin-eyebrow">EMPLOYEE TRAINING</p><h2>${esc(p.name)}</h2><p>${esc(p.department)} · ${esc(p.role)}${p.employeeId?` · 工号 ${esc(p.employeeId)}`:''}</p><div class="person-training-stats"><div><span>观看时长</span><strong>${data.hasRecords?`${data.minutes} 分钟`:'暂无记录'}</strong></div><div><span>已通过课程</span><strong>${data.hasRecords?`${data.passed.length} 门`:'暂无记录'}</strong></div></div><h3>课程学习明细</h3>${data.hasRecords?adminTable(['课程','观看时长','状态'],rows):'<div class="admin-empty-training">暂无学习记录。导入人员名单只建立人员资料，不会生成学习时长或课程结果。</div>'}<p class="admin-hint">${data.hasRecords?'当前为原型示例学习记录，正式数据需接入课程播放与考核系统。':'该员工目前仅有人事名单资料。'}</p></div>`,true)}
function trainingExportSheets(people){const summary=[['工号','姓名','部门','角色','学习进度（%）','观看分钟','已通过课程数','已通过课程名称','学习中课程名称','记录来源']];const detail=[['工号','姓名','部门','课程名称','观看分钟','课程状态','记录来源']];for(const p of people){const data=personTraining(p);summary.push([p.employeeId||'',p.name,p.department,p.role,Number(p.progress)||0,data.hasRecords?data.minutes:'',data.hasRecords?data.passed.length:'',data.passed.map(r=>r.title).join('、'),data.records.filter(r=>!r.passed).map(r=>r.title).join('、'),data.hasRecords?'原型示例记录':'仅人员名单，无学习记录']);for(const r of data.records)detail.push([p.employeeId||'',p.name,p.department,r.title,Number(r.minutes)||0,r.passed?'已通过':'学习中','原型示例记录'])}return[['员工培训汇总',summary],['课程学习明细',detail]]}
function exportTrainingData(){const department=adminView.department;const people=department?adminData.people.filter(p=>p.department===department):adminData.people;const blob=sheetIO.workbook(trainingExportSheets(people));const date=new Date(),stamp=`${date.getFullYear()}-${String(date.getMonth()+1).padStart(2,'0')}-${String(date.getDate()).padStart(2,'0')}`;sheetIO.download(blob,`员工培训数据_${department||'全部部门'}_${stamp}.xlsx`);toast(`已导出 ${people.length} 位员工的培训数据`)}
