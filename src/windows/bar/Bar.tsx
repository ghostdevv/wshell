import { extensions } from 'src/extensions/extensions';
import { sortExtensions } from '$lib/extensions/bar';
import { Astal, Gtk, type Gdk } from 'ags/gtk4';
import { Render } from '$lib/extensions/render';
import app from 'ags/gtk4/app';

const barExtensions = sortExtensions(extensions);

export default function Bar(props: { monitor: Gdk.Monitor }) {
	const { TOP, LEFT, RIGHT } = Astal.WindowAnchor;
	return (
		<window
			visible
			name="bar"
			class="bar"
			gdkmonitor={props.monitor}
			exclusivity={Astal.Exclusivity.EXCLUSIVE}
			anchor={TOP | LEFT | RIGHT}
			application={app}
		>
			<centerbox cssName="centerbox">
				<box $type="start" halign={Gtk.Align.END} spacing={8}>
					{barExtensions.left.map((extension) => (
						<Render
							this={extension.render}
							monitor={props.monitor}
						/>
					))}
				</box>

				<box $type="center" halign={Gtk.Align.END}>
					{barExtensions.center.map((extension) => (
						<Render
							this={extension.render}
							monitor={props.monitor}
						/>
					))}
				</box>

				<box $type="end" halign={Gtk.Align.END} spacing={8}>
					{barExtensions.right.map((extension) => (
						<Render
							this={extension.render}
							monitor={props.monitor}
						/>
					))}
				</box>
			</centerbox>
		</window>
	) as Astal.Window;
}
