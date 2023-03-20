<script lang="ts">
	import Icon from '../Icon.svelte'
	import { saveProgress } from '$lib/store'
	import { ActionType, ObjectType } from '$lib/types'
	import { action, control, renderer } from '$lib/components/canvas/canvas.store'
	import type { SupabaseClient } from '@supabase/supabase-js'

	let canvasClearAlertModal = false
	export let supabase: SupabaseClient

	async function onSaveInCloud() {
		$control?.onSave()
		const {
			data: { user },
		} = await supabase.auth.getUser()
		const canvasData = $control?.getCanvasJSON()
		if (!user || !canvasData) return
		const { data, error: canvasIdError } = await supabase
			.from('canvas')
			.select('id')
			.eq('user', user.id)
		if (canvasIdError || !data) {
			console.error(canvasIdError)
			return
		}
		const canvasId = data[0].id
		if (canvasId) {
			const { error } = await supabase
				.from('canvas')
				.update({ data: canvasData })
				.eq('id', canvasId)
			if (error) {
				console.error(error)
			}
			return
		}
		const { error } = await supabase.from('canvas').insert({
			data,
			user: user?.id,
		})
		if (error) {
			console.error(error)
		}
	}
</script>

<div
	class="absolute top-0 left-1/2 hidden h-10 w-2/3 -translate-x-1/2 items-center justify-evenly rounded-full border border-base-400 backdrop-blur-md lg:flex"
>
	<button id="자물쇠" on:click={() => $control?.onLockCanvas()}>
		<Icon name="lock" class="h-5 w-5 transition-all duration-500 ease-in-out hover:scale-110" />
	</button>
	<button id="마우스" on:click={() => ($action = ActionType.DEFAULT)}>
		<Icon name="mouse" class="h-5 w-5 transition-all duration-500 ease-in-out hover:scale-110" />
	</button>
	<button id="손" on:click={() => ($action = ActionType.DRAG)}>
		<Icon name="hand" class="h-5 w-5 transition-all duration-500 ease-in-out hover:scale-110" />
	</button>
	<button
		id="네모 cursor-pointer"
		class="select-none"
		on:click={() => {
			$renderer?.onAddRectnText()
		}}
	>
		<Icon
			name="rectangle"
			class="h-5 w-5 transition-all duration-500 ease-in-out hover:scale-110"
		/>
	</button>
	<button id="원" on:click={() => $renderer?.onAddCirclenText()}>
		<Icon name="circle" class="h-5 w-5 transition-all duration-500 ease-in-out hover:scale-110" />
	</button>
	<button id="연필" on:click={() => ($action = ActionType.PENCIL)}>
		<Icon name="pencil" class="h-5 w-5 transition-all duration-500 ease-in-out hover:scale-110" />
	</button>
	<button id="브러쉬" on:click={() => ($action = ActionType.BRUSH)}>
		<Icon name="brush" class="h-5 w-5 transition-all duration-500 ease-in-out hover:scale-110" />
	</button>
	<button id="라인" on:click={() => ($action = ActionType.LINE)}>
		<Icon
			name="stickyLine"
			class="h-5 w-5 transition-all duration-500 ease-in-out hover:scale-110"
		/>
	</button>
	<input
		name="image-upload"
		id="imageUpload"
		type="file"
		accept="image/*"
		class="hidden"
		on:change={(e) => $renderer?.onAddImage(e)}
	/>
	<button
		id="텍스트"
		on:click={() => $renderer?.onMakeObject(ObjectType.TEXT)}
		class="select-none pt-1 transition-all duration-500 ease-in-out hover:scale-110"
	>
		<span class="text-2xl font-bold">T</span>
	</button>
	<label for="imageUpload" class="grid cursor-pointer place-content-center">
		<button class="사진 업로드 pointer-events-none ">
			<Icon name="upload" class="transition-all duration-500 ease-in-out hover:scale-110" />
		</button>
	</label>
	<button class="쓰레기통" on:click={() => $control?.onDelete()}>
		<Icon name="trash" class="h-5 w-5 transition-all duration-500 ease-in-out hover:scale-110" />
	</button>
	<button id="다운로드" on:click={() => $control?.onDownloadAsSVG()}>
		<Icon name="download" class="h-5 w-5 transition-all duration-500 ease-in-out hover:scale-110" />
	</button>
	<button id="저장" class="relative" on:click={async () => await onSaveInCloud()}>
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
		<div class="absolute top-5 left-0.5 text-xs">저장</div>
	</button>
	<button id="전체 삭제" on:click={() => (canvasClearAlertModal = true)}>
		<Icon name="clear" class="h-5 w-5 transition-all duration-500 ease-in-out hover:scale-110" />
	</button>
</div>
{#if canvasClearAlertModal}
	<button
		class="fixed inset-0 z-10 h-full w-full"
		on:click={() => (canvasClearAlertModal = false)}
	/>
	<div
		class="fixed top-1/2 left-1/2 z-20 flex h-24 w-48 -translate-x-1/2 -translate-y-1/2 flex-col items-center justify-center space-y-3 rounded-md border border-base-400 shadow-lg backdrop-blur-md"
	>
		<h3>정말로 전부 삭제하시겠습니까?</h3>
		<div class="flex w-full items-center justify-around">
			<button
				class="rounded-md border border-base-600 px-2 py-1 text-center shadow-sm hover:bg-base-200"
				on:click={() => {
					$control?.onCanvasClear()
					canvasClearAlertModal = false
				}}>Yes</button
			>
			<button
				class="rounded-md border border-base-600 px-2 py-1 text-center shadow-sm hover:bg-base-200"
				on:click={() => (canvasClearAlertModal = false)}>No</button
			>
		</div>
	</div>
{/if}
