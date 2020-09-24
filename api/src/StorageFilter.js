import fs from 'fs';

import path from 'path';

import mime from 'mime';

export default function StorageFilter(directoryPath) {
	directoryPath = path.resolve(directoryPath);
	return (eReq, eRes, nextFn) => {
		let p = path.resolve(path.join(directoryPath, eReq.path));

		if (!fs.existsSync(p)) nextFn();

		else {
			fs.readFile(p, (error, data) => {
				if (!error) eRes.writeHead(200, { 'Content-Type': mime.getType(path.extname(p)) }), eRes.end(data);
				nextFn();
			});
		}
	};
}