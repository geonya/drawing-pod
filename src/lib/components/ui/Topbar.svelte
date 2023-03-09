<script lang="ts">
	import Icon from '../Icon.svelte'
	import { MotionRender } from '$lib'
	import TopPanel from '../panel/TopPanel.svelte'
</script>

<MotionRender>
	<div class="fixed top-5 left-0 right-0 z-10 mx-auto w-full">
		<div class="grid w-full grid-cols-10">
			<!-- // left side -->
			<div class="col-span-2 ml-5 place-self-center">
				<button class="self-start">
					<Icon name="menu" />
				</button>
			</div>
			<!-- Top Control Panel -->
			<TopPanel />
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
