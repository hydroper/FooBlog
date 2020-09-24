import {
    Validator,
} from 'com.siteblade.nodejs.www.api';

import {
    ItemsPerPage,
    OrderBy,
    Comparison,
} from 'com.siteblade.nodejs.database.orm';

import { JSON, Enum, FlagsEnum } from 'com.siteblade.util';

import CORS from '../CORS.js';

import TranslationProvider from '../TranslationProvider.js';

import JWT from '../auth/JWT.js';

import User, { Privileges } from '../database/entities/User.js';

import bcrypt from 'bcryptjs';

import Multer from 'multer';

export default class LoginController {
    constructor(eApp) {
        // begin Validator
        this.validator = new Validator({
            fields: {
                netid: [ ],
                password: [ ],
                remember: [ ],
            },
            steps: [
                // validate credentials
                async (fields, report) => {
                    let [ user ] = await User.find({ netId: fields.netid });
                    if (!user) {
                        report('netid', 'validation.user.idNotFound');
                        return undefined;
                    }
                    if (!(await bcrypt.compare(fields.password, user.passwordHash))) {
                        report('password', 'validation.user.wrongPassword');
                        return undefined;
                    }
                    return [ user, fields.remember == '1' ];
                },
            ],
        });
        // end Validator

        eApp.post('login', CORS.all(), Multer().none(), this.validator.eMiddleware(TranslationProvider), async (req, res) => {
            let [ user, remember ] = req.validationResult;
            res.end(JSON.stringify({
                user: user.toJSON(),
                token: JWT.generate(user, remember),
            }));
        });
    }
}