import { IMeshXElement } from "./IMeshXElement";
import { IMeshXPrimitive } from "./IMeshXPrimitive";
import { TriangleSubmesh } from "./TriangleSubmesh";
import { MeshX } from "./MeshX";
import { Vertex } from "./Vertex";
import { MathX } from "./MathX";
import { float3 } from "./float3";
export class Triangle implements IMeshXElement, IMeshXPrimitive {
	private index: number;
	private version: number;
	private submesh: TriangleSubmesh;
	public get Submesh(): TriangleSubmesh {
		return this.submesh;
	}
	public get Mesh(): MeshX {
		return this.submesh?.Mesh;
	}
	public get IsNull(): boolean {
		return this.submesh == null;
	}
	constructor(index: number, submesh: TriangleSubmesh) {
		this.index = index;
		this.submesh = submesh;
		if (submesh.Mesh.TrackRemovals) this.version = submesh.primitiveIDs[index];
		else this.version = submesh.PrimitivesVersion;
	}
	public Copy(t: Triangle): void {
		if (t.submesh == this.submesh) {
			this.Vertex0Index = t.Vertex0Index;
			this.Vertex1Index = t.Vertex1Index;
			this.Vertex2Index = t.Vertex2Index;
		} else {
			this.Vertex0 = this.Mesh.AddVertex(t.Vertex0);
			this.Vertex1 = this.Mesh.AddVertex(t.Vertex1);
			this.Vertex2 = this.Mesh.AddVertex(t.Vertex2);
		}
	}
	public get IndexUnsafe(): number {
		return this.index;
	}
	public get Index(): number {
		this.UpdateIndex();
		return this.index;
	}
	public get SubmeshIndexUnsafe(): number {
		return this.submesh.Index;
	}
	public get SubmeshIndex(): number {
		this.UpdateIndex();
		return this.submesh.Index;
	}
	public set SubmeshIndex(value: number) {
		this.UpdateIndex();
		const submesh = this.Mesh.TryGetSubmesh<TriangleSubmesh>(value);
		const index = this.index * 3;
		submesh.AddTriangle(
			this.submesh.indicies[index],
			this.submesh.indicies[index + 1],
			this.submesh.indicies[index + 2]
		);
		this.submesh.Remove(this.index);
	}
	public get Vertex0IndexUnsafe(): number {
		return this.submesh.indicies[this.index * 3];
	}
	public set Vertex0IndexUnsafe(value: number) {
		this.submesh.indicies[this.index * 3] = value;
	}
	public get Vertex1IndexUnsafe(): number {
		return this.submesh.indicies[this.index * 3 + 1];
	}
	public set Vertex1IndexUnsafe(value: number) {
		this.submesh.indicies[this.index * 3 + 1] = value;
	}
	public get Vertex2IndexUnsafe(): number {
		return this.submesh.indicies[this.index * 3 + 2];
	}
	public set Vertex2IndexUnsafe(value: number) {
		this.submesh.indicies[this.index * 3 + 2] = value;
	}
	public get Vertex0Index(): number {
		this.UpdateIndex();
		return this.submesh.indicies[this.index * 3];
	}
	public set Vertex0Index(value: number) {
		this.UpdateIndex();
		this.Mesh.VerifyVertexIndex(value);
		this.submesh.indicies[this.index * 3] = value;
	}
	public get Vertex1Index(): number {
		this.UpdateIndex();
		return this.submesh.indicies[this.index * 3 + 1];
	}
	public set Vertex1Index(value: number) {
		this.UpdateIndex();
		this.Mesh.VerifyVertexIndex(value);
		this.submesh.indicies[this.index * 3 + 1] = value;
	}
	public get Vertex2Index(): number {
		this.UpdateIndex();
		return this.submesh.indicies[this.index * 3 + 2];
	}
	public set Vertex2Index(value: number) {
		this.UpdateIndex();
		this.Mesh.VerifyVertexIndex(value);
		this.submesh.indicies[this.index * 3 + 2] = value;
	}
	public get Vertex0(): Vertex {
		return new Vertex(this.Vertex0Index, this.Mesh);
	}
	public set Vertex0(value: Vertex) {
		this.Vertex0Index = value.Index;
	}
	public get Vertex1(): Vertex {
		return new Vertex(this.Vertex1Index, this.Mesh);
	}
	public set Vertex1(value: Vertex) {
		this.Vertex1Index = value.Index;
	}
	public get Vertex2(): Vertex {
		return new Vertex(this.Vertex2Index, this.Mesh);
	}
	public set Vertex2(value: Vertex) {
		this.Vertex2Index = value.Index;
	}
	public GetVertex(index: number): Vertex {
		switch (index) {
		case 0:
			return this.Vertex0;
		case 1:
			return this.Vertex1;
		case 2:
			return this.Vertex2;
		default:
			throw new Error("Invalid vertex index");
		}
	}
	public GetVertexIndexUnsafe(index: number): number {
		switch (index) {
		case 0:
			return this.Vertex0IndexUnsafe;
		case 1:
			return this.Vertex1IndexUnsafe;
		case 2:
			return this.Vertex2IndexUnsafe;
		default:
			return -1;
		}
	}
	public Set(v0: Vertex, v1: Vertex, v2: Vertex): void;
	public Set(v0: number, v1: number, v2: number): void;
	public Set(
		v0: number | Vertex,
		v1: number | Vertex,
		v2: number | Vertex
	): void {
		if (v0 instanceof Vertex && v1 instanceof Vertex && v2 instanceof Vertex) {
			this.Set(v0.Index, v1.Index, v2.Index);
		} else if (
			typeof v0 === "number" &&
			typeof v1 === "number" &&
			typeof v2 === "number"
		) {
			this.UpdateIndex();
			this.Mesh.VerifyVertexIndex(v0);
			this.Mesh.VerifyVertexIndex(v1);
			this.Mesh.VerifyVertexIndex(v2);
			const index = this.index * 3;
			this.submesh.indicies[index] = v0;
			this.submesh.indicies[index + 1] = v1;
			this.submesh.indicies[index + 2] = v2;
		} else throw new Error("Invalid Input");
	}
	public ReverseWinding(): void {
		const vertex0Index = this.Vertex0Index;
		this.Vertex0Index = this.Vertex2Index;
		this.Vertex2Index = vertex0Index;
	}
	public get SurfaceNormal(): float3 {
		const position1 = this.Vertex0.Position;
		const position2 = this.Vertex1.Position;
		const a = float3.Subtract(position2, position1);
		const position3 = this.Vertex2.Position;
		const b = float3.Subtract(position3, position1);
		return MathX.Cross(a, b).Normalized;
	}
}
