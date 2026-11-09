/* EDIT THESE VALUES BEFORE GOING LIVE */
var CONFIG={
  bookingUrl:"https://calendly.com/shawasutosh/30min",
  whatsappNumber:"918981399603",
  email:"simplysuitable.investments@gmail.com",
  checklistUrl:"",          /* add your checklist form link to show the checklist section */
  registrations:""          /* e.g. insurance / NPS registration details; shown in the footer when filled */
};
function placeholder(u){return !u||u.indexOf("YOUR")>-1||u.indexOf("XXXX")>-1}
var map={book:CONFIG.bookingUrl,whatsapp:"https://wa.me/"+CONFIG.whatsappNumber+"?text="+encodeURIComponent("Hi, I found you through Simply Suitable Investments."),email:"mailto:"+CONFIG.email,checklist:CONFIG.checklistUrl};
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
