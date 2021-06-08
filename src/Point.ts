import { IMeshXElement } from "./IMeshXElement";
import { IMeshXPrimitive } from "./IMeshXPrimitive";
import { PointSubmesh } from "./PointSubmesh";
import { MeshX } from "./MeshX";
import { Vertex } from "./Vertex";

export class Point implements IMeshXElement, IMeshXPrimitive {
	private index: number;
	private version: number;
	private submesh: PointSubmesh;
	public get Submesh(): PointSubmesh {
		return this.Submesh;
	}
	public get Mesh(): MeshX {
		return this.submesh?.Mesh;
	}

	constructor(index: number, submesh: PointSubmesh) {
		this.index = index;
		this.submesh = submesh;
		if (submesh.Mesh.TrackRemovals) this.version = submesh.primitiveIDs[index];
		else this.version = submesh.PrimitivesVersion;
	}

	public get Index(): number {
		this.UpdateIndex();
		return this.index;
	}

	public get SubmeshIndex(): number {
		this.UpdateIndex();
		return this.submesh.Index;
	}
	public set SubmeshIndex(value: number) {
		this.UpdateIndex();
		this.Mesh.TryGetSubmesh<PointSubmesh>(value).AddPoint(
			this.submesh.indicies[this.index]
		);
		this.submesh.Remove(this.index);
	}

	public get VertexIndex(): number {
		this.UpdateIndex();
		return this.submesh.indicies[this.index];
	}
	public set VertexIndex(value: number) {
		this.UpdateIndex();
		this.Mesh.VerifyVertexIndex(value);
		this.submesh.indicies[this.index] = value;
	}

	public get Vertex(): Vertex {
		return new Vertex(this.VertexIndex, this.Mesh);
	}
	public set Vertex(value: Vertex) {
		this.VertexIndex = value.Index;
	}
	/**@internal */
	public UpdateIndex(): boolean {
		this.submesh.UpdateIndex(this.version, this.index);
	}
}
