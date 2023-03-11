<script lang="ts">
	import Icon from '../ui/Icon.svelte'
	import { motion, saveProgress, control, renderer } from '$lib/store'
	import { MotionState } from '$lib/types'

	const onFreeDrawingStart = () => {
		$motion?.onChangeMotionState(MotionState.DRAWING)
	}
</script>

<div
	class="col-span-5 flex h-10 w-full items-center justify-evenly rounded-full border border-base-400 backdrop-blur-md"
>
	<button id="자물쇠">
		<Icon name="lock" />
	</button>
	<button id="마우스" on:click={() => $motion?.onCursorMove()}>
		<Icon name="mouse" />
	</button>
	<button id="손" on:click={() => $motion?.onChangeMotionState(MotionState.DRAGGING)}>
		<Icon name="hand" />
	</button>
	<button id="네모 cursor-pointer" on:click={() => $renderer?.onAddRect()}>
		<Icon name="rectangle" />
	</button>
	<button id="원" on:click={() => $renderer?.onAddCircle()}>
		<Icon name="circle" />
	</button>
	<button id="연필" on:click={onFreeDrawingStart}>
		<Icon name="pencil" />
	</button>
	<input
		name="image-upload"
		id="imageUpload"
		type="file"
		accept="image/*"
		class="hidden"
		on:change={(e) => $renderer?.onAddImage(e)}
	/>
	<button id="텍스트" on:click={() => $renderer?.onTextAdd()} class="select-none pt-1">
		<span class="text-2xl font-bold">T</span>
	</button>
	<label for="imageUpload" class="grid cursor-pointer place-content-center">
		<button class="사진 업로드 pointer-events-none ">
			<Icon name="upload" />
		</button>
	</label>
	<button class="쓰레기통" on:click={() => $control?.onDelete()}>
		<Icon name="trash" />
	</button>
	<button id="다운로드" on:click={() => $control?.onDownloadAsSVG()}>
		<Icon name="download" />
	</button>
	<button id="저장" class="relative" on:click={() => $control?.onSave()}>
		<div class="absolute -top-6 -right-3 z-10 h-3 w-12 overflow-hidden rounded-full border text-xs">
			{#if $saveProgress >= 1.0}
				<div class="flex h-full items-center justify-center bg-green-500" style="width:100%">
					<span class="text-xs text-white">Save!</span>
				</div>
			{:else}
				<div class="h-full bg-green-500" style="width: {$saveProgress * 100}%" />
			{/if}
		</div>
		<Icon name="save" class="h-5 w-5 transition-all duration-500 ease-in-out hover:scale-110" />
	</button>
</div>

<style>
</style>
