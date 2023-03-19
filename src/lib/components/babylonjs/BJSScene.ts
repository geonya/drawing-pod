import { MM_TO_PX } from '$lib/constants'
import { canvasSVG } from '$lib/store'
import {
	Animation,
	ArcRotateCamera,
	Color3,
	Color4,
	DirectionalLight,
	DynamicTexture,
	HemisphericLight,
	Mesh,
	MeshBuilder,
	PointLight,
	Scene,
	StandardMaterial,
	Texture,
	Vector3,
	Vector4,
	type Engine,
} from '@babylonjs/core'
import { get } from 'svelte/store'

export class BJSScene {
	private _scene: Scene
	svgSrc: string | undefined

	constructor(private readonly engine: Engine, private readonly canvas: HTMLCanvasElement) {
		this._scene = new Scene(this.engine)
		this._scene.clearColor = new Color4(0, 0, 0, 0)

		const ZOOM_RADIUS = 7
		const camera = new ArcRotateCamera(
			'Camera',
			-Math.PI / 3,
			Math.PI / 4,
			ZOOM_RADIUS,
			Vector3.Zero(),
			this._scene,
		)
		camera.attachControl(this.canvas, true)
		// prevent zoom
		camera.lowerRadiusLimit = ZOOM_RADIUS
		camera.upperRadiusLimit = ZOOM_RADIUS

		const light1 = new DirectionalLight('DirectionalLight', new Vector3(0, -1, 1), this._scene)
		const light2 = new HemisphericLight('HemiLight', new Vector3(0, 1, 0), this._scene)
		light1.intensity = 0.7
		light2.intensity = 0.6

		const box = MeshBuilder.CreateBox(
			'box',
			{
				width: 3,
				height: 3,
				depth: 3,
				faceColors: [
					new Color4(1, 0, 0, 1),
					new Color4(0, 1, 0, 1),
					new Color4(0, 0, 1, 1),
					new Color4(1, 1, 0, 1),
					new Color4(1, 0, 1, 1),
					new Color4(0, 1, 1, 1),
				],
			},
			this._scene,
		)
		box.position.y = 0

		const frameRate = 10
		//Position Animation

		//Rotation Animation
		const yRot = new Animation(
			'yRot',
			'rotation.y',
			frameRate,
			Animation.ANIMATIONTYPE_FLOAT,
			Animation.ANIMATIONLOOPMODE_CYCLE,
		)

		const keyFramesR = []

		keyFramesR.push({
			frame: 0,
			value: 0,
		})

		keyFramesR.push({
			frame: 2.5 * frameRate,
			value: 2 * Math.PI,
		})

		keyFramesR.push({
			frame: 5 * frameRate,
			value: 4 * Math.PI,
		})

		yRot.setKeys(keyFramesR)

		const nextAnimation = () => {
			this._scene.beginDirectAnimation(box, [yRot], 0, 2 * frameRate, true)
		}

		this._scene.beginDirectAnimation(box, [yRot], 0, 2 * frameRate, false, 1, nextAnimation)
	}
	get scene(): Scene {
		return this._scene
	}
}
