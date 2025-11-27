export interface Config {
	surfaces: {
		bar: {
			left?: string[];
			center?: string[];
			right?: string[];
		};
	};
}

export async function loadConfig(): Promise<Config> {
	return {
		surfaces: {
			bar: {
				left: ['niri:workspaces', 'desktop:tray'],
				center: ['wshell:clock'],
				right: [
					'desktop:privacy',
					'system:vitals',
					'wshell:indicators',
				],
			},
		},
	};
}

export const config = await loadConfig();
