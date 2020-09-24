import jwtsimpleNS from 'jwt-simple';

import Moment from 'moment';

import ProjectConfig from '../ProjectConfig.js';

export default class JWT {
    static generate(user, remember = false) {
        let payload = {
            sub: Number(user.id),
            iat: Moment().unix(),
            exp: Moment().add(1, remember ? 'y' : 'd').unix(),
        };
        return jwtsimpleNS.encode(payload, ProjectConfig.applicationKey);
    }

    static decode(token) {
        return jwtsimpleNS.decode(token, ProjectConfig.applicationKey);
    }
}