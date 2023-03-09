<script lang="ts">
	import { PaintType } from '$lib/types';
	import { stringRgbaToHex } from '$lib/utils';
	import { fly } from 'svelte/transition';
	import { ColorRender } from '../..';
	import Icon from '../Icon.svelte';
	import Palette from '../palette/Palette.svelte';
	let fill: string | null;
	let stroke: string | null;
	let whichPalette: PaintType | null = PaintType.FILL;
	$: fillHex = fill ? stringRgbaToHex(fill) : '';
	$: strokeHex = stroke ? stringRgbaToHex(stroke) : '';
</script>

<ColorRender bind:fill bind:stroke>
	<nav
		transition:fly={{ x: -200, duration: 500 }}
		class="fixed top-24 left-8 z-10 h-full max-h-[600px] w-64 rounded-md border shadow-md backdrop-blur md:block"
	>
		<div class="scroll-none scroll scrollbar-hide relative h-full w-full">
			<div class="컨트롤 박스">
				{#if fill && whichPalette === PaintType.FILL}
					<Palette color={fill} type={PaintType.FILL} />
				{/if}
				{#if stroke && whichPalette === PaintType.STROKE}
					<Palette color={stroke} type={PaintType.STROKE} />
				{/if}
				{#if stroke && fill}
					<div class="컬러리뷰박스 space-y-2 px-2">
						<div class="채우기">
							<label for={PaintType.FILL}>
								<span class="">채우기</span>
							</label>
							<div class="grid grid-flow-col items-center gap-2">
								<button
									class={'샘플컬러 h-7 w-7 rounded-md ' +
										(whichPalette === PaintType.FILL ? 'ring-2 ring-blue-500' : '')}
									style="background-color:{fill};"
									on:click={() => (whichPalette = PaintType.FILL)}
								/>
								<input
									id="fill"
									type="text"
									value={fillHex}
									class="input max-h-7 w-full rounded-md border px-2"
									disabled
								/>
							</div>
						</div>

						<div class="선">
							<label for="stroke">
								<span class="">선</span>
							</label>
							<div class="grid grid-flow-col items-center gap-2">
								<button
									class={'샘플컬러 h-7 w-7 rounded-md ' +
										(whichPalette === PaintType.STROKE ? 'ring-2 ring-blue-500' : '')}
									style="background-color:{stroke};"
									on:click={() => (whichPalette = PaintType.STROKE)}
								/>
								<input
									id="stroke"
									value={strokeHex}
									type="text"
									class="input max-h-7 w-full rounded-md border px-2"
									disabled
								/>
							</div>
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
