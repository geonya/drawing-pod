<script lang="ts">
	import Icon from '../Icon.svelte'
	import { getContext, onMount } from 'svelte'
	import { AUTO_SAVE_DELAY, CANVAS_DATA, MOTION_CONTEXT_KEY } from '$lib/constants'
	import { canvas } from '$lib/store'
	import type { IMotionContext } from '$lib/types'
	let saveProgress: number = 0

	const saveTimer = (m: number) => {
		let saveTimerId: ReturnType<typeof requestAnimationFrame>
		let start: number | null = null
		const loop = (timestamp: number) => {
			if (!start) start = timestamp
			const elapsed = timestamp - start
			const progress = (elapsed / m) * 1.1
			if (progress <= 1) {
				requestAnimationFrame(loop)
			}
			saveProgress = progress
		}
		saveTimerId = requestAnimationFrame(loop)
		return saveTimerId
	}
	const onIntervalAutoSaveWithTimer = () => {
		let interval: ReturnType<typeof setInterval>
		let saveTimerId: ReturnType<typeof requestAnimationFrame> | null
		saveTimerId = saveTimer(AUTO_SAVE_DELAY)
		interval = setInterval(() => {
			saveTimerId = saveTimer(AUTO_SAVE_DELAY)
		}, AUTO_SAVE_DELAY)
		return () => {
			clearInterval(interval)
			saveTimerId && cancelAnimationFrame(saveTimerId)
		}
	}
	const onAutoSaveInLocalStorage = (canvas: fabric.Canvas) => {
		let interval: ReturnType<typeof setInterval>
		interval = setInterval(() => {
			const json = canvas.toJSON()
			localStorage.setItem(CANVAS_DATA, JSON.stringify(json))
			console.log('canvas data auto saved!')
		}, AUTO_SAVE_DELAY)
		return () => {
			clearInterval(interval)
		}
	}
	const {
		onAddImage,
		onAddRect,
		onAddCircle,
		onHandDraggingStart,
		onCursorMove,
		onDrawing,
		onDelete,
		onSave,
		onKeyDown,
		onKeyUp,
	} = getContext<IMotionContext>(MOTION_CONTEXT_KEY)

	onMount(() => {
		if ($canvas) {
			onIntervalAutoSaveWithTimer()
			onAutoSaveInLocalStorage($canvas)
		}
	})
</script>

<svelte:window on:keydown={onKeyDown} on:keyup={onKeyUp} />
<div class="col-span-5 flex w-full items-center justify-evenly">
	<button id="자물쇠">
		<Icon name="lock" />
	</button>
	<button id="마우스" on:click={() => onCursorMove()}>
		<Icon name="mouse" />
	</button>
	<button id="손" on:click={() => onHandDraggingStart()}>
		<Icon name="hand" />
	</button>
	<button id="네모 cursor-pointer" on:click={() => onAddRect()}>
		<Icon name="rectangle" />
	</button>
	<button id="원" on:click={() => onAddCircle()}>
		<Icon name="circle" />
	</button>
	<button id="연필" on:click={() => onDrawing()}>
		<Icon name="pencil" />
	</button>
	<input
		name="image-upload"
		id="imageUpload"
		type="file"
		accept="image/*"
		class="hidden"
		on:change={onAddImage}
	/>
	<label for="imageUpload" class="grid cursor-pointer place-content-center">
		<button class="사진 업로드 pointer-events-none ">
			<Icon name="upload" />
		</button>
	</label>
	<button class="쓰레기통" on:click={() => onDelete()}>
		<Icon name="trash" />
	</button>
	<button id="저장" class="relative" on:click={() => onSave()}>
		{#if saveProgress >= 1.0}<div
				class="absolute -right-16 top-0 grid h-5 w-16 place-content-center rounded-full border border-green-500 px-1 text-green-500 shadow-sm"
			>
				<span class="text-xs">자동 저장 완료!</span>
			</div>{/if}
		<div
			class="absolute -top-3.5 -right-3 z-10 h-2.5 w-11 overflow-hidden rounded-full border text-xs"
		>
			<div class="h-full bg-green-500" style="width: {saveProgress * 100}%" />
		</div>
		<Icon
			name="save"
			class="stroke-green-500 transition-all duration-500 ease-in-out hover:scale-110"
		/>
	</button>
</div>
