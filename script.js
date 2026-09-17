const $=s=>document.querySelector(s);
const sections=[...document.querySelectorAll(".scene")];
let musicOn=false, audioCtx=null, musicTimer=null;

window.addEventListener("load",()=>setTimeout(()=>{$("#loader").style.opacity="0";setTimeout(()=>$("#loader").remove(),800)},900));

function goTo(id){document.getElementById(id).scrollIntoView({behavior:"smooth"});}

const observer=new IntersectionObserver(entries=>{
  entries.forEach(e=>{
    if(e.isIntersecting){
      const i=sections.indexOf(e.target);
      if(i>=0) $("#chapterIndicator").textContent=i===0?"CHAPTER 01":i===5?"THE END":"CHAPTER 0"+i;
      e.target.querySelectorAll(".section-inner,.hero-content").forEach(x=>x.classList.add("in"));
    }
  });
},{threshold:.45});
sections.forEach(s=>observer.observe(s));

function burst(n=70){
  const box=$("#confetti");
  for(let i=0;i<n;i++){
    const h=document.createElement("div");
    h.className="confetti-heart"; h.textContent=["♥","❤","♡","✦","•"][Math.floor(Math.random()*5)];
    h.style.left=Math.random()*100+"vw";
    h.style.animationDelay=Math.random()*1.8+"s";
    h.style.fontSize=(12+Math.random()*24)+"px";
    h.style.opacity=.45+Math.random()*.55;
    box.appendChild(h); setTimeout(()=>h.remove(),5500);
  }
}
function yesAnswer(){
  burst(110);
  setTimeout(()=>{
    document.querySelectorAll(".scene").forEach(s=>s.style.display="none");
    $("#answer").style.display="flex";
    $("#answer").scrollIntoView({behavior:"smooth"});
    $("#answerTitle").textContent="BEGINS.";
    $("#answerText").textContent="And just like that, a Snapchat conversation became the beginning of something worth discovering. ❤️";
    $("#answerEmoji").textContent="❤️";
  },500);
}
function thinkAnswer(){
  const b=$("#thinkBtn");
  b.textContent="TAKE YOUR TIME 🤍";
  b.style.transform="scale(.98)";
  setTimeout(()=>{b.textContent="I'M STILL HERE 😌"; b.style.transform="";},1200);
}
function replay(){location.reload();}

// Tiny synthesized ambient tone — no external audio file required.
function startMusic(){
  if(musicOn)return;
  try{
    audioCtx=new (window.AudioContext||window.webkitAudioContext)();
    const notes=[261.63,329.63,392,493.88,392,329.63];
    let t=audioCtx.currentTime;
    notes.forEach((f,i)=>{
      const o=audioCtx.createOscillator(),g=audioCtx.createGain();
      o.type="sine";o.frequency.value=f;g.gain.setValueAtTime(0,t+i*1.1);
      g.gain.exponentialRampToValueAtTime(.0001,t+i*1.1+1);
      o.connect(g).connect(audioCtx.destination);o.start(t+i*1.1);o.stop(t+i*1.1+1.05);
    });
    musicTimer=setInterval(()=>{ if(musicOn) startMusic(); },7000);
    musicOn=true;$("#soundBtn").textContent="🔊";
  }catch(e){}
}
$("#soundBtn").addEventListener("click",()=>{
  if(!musicOn){startMusic()}
  else {musicOn=false;if(audioCtx)audioCtx.suspend();$("#soundBtn").textContent="♫";}
});
document.addEventListener("click",e=>{ if(e.target.closest("button")) return; if(!musicOn) startMusic();},{once:true});
