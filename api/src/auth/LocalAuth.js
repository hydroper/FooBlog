import JWT from './JWT.js';

import User from '../database/entities/User.js';

export default async function LocalAuth(eReq, eRes, nextFn) {
	let jwt = eReq.query.auth ? JWT.decode(eReq.query.auth) : null;
	let [ user ] = jwt ? await User.find({ id: jwt.sub }) : [];
	if (user) eReq.user = user, nextFn();
	else eRes.statusCode = 400, eRes.end(JSON.stringify({ errorType: 'authFailed', messages: {} }));
}