const keytar = require('keytar');

const _pass = document.getElementById('_pass');
const _user = document.getElementById('_user');
const _form = document.getElementById('_form');

const loading = document.getElementById("lds-container")

const LoadingStart = ()=>{
  loading.innerHTML = `<div class="lds-spinner"><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div></div>`;
}

const LoadingEnd = ()=>{
  loading.innerHTML = "";
}

let user = "";
let pass = "";

const setKeyAndPass = async ()=>{
  const ked = await keytar.findCredentials('iitg_autologin_app').then(res=>res);
  console.log(ked)
  ked.forEach(k=>{
    keytar.deletePassword('iitg_autologin_app', k.account)
  })
  const res = await keytar.setPassword('iitg_autologin_app', user, pass);
  const ke = await keytar.findCredentials('iitg_autologin_app').then(res=>res);
  console.log(ke)
  LoadingEnd();
}

const formSubmitHandler = async (e)=>{
  e.preventDefault();
  LoadingStart();
  await setKeyAndPass();
}

const userInputHandler = (e)=>{
  user = e.target.value;
  // console.log(user)
}

const passInputHandler = (e)=>{
  pass = e.target.value;
  // console.log(pass)
}

_user.addEventListener('input', userInputHandler);
_pass.addEventListener('input', passInputHandler);
_form.addEventListener('submit', formSubmitHandler);
