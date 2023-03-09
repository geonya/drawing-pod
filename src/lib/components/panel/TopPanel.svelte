<script lang="ts">
	import Icon from '../Icon.svelte'
	import { getContext, onMount } from 'svelte'
	import { MOTION_CONTEXT_KEY } from '$lib/constants'
	import type { IMotionContext } from '$lib/types'
	let saveProgress = 0

	const onDownload = () => {}
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

	onMount(() => {})
</script>

<svelte:window on:keydown={onKeyDown} on:keyup={onKeyUp} />
<div
	class="col-span-5 flex h-10 w-full items-center justify-evenly rounded-full border border-base-400 backdrop-blur-md"
>
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
	<button id="다운로드" on:click={() => onDownload()}>
		<Icon name="download" />
	</button>
	<button id="저장" class="relative" on:click={() => onSave()}>
		{#if saveProgress >= 1.0}<div
				class="absolute -right-16 top-0 grid h-5 w-16 place-content-center rounded-full border border-green-500 px-1 text-green-500 shadow-sm"
			>
				<span class="text-xs">자동 저장 완료!</span>
			</div>{/if}
		<div
			class="absolute -top-5 -right-3 z-10 h-2.5 w-11 overflow-hidden rounded-full border text-xs"
		>
			<div class="h-full bg-green-500" style="width: {saveProgress * 100}%" />
		</div>
		<Icon name="save" class="h-5 w-5 transition-all duration-500 ease-in-out hover:scale-110" />
	</button>
</div>

<style>
</style>
