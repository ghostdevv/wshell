import { exec, Process } from 'ags/process';
import { createPoll } from 'ags/time';
import { format } from 'date-fns';
import System from 'system';

export const now = createPoll(new Date(), 500, () => {
	const now = new Date();

	if (now.getMinutes() % 10 === 0) {
		System.clearDateCaches();
	}

	return now;
});

export const displayTime = now.as((now) => format(now, 'HH:mm:ss'));
export const displayDate = now.as((now) => format(now, 'do MMMM yyyy'));
