const cookieProvider = require('../DPAuthentication/docketingPortalAuthProvider.js');
const fs = require('fs');

(async () => {
	var parameters = getInputDictionary(process.argv);
	validateParameters(parameters);
	 let authCookie; 
	 try
	 {
		authCookie = await cookieProvider.getAuthCookie(parameters.userName, parameters.password, parameters.baseUrl);
		if(authCookie){
			fs.writeFile(parameters.authCookieFilePath, authCookie, (err) => {
				if (err) throw err;
				console.log(`Authentication cookie ${authCookie} was successfully written to ${parameters.authCookieFilePath}`);
			});
		}
	 }
	 catch(err)
	 {
		console.error(err);
		process.exit(1);
	 }

})();

function validateParameters(parameters){
	const errors = ['userName', 'password', 'baseUrl', 'authCookieFilePath']
		.filter(parameter => !parameters[parameter])
		.map(parameter => `${parameter} is missing`);

	if(errors.length > 0) {
		errors.forEach(error => console.error(error));
		process.exit(1);
	}
}

function getInputDictionary(inputs) {
	return inputs.slice(2).reduce((dictionary, input) => {
		const pair = input.split('=');
		if (pair.length === 2) dictionary[pair[0]] = pair[1];
		return dictionary;
	}, {});
}