exports.cookieStorage = {
  cookies: []
};

let cookieStorage = exports.cookieStorage;

exports.getCookies = function(response){
  return response.headers['set-cookie'];
}

exports.addCookiesToStorage = function(cookie){
  let separatedCookies = separateCookie(cookie);
  for (const c of separatedCookies) {
    if (!cookieStorage.cookies.includes(c)) {
      cookieStorage.cookies.push(c);
    }
  }
}

exports.createCookieProperty = function(name) {
  cookieStorage.cookies.forEach(cookie => {
    if (cookie.includes(name)) {
      cookieStorage[name] = cookie;
    }
  });
  
  if(!exports.cookieStorage[name]){
	  console.error(`Cookie that includes "${name}" was not returned with any response.`);
	  process.exit(1);	  
  }
}

function separateCookie(cookies) {
  let cookieArray = [];
  for (const c of cookies) {
    for (const a of getCookieArray(c)) {
      if (!cookieArray.includes(a)) {
        cookieArray.push(a);
      }
    }
  }

  return cookieArray;
}

function getCookieArray(cookieString){
  return cookieString.split("; ");
}