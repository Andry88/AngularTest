const https = require('https');
const cookieHelper = require('./cookieHelper.js');

const userAgent = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/76.0.3809.100 Safari/537.36';

exports.getAsync = async function(options) {
  try
  {
	options.headers['User-Agent'] = userAgent;
	  
    return new Promise((resolve, reject) => {
      https
        .request({ ...options, 
		method: 'GET', 
		headers: {
		  'User-Agent': userAgent,
          'cookie': options.headers.cookie
      }}, response => 
          {
            response.on('data', data => response.body = data.toString());
            const cookies = cookieHelper.getCookies(response);
            if(cookies){
              cookieHelper.addCookiesToStorage(cookies);
            }
            resolve(response);
          })
        .on('error', error => reject(error))
        .end();
    });
  } 
  catch (error) {
    console.error(error);
  }
}

exports.postAsync = async function(options, body) {
 
  try
  {
    return new Promise((resolve, reject) => {
      const request = https.request({...options,
        method: 'POST',
        headers: {
		  'User-Agent': userAgent,
          'Content-Type': 'application/x-www-form-urlencoded',
          'cookie': options.headers.cookie
      }
    }, response => {
        const cookies = cookieHelper.getCookies(response);
        if(cookies){
          cookieHelper.addCookiesToStorage(cookies);
        }
        resolve(response);
      });
      
      if(body) {
        request.write(body);
      }
      request.on('error', error => reject(error));
      request.end(); 
    });
  } 
  catch (error) {
    console.error(error);
  }
}

exports.getPath = function(url){
  return url.pathname + url.search;
}

exports.getHiddenInputValue = function(string, property){
  return string.match(new RegExp(`<input type=\"hidden\" name=\"${property}\" value=\"(.*)\" \.+\/>`))[1];
}