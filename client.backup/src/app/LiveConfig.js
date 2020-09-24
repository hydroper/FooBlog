import cookies from 'browser-cookies';
import { writable } from 'svelte/store';
import { Theme } from '/app/Theme';

// Initial theme

let initialTheme = null;

if (typeof document == 'object') {
    let id = cookies.get('configtheme');
    initialTheme = id ? Theme(id) : Theme.LIGHT;
}
else initialTheme = Theme.LIGHT;

// LiveConfig

export const LiveConfig = {
    theme: writable(initialTheme),
};

if (typeof document == 'object') {
    LiveConfig.theme.subscribe(value => {
        cookies.set('configtheme', value.toString());
    });
}