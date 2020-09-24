import LocalAuth from './LocalAuth.js';

export default async function AdministratorAuth(eReq, eRes, nextFn) {
	await LocalAuth(eReq, eRes, () => {
	    if (!('administrator' in eReq.user.privileges))
	        eRes.statusCode = 400, eRes.end(JSON.stringify({ errorType: 'administratorAuthFailed', messages: {} }));
	   	else nextFn();
	});
}