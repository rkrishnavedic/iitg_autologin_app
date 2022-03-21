const keytar = require('keytar');

const fn = async ()=>{
  const ke = await keytar.findCredentials('iitg_autologin_app').then(res=>res);
  console.log(ke)

  ke.forEach(k=>{
    keytar.deletePassword('iitg_autologin_app', k.account)
  })
  const ked = await keytar.findCredentials('iitg_autologin_app').then(res=>res);
  console.log(ked)

}

fn();


// const ke = keytar.setPassword('iitg_autologin_app', 'users', 'user');
