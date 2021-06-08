import { MeshX } from "./MeshX";
import { SubmeshTopology } from "./SubmeshTopology";
import { BoundingBox } from "./BoundingBox";
import { float3 } from "./float3";
import { SubmeshMetadata } from "./SubmeshMetadata";
export abstract class Submesh {
	public Mesh!: MeshX;
	public indicies: number[] = [];
	public primitiveIDs: number[] = [];
	private _currentID!: number;

	public abstract Topology: SubmeshTopology;

	public get Index(): number {
		return this.Mesh.IndexOfSubmesh(this);
	}
	public Count = 0;

	public get IndicieCount(): number {
		return this.Count * this.IndiciesPerElement;
	}

	public get RawIndicies(): number[] {
		return this.indicies;
	}

	public Submesh(mesh: MeshX): void {
		this.Mesh = mesh;
		this.PrimitivesVersion = -1;
	}
	constructor(mesh: MeshX) {
		this.Submesh(mesh);
	}

	public get Capacity(): number {
		const indicies = this.indicies;
		return (indicies != null ? indicies.length : 0) / this.IndiciesPerElement;
	}

	public abstract IndiciesPerElement: number;

	public PrimitivesVersion!: number;

	public SetCountAndSequence(count: number, sequenceStart = 0): boolean {
		const count1 = count - this.Count;
		if (count1 > 0) {
			const count2 = this.Count;
			this.IncreaseCount(count1);
			const indiciesPerElement = this.IndiciesPerElement;
			for (
				let index = count2 * indiciesPerElement;
				index < this.IndicieCount;
				index++
			)
				this.indicies[index] = index + sequenceStart;
		} else if (count1 < 0) this.RemoveFromEnd(-count1);
		return count1 > 0;
	}

	public Clear(): void {
		this.Count = 0;
	}

	public SetCount(count: number): boolean {
		const count1 = count - this.Count;
		if (count1 > 0) this.IncreaseCount(count1);
		else if (count1 < 0) this.RemoveFromEnd(-count1);
		return count1 > 0;
	}

	public IncreaseCount(count: number): void {
		this.Count += count;
		if (this.Capacity < this.Count)
			this.EnsureCapacity(Math.max(this.Capacity * 2, this.Count, 4));
		if (!this.Mesh.TrackRemovals) return;
		for (let index = this.Count - count; index < this.Count; index++)
			this.primitiveIDs[index] = this._currentID++;
	}

	public Append(submesh: Submesh): void {
		if (submesh.Topology != this.Topology)
			throw new Error("Submesh topology mismatch");
		this.IncreaseCount(submesh.Count);
		for (let index = 0; index < submesh.IndicieCount; index++) {
			this.RawIndicies[this.IndicieCount - submesh.IndicieCount + index] =
				submesh.RawIndicies[index];
		}
	}

	public RemoveFromEnd(count: number): void {
		this.RemoveFromEnd(this.Count - count, count);
	}

	public Remove(index: number, count = 1): void {
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

	private EnsureCapacity(capacity: number): void {
		this.Mesh.EnsureArray(
			true,
			this.indicies,
			capacity * this.IndiciesPerElement
		);
		this.Mesh.EnsureArray(this.Mesh.TrackRemovals, this.primitiveIDs, capacity);
	}

	public VerifyIndex(index: number): void {
		if (index < 0 || index >= this.Count)
			throw new RangeError(`index = ${index}`);
	}

	public UpdateIndex(version: number, index: number): boolean {
		if (version < 0) {
			if (version != this.PrimitivesVersion)
				throw new Error("Primitive has been invalidated");
		} else if (version != this.primitiveIDs[index]) {
			while (index > 0 && this.primitiveIDs[index] > version) index--;
			if (this.primitiveIDs[index] != version)
				throw new Error("Primitive has been removed");
			return true;
		}
		return false;
	}

	public VerticesRemoved(index: number, count: number): void {
		const num = index + count;
		for (let index1 = 0; index1 < this.indicies.length; index1++) {
			if (this.indicies[index1] >= index && this.indicies[index1] < num)
				this.indicies[index1] = -1;
			else if (this.indicies[index1] >= num) this.indicies[index1] -= count;
		}
	}

	public EnableTrackRemovals(): void {
		for (let index = 0; index < this.Count; index++)
			this.primitiveIDs[index] = this._currentID++;
	}

	public Encode(bw: BinaryWriter): void {
		//TODO
	}
	public Decode(bw: BinaryWriter): void {
		//TODO
	}

	public CalculateBoundingBox(): BoundingBox {
		const boundingBox = new BoundingBox();
		boundingBox.MakeEmpty();
		const positions: float3[] = this.Mesh.positions;
		if (positions != null) {
			for (let index = 0; index < this.IndicieCount; index++) {
				const indicy = this.indicies[index];
				if (indicy >= 0 && indicy <= positions.length)
					boundingBox.Encapsulate(positions[indicy]);
			}
		}
		return boundingBox;
	}

	public CalculateMetadata(): SubmeshMetadata {
		return new SubmeshMetadata({
			elementCount: this.Count,
			topology: this.Topology,
			bounds: this.CalculateBoundingBox(),
		});
	}
}
