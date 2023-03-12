import { canvasSVG } from '$lib/store'
import {
	ArcRotateCamera,
	Color4,
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
		var camera = new ArcRotateCamera(
			'Camera',
			-Math.PI / 1,
			Math.PI / 3,
			25,
			Vector3.Zero(),
			this._scene,
		)
		camera.attachControl(canvas, true)

		// Add lights to the scene
		var light = new HemisphericLight('light1', new Vector3(0, 1, 0), this._scene)
		light.intensity = 0.7
		var groundWidth = 20
		var groundHeight = 10

		var ground = MeshBuilder.CreateGround(
			'ground1',
			{ width: groundWidth, height: groundHeight, subdivisions: 25 },
			this._scene,
		)

		const myDynamicTexture = new DynamicTexture('svg', { width: 500, height: 500 }, this._scene)
		const mat = new StandardMaterial('', this._scene)

		var textureResolution = 512

		const textureGround = myDynamicTexture
		var materialGround = new StandardMaterial('Mat', this._scene)
		materialGround.diffuseTexture = textureGround
		ground.material = materialGround
		const ctx = textureGround.getContext()
		canvasSVG.subscribe((newValue) => {
			this.svgSrc = this.updateSVG(newValue)
			if (this.svgSrc) {
				const img = new Image()
				const src = this.svgSrc
				img.src = src
				img.onload = () => {
					ctx.drawImage(img, 0, 0)
					textureGround.update()
				}
			}
		})
	}
	get scene(): Scene {
		return this._scene
	}
	updateSVG(svg: string | null) {
		if (!svg) return
		return `data:image/svg+xml;base64,` + window.btoa(svg)
	}
}
