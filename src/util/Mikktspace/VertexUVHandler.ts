import type { Out } from "@bombitmanbomb/utils";
export interface VertexUVHandler {
	(face: number, vertex: number, u: Out<number>, v: Out<number>): void;
}
