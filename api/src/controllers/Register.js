import {
    Validator,
    Email,
    MinLength,
    MaxLength,
    MatchesField,
    DBUnique,
} from 'com.siteblade.nodejs.www.api';

import {
    ItemsPerPage,
    OrderBy,
    Comparison,
} from 'com.siteblade.nodejs.database.orm';

import { JSON, Enum, FlagsEnum } from 'com.siteblade.util';

import TranslationProvider from '../TranslationProvider.js';

import JWT from '../auth/JWT.js';

import User, { Privileges } from '../database/entities/User.js';

import CORS from '../CORS.js';

import bcryptNS from 'bcryptjs';

import Multer from 'multer';

export default class RegisterController {
    constructor(eApp) {
        // begin Validator
        this.validator = new Validator({
            fields: {
                netid: [
                    MinLength(3),
                    MaxLength(25),
                    DBUnique(User, 'netId', {
                        message: 'validation.user.unavailableNetworkId',
                    }),
                ],
                email: [
                    Email({
                        message: 'validation.user.invalidEmail',
                    }),
                    MaxLength(255),
                    DBUnique(User, 'email', {
                        message: 'validation.user.unavailableEmail',
                    }),
                ],
                password: [
                    MinLength(8),
                    MaxLength(255),
                    MatchesField('passwordconfirmation', {
                        message: 'validation.user.passwordsDoNotMatch',
                    }),
                ],
                passwordconfirmation: [],
            },
            steps: [
                async (fields, report) => {
                    let user = await User.add({
                        netId: fields.netid,
                        email: fields.email,
                        passwordHash: await bcryptNS.hash(fields.password, 10),
                        privileges: undefined,
                    });
                    return user;
                },
            ],
        });
        // end Validator

        eApp.post('register', CORS.all(), Multer().none(), this.validator.eMiddleware(TranslationProvider), async (req, res) => {
            let user = req.validationResult;
            res.end(JSON.stringify({
                user: user.toJSON(),
                token: JWT.generate(user, true),
            }));
        });
    }
}