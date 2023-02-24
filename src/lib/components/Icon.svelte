<script lang="ts">
	export let name: string;

	interface IIcon {
		name: string;
		svg: string;
	}
	let icons: IIcon[] = [
		{
			name: 'movingFoword',
			svg: `<g
							clip-path="url(#a)"
							stroke="currentColor"
							stroke-width="1.25"
							stroke-linecap="round"
							stroke-linejoin="round"
							><path
								fill-rule="evenodd"
								clip-rule="evenodd"
								d="M6.944 12.5H12.5v1.389a1.389 1.389 0 0 1-1.389 1.389H5.556a1.389 1.389 0 0 1-1.39-1.39V8.334a1.389 1.389 0 0 1 1.39-1.389h1.388"
								fill="currentColor"
							/><path
								d="M13.889 4.167H8.333c-.767 0-1.389.621-1.389 1.389v5.555c0 .767.622 1.389 1.39 1.389h5.555c.767 0 1.389-.622 1.389-1.389V5.556c0-.768-.622-1.39-1.39-1.39Z"
							/></g
						><defs><clipPath id="a"><path fill="#fff" d="M0 0h20v20H0z" /></clipPath></defs>`,
		},
		{
			name: 'movingBackward',
			svg: `<g
						clip-path="url(#a)"
						stroke="currentColor"
						stroke-width="1.25"
						stroke-linecap="round"
						stroke-linejoin="round"
						><path
							d="M13.889 4.167H8.333c-.767 0-1.389.622-1.389 1.389v5.555c0 .767.622 1.389 1.39 1.389h5.555c.767 0 1.389-.622 1.389-1.389V5.556c0-.767-.622-1.39-1.39-1.39Z"
							fill="currentColor"
						/><path
							d="M12.5 12.5v1.389a1.389 1.389 0 0 1-1.389 1.389H5.556a1.389 1.389 0 0 1-1.39-1.39V8.334a1.389 1.389 0 0 1 1.39-1.389h1.388"
						/></g
					><defs><clipPath id="a"><path fill="#fff" d="M0 0h20v20H0z" /></clipPath></defs>`,
		},
		{
			name: 'storage',
			svg: `<path
		stroke-linecap="round"
		stroke-linejoin="round"
		d="M7.875 14.25l1.214 1.942a2.25 2.25 0 001.908 1.058h2.006c.776 0 1.497-.4 1.908-1.058l1.214-1.942M2.41 9h4.636a2.25 2.25 0 011.872 1.002l.164.246a2.25 2.25 0 001.872 1.002h2.092a2.25 2.25 0 001.872-1.002l.164-.246A2.25 2.25 0 0116.954 9h4.636M2.41 9a2.25 2.25 0 00-.16.832V12a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 12V9.832c0-.287-.055-.57-.16-.832M2.41 9a2.25 2.25 0 01.382-.632l3.285-3.832a2.25 2.25 0 011.708-.786h8.43c.657 0 1.281.287 1.709.786l3.284 3.832c.163.19.291.404.382.632M4.5 20.25h15A2.25 2.25 0 0021.75 18v-2.625c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125V18a2.25 2.25 0 002.25 2.25z"
	/>`,
		},
	];
	let displayIcon = icons.find((e: IIcon) => e.name === name);
</script>

{#if displayIcon}
	<svg
		class={'h-6 w-6 ' + $$props.class}
		aria-hidden="true"
		focusable="false"
		role="img"
		viewBox="0 0 20 20"
		fill="none"
		stroke="currentColor"
		stroke-linecap="round"
		stroke-linejoin="round">{@html displayIcon.svg}</svg
	>
{/if}
