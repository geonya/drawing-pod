import type { Engine, Scene } from '@babylonjs/core'
import { appStateMachine, AppStates } from './appStateMachine'
import { BJSEngine } from './BJSEngine'
import { BJSScene } from './BJSScene'

export class BJSApp {
	private readonly engine: Engine
	private readonly stateMachine: Generator
	private currentScene: Scene | null = null
	private currentState: AppStates | null = null

	constructor(private readonly canvas: HTMLCanvasElement) {
		this.engine = new BJSEngine(canvas).engine
		this.stateMachine = appStateMachine()
	}

	private moveNextAppState(state: AppStates) {
		return this.stateMachine.next(state)
	}

	private async initialize() {
		// this.engine.displayLoadingUI();
		this.moveNextAppState(AppStates.MOUNTED)
		// await new Promise((resolve) => {
		// 	this.moveNextAppState(AppStates.LOADING);
		// 	setTimeout(resolve, 100);
		// });
		this.moveNextAppState(AppStates.INITAILIZED)
		this.engine.hideLoadingUI()
		this.engine.getAudioContext()?.resume()
	}

	async run() {
		await this.initialize()
		this.currentScene = new BJSScene(this.engine, this.canvas).scene

		this.moveNextAppState(AppStates.CUTSCENE)
		this.engine.runRenderLoop(async () => {
			if (!this.canvas || !this.engine || !this.currentScene) return
			switch (this.currentState) {
				case AppStates.LOADING:
					break
				case AppStates.MOUNTED:
					break
				case AppStates.INITAILIZED:
					break
				case AppStates.CUTSCENE:
					break
				case AppStates.RUNNING:
					break
				case AppStates.EXITING:
					break
				default:
					break
			}
			this.currentScene.render()
		})
		this.moveNextAppState(AppStates.RUNNING)
		window.addEventListener('resize', () => {
			this.engine.resize()
		})
	}
}
