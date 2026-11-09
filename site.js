/* EDIT THESE VALUES BEFORE GOING LIVE */
var CONFIG={
  bookingUrl:"https://calendly.com/simplysuitable-investments/30min",
  whatsappNumber:"918981399603",
  email:"simplysuitable.investments@gmail.com",
  moneyClarityUrl:"https://script.google.com/macros/s/AKfycbz7iR3RkMyOdBJSZuvZ9bQB9XA5pCjVZyxLN1oa4tvusUuTsClYOSYezGX6NY5jpdt0_A/exec",
  riskProfileUrl:"https://forms.gle/Mh9TCLVuaAqBf5K27",
  checklistUrl:"",          /* add your checklist form link to show the checklist section */
  registrations:""          /* e.g. insurance / NPS registration details; shown in the footer when filled */
};
function placeholder(u){return !u||u.indexOf("YOUR")>-1||u.indexOf("XXXX")>-1}
var map={book:CONFIG.bookingUrl,whatsapp:"https://wa.me/"+CONFIG.whatsappNumber+"?text="+encodeURIComponent("Hi, I found you through Simply Suitable Investments."),email:"mailto:"+CONFIG.email,checklist:CONFIG.checklistUrl,clarity:CONFIG.moneyClarityUrl,risk:CONFIG.riskProfileUrl};
document.querySelectorAll("[data-link]").forEach(function(a){var u=map[a.getAttribute("data-link")];if(!placeholder(u)){a.href=u;if(u.indexOf("http")===0){a.target="_blank";a.rel="noopener"}}});
document.querySelectorAll("[data-needs]").forEach(function(s){if(placeholder(map[s.getAttribute("data-needs")]))s.hidden=true});
var rg=document.getElementById("regs");if(rg&&CONFIG.registrations){rg.textContent=CONFIG.registrations;rg.hidden=false}
var y=document.getElementById("yr");if(y)y.textContent=new Date().getFullYear();
var wa=document.getElementById("waForm");
if(wa)wa.addEventListener("submit",function(e){e.preventDefault();
var n=document.getElementById("wn").value.trim(),i=document.getElementById("wi").value,m=document.getElementById("wm").value.trim();
var t="Hi, I’m "+n+". I’d like to talk about: "+i+"."+(m?" "+m:"");
window.open("https://wa.me/"+CONFIG.whatsappNumber+"?text="+encodeURIComponent(t),"_blank")});
var sf=document.getElementById("sipForm");
if(sf){var inr=function(x){return "₹"+Math.round(x).toLocaleString("en-IN")};
var calc=function(){var p=+document.getElementById("amt").value,a=+document.getElementById("ret").value,yr=+document.getElementById("yrs").value;
if(!(p>0&&yr>0&&a>=0))return;var r=a/1200,n=yr*12,fv=r?p*((Math.pow(1+r,n)-1)/r)*(1+r):p*n,inv=p*n;
document.getElementById("oi").textContent=inr(inv);document.getElementById("og").textContent=inr(fv-inv);document.getElementById("ov").textContent=inr(fv)};
sf.addEventListener("input",calc);calc()}

(function(){
var rm=window.matchMedia&&matchMedia("(prefers-reduced-motion: reduce)").matches;
if("IntersectionObserver" in window&&!rm){var io=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){e.target.classList.add("in");io.unobserve(e.target)}})},{threshold:.12});
document.querySelectorAll("main section").forEach(function(s){if(s.getBoundingClientRect().top>innerHeight){s.classList.add("rv");io.observe(s)}})}
function picker(sel,out,fn){var bs=document.querySelectorAll(sel);bs.forEach(function(b){b.addEventListener("click",function(){bs.forEach(function(x){x.setAttribute("aria-pressed",x===b?"true":"false")});fn(b,document.getElementById(out))})})}
function lead(o,t,rest){o.textContent="";var s=document.createElement("b");s.textContent=t;o.appendChild(s);o.appendChild(document.createTextNode(rest))}
picker(".chip","sitText",function(b,o){o.textContent=b.getAttribute("data-r")});
picker(".goal","goalText",function(b,o){lead(o,b.getAttribute("data-n")+". ","We’d work out: "+b.getAttribute("data-q"))});
picker(".step","stepText",function(b,o){lead(o,b.getAttribute("data-n")+". ",b.getAttribute("data-d"))});
var f=document.querySelector(".step");if(f)f.click();
var pf=document.getElementById("planForm");
if(pf){var money=function(x){return "₹"+Math.round(x).toLocaleString("en-IN")};
var plan=function(){var c=+document.getElementById("pc").value,n=+document.getElementById("py").value,i=+document.getElementById("pi").value,e=+document.getElementById("pe").value,r=+document.getElementById("pr").value;
if(!(c>0&&n>0&&i>=0&&e>=0&&r>=0))return;var rm=r/1200,N=n*12,fc=c*Math.pow(1+i/100,n),eg=e*Math.pow(1+rm,N),gap=Math.max(0,fc-eg),m=gap===0?0:(rm?gap*rm/((Math.pow(1+rm,N)-1)*(1+rm)):gap/N);
document.getElementById("pfc").textContent=money(fc);document.getElementById("peg").textContent=money(eg);document.getElementById("pgap").textContent=money(gap);document.getElementById("pm").textContent=money(m)};
pf.addEventListener("input",plan);plan()}
})();
