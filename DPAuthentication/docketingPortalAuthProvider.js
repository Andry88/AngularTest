const querystring = require('querystring');
const httpHelper = require('./httpHelper.js');
const cookieHelper = require('./cookieHelper.js');


exports.getAuthCookie = async function (userName, password, baseUrl) {
  const url = new URL(baseUrl);
  const idsrvXsrf = 'idsrv.xsrf';
  const signInMessage = 'SignInMessage';
  const tempUserName = 'TempUserName';
  const idsrv = 'idsrv=';
  const idsvrSession = 'idsvr.session';
  const authUserName = 'Auth.UserName';
  const ipmsIpm = 'ipms.ipm';
 
	let options = {
	  host: url.hostname, 
	  path: url.pathname,
	  headers: {
		  cookie: []
	  }
	};

  let response = await httpHelper.getAsync(options);
 
  const authConnectUrl = new URL(response.headers.location);

  response = await httpHelper.getAsync({ ...options, path: httpHelper.getPath(authConnectUrl) });

  const sighInUrl = new URL(response.headers.location);
  const sighInParam = sighInUrl.searchParams;
  cookieHelper.createCookieProperty(signInMessage);
  options.headers.cookie = [cookieHelper.cookieStorage[signInMessage]];

  response = await httpHelper.getAsync({ ...options, path: httpHelper.getPath(sighInUrl) });
  const idsrvXsrfFromBody = httpHelper.getHiddenInputValue(response.body, idsrvXsrf);
  cookieHelper.createCookieProperty(idsrvXsrf);
  let queryStr = new URLSearchParams(sighInParam);
  queryStr.append('userName', userName);
  options.headers.cookie = [
    cookieHelper.cookieStorage[signInMessage],
    cookieHelper.cookieStorage[idsrvXsrf]
  ];

  response = await httpHelper.getAsync({ ...options, path: `/auth/Account/LoginProviders?${queryStr.toString()}` });

  cookieHelper.createCookieProperty(tempUserName);
  options.headers.cookie = [
    cookieHelper.cookieStorage[tempUserName],
    cookieHelper.cookieStorage[signInMessage],
    cookieHelper.cookieStorage[idsrvXsrf]
  ];
  let body = querystring.stringify({
    'idsrv.xsrf': idsrvXsrfFromBody,
    username: userName,
    password: password,
    btnLoginSubmit: 'Sign in'
  });
  
  response = await httpHelper.postAsync({ ...options, path: httpHelper.getPath(sighInUrl) }, body);

  cookieHelper.createCookieProperty(idsrv);
  cookieHelper.createCookieProperty(idsvrSession);
  options.headers.cookie = [
    cookieHelper.cookieStorage[tempUserName],
    cookieHelper.cookieStorage[idsrvXsrf],
    cookieHelper.cookieStorage[idsrv],
    cookieHelper.cookieStorage[idsvrSession]
  ];

  response = await httpHelper.getAsync({ ...options, path: httpHelper.getPath(authConnectUrl) });
  
  cookieHelper.createCookieProperty(authUserName);
  body = querystring.stringify({
    code: httpHelper.getHiddenInputValue(response.body, 'code'),
    state: httpHelper.getHiddenInputValue(response.body, 'state')
  });
  options.headers.cookie = [cookieHelper.cookieStorage[authUserName]];

  response = await httpHelper.postAsync({ ...options, path: url.pathname }, body);
  
  cookieHelper.createCookieProperty(ipmsIpm);
  
  return JSON.stringify({ Cookie: cookieHelper.cookieStorage[ipmsIpm] });
}

