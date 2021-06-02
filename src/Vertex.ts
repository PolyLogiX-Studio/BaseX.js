import { IVertex } from "./IVertex";
import { MeshX } from "./MeshX";
export class Vertex implements IVertex {
	private index!: number;
	private version!: number;
	private meshx!: MeshX;
	public get Mesh(): MeshX {
		return this.meshx;
	}

	public static get Null(): Vertex {
		return new Vertex();
	}

	constructor(index?: number, meshx?: MeshX) {
		if (index == null) return;
		this.Vertex(index as number, meshx as MeshX);
	}
	public Vertex(index: number, meshx: MeshX): void {
		this.index = index;
		this.meshx = meshx;
		if (meshx.TrackRemovals) this.version = meshx.vertexIDs[index];
		else this.version = meshx.VerticesVersion;
	}

	public Copy(v: Vertex): void {}
}
