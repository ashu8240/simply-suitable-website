/* Money Clarity Check, native version. Questions, points, bands and messages are unchanged from the original Apps Script page. */
var MC=(function(){
var YN = ['Yes, clearly', 'Partly', 'Not really'];
var POINTS = [2, 1, 0];
var BANDS = [
  {min: 10, name: 'Well measured', msg: 'You can see most of your money clearly.',
   next: 'Set a date every six months to review everything in one place, and update your goals after any big life change.'},
  {min: 6, name: 'Partly measured', msg: 'You have a solid base, and a few areas are still unclear.',
   next: 'Pick the first area in your attention list and sort that out first. Small, clear steps matter more than a perfect plan.'},
  {min: 0, name: 'Just getting started', msg: 'Most of this is not measured yet, which is a normal starting point.',
   next: 'Start with goals only. Write down 2-3 goals, each with an amount and a year. Everything else builds on that.'}
];
var SCORED = [
 {area: 'Priorities', q: 'If someone asked you today, \u201CWhat are your top 2-3 financial priorities?\u201D, could you answer clearly?',
  hint: 'For example: \u201CMy child\u2019s education, a home, and retirement.\u201D If you can say it like that without much thought, choose Yes, clearly.', opts: YN,
  tip: 'Write your top 2-3 priorities in one line each. If you can say them clearly, you can measure them.'},
 {area: 'Purpose', q: 'Do you know what your major savings and investments are ultimately meant to help you achieve?',
  hint: 'For example: \u201CThis SIP is for my child\u2019s education in 2035, and this fund is for retirement.\u201D If you are not sure what an investment is for, choose Partly.', opts: YN,
  tip: 'Match each major saving or investment to one goal. Money without a purpose is hard to judge.'},
 {area: 'Resilience', q: 'If a large unexpected expense came up tomorrow, could you handle it without disturbing your existing plans?',
  hint: 'For example: a medical bill, an urgent home repair or a gap in income. Could you cover it from money set aside, without selling investments or delaying goals?', opts: YN,
  tip: 'A separate cushion for surprises keeps one expense from changing your long-term plans.'},
 {area: 'Readiness', q: 'If your income or family situation changed, would you know what to review first?',
  hint: 'For example: a raise, a new job, a baby, a business change or a home purchase. Would you know where to look first, such as goals, monthly savings or insurance?', opts: YN,
  tip: 'Decide in advance what you would review first after a raise, a new job, a baby or a home purchase.'},
 {area: 'Confidence', q: 'When you think about your future and your family\u2019s, how confident are you that you are adequately prepared?',
  hint: 'Go with your overall feeling, not exact numbers. There is no right or wrong answer.', opts: ['Very confident', 'Somewhat confident', 'Not very confident'],
  tip: 'Confidence usually grows from knowing where you stand. Putting everything in one picture is a good first step.'},
 {area: 'One picture', q: 'When did you last look at your overall financial position as one picture, rather than separately?',
  hint: 'One picture means savings, investments, loans and goals together, for example in one sheet, one app or one conversation with someone you trust.',
  opts: ['Within the last 6 months', 'More than 6 months ago', 'I haven\u2019t really done this'],
  tip: 'Look at all your savings, investments, protection and goals together on a fixed date each half-year.'}
];
var INSIGHT = [
 {q: 'Which of these feels least clear to you right now?',
  hint: 'Pick the one that feels most true today. For example, if you often wonder \u201CAm I doing enough?\u201D, choose \u201CWhether I\u2019m on the right track\u201D.',
  opts: ['Whether I\u2019m on the right track', 'Balancing today\u2019s needs with future goals', 'Knowing what I should prioritise first', 'Being prepared for unexpected situations', 'Keeping everything organised', 'Nothing in particular']},
 {q: 'What would give you the most confidence?',
  hint: 'Pick the one that would help you most. For example, if you want to see everything in one place, choose \u201CKnowing exactly where I stand\u201D.',
  opts: ['Knowing exactly where I stand', 'Having a clearer plan for the future', 'Knowing that I\u2019m adequately prepared', 'Knowing whether my current decisions are working together', 'I\u2019m already confident with my current approach']}
];
var STEPS = SCORED.concat(INSIGHT);
function evaluate(idx) {
  var score = 0, rows = [];
  for (var i = 0; i < SCORED.length; i++) {
    var pts = POINTS[idx[i]];
    score += pts;
    rows.push({i: i, area: SCORED[i].area, pts: pts, tip: SCORED[i].tip});
  }
  var band = BANDS.filter(function (b) { return score >= b.min; })[0];
  var need = rows.filter(function (r) { return r.pts < POINTS[0]; })
                 .sort(function (a, b) { return a.pts - b.pts || a.i - b.i; });
  var clear = rows.filter(function (r) { return r.pts === POINTS[0]; });
  return {score: score, max: POINTS[0] * SCORED.length, band: band, need: need, clear: clear};
}
return {evaluate:evaluate,SCORED:SCORED,INSIGHT:INSIGHT,STEPS:STEPS};
})();

(function(){
function $(id){return document.getElementById(id)}
if(!$("start"))return;
var SCORED=MC.SCORED,INSIGHT=MC.INSIGHT,STEPS=MC.STEPS,ans=[],step=0;
function ruler(el,n,on){var h="";for(var k=0;k<n;k++)h+='<i class="'+(k<on?"on":"")+'"></i>';el.innerHTML=h}
function show(id){["intro","quiz","profile","result"].forEach(function(s){$(s).hidden=(s!==id)});$("mc").scrollIntoView()}
function esc(s){return String(s).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;")}
function ask(){
  var s=STEPS[step];
  $("count").textContent="Question "+(step+1)+" of "+STEPS.length;
  $("qtext").textContent=s.q;$("qhint").textContent=s.hint;
  ruler($("ruler"),STEPS.length,step);
  $("back").style.visibility=step?"visible":"hidden";
  var h="";s.opts.forEach(function(o,i){h+='<button class="mc-opt" type="button" data-i="'+i+'">'+esc(o)+"</button>"});
  $("opts").innerHTML=h;
}
$("opts").addEventListener("click",function(e){
  var b=e.target.closest(".mc-opt");if(!b)return;
  ans[step]=parseInt(b.getAttribute("data-i"),10);
  if(step<STEPS.length-1){step++;ask()}else{show("profile")}
});
$("start").onclick=function(){step=0;ans=[];ask();show("quiz")};
$("back").onclick=function(){if(step>0){step--;ask()}};
$("again").onclick=function(){step=0;ans=[];show("intro")};
$("see").onclick=function(){var r=MC.evaluate(ans.slice(0,SCORED.length));render(r);log(r);show("result")};
function render(r){
  $("sc").textContent=r.score;$("mx").textContent=r.max;
  ruler($("rulerR"),r.max,r.score);
  $("st").textContent=r.band.name;$("msg").textContent=r.band.msg;
  var h="",shown=r.need.slice(0,3);
  if(!r.need.length){h='<p style="margin:0">Nothing stands out. All six areas look clear right now.</p>'}
  else{
    shown.forEach(function(n){h+='<div class="mc-item'+(n.pts===1?" mid":"")+'"><b>'+esc(n.area)+" ("+(n.pts===1?"partly clear":"not yet clear")+")</b>"+esc(n.tip)+"</div>"});
    if(r.need.length>3){h+='<p class="mc-more">Also worth a look later: '+r.need.slice(3).map(function(n){return esc(n.area)}).join(", ")+".</p>"}
  }
  $("att").innerHTML=h;
  $("clr").textContent=r.clear.length?"Already clear: "+r.clear.map(function(c){return c.area}).join(", "):"";
  $("next").textContent=r.band.next;
}
/* Saving is best-effort and never affects what the person sees. */
function log(r){
  try{
    var url=(typeof CONFIG!=="undefined")&&CONFIG.clarityEndpoint;if(!url)return;
    var payload={source:"website",answers:SCORED.map(function(s,i){return s.opts[ans[i]]}),score:r.score,max:r.max,band:r.band.name,
      insight1:INSIGHT[0].opts[ans[6]],insight2:INSIGHT[1].opts[ans[7]],age:$("age").value,work:$("work").value,city:$("city").value};
    fetch(url,{method:"POST",mode:"no-cors",keepalive:true,headers:{"Content-Type":"text/plain;charset=utf-8"},body:JSON.stringify(payload)}).catch(function(){});
  }catch(e){}
}
})();
