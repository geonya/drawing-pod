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
		var scene = new Scene(engine)

		var camera = new ArcRotateCamera(
			'Camera',
			-Math.PI / 3,
			Math.PI / 4,
			10,
			Vector3.Zero(),
			this._scene,
		)

		camera.attachControl(canvas, true)

		var light1 = new DirectionalLight('DirectionalLight', new Vector3(0, -1, 1), this._scene)
		var light2 = new HemisphericLight('HemiLight', new Vector3(0, 1, 0), this._scene)
		light1.intensity = 0.7
		light2.intensity = 0.6

		var box = MeshBuilder.CreateBox(
			'box',
			{
				width: 2,
				height: 2,
				depth: 2,
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
		box.position.y = 2

		var frameRate = 10
		//Position Animation

		//Rotation Animation
		var yRot = new Animation(
			'yRot',
			'rotation.y',
			frameRate,
			Animation.ANIMATIONTYPE_FLOAT,
			Animation.ANIMATIONLOOPMODE_CYCLE,
		)

		var keyFramesR = []

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
