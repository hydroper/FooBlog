import { createFlagsEnum } from 'com.siteblade.util';
import { writable } from 'svelte/store';
import { AnimationTimer } from 'animation-timer';

let requiredProperties = [
    'token', 'displayName', 'privileges',
];

export class User {
    constructor(description = {}) {
        this._token = '';
        this._displayName = '';
        this._privileges = null;

        for (var name of requiredProperties)
            if (description[name] === undefined)
                throw new Error('User.' + name + ' must be specified.');

        this.token = description.token;
        this.displayName = description.displayName;
        this.privileges = description.privileges;
    }

    /**
     * @type {String}
     */
    get token() {
        return this._token;
    }

    set token(value) {
        this._token = String(value);
    }

    /**
     * @type {String}
     */
    get displayName() {
        return this._displayName;
    }

    set displayName(value) {
        this._displayName = String(value);
    }

    /**
     * @type {Number}
     */
    get privileges() {
        return this._privileges;
    }

    set privileges(value) {
        this._privileges = Privileges(value);
    }
}

export const Privileges = createFlagsEnum('Privileges', [
    ['MODERATOR', 16],
    ['ADMINISTRATOR', 32],
]);

export const Auth = {

    user: writable(null),

    _current: null,

    /**
     * @returns {Boolean} Whether the authenticated user updated.
     */
    loadCurrentUser() {
        let storage = sessionStorage['auth.token'] ? sessionStorage : localStorage;
        let token = storage['auth.token'];
        let updated = false;
        if (token) {
            let displayName = storage['auth.displayName'];
            if (Auth._current && Auth._current.displayName == displayName)
                return false;
            Auth._current = new User({
                token,
                displayName,
                privileges: storage['auth.privileges'],
            });
            updated = true;
        }
        else {
            updated = !!Auth._current;
            Auth._current = null;
        }
        if (updated)
            Auth.user.set(Auth._current);
        return updated;
    },

    /**
     * @param {Boolean} remember 
     */
    saveCurrentUser(user = null, remember = true) {
        user = user || Auth._current;
        Auth._current = user;
        if (!user)
            return;
        let storage = remember ? localStorage : sessionStorage;
        storage['auth.token'] = user.token;
        storage['auth.displayName'] = user.displayName;
        storage['auth.privileges'] = user.privileges.toString();
        Auth.user.set(user);
    },

    /** */
    clearCurrentUser() {
        let keys = [
            'auth.token',
            'auth.displayName',
            'auth.privileges',
        ];
        for (let key of keys)
            delete localStorage[key];
        for (let key of keys)
            delete sessionStorage[key];
        Auth._current = null;
        Auth.user.set(null);
    },
};

Auth.loadCurrentUser();

if (typeof document == 'object') {
    (new AnimationTimer)
        .duration(2000)
        .on('loop', () => {
            Auth.loadCurrentUser();
        })
        .loop();
}