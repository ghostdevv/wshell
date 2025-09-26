import { execAsync } from 'ags/process';

export async function notify(
	message: string,
	type?: 'low' | 'normal' | 'critical',
) {
	await execAsync(['notify-send', type ? `--urgency=${type}` : '', message]);
}
