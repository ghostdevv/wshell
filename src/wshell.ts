import QuickSettings from './quick-settings/QuickSettings';
import style from './wshell.scss';
import app from 'ags/gtk4/app';
import Bar from './bar/Bar';

app.start({
	css: style,
	instanceName: 'wshell',
	main() {
		app.get_monitors().map(Bar);
		app.get_monitors().map(QuickSettings);
	},
});
