export class PagePreloader {
    constructor(regex, callback) {
        this.regex = regex;
        this.callback = callback;
        this.cancel = null;
        PagePreloader._all.push(this);
    }

    static async preload(to) {
        to = String(to);
        to = to.startsWith('/') ? to.slice(1) : to;

        PagePreloader.UI.begin();

        if (PagePreloader._current)
            PagePreloader._current.cancel(),
            PagePreloader._current = null;

        const url = new URL(`${window.location.protocol}//${window.location.host}/${to}`);
        let anyMatch = false;
        for (let p of PagePreloader._all) {
            let regex = new RegExp(`^${p.regex.source}$`, p.regex.flags);
            let m = url.pathname.slice(1).match(regex);
            if (m) {
                anyMatch = true;
                PagePreloader._current = p;
                try {
                    await p.callback.apply(p, m);
                }
                catch (e) {
                    PagePreloader._current = null;
                    PagePreloader.UI.end();
                    throw e;
                }
                finally {
                    PagePreloader._current = null;
                }
                break;
            }
        }

        PagePreloader.UI.end();

        await new Promise(resolve => {
            setTimeout(resolve, 200);
        });
    }
}

PagePreloader.UI = class UI {
    static get progressBar() {
        return PagePreloader.UI._progressBar =
            PagePreloader.UI._progressBar || document.body.querySelector('main #pageProgressBar');
    }

    static begin() {
        let bar = PagePreloader.UI.progressBar;
        if (bar)
            bar.style.width = '0%',
            bar.style.display = 'block';
    }

    static setProgress(ratio) {
        let bar = PagePreloader.UI.progressBar;
        if (bar)
            bar.style.width = Math.round(ratio * 100) + '%';
    }

    static end() {
        let bar = PagePreloader.UI.progressBar;
        if (bar)
            bar.style.width = '0%',
            bar.style.display = 'none';
    }
};

PagePreloader.UI._progressBar = null;

PagePreloader.data = null;

PagePreloader._current = null;
PagePreloader._all = [];