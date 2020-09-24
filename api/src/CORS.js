import cors from 'cors';

export default class CORS {
	static all() {
		return cors({ allowedHeaders: 'Content-Type,Authorization', credentials: true, origin: true });
	}
};