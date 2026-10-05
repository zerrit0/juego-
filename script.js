const N=10,M=16,LV=["Fácil","Medio","Difícil"],MIN_RULETA=150,PTS=25; /* puntos mínimos para girar la ruleta */
let level=0,cells,lives,flagMode,started,over,opened,cur,score=0,best=0,girado=false;
const $=id=>document.getElementById(id);
const rnd=(a,b)=>a+Math.floor(Math.random()*(b-a+1));
function problem(){
  let t,a,b,c,ans;
  if(level===0){a=rnd(2,20);b=rnd(2,20);if(Math.random()<.5){t=a+" + "+b;ans=a+b}else{if(b>a)[a,b]=[b,a];t=a+" − "+b;ans=a-b}}
  else if(level===1){a=rnd(2,9);b=rnd(2,9);if(Math.random()<.7){t=a+" × "+b;ans=a*b}else{c=a*b;t=c+" ÷ "+a;ans=b}}
  else{const k=rnd(0,2);if(k===0){a=rnd(6,12);b=rnd(6,12);t=a+" × "+b;ans=a*b}else if(k===1){a=rnd(2,9);b=rnd(2,9);c=rnd(2,9);t="("+a+" + "+b+") × "+c;ans=(a+b)*c}else{a=rnd(3,12);b=rnd(3,12);c=rnd(5,40);t=a+" × "+b+" − "+c;ans=a*b-c}}
  const set=new Set([ans]);
  while(set.size<4){const d=ans+rnd(-10,10);if(d>=0&&d!==ans)set.add(d)}
  return{t,ans,opts:[...set].sort(()=>Math.random()-.5)};
}
function nb(i){const r=Math.floor(i/N),c=i%N,l=[];for(let dr=-1;dr<=1;dr++)for(let dc=-1;dc<=1;dc++){if(!dr&&!dc)continue;const y=r+dr,x=c+dc;if(y>=0&&y<N&&x>=0&&x<N)l.push(y*N+x)}return l}
function init(){
  cells=Array.from({length:N*N},()=>({m:false,o:false,f:false,n:0}));
  lives=3;score=0;best=0;girado=false;flagMode=false;started=false;over=false;opened=0;
  $("flagBtn").classList.remove("on");$("msg").textContent="";
  const g=$("grid");g.innerHTML="";g.style.gridTemplateColumns="repeat("+N+",1fr)";
  cells.forEach((_,i)=>{const b=document.createElement("button");b.className="c";b.onclick=()=>click(i);g.appendChild(b)});
  $("levels").innerHTML="";
  LV.forEach((n,i)=>{const b=document.createElement("button");b.textContent=n;if(i===level)b.className="on";b.onclick=()=>{level=i;init()};$("levels").appendChild(b)});
  hud();
}
function hud(){
  $("score").textContent="⭐ "+score+" pts";
  if(score>best)best=score;
  $("best").textContent="🏆 Récord: "+best;
  $("lives").textContent="❤️".repeat(lives)+"🖤".repeat(3-lives);
  $("mines").textContent="💣 "+(M-cells.filter(c=>c.f).length);
}
function draw(){
  [...$("grid").children].forEach((b,i)=>{const c=cells[i];
    b.className="c"+(c.o?" o":"")+(c.o&&c.m?" m":"");
    b.textContent=c.o?(c.m?"💣":(c.n||"")):(c.f?"🚩":"");
    if(c.o&&!c.m&&c.n)b.classList.add("n"+c.n);
  });hud();
}
function place(safe){
  const ban=new Set([safe,...nb(safe)]);let p=0;
  while(p<M){const i=rnd(0,N*N-1);if(!ban.has(i)&&!cells[i].m){cells[i].m=true;p++}}
  cells.forEach((c,i)=>c.n=nb(i).filter(j=>cells[j].m).length);
  started=true;
}
function click(i){
  if(over||cells[i].o)return;
  if(flagMode){cells[i].f=!cells[i].f;draw();return}
  if(cells[i].f)return;
  cur=i;const p=problem();cur={i,ans:p.ans};
  $("q").textContent=p.t;$("opts").innerHTML="";
  p.opts.forEach(v=>{const b=document.createElement("button");b.textContent=v;b.onclick=()=>answer(v);$("opts").appendChild(b)});
  $("modal").classList.add("show");
}
function answer(v){
  $("modal").classList.remove("show");
  if(v===cur.ans){score+=PTS;$("msg").textContent="✅ ¡Correcto! +"+PTS+" pts";reveal(cur.i)}
  else{lives--;$("msg").textContent="❌ Incorrecto. La respuesta era "+cur.ans;
    if(lives<=0)lose();else draw()}
}
function reveal(i){
  if(!started)place(i);
  if(cells[i].m){lose();return}
  const st=[i];
  while(st.length){const k=st.pop(),c=cells[k];if(c.o||c.m)continue;
    c.o=true;c.f=false;opened++;
    if(c.n===0)nb(k).forEach(j=>{if(!cells[j].o)st.push(j)})}
  draw();
  if(opened===N*N-M){over=true;score+=50*lives;hud();$("msg").textContent="🏆 ¡Ganaste! Despejaste todo el tablero."}
}
function lose(){
  over=true;cells.forEach(c=>{if(c.m)c.o=true});draw();
  $("msg").textContent=lives<=0?"💔 Te quedaste sin vidas. ¡Fin del juego!":"💥 ¡BOOM! Era una mina.";
}
$("flagBtn").onclick=()=>{flagMode=!flagMode;$("flagBtn").classList.toggle("on",flagMode)};
$("reset").onclick=init;
init();

/* ===== EFECTOS ===== */
(function(){
  /* ===== TUS IMÁGENES: poné acá el nombre de tu archivo (png, jpg, gif, webp) ===== */
  var IMAGEN_GANAR='444.png';
  var IMAGEN_PERDER='1122.gif';
  var IMAGEN_SUSTO='deepfriedwoomy.gif'; /* imagen del screamer (si no existe, sale un 👹) */
  var MUSICA='musica.m4a'; /* música de fondo (en bucle) */
  var SONIDO_SUSTO='fnaf-foxy-scream-sfx.mp3'; /* sonido del screamer (si no existe, suena uno sintetizado) */
  var IMAGEN_BIENVENIDA='887.gif'; /* gif de la pantalla de inicio */
  /* Los archivos tienen que estar en la misma carpeta que index.html */

  var reducir=window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---- Fondo: fragmentos de vidrio rojos y blancos ---- */
  var c=document.getElementById('fondo'),ctx=c.getContext('2d');
  var W,H,dpr,piezas=[],mouse={x:-999,y:-999};
  var colores=['#e8002d','#e8002d','#ffffff','#3a3a3a'];
  function nuevaPieza(y){
    var n=3+Math.floor(Math.random()*2),r=8+Math.random()*26,pts=[];
    for(var i=0;i<n;i++){
      var a=(i/n)*Math.PI*2+Math.random()*0.8;
      pts.push([Math.cos(a)*r*(0.5+Math.random()),Math.sin(a)*r*(0.5+Math.random())]);
    }
    return{x:Math.random()*W,y:y,vx:-0.15-Math.random()*0.35,vy:-0.25-Math.random()*0.6,
      rot:Math.random()*6.28,vr:(Math.random()-0.5)*0.02,pts:pts,
      color:colores[Math.floor(Math.random()*colores.length)],alpha:0.15+Math.random()*0.4,ox:0,oy:0};
  }
  function ajustar(){
    dpr=window.devicePixelRatio||1;W=window.innerWidth;H=window.innerHeight;
    c.width=W*dpr;c.height=H*dpr;ctx.setTransform(dpr,0,0,dpr,0,0);
    var total=Math.round(Math.min(70,W*H/14000));piezas=[];
    for(var i=0;i<total;i++)piezas.push(nuevaPieza(Math.random()*H));
  }
  function dibujar(){
    ctx.clearRect(0,0,W,H);
    for(var i=0;i<piezas.length;i++){
      var p=piezas[i];
      if(!reducir){
        p.x+=p.vx;p.y+=p.vy;p.rot+=p.vr;
        var dx=p.x+p.ox-mouse.x,dy=p.y+p.oy-mouse.y,d=Math.sqrt(dx*dx+dy*dy);
        if(d<140&&d>0){var f=(140-d)/140;p.ox+=(dx/d)*f*3;p.oy+=(dy/d)*f*3}
        p.ox*=0.94;p.oy*=0.94;
        if(p.y<-60||p.x<-60){var q=nuevaPieza(H+40);q.x=Math.random()*(W+120);piezas[i]=p=q}
      }
      ctx.save();ctx.translate(p.x+p.ox,p.y+p.oy);ctx.rotate(p.rot);
      ctx.globalAlpha=p.alpha;ctx.fillStyle=p.color;ctx.beginPath();
      ctx.moveTo(p.pts[0][0],p.pts[0][1]);
      for(var j=1;j<p.pts.length;j++)ctx.lineTo(p.pts[j][0],p.pts[j][1]);
      ctx.closePath();ctx.fill();ctx.restore();
    }
    if(!reducir)requestAnimationFrame(dibujar);
  }
  window.addEventListener('resize',function(){ajustar();if(reducir)dibujar()});
  ajustar();dibujar();

  /* ---- Skin de mouse ---- */
  var fino=window.matchMedia('(pointer: fine)').matches;
  if(fino){
    document.documentElement.classList.add('con-cursor');
    var anillo=document.querySelector('.anillo'),ax=0,ay=0,mx=0,my=0;
    document.addEventListener('mousemove',function(e){
      mouse.x=e.clientX;mouse.y=e.clientY;mx=e.clientX;my=e.clientY;
      anillo.classList.add('visible');
      anillo.classList.toggle('sobre-link',!!e.target.closest('button'));
    });
    document.addEventListener('mouseleave',function(){anillo.classList.remove('visible');mouse.x=mouse.y=-999});
    document.addEventListener('mousedown',function(){anillo.classList.add('click')});
    document.addEventListener('mouseup',function(){anillo.classList.remove('click')});
    (function seguir(){
      ax+=(mx-ax)*0.18;ay+=(my-ay)*0.18;
      anillo.style.transform='translate('+ax+'px,'+ay+'px)';
      requestAnimationFrame(seguir);
    })();
  }

  /* ---- Sonidos (sintetizados, no necesitan archivos) ---- */
  var AC=null;
  function audio(){
    if(!AC){var C=window.AudioContext||window.webkitAudioContext;if(!C)return null;AC=new C()}
    if(AC.state==='suspended')AC.resume();
    return AC;
  }
  function tono(f,d,tipo,vol,t0,f2){
    var a=audio();if(!a)return;
    var t=a.currentTime+(t0||0),o=a.createOscillator(),g=a.createGain();
    o.type=tipo||'square';o.frequency.setValueAtTime(f,t);
    if(f2)o.frequency.exponentialRampToValueAtTime(f2,t+d);
    g.gain.setValueAtTime(vol||0.05,t);g.gain.exponentialRampToValueAtTime(0.0001,t+d);
    o.connect(g);g.connect(a.destination);o.start(t);o.stop(t+d);
  }
  function ruido(d,vol){
    var a=audio();if(!a)return;
    var n=Math.floor(a.sampleRate*d),b=a.createBuffer(1,n,a.sampleRate),x=b.getChannelData(0);
    for(var i=0;i<n;i++)x[i]=(Math.random()*2-1)*(1-i/n);
    var s=a.createBufferSource(),g=a.createGain();s.buffer=b;g.gain.value=vol;
    s.connect(g);g.connect(a.destination);s.start();
  }
  var sfx={
    hover:function(){tono(1200,0.04,'square',0.02)},
    click:function(){tono(500,0.08,'square',0.04,0,900)},
    ok:function(){[660,880,1320].forEach(function(f,i){tono(f,0.12,'square',0.05,i*0.07)})},
    mal:function(){tono(220,0.35,'sawtooth',0.07,0,70)},
    boom:function(){ruido(0.6,0.18);tono(90,0.5,'sawtooth',0.1,0,30)},
    win:function(){[523,659,784,1047,1319].forEach(function(f,i){tono(f,0.18,'square',0.05,i*0.1)})}
  };
  document.addEventListener('mouseover',function(e){
    var b=e.target.closest('button');
    if(fino&&b&&!b.contains(e.relatedTarget))sfx.hover();
  });
  document.addEventListener('click',function(e){if(e.target.closest('button'))sfx.click()});

  /* Sonidos del juego: se enganchan a las funciones existentes */
  var _answer=window.answer,_lose=window.lose;
  window.answer=function(v){
    var bien=(v===cur.ans);
    _answer(v);
    if(over&&lives>0&&opened===N*N-M){sfx.win();mostrarFin(true)}
    else if(bien&&!over)sfx.ok();
    else if(!over)sfx.mal();
  };
  window.lose=function(){_lose();sfx.boom();mostrarFin(false)};

  /* ---- Secreto: tocá el título 7 veces seguidas ---- */
  var titulo=document.querySelector('h1'),toques=0,tt;
  titulo.onclick=function(){
    toques++;clearTimeout(tt);tt=setTimeout(function(){toques=0},1500);
    if(toques>=7){
      toques=0;var on=document.body.classList.toggle('secreto');
      document.getElementById('msg').textContent=on?'🕵️ ¡Encontraste el secreto! Modo arcoíris activado':'🕵️ Modo arcoíris desactivado';
      on?sfx.win():sfx.mal();
    }
  };

  /* ---- Pantalla de bienvenida ---- */
  var bien=document.getElementById('bienvenida'),bienImg=document.getElementById('bienImg');
  bienImg.onerror=function(){bienImg.style.display='none'};
  bienImg.src=IMAGEN_BIENVENIDA;
  /* ---- Screamer: tocá el gif de bienvenida ---- */
  var susto=document.getElementById('susto'),sustoImg=document.getElementById('sustoImg'),sustoEmoji=document.getElementById('sustoEmoji'),sustoT;
  sustoImg.onerror=function(){sustoImg.style.display='none';sustoEmoji.style.display='block'};
  sustoImg.onload=function(){sustoImg.style.display='block';sustoEmoji.style.display='none'};
  var sustoAu=null;
  function cerrarSusto(){clearTimeout(sustoT);susto.classList.remove('show');musicaPlay();if(sustoAu){sustoAu.pause();sustoAu=null}}
  bienImg.onclick=function(){
    musica.pause();
    sustoImg.src=IMAGEN_SUSTO;
    susto.classList.add('show');
    var sinte=function(){ruido(1.2,0.3);tono(900,1.2,'sawtooth',0.15,0,2400);tono(950,1.2,'square',0.1,0,2600);tono(80,1,'sawtooth',0.2,0,40)};
    try{var au=new Audio(SONIDO_SUSTO);au.volume=1;au.onerror=sinte;var pr=au.play();if(pr&&pr.catch)pr.catch(sinte);sustoAu=au}catch(e){sinte()}
    sustoT=setTimeout(cerrarSusto,2200);
  };
  susto.onclick=cerrarSusto;
  /* ---- Música de fondo ---- */
  var musica=new Audio(MUSICA),musicaOn=true,musicaIniciada=false,musicBtn=document.getElementById('musicBtn');
  musica.loop=true;musica.volume=0.35;musica.preload='auto';
  function musicaActualizar(){musicBtn.textContent=musicaOn?'🔊':'🔇'}
  function musicaPlay(){if(musicaIniciada&&musicaOn){var p=musica.play();if(p&&p.catch)p.catch(function(){})}}
  musicBtn.onclick=function(){
    musicaOn=!musicaOn;musicaActualizar();
    if(musicaOn){musicaIniciada=true;musicaPlay()}else musica.pause();
  };
  musicaActualizar();
  document.getElementById('bienBtn').onclick=function(){audio();sfx.ok();bien.classList.remove('show');musicaIniciada=true;musicaPlay()};

  /* ---- Ventana final con imagen / gif ---- */
  var fin=document.getElementById('fin'),finImg=document.getElementById('finImg');
  function mostrarFin(gano){
    setTimeout(function(){
      document.getElementById('finTitulo').textContent=document.getElementById('msg').textContent;
      var falta=MIN_RULETA-score;
      document.getElementById('finPuntos').textContent='⭐ Puntaje: '+score+' pts'+(gano&&falta>0?' · Faltaron '+falta+' para la ruleta':'');
      document.getElementById('finRuleta').style.display=(gano&&score>=MIN_RULETA&&!girado)?'':'none';
      finImg.style.display='';
      finImg.onerror=function(){finImg.style.display='none'};
      finImg.src=gano?IMAGEN_GANAR:IMAGEN_PERDER;
      fin.classList.add('show');
    },900);
  }
  document.getElementById('finBtn').onclick=function(){fin.classList.remove('show');init()};


  /* ---- Ruleta de premios (aparece al ganar) ----
     Para cambiar premios o probabilidades, editá esta lista: más segmentos iguales = más chances. */
  var PREMIOS=[
    {t:'2 DÉCIMAS',c:'#e8002d',k:'#ffffff',msg:'🎉 ¡Ganaste 2 décimas!'},
    {t:'NADA',c:'#2a2b33',k:'#ffffff',msg:'😅 Esta vez nada... ¡suerte la próxima!'},
    {t:'UN DULCE',c:'#f5f5f5',k:'#0b0b0d',msg:'🍬 ¡Ganaste un dulce!'},
    {t:'2 DÉCIMAS',c:'#e8002d',k:'#ffffff',msg:'🎉 ¡Ganaste 2 décimas!'},
    {t:'NADA',c:'#2a2b33',k:'#ffffff',msg:'😅 Esta vez nada... ¡suerte la próxima!'},
    {t:'UN DULCE',c:'#f5f5f5',k:'#0b0b0d',msg:'🍬 ¡Ganaste un dulce!'}
  ];
  var rueda=document.getElementById('rueda'),rc=rueda.getContext('2d'),seg=Math.PI*2/PREMIOS.length;
  (function(){
    var R=150;
    PREMIOS.forEach(function(p,i){
      var a0=-Math.PI/2+i*seg;
      rc.beginPath();rc.moveTo(R,R);rc.arc(R,R,R,a0,a0+seg);rc.closePath();
      rc.fillStyle=p.c;rc.fill();rc.lineWidth=3;rc.strokeStyle='#0b0b0d';rc.stroke();
      rc.save();rc.translate(R,R);rc.rotate(a0+seg/2);
      rc.textAlign='right';rc.textBaseline='middle';rc.fillStyle=p.k;
      rc.font='900 17px "Arial Black",Impact,sans-serif';
      rc.fillText(p.t,R-16,0);rc.restore();
    });
    rc.beginPath();rc.arc(R,R,18,0,Math.PI*2);rc.fillStyle='#0b0b0d';rc.fill();
    rc.lineWidth=3;rc.strokeStyle='#f5f5f5';rc.stroke();
  })();
  var ruleta=document.getElementById('ruleta'),rGirar=document.getElementById('rGirar'),
      rCerrar=document.getElementById('rCerrar'),rRes=document.getElementById('rRes'),rot=0,girando=false;
  function abrirRuleta(){
    if(score<MIN_RULETA){$('msg').textContent='🎡 Necesitás '+MIN_RULETA+' pts para girar la ruleta (te faltan '+(MIN_RULETA-score)+')';return}
    if(girado){$('msg').textContent='🎡 Ya giraste la ruleta en esta partida';return}
    rot=0;girando=false;
    rueda.style.transition='none';rueda.style.transform='rotate(0deg)';
    rRes.textContent='';rGirar.style.display='';rGirar.disabled=false;rCerrar.style.display='none';
    rCerrar.textContent=over?'Jugar de nuevo':'Cerrar';
    ruleta.classList.add('show');
  }
  rGirar.onclick=function(){
    if(girando)return;girando=true;girado=true;rGirar.disabled=true;
    var idx=Math.floor(Math.random()*PREMIOS.length),segD=360/PREMIOS.length,
        jit=(Math.random()-0.5)*segD*0.6,centro=(idx+0.5)*segD;
    rot=Math.ceil(rot/360)*360+360*5-centro+jit;
    void rueda.offsetWidth;
    rueda.style.transition='transform 4.5s cubic-bezier(.15,.65,.1,1)';
    rueda.style.transform='rotate('+rot+'deg)';
    var iv=setInterval(function(){tono(700,0.03,'square',0.03)},140);
    setTimeout(function(){clearInterval(iv)},4300);
    setTimeout(function(){
      var p=PREMIOS[idx];
      rRes.textContent=p.msg;
      if(p.t==='NADA')sfx.mal();else sfx.win();
      rGirar.style.display='none';rCerrar.style.display='';
    },4600);
  };
  document.getElementById('finRuleta').onclick=function(){fin.classList.remove('show');abrirRuleta()};
  rCerrar.onclick=function(){ruleta.classList.remove('show');if(over)init()};
  document.getElementById('ruletaBtn').onclick=abrirRuleta;
  document.getElementById('ruletaBtn').textContent='🎡 Ruleta ('+MIN_RULETA+' pts)';

})();
