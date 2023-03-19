import type { Engine, Scene } from '@babylonjs/core'
import { appStateMachine, AppStates } from './appStateMachine'
import { BJSEngine } from './BJSEngine'
import { BJSScene } from './BJSScene'

export class BJSApp {
	private readonly engine: Engine

	private currentScene: Scene | null = null

	constructor(private readonly canvas: HTMLCanvasElement) {
		this.engine = new BJSEngine(canvas).engine
	}

	private async initialize() {
		this.engine.hideLoadingUI()
		this.engine.getAudioContext()?.resume()
	}

	async run() {
		await this.initialize()
		this.currentScene = new BJSScene(this.engine, this.canvas).scene

		this.engine.runRenderLoop(async () => {
			if (!this.canvas || !this.engine || !this.currentScene) return
			this.currentScene.render()
		})

		window.addEventListener('resize', () => {
			this.engine.resize()
		})
	}
}
