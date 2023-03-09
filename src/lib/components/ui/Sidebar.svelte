<script context="module" lang="ts">
	export let sidebarKey = Symbol()
</script>

<script lang="ts">
	import { ObjectType, PaintType } from '$lib/types'
	import { stringRgbaToHex } from '$lib/utils'
	import { fly } from 'svelte/transition'
	import Icon from '../Icon.svelte'
	import Palette from '../palette/Palette.svelte'
	export let fill: string | null
	export let stroke: string | null
	export let type: ObjectType | null
	export let strokeWidth: number | null
	$: fillHex = fill ? stringRgbaToHex(fill) : ''
	$: strokeHex = stroke ? stringRgbaToHex(stroke) : ''
	$: whichPalette = fill ? PaintType.FILL : PaintType.STROKE
	$: {
		if (type) {
			if (type === ObjectType.PATH) {
				whichPalette = PaintType.STROKE
			} else if (type === ObjectType.IMAGE) {
				whichPalette = PaintType.STROKE
			}
		}
	}
</script>

<nav
	transition:fly={{ x: -200, duration: 500 }}
	class="fixed top-24 left-8 z-10 h-full max-h-[600px] w-64 rounded-md border border-base-400 shadow-md backdrop-blur-lg md:block"
>
	<div class="scroll-none scroll scrollbar-hide relative h-full w-full">
		<div class="컨트롤 박스">
			{#if fill && whichPalette === PaintType.FILL && type !== ObjectType.PATH}
				<Palette color={fill} type={PaintType.FILL} />
			{/if}
			{#if stroke && whichPalette === PaintType.STROKE}
				<Palette color={stroke} type={PaintType.STROKE} />
			{/if}
			<div class="컬러리뷰박스 space-y-2 px-2">
				{#if fill && type !== ObjectType.PATH && type !== ObjectType.IMAGE}
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
				{/if}
				{#if stroke}
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
							{#if strokeWidth !== null && strokeWidth >= 0}
								<input
									id="stroke"
									value={strokeHex}
									type="text"
									class="input max-h-7 w-full rounded-md border px-2"
									disabled
								/>
							{/if}
						</div>
					</div>
					<div id="선두께">
						<label for="strokeWidth">
							<span class="">두께</span>
						</label>
						<div class="grid grid-flow-col items-center gap-2 ">
							<button
								class={'샘플컬러 h-7 w-7 rounded-md border-2'}
								style="border-color:{stroke};"
							/>
							<div class="flex justify-end space-x-2">
								<input
									id="strokeWidth"
									bind:value={strokeWidth}
									type="number"
									class="input w-16 rounded-md border bg-white bg-opacity-40   px-2 text-center"
								/>
								<span>px</span>
							</div>
						</div>
					</div>
				{/if}
			</div>
		</div>
		<div class="flex h-full justify-around">
			<button class="앞으로" on:click={() => 'handleBringForward'}>
				<Icon name="forward" />
			</button>
			<button class="뒤로" on:click={() => 'handleBringForward'}> <Icon name="backward" /></button>
		</div>
	</div>
</nav>
