import { execAsync } from 'ags/process';

interface Options {
	title?: string;
	message: string;
	type?: string;
}

export async function notify(options: Options) {
	const args = [
		'notify-send',
		options.title,
		options.message,
		`--urgency=${options.type ?? 'normal'}`,
	];

	await execAsync(
		args.filter(
			(arg): arg is string => typeof arg === 'string' && arg.length > 0,
		),
	);
}
