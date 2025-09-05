import style from './style.scss';
import app from 'ags/gtk4/app';
import Bar from './bar/Bar';

app.start({
	css: style,
	main() {
		app.get_monitors().map(Bar);
	},
});
