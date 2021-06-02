import { Submesh } from "./Submesh";
import { SubmeshTopology } from "./SubmeshTopology";
import { Triangle } from "./Triangle";
import { MeshX } from "./MeshX";
import { TriangleCollection } from "./TriangleCollection";
import { Vertex } from "./Vertex";
export class TriangleSubmesh extends Submesh {
	public get IndiciesPerElement(): number {
		return 3;
	}
	public get Topology(): SubmeshTopology {
		return SubmeshTopology.Triangles;
	}
	public THIS(index: number): Triangle {
		return this.GetTriangle(index);
	}
	constructor(mesh: MeshX) {
		super(mesh);
	}

	public AddTriangles(
		count: number,
		trigs: TriangleCollection | null = null
	): void {
		this.IncreaseCount(count);
		if (trigs == null) return;
		trigs.Capacity += count;
		for (let index = 0; index < count; index++)
			trigs.Add(new Triangle(this.Count - count + index, this));
	}

	public AddTriangle(
		v0?: number | Vertex,
		v1?: number | Vertex,
		v2?: number | Vertex
	): Triangle {
		if (v0 == null) {
			this.IncreaseCount(1);
			return new Triangle(this.Count - 1, this);
		} else if (
			v0 instanceof Vertex &&
			v1 instanceof Vertex &&
			v2 instanceof Vertex
		) {
			return this.AddTriangle(v0.Index, v1.Index, v2.Index);
		} else if (
			typeof v0 == "number" &&
			typeof v1 == "number" &&
			typeof v2 == "number"
		) {
			const triangle = this.AddTriangle();
			triangle.Vertex0Index = v0;
			triangle.Vertex1Index = v1;
			triangle.Vertex2Index = v2;
			return triangle;
		} else {
			throw new SyntaxError("Invalid Usage");
		}
	}

	public SetTriangle(index: number, v0: number, v1: number, v2: number): void {
		this.VerifyIndex(index);
		index *= 3;
		this.indicies[index] = v0;
		this.indicies[index + 1] = v1;
		this.indicies[index + 2] = v2;
	}

	public GetTriangle(index: number): Triangle {
		this.VerifyIndex(index);
		return new Triangle(index, this);
	}

	public Remove(
		index: number | Triangle | TriangleCollection,
		count = 1
	): void {
		if (typeof index == "number") {
			if (count == 0) return;
			this.VerifyIndex(index);
			if (index + count > this.Count) throw new Error(count.toString());
			if (index + count != this.Count) this.PrimitivesVersion--;
			const indiciesPerElement = this.IndiciesPerElement;
			this.Mesh.RemoveElements(
				this.indicies,
				index * indiciesPerElement,
				count * indiciesPerElement,
				this.Count * indiciesPerElement
			);
			this.Mesh.RemoveElements(
				this.primitiveIDs,
				index,
				count,
				this.Count,
				true,
				2147483647
			);
			this.Count -= count;
		} else if (index instanceof Triangle) {
			this.Remove(index.Index);
		} else if (index instanceof TriangleCollection) {
			if (index.Count <= 0) return;
			this.Mesh.RemoveElements<Triangle>(
				index._triangles,
				(i: number, count: number) => this.Remove(i, count)
			);
		} else {
			throw new SyntaxError("Invalid Usage");
		}
	}
}
