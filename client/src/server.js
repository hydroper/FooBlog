import sirv from 'sirv';

import polka from 'polka';

import compression from 'compression';

import * as sapper from '@sapper/server';

const { PORT, NODE_ENV } = process.env;

const isDebugging = NODE_ENV === 'development';

polka() // You can also use Express
	.use('res/lang', sirv('res/lang', {
		dev: isDebugging, maxAge: 60
	}))
	.use(
		compression({ threshold: 0 }),
		sirv('static', { dev: isDebugging, maxAge: 60 }),
		sapper.middleware({
			session: (req, res) => ({
				acceptLanguage: req.headers['Accept-Language'],
			}),
		})
	)
	.listen(PORT, err => {
		if (err) console.log('Error', err);
	});