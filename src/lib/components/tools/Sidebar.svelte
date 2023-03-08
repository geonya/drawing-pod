<script lang="ts">
	import { PaintType } from '$lib/types';
	import { fade, fly } from 'svelte/transition';
	import { ColorRender } from '../..';
	import type { Render } from '../canvas/Render';
	import Icon from '../Icon.svelte';
	import Palette from '../palette/Palette.svelte';
	export let render: Render;
	let fill: string | null = render.fill;
	let stroke: string | null = render.stroke;
	let whichPalette: PaintType | null = null;
</script>

<ColorRender bind:fill bind:stroke {render}>
	<nav
		transition:fly={{ x: -200, duration: 500 }}
		class="fixed top-24 left-8 z-10 h-full max-h-[600px] w-64 rounded-md border shadow-md backdrop-blur md:block"
	>
		<div class="scroll-none scroll scrollbar-hide relative h-full w-full overflow-y-auto">
			<div class="컨트롤 박스 p-3">
				{#if fill && whichPalette === PaintType.FILL}
					<div transition:fade={{ duration: 200 }}>
						<Palette color={fill} type={PaintType.FILL} />:
						<button
							on:click={() => (whichPalette = null)}
							class="absolute top-0 left-0 h-full w-full"
						/>
					</div>
				{/if}
				{#if stroke && whichPalette === PaintType.STROKE}
					<div transition:fade={{ duration: 200 }}>
						<Palette color={stroke} type={PaintType.STROKE} />
						<button
							on:click={() => (whichPalette = null)}
							class="absolute top-0 left-0 h-full w-full"
						/>
					</div>
				{/if}
				{#if stroke && fill}
					<div class="채우기">
						<label for={PaintType.FILL}>
							<span class="">채우기</span>
						</label>
						<div class="grid grid-flow-col items-center gap-2">
							<button
								class="샘플컬러 h-7 w-7 rounded-md "
								style="background-color:{fill};"
								on:click={() => (whichPalette = PaintType.FILL)}
							/>:
							<input id="fill" type="text" class="input max-h-7 w-full rounded-md border px-2" />
						</div>
					</div>

					<div class="선">
						<label for="stroke">
							<span class="">선</span>
						</label>
						<div class="grid-flow--col grid items-center gap-2">
							<button
								class="샘플컬러 h-7 w-7 rounded-md"
								style="background-color:{stroke};"
								on:click={() => (whichPalette = PaintType.STROKE)}
							/>
							<input id="stroke" type="text" class="input max-h-7 w-full rounded-md border px-2" />
						</div>
					</div>
				{/if}
			</div>
			<div class="flex h-full justify-around">
				<button class="앞으로" on:click={() => 'handleBringForward'}>
					<Icon name="forward" />
				</button>
				<button class="뒤로" on:click={() => 'handleBringForward'}>
					<Icon name="backward" /></button
				>
			</div>
		</div>
	</nav>
</ColorRender>
