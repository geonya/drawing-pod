<script lang="ts">
	import { ObjectType, PaintType } from '$lib/types'
	import { fly } from 'svelte/transition'
	import Icon from './Icon.svelte'
	import Palette from '../palette/Palette.svelte'

	import { paintType, stringRgbaToHex, outputColor } from '../palette/palette.store'
	import { control, shape } from '../canvas/canvas.store'
	import { INITIAL_RGBA } from '$lib/constants'

	let fill = $shape?.fill
	let stroke = $shape?.stroke
	let objectType = $shape?.objectType
	let strokeWidth = $shape?.strokeWidth ?? 0

	$: fill = $outputColor?.fill
	$: stroke = $outputColor?.stroke
	$: strokeWidth, shape.update((shape) => ({ ...shape, strokeWidth }))
</script>

<nav
	transition:fly={{ x: -200, duration: 500 }}
	class="fixed top-24 left-8 z-40 w-48 rounded-md border text-xs shadow-md backdrop-blur-md md:block"
>
	<div class="scroll-none scroll scrollbar-hide relative h-full w-full">
		<div class="컨트롤 박스">
			{#if $paintType === PaintType.FILL}
				<Palette />
			{/if}
			{#if $paintType === PaintType.STROKE}
				<Palette />
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
									($paintType === PaintType.FILL ? 'ring-2 ring-blue-500' : '')}
								style="background-color:{fill};"
								on:click={() => paintType.set(PaintType.FILL)}
							/>

							<input
								id={PaintType.FILL}
								type="text"
								value={stringRgbaToHex($outputColor?.fill || '').length >= 9
									? stringRgbaToHex($outputColor?.fill || '').slice(0, -2)
									: stringRgbaToHex($outputColor?.fill || '')}
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
									($paintType === PaintType.STROKE ? 'ring-2 ring-blue-500' : '')}
								style="background-color:{stroke};"
								on:click={() => paintType.set(PaintType.STROKE)}
							/>
							{#if strokeWidth !== null}
								<input
									id={PaintType.STROKE}
									value={stringRgbaToHex($outputColor?.stroke || INITIAL_RGBA).length >= 9
										? stringRgbaToHex($outputColor?.stroke || INITIAL_RGBA).slice(0, -2)
										: stringRgbaToHex($outputColor?.stroke || INITIAL_RGBA)}
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
									on:input={() => ($shape = { ...$shape, strokeWidth })}
								/>
								<span>px</span>
							</div>
						</div>
					</div>
				{/if}
			</div>
		</div>
		<div class="flex w-full justify-around py-2 text-xs">
			<button id="위로" class="" on:click={() => $control?.onBringForward()}>
				<span>위로</span>
				<Icon name="forward" />
			</button>
			<button id="밑으로" on:click={() => $control?.onSendBackward()}>
				<span>밑으로</span> <Icon name="backward" /></button
			>
			<button id="그룹" on:click={() => $control?.onBindGroup()}>
				<span>그룹 묶기</span> <Icon name="bind" /></button
			>
			<button id="그룹" on:click={() => $control?.onUnBindGroup()}>
				<span>그룹 풀기</span> <Icon name="unbind" /></button
			>
		</div>
		<div class="flex w-full justify-around py-2 text-xs">
			<button id="좌로정렬" class="" on:click={() => $control?.onAlignLeft()}>
				<span>좌로 정렬</span>
				<Icon name="alignLeft" />
			</button>
			<button id="우로정렬" class="" on:click={() => $control?.onAlignRight()}>
				<span>우로 정렬</span>
				<Icon name="alignRight" />
			</button>
			<button id="중앙정렬" class="" on:click={() => $control?.onAlignCenter()}>
				<span>중앙 정렬</span>
				<Icon name="alignCenter" />
			</button>
		</div>
		<div class="flex w-full justify-around py-2 text-xs">
			<button id="위로정렬" class="" on:click={() => $control?.onAlignTop()}>
				<span>위로 정렬</span>
				<Icon name="alignTop" />
			</button>
			<button id="아래로정렬" class="" on:click={() => $control?.onAlignBottom()}>
				<span>아래로 정렬</span>
				<Icon name="alignBottom" />
			</button>
			<button id="정중앙" class="" on:click={() => $control?.onAlignMiddle()}>
				<span>정중앙 정렬</span>
				<Icon name="alignMiddle" />
			</button>
		</div>
	</div>
</nav>
