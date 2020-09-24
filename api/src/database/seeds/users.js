import User from '../entities/User.js';

import bcrypt from 'bcryptjs';

export default async function seed() {
	await User.add({
		netId: 'hydroper',
		email: 'HydroperHH@gmail.com',
		passwordHash: await bcrypt.hash('hydroper', 10),
		privileges: ['moderator', 'administrator'],
		createdAt: new Date('2014-12-15T14:20:09'),
	});
}
