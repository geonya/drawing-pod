import { MM_TO_PX } from '$lib/constants'
import { canvasSVG } from '$lib/store'
import {
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
		const camera = new ArcRotateCamera(
			'camera',
			-Math.PI / 2,
			Math.PI / 2.5,
			6,
			new Vector3(0, 0, 0),
		)
		const groundMat = new StandardMaterial('groundMat')
		groundMat.diffuseColor = new Color3(0, 1, 0)
		camera.attachControl(canvas, true)
		new DirectionalLight('light', new Vector3(1, 0, 1), this._scene)
		new DirectionalLight('light', new Vector3(0, 1, -1), this._scene)
		const faceUV = []
		faceUV[0] = new Vector4(0.0, 0.0, 0.0, 0.0)
		faceUV[1] = new Vector4(0.0, 0.0, 1.0, 1.0)
		faceUV[2] = new Vector4(0.0, 0.0, 0.0, 0.0)
		faceUV[3] = new Vector4(0.0, 0.0, 0.0, 0.0)
		faceUV[4] = new Vector4(0.0, 0.0, 0.0, 0.0)
		faceUV[4] = new Vector4(0.0, 0.0, 0.0, 0.0)

		const box = MeshBuilder.CreateBox('box', {
			width: 4,
			height: 3,
			depth: 0.3,
			faceUV,
			wrap: true,
		})
		box.position.y = 1

		const boxMat = new StandardMaterial('boxMat', this._scene)
		box.material = boxMat

		canvasSVG.subscribe((dataURL) => {
			boxMat.diffuseTexture = new Texture(dataURL, this._scene)
		})
	}
	get scene(): Scene {
		return this._scene
	}
}
