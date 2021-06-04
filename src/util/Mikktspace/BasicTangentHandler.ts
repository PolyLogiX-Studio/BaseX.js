export interface BasicTangentHandler {
	(
		face: number,
		vertex: number,
		x: number,
		y: number,
		z: number,
		sign: number
	): void;
}
