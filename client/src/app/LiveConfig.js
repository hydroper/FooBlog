import {
    writable
} from 'svelte/store';

import {
    Theme
} from '/app/Theme';

// Initial theme

let initialTheme = null;

if (typeof document == 'object') {
    let id = sessionStorage['config.theme'];
    initialTheme = id ? Theme(id) : Theme.LIGHT;
}
else initialTheme = Theme.LIGHT;

// LiveConfig

export const LiveConfig = {
    theme: writable(initialTheme),
};

if (typeof document == 'object') {
    LiveConfig.theme.subscribe(value => {
        sessionStorage['config.theme'] = value.toString();
    });
}