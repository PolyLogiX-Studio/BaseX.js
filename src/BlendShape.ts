import { MeshX } from "./MeshX";
import { List } from "@bombitmanbomb/utils";
import { BlendShapeFrame } from "./BlendShapeFrame";
export class BlendShape {
	public Mesh: MeshX;
	public Name: string;
	private _frames: List<BlendShapeFrame> = new List();
	private _hasNormals: boolean;
	private _hasTangents: boolean;

	public get Index(): number {
		return this.Mesh.IndexOfBlendShape(this);
	}

	public get HasNormals(): boolean {
		return this._hasNormals;
	}
	public set HasNormals(value: boolean) {
		this._hasNormals = value;
		for (const frame of this._frames) {
			this.Mesh.EnsureVertexArray<float3>(value, frame.normals);
		}
	}

	public get HasTangents(): boolean {
		return this._hasTangents;
	}
	public set HasTangents(value: boolean) {
		this._hasTangents = value;
		for (const frame of this._frames) {
			this.Mesh.EnsureVertexArray<float3>(value, frame.tangents);
		}
	}

	public get FrameCount(): number {
		return this._frames.Count;
	}

	public THIS(frame: number): BlendShapeFrame {
		return this._frames[frame];
	}

	public get Frames(): List<BlendShapeFrame> {
		return this._frames;
	}

	public AddFrame(weight: float): BlendShapeFrame {
		return this.InsertFrame(this.FrameCount, weight);
	}

	public InsertFrame(index: number, weight: number): BlendShapeFrame {
		const blendShapeFrame = new BlendShapeFrame(this, weight);
		this._frames.Insert(index, blendShapeFrame);
		return blendShapeFrame;
	}

	public RemoveFrame(frame: BlendShapeFrame): boolean {
		return this._frames.Remove(frame) != -1;
	}

	public RemoveFrameAt(index: number): void {
		this._frames.RemoveAt(index);
	}

	public ClearFrames(): void {
		this._frames.Clear();
	}

	constructor(mesh: MeshX, name: string) {
		this.Mesh = mesh;
		this.Name = name;
	}

	/**@internal */
	public EnsureCapacity(capacity: number): void {
		for (const frame of this._frames) {
			this.Mesh.EnsureArray<float3>(true, frame.positions, capacity);
			this.Mesh.EnsureArray<float3>(this.HasNormals, frame.normals, capacity);
			this.Mesh.EnsureArray<float3>(this.HasTangents, frame.tangents, capacity);
		}
	}
	/**@internal */
	public RemoveElements(index: number, count: number): void {
		for (const frame of this._frames) {
			this.Mesh.RemoveElements<float3>(
				frame.positions,
				index,
				count,
				this.Mesh.VertexCount
			);
			this.Mesh.RemoveElements<float3>(
				frame.normals,
				index,
				count,
				this.Mesh.VertexCount
			);
			this.Mesh.RemoveElements<float3>(
				frame.tangents,
				index,
				count,
				this.Mesh.VertexCount
			);
		}
	}

	public Encode(bw): void {}
	public Decode(bw): void {}
}
