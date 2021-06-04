import type { Out } from "@bombitmanbomb/utils";
export interface VertexNormalHandler {
	(
		face: number,
		vertex: number,
		x: Out<number>,
		y: Out<number>,
		z: Out<number>
	): void;
}
