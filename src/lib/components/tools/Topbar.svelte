<script lang="ts">
	import Icon from '../Icon.svelte';
	import { MotionRender } from '$lib';
	import type { Render } from '../canvas/Render';
	import { MotionState } from '$lib/types';
	import type { Controller } from '../canvas/Controller';
	import { onMount } from 'svelte';
	import { canvas, motionState } from '$lib/store';
	export let controller: Controller;
	export let render: Render;
	const onRectAdd = () => {
		render.onAddRect();
	};
	const onCircleAdd = () => {
		render.onAddCircle();
	};
	const onHandDragging = () => {
		$motionState = MotionState.DRAGGING;
	};
	const onCursorMove = () => {
		$motionState = MotionState.DEFAULT;
	};
	const onDrawing = () => {
		$motionState = MotionState.DRAWING;
	};
	const onDelete = () => {
		controller.onDelete();
	};
	const onSave = () => {
		controller.onSave();
	};
</script>

<MotionRender {render}>
	<div class="fixed top-5 left-0 right-0 z-10 mx-auto w-full">
		<div class="grid w-full grid-cols-10">
			<!-- // left side -->
			<div class="col-span-2 ml-5 place-self-center">
				<button class="self-start">
					<Icon name="menu" />
				</button>
			</div>
			<!-- // center side -->
			<div class="col-span-5 flex w-full items-center justify-evenly">
				<button class="자물쇠">
					<Icon name="lock" />
				</button>
				<button class="마우스" on:click={() => onCursorMove()}>
					<Icon name="mouse" />
				</button>
				<button class="손" on:click={() => onHandDragging()}>
					<Icon name="hand" />
				</button>
				<button class="네모 cursor-pointer" on:click={() => onRectAdd()}>
					<Icon name="rectangle" />
				</button>
				<button class="원" on:click={() => onCircleAdd()}>
					<Icon name="circle" />
				</button>
				<button class="연필" on:click={() => onDrawing()}>
					<Icon name="pencil" />
				</button>
				<input
					name="image-upload"
					id="imageUpload"
					type="file"
					accept="image/*"
					class="hidden"
					on:change={controller.onAddImage}
				/>
				<label for="imageUpload" class="grid cursor-pointer place-content-center">
					<button class="사진 업로드 pointer-events-none ">
						<Icon name="upload" />
					</button>
				</label>
				<button class="쓰레기통" on:click={() => onDelete()}>
					<Icon name="trash" />
				</button>
				<button class="저장" on:click={() => onSave()}>
					<Icon name="save" />
				</button>
			</div>

			<!-- 우측 버튼 모음 -->
			<div class="col-span-3 hidden h-full w-full md:block">
				<div class="flex h-full items-center justify-center space-x-3">
					<button class="rounded-md bg-blue-400 p-2 text-white">
						<svg
							xmlns="http://www.w3.org/2000/svg"
							fill="none"
							viewBox="0 0 24 24"
							stroke-width={1.5}
							stroke="currentColor"
							class="h-5 w-5"
						>
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								d="M7.217 10.907a2.25 2.25 0 100 2.186m0-2.186c.18.324.283.696.283 1.093s-.103.77-.283 1.093m0-2.186l9.566-5.314m-9.566 7.5l9.566 5.314m0 0a2.25 2.25 0 103.935 2.186 2.25 2.25 0 00-3.935-2.186zm0-12.814a2.25 2.25 0 103.933-2.185 2.25 2.25 0 00-3.933 2.185z"
							/>
						</svg>
					</button>
					<button
						class="flex flex-shrink items-center space-x-2 rounded-md border px-3 py-1.5 hover:bg-base-100"
					>
						<Icon name="storage" />
						<span>창꼬</span>
					</button>
				</div>
			</div>
		</div>
	</div>
</MotionRender>
