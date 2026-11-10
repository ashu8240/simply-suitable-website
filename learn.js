(function(){
var q=document.getElementById("lq");if(!q)return;
var cards=[].slice.call(document.querySelectorAll(".lcard")),chips=[].slice.call(document.querySelectorAll(".lchip")),
more=document.getElementById("lmore"),empty=document.getElementById("lempty"),cnt=document.getElementById("lcount"),cat="All",PAGE=12,n=PAGE;
function apply(){var t=q.value.toLowerCase().trim(),m=0;
cards.forEach(function(c){var ok=(cat==="All"||c.getAttribute("data-cat")===cat)&&(!t||c.getAttribute("data-t").indexOf(t)>-1);if(ok){m++;c.hidden=m>n}else{c.hidden=true}});
empty.hidden=m>0;more.hidden=m<=n;cnt.textContent=m+(m===1?" article":" articles")}
q.addEventListener("input",function(){n=PAGE;apply()});
chips.forEach(function(b){b.addEventListener("click",function(){cat=b.getAttribute("data-c");n=PAGE;chips.forEach(function(x){x.setAttribute("aria-pressed",x===b?"true":"false")});apply()})});
more.addEventListener("click",function(){n+=PAGE;apply()});apply();
})();
