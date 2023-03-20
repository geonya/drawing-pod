<script lang="ts">
	import { AUTO_SAVE_DELAY, CANVAS_DATA } from '$lib/constants'
	import { saveProgress, sb } from '$lib/store'
	import { onDestroy, onMount } from 'svelte'
	import { control } from './canvas.store'
	export let canvas: fabric.Canvas

	const onLoadStorageData = (canvas: fabric.Canvas) => {
		const storageJsonData = localStorage.getItem(CANVAS_DATA)
		if (storageJsonData) {
			const json = JSON.parse(storageJsonData)
			canvas.loadFromJSON(json, () => {
				canvas.renderAll()
			})
		}
	}
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
			$saveProgress = progress
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

	async function onUploadCloud() {
		if (!$sb) return
		const {
			data: { user },
		} = await $sb?.auth.getUser()
		if (!user) {
			return
		}
		const canvasData = $control?.getCanvasJSON()
		if (!canvasData) return
		const { data, error: canvasIdError } = await $sb.from('canvas').select('id').eq('user', user.id)
		if (canvasIdError || !data) {
			console.error(canvasIdError)
			return
		}
		const canvasId = data[0].id
		if (canvasId) {
			const { error } = await $sb.from('canvas').update({ data: canvasData }).eq('id', canvasId)
			if (error) {
				console.error(error)
			}
			return
		}
		const { error } = await $sb.from('canvas').insert({
			data,
			user: user?.id,
		})
		if (error) {
			console.error(error)
		}
	}
	onMount(() => {
		if (!canvas) return
		// auto saving
		onLoadStorageData(canvas)
		onIntervalAutoSaveWithTimer()
		onAutoSaveInLocalStorage(canvas)
	})
	onDestroy(async () => {
		localStorage.removeItem(CANVAS_DATA)
		await onUploadCloud()
	})
</script>
