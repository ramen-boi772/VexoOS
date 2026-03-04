let zIndex = 1;

const desktop = document.getElementById("desktop");
const taskApps = document.getElementById("task-apps");

//////////////////////////////
// WINDOW SYSTEM
//////////////////////////////

function createWindow(id,title,content){

  if(document.getElementById(id)) return;

  const win=document.createElement("div");
  win.className="window";
  win.id=id;

  win.innerHTML=`
    <div class="header" onmousedown="dragStart(event,this.parentElement)">
      <span>${title}</span>
      <div>
        <button onclick="minimize('${id}')">—</button>
        <button onclick="closeApp('${id}')">✖</button>
      </div>
    </div>
    <div class="content">${content}</div>
  `;

  desktop.appendChild(win);
  openApp(id);
  addTaskIcon(id,title);
}

function openApp(id){
  const win=document.getElementById(id);
  if(!win) return;
  win.style.display="flex";
  win.style.zIndex=++zIndex;
}

function closeApp(id){
  document.getElementById(id)?.remove();
  document.getElementById("task-"+id)?.remove();
}

function minimize(id){
  document.getElementById(id).style.display="none";
}

//////////////////////////////
// TASKBAR
//////////////////////////////

function addTaskIcon(id,title){
  if(document.getElementById("task-"+id)) return;

  const icon=document.createElement("div");
  icon.id="task-"+id;
  icon.innerText=title;
  icon.onclick=()=>openApp(id);

  taskApps.appendChild(icon);
}

//////////////////////////////
// DRAG + SNAP
//////////////////////////////

function dragStart(e,win){

  let shiftX=e.clientX-win.getBoundingClientRect().left;
  let shiftY=e.clientY-win.getBoundingClientRect().top;

  function moveAt(pageX,pageY){
    win.style.left=pageX-shiftX+"px";
    win.style.top=pageY-shiftY+"px";
  }

  function onMove(e){moveAt(e.pageX,e.pageY);}

  document.addEventListener("mousemove",onMove);

  document.onmouseup=function(){
    document.removeEventListener("mousemove",onMove);
    document.onmouseup=null;
  };
}

function snapLeft(id){
  const win=document.getElementById(id);
  win.classList.add("maximized");
}

function snapRight(id){
  const win=document.getElementById(id);
  win.classList.add("maximized");
}

//////////////////////////////
// THEME SYSTEM
//////////////////////////////

function toggleTheme(){
  document.body.classList.toggle("dark");
  document.body.classList.toggle("light");
  localStorage.theme=document.body.className;
}

if(localStorage.theme){
  document.body.className=localStorage.theme;
}

//////////////////////////////
// FILE SYSTEM
//////////////////////////////

function saveFile(name,data){
  localStorage.setItem("vexo_file_"+name,data);
}

function loadFile(name){
  return localStorage.getItem("vexo_file_"+name);
}

function deleteFile(name){
  localStorage.removeItem("vexo_file_"+name);
}

//////////////////////////////
// WALLPAPER
//////////////////////////////

function setWallpaper(url){
  document.body.style.backgroundImage=`url(${url})`;
  document.body.style.backgroundSize="cover";
  localStorage.wallpaper=url;
}

if(localStorage.wallpaper){
  setWallpaper(localStorage.wallpaper);
}

//////////////////////////////
// SETTINGS APP
//////////////////////////////

function openSettings(){
  createWindow("settings","Settings",`
    <h3>Theme</h3>
    <button onclick="toggleTheme()">Toggle Theme</button>

    <h3>Wallpaper</h3>
    <input id="wp" placeholder="Image URL">
    <button onclick="setWallpaper(document.getElementById('wp').value)">
      Set
    </button>
  `);
}

//////////////////////////////
// START MENU
//////////////////////////////

function toggleStart(){
  openSettings();
}

//////////////////////////////
// PWA
//////////////////////////////

if("serviceWorker" in navigator){
  navigator.serviceWorker.register("service-worker.js");
}
