import { Submesh } from "./Submesh";
import { SubmeshTopology } from "./SubmeshTopology";
import { Point } from "./Point";
import { MeshX } from "./MeshX";
import { PointCollection } from "./PointCollection";
export class PointSubmesh extends Submesh {
	/**@override */
	public get Topology(): SubmeshTopology {
		return SubmeshTopology.Points;
	}

	public get IndiciesPerElement(): number {
		return 1;
	}

	public THIS(index: number): Point {
		return this.GetPoint(index);
	}

	constructor(mesh: MeshX) {
		super(mesh);
	}

	public AddPoint(vIndex?: number): Point {
		if (vIndex != null) {
			const point = this.AddPoint();
			point.VertexIndex = vIndex;
			return point;
		} else {
			this.IncreaseCount(1);
			return new Point(this.Count - 1, this);
		}
	}

	public AddPoints(count: number, points: PointCollection | null = null): void {
		this.IncreaseCount(count);
		if (points == null) return;
		points.Capacity += count;
		for (let index = 0; index < count; index++)
			points.Add(new Point(this.Count - count + index, this));
	}

	public GetPoint(index: number): Point {
		this.VerifyIndex(index);
		return new Point(index, this);
	}

	public SetPoint(index: number, vIndex: number): void {
		this.indicies[index] = vIndex;
	}
	public Remove(index: number | Point | PointCollection, count = 1): void {
		if (index instanceof Point) {
			this.Remove(index.Index);
		} else if (index instanceof PointCollection) {
			if (index.Count <= 0) return;
			this.Mesh.RemoveElements<Point>(index._points, (i: number, c: number) =>
				this.Remove(i, c)
			);
		} else {
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
		}
	}
}
