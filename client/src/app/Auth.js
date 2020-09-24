import {
    User
} from '/app/models/User';

import {
    writable
} from 'svelte/store';

import {
    AnimationTimer
} from 'animation-timer';

export {
    User
};

export const Auth = {

    user: writable(null),

    _current: null,

    _currentToken: '',

    get currentUserToken() {
        return this._currentToken;
    },

    /**
     * @returns {Boolean} Whether the authenticated user updated.
     */
    loadCurrentUser() {
        let storage = sessionStorage['auth.token'] ? sessionStorage : localStorage;
        let token = storage['auth.token'];
        let updated = false;
        if (token) {
            let id = storage['auth.id'];
            if (Auth._current && Auth._current.displayName == id)
                return false;
            Auth._current = new User({
                id,
                netId: storage['auth.netId'],
                privileges: storage['auth.privileges'],
                createdAt: storage['auth.createdAt'],
            });
            Auth._currentToken = token;
            updated = true;
        }
        else updated = !!Auth._current, Auth._current = null;

        if (updated) Auth.user.set(Auth._current);

        return updated;
    },

    /**
     * @param {Boolean} remember 
     */
    saveCurrentUser(user = null, token = '', remember = true) {
        user = user || Auth._current;
        Auth._current = user;
        if (!user) return;

        let storage = remember ? localStorage : sessionStorage;
        storage['auth.token'] = token;
        storage['auth.id'] = user.id;
        storage['auth.netId'] = user.netId;
        storage['auth.privileges'] = user.privileges.toString();
        storage['auth.createdAt'] = String(user.createdAt.valueOf());
        Auth.user.set(user);
    },

    /** */
    clearCurrentUser() {
        let keys = [
            'auth.token',
            'auth.id',
            'auth.netId',
            'auth.privileges',
            'auth.createdAt',
        ];
        for (let key of keys)
            delete localStorage[key];
        for (let key of keys)
            delete sessionStorage[key];
        Auth._current = null;
        Auth._currentToken = '';
        Auth.user.set(null);
    },
};

if (typeof document == 'object') {
    Auth.loadCurrentUser();
    (new AnimationTimer)
        .duration(500)
        .on('loop', () => Auth.loadCurrentUser())
        .loop();
}