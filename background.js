// const {USERNAME, PASSWORD} = require('./credentials.js');
const keytar = require('keytar');

const GetCredentials = async ()=>{
  const ke = await keytar.findCredentials('iitg_autologin_app').then(res=>res);
  if(ke.length==0){
    return null;
  }else{
    return {
      'USERNAME':ke[0].account,
      'PASSWORD':ke[0].password
    }
  }
}

const BASE_URL = "https://agnigarh.iitg.ac.in:1442"
const LOGIN_URL = BASE_URL+"/login?"
const LOGOUT_URL = BASE_URL+"/logout?"

const VERDICT_STR = ["logged in as", "authentication failed", "concurrent authentication"]

const GetTokens = async ()=>{
  const res = await fetch(LOGIN_URL).then(response=> response.text()).catch(err=>{
    console.log(err)
    throw 'LAN/WiFi Disconnected!'
  })
  // regex101.com
  const regex = /\"4Tredir.*?value=\"(.*?)\".*?\"magic.*?value=\"(.*?)\"/gm;
  let m;
  if ((m = regex.exec(res)) !== null) {
      // This is necessary to avoid infinite loops with zero-width matches
      if (m.index === regex.lastIndex) {
          regex.lastIndex++;
      }
  }
  if(m.length!=3){
    return null;
  }
  const tokens={
    "4Tredir": m[1],
    "magic":m[2]
  }
  // console.log(tokens);
  return tokens;
}

const Login = async ()=>{
  const tokens = await GetTokens();
  const credentials = await GetCredentials();
  if(credentials==null){
    throw 'Please configure your username and password for this app!'
  }
  const data = {
    "username":credentials.USERNAME,
    "password":credentials.PASSWORD,
    ...tokens,
  }

  const res = await fetch(BASE_URL, {
    method: 'POST',
    headers:{
      // 'Content-Type': 'application/json',
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    body: new URLSearchParams(data)
  }).catch(err=>{
    console.log(err);
    throw 'LAN/WiFi Disconnected!'
  });

  //regex101.com
  const regex = /.*?(keepalive)/gm;
  let m;

  if((m = regex.exec(res.url)) !== null) {
      // This is necessary to avoid infinite loops with zero-width matches
      if (m.index === regex.lastIndex) {
          regex.lastIndex++;
      }
  }
  // console.log(res);
  if(res?.status==200 && m?.length>0){
    console.log(res.url)
    console.log('Login Success!');
    return res?.url;
  }
  console.log('Login Unsuccess!');
  throw 'Authentication Failed, please review your credentials!'
}

const Logout = async ()=>{
  const res = await fetch(LOGOUT_URL).catch(err=>{
    console.log(err)
    throw 'LAN/WiFi Disconnected!'
  });
  console.log(res)
  if(res?.status==200){
    console.log("Logout Success!")
    return true;
  }
  return false;
}

module.exports = {Login, Logout};
