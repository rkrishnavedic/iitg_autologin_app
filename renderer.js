const background = require('./background.js')

const connect_btn = document.getElementById("__connect_btn")
const logout_btn = document.getElementById("__logout_btn")
const __change_cred = document.getElementById("____change_cred")
const log = document.getElementById("__log")
const loading = document.getElementById("lds-container")

var keepalive_link = null;

const LoadingStart = ()=>{
  loading.innerHTML = `<div class="lds-spinner"><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div></div>`;
}

const LoadingEnd = ()=>{
  loading.innerHTML = "";
}

const KeepAlive= async ()=>{
  if(keepalive_link==null || keepalive_link==undefined) return false;
  const res = await fetch(keepalive_link).catch(err=>{
    console.log(err)
  });
  console.log(res);
  if(res?.status==200) return true;
  return false;
}

const Autologin= async ()=>{
    const all_good = await KeepAlive();
    if(all_good){
      //do nothing... its connected
      log.innerText = "Connected Successfully!"
      LoadingEnd();
    }else{
      //Try to login again
      try{
        const logout_good = await background.Logout();
        const newLink = await background.Login();
        console.log(newLink)
        keepalive_link = newLink;
        log.innerText = "Connected Successfully!"
        LoadingEnd();
      }catch(err){
        log.innerText = "Connection Faild! Reason: "+err.toString();
        LoadingEnd();
      }
    }

}

let autologin_interval;

const ConnectHandler= async ()=>{
  LoadingStart();
  autologin_interval = setInterval(()=>{Autologin()}, 5000);
}

const LogoutHandler = async ()=>{
  LoadingStart();
  clearInterval(autologin_interval);
  keepalive_link = null;
  const logout_good = await background.Logout();
  log.innerText = "Logged out Successfully!"
  LoadingEnd();
}

logout_btn.addEventListener('click', LogoutHandler);
connect_btn.addEventListener('click', ConnectHandler);
