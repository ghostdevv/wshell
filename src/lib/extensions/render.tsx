import type { Child } from '$lib/common';

type RenderProps<P> = {
	this: (props: P) => Child;
} & P;

export function Render<P>(props: RenderProps<P>) {
	const This = props.this;
	// @ts-expect-error ts is wrong
	return <This {...props} />;
}
