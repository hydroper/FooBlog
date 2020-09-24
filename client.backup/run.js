import Sirv from 'sirv';
import Polka from 'polka';

const assets1 = Sirv('public', {
    maxAge: 31536000,
    immutable: true,
    single: true,
});

const assets2 = Sirv('assets');
const assets3 = Sirv('build');

const app = Polka();
app.use('assets', assets2);
app.use(assets1);
app.use(assets3);
app.listen(3000);
console.log(`Listening on localhost:${3000}`);