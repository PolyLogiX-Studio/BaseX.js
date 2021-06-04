export interface TangentHandler {
	(
		face: number,
		vertex: number,
		tangentX: number,
		tangentY: number,
		tangentZ: number,
		bitangentX: number,
		bitangentY: number,
		bitangentZ: number,
		tangentMagnitude: number,
		bitangentMagnitude: number,
		isOrientationPreserving: boolean
	): void;
}
