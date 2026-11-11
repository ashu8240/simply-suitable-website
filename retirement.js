/* Retirement corpus calculator. Standard time-value-of-money arithmetic; every assumption is an input. */
var RC=(function(){
var MAXR=0.13; /* return inputs are limited to 13% for this illustration */
function calc(p){
  var E=p.exp+p.extra,n=p.retAge-p.age,T=p.lifeAge-p.retAge,N=n-p.start,e=null;
  if(!(E>0))e="Enter your yearly expenses.";
  else if(!(n>0))e="Retirement age must be higher than your current age.";
  else if(!(T>0))e="The age the corpus should last until must be higher than the retirement age.";
  else if(!(p.start>=0&&p.start<n))e="Start fresh investing after fewer years than you have until retirement.";
  if(e)return {error:e};
  var X=E*(1-p.drop)*Math.pow(1+p.i1,n);
  var rt=p.r*(1-p.tax),g=(1+rt)/(1+p.i2)-1;
  var pay=Math.abs(g)<1e-9?X*T:X*(1+g)*(1-Math.pow(1+g,-T))/g;      /* payments at the start of each year */
  var corpus=pay+p.legacy*Math.pow(1+g,-T);
  var A=p.a1+p.a2+p.a3,gap=corpus-A,out={n:n,T:T,E:E,X:X,rt:rt,g:g,corpus:corpus,A:A,gap:gap,pct:A/corpus,N:N};
  if(gap>0){
    var m=Math.pow(1+p.rf,1/12)-1;
    out.lump=gap/Math.pow(1+p.rf,N);
    out.sip=p.rf===0?gap/(N*12):gap*m/(Math.pow(1+p.rf,N)-1);
    if(p.step>0){
      var s=p.step,A1;
      if(p.rf===0)A1=gap*s/(Math.pow(1+s,N)-1);
      else if(Math.abs(p.rf-s)<1e-9)A1=gap/(N*Math.pow(1+p.rf,N-1));
      else A1=gap*(p.rf-s)/(Math.pow(1+p.rf,N)-Math.pow(1+s,N));
      out.stepSip=p.rf===0?A1/12:A1*m/p.rf;
    }
  }
  return out;
}
function inr(x){return "₹"+Math.round(x).toLocaleString("en-IN")}
function short(x){var a=Math.abs(x);if(a>=1e7)return "₹"+(x/1e7).toFixed(2)+" crore";if(a>=1e5)return "₹"+(x/1e5).toFixed(2)+" lakh";return inr(x)}
return {calc:calc,inr:inr,short:short,MAXR:MAXR};
})();

(function(){
var form=document.getElementById("rcForm");if(!form)return;
function $(id){return document.getElementById(id)}
function num(id){var v=parseFloat(String($(id).value).replace(/[₹,\s]/g,""));return isFinite(v)&&v>0?v:0}
function pct(id,cap){var v=num(id);var note=false;if(cap&&v>cap*100){v=cap*100;note=true}return {v:v/100,note:note}}
function read(){
  var r=pct("rc-r",RC.MAXR),rf=pct("rc-rf",RC.MAXR);
  $("rcCap").hidden=!(r.note||rf.note);
  return {exp:num("rc-exp"),extra:num("rc-extra"),age:num("rc-age"),retAge:num("rc-ret"),lifeAge:num("rc-life"),
    i1:pct("rc-i1").v,drop:Math.min(pct("rc-drop").v,0.9),i2:pct("rc-i2").v,r:r.v,tax:Math.min(pct("rc-tax").v,0.9),legacy:num("rc-legacy"),
    a1:num("rc-a1"),a2:num("rc-a2"),a3:num("rc-a3"),start:num("rc-start"),rf:rf.v,step:pct("rc-step").v};
}
function set(id,t){$(id).textContent=t}
function dash(){["rC","rCx","rPct","rX","rA","rGap","rLump","rSip","rStep","rW1","rW2","rW3","rW4"].forEach(function(i){set(i,"")});$("rBar").style.width="0";$("rClose").hidden=true;$("rWhat").hidden=true;$("rWork").hidden=true}
function render(){
  var p=read(),o=RC.calc(p);
  [].forEach.call(document.querySelectorAll("[data-money]"),function(inp){var v=parseFloat(String(inp.value).replace(/[₹,\s]/g,""));var h=document.getElementById(inp.id+"-h");if(h)h.textContent=v>0?RC.inr(v):""});
  if(o.error){dash();set("rMsg",o.error);return}
  set("rMsg","");$("rWhat").hidden=false;$("rWork").hidden=false;
  set("rC",RC.short(o.corpus));set("rCx",RC.inr(o.corpus));
  var pc=o.pct*100;$("rBar").style.width=Math.max(0,Math.min(100,pc))+"%";
  set("rPct","Your expected assets are about "+Math.round(pc)+"% of this illustrated corpus.");
  set("rX",RC.short(o.X)+" a year ("+RC.short(o.X/12)+" a month)");set("rA",RC.short(o.A));
  if(o.gap>0){set("rGap",RC.short(o.gap));$("rClose").hidden=false;
    set("rLump",RC.short(o.lump));set("rSip",RC.inr(o.sip));
    $("rStepRow").hidden=!(o.stepSip>0);if(o.stepSip>0)set("rStep",RC.inr(o.stepSip)+" in year 1, rising each year")}
  else{set("rGap","No gap on these assumptions ("+RC.short(-o.gap)+" above the illustrated corpus)");$("rClose").hidden=true}
  var rows=[["Inflation 1 point higher",{i1:p.i1+0.01,i2:p.i2+0.01}],["Inflation 1 point lower",{i1:Math.max(0,p.i1-0.01),i2:Math.max(0,p.i2-0.01)}],["Return on corpus 1 point lower",{r:Math.max(0,p.r-0.01)}]],h="";
  rows.forEach(function(w){var q={};for(var k in p)q[k]=p[k];for(var k2 in w[1])q[k2]=w[1][k2];var x=RC.calc(q);
    if(!x.error){var d=(x.corpus/o.corpus-1)*100;h+="<tr><td>"+w[0]+"</td><td>"+RC.short(x.corpus)+"</td><td>"+(d>=0?"+":"")+d.toFixed(0)+"%</td></tr>"}});
  $("rWhatBody").innerHTML=h;
  set("rW1",o.n+" years to retirement, "+o.T+" years in retirement");
  set("rW2","Yearly spending today "+RC.inr(o.E)+" becomes "+RC.inr(o.X)+" at retirement");
  set("rW3","Return after tax "+(o.rt*100).toFixed(2)+"%; after inflation (real return) "+(o.g*100).toFixed(2)+"%");
  set("rW4","Corpus = the value on retirement day of your yearly spending (rising with inflation) plus any amount you want to leave behind");
}
form.addEventListener("input",render);render();
})();
