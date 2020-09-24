class Theme {
    static all() {
        return [
            Theme.LIGHT,
            Theme.DARK,
        ];
    }

    constructor(options) {
        Theme._byId[options.id] = this;
        this.id = options.id;
        this.rootClasses = options.rootClasses;
        this.cardBackgroundClass = options.cardBackgroundClass;
        this.navbarClasses = options.navbarClasses;
    }

    toString() {
        return this.id;
    }
}

const ThemeProxy = new Proxy(Theme, {
    apply: function(target, thisArg, argumentsList) {
        return Theme._byId[argumentsList[0]];
    },
});

export { ThemeProxy as Theme };;

Theme._byId = {};

Theme.LIGHT = new Theme({
    id: 'light',
    rootClasses: ['JavaDocTheme', 'bg-white'],
    cardBackgroundClass: 'bg-white',
    navbarClasses: ['bg-dark', 'navbar-dark'],
});

Theme.DARK = new Theme({
    id: 'dark',
    rootClasses: ['JavaDocTheme', 'bg-dark'],
    cardBackgroundClass: 'bg-dark',
    navbarClasses: ['bg-dark', 'navbar-dark'],
});