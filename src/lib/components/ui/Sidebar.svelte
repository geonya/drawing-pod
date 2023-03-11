<script lang="ts">
	import { ObjectType, PaintType } from '$lib/types'
	import { stringRgbaToHex } from '$lib/utils'
	import { fly } from 'svelte/transition'
	import Icon from './Icon.svelte'
	import Palette from '../palette/Palette.svelte'
	import { shape } from '../canvas/Renderer'
	import { control } from '$lib/store'
	let fill: string | null = $shape?.fill ?? null
	let stroke: string | null = $shape?.stroke ?? null
	let objectType: ObjectType | null = $shape?.objectType ?? null
	let strokeWidth: number | null = $shape?.strokeWidth ?? null

	$: fillHex = fill ? stringRgbaToHex(fill) : ''
	$: strokeHex = stroke ? stringRgbaToHex(stroke) : ''
	$: whichPalette = fill ? PaintType.FILL : PaintType.STROKE
	$: {
		if (objectType) {
			if (objectType === ObjectType.PATH) {
				whichPalette = PaintType.STROKE
			} else if (objectType === ObjectType.IMAGE) {
				whichPalette = PaintType.STROKE
			}
		}
	}
	const onColorUpdate = (e: CustomEvent) => {
		const { color, paintType } = e.detail
		$shape = { ...$shape, [paintType]: color }
		if (paintType === PaintType.FILL) {
			fill = color
		} else if (paintType === PaintType.STROKE) {
			stroke = color
		}
	}
	const onUpdateStorkeWidth = () => {
		$shape = { ...$shape, strokeWidth }
	}
</script>

<nav
	transition:fly={{ x: -200, duration: 500 }}
	class="fixed top-24 left-8 z-40 w-64 rounded-md border text-xs shadow-md backdrop-blur-md md:block"
>
	<div class="scroll-none scroll scrollbar-hide relative h-full w-full">
		<div class="컨트롤 박스">
			{#if fill && whichPalette === PaintType.FILL && objectType !== ObjectType.PATH}
				<Palette paintType={PaintType.FILL} on:colorUpdate={onColorUpdate} />
			{/if}
			{#if stroke && whichPalette === PaintType.STROKE}
				<Palette paintType={PaintType.STROKE} on:colorUpdate={onColorUpdate} />
			{/if}
			<div class="컬러리뷰박스 space-y-2 px-2">
				{#if fill && objectType !== ObjectType.PATH && objectType !== ObjectType.IMAGE}
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
									on:input={onUpdateStorkeWidth}
								/>
								<span>px</span>
							</div>
						</div>
					</div>
				{/if}
			</div>
		</div>
		<div class="flex w-full justify-around py-3 text-xs">
			<button id="위로" class="" on:click={() => $control?.onBringForward()}>
				<span>위로</span>
				<Icon name="forward" />
			</button>
			<button id="밑으로" on:click={() => $control?.onSendBackward()}>
				<span>밑으로</span> <Icon name="backward" /></button
			>
		</div>
	</div>
</nav>
