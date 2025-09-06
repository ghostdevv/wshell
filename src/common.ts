export function getIconByPercent(percent: number, icons: string[]): string {
	// Clamp the percentage between 0 and 1
	const clampedPercent = Math.max(0, Math.min(1, percent));

	// Calculate the index (0 to icons.length - 1)
	const index = Math.floor(clampedPercent * icons.length);

	// Handle edge case where percent is exactly 1.0
	const safeIndex = Math.min(index, icons.length - 1);

	return icons[safeIndex];
}

export function fmtPercent(percent: number): string {
	return `${Math.floor(percent * 100)}%`;
}
