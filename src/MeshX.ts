import { Dictionary, List } from "@bombitmanbomb/utils";
import { float3 } from "./float3";
import { float4 } from "./float4";
import { color } from "./color";
import { float2 } from "./float2";
import { Submesh } from "./Submesh";
import { TriangleCollection } from "./TriangleCollection";
import { Vertex } from "./Vertex";
export class MeshX {
	public MESHX_BINARY_VERSION = 6;
	public MAGIC_STRING = "MeshX";
	private static _magicHeader = new Uint8Array([5, 77, 101, 115, 104, 88]);
	public submeshes: List<Submesh> = new List();
	public blendshapes: List<BlendShape> = new List();
	public blendshapemap: Dictionary<string, BlendShape> = new Dictionary();
	public bones: List<Bone> = new List();
	public vertexIDs: number[];
	private _vertexID: number;
	public positions: float3[];
	public normals: float4[];
	public tangents: float4[];
	public colors: color[];
	public uv_channels: UV_Array[];
	public boneBindings: BoneBinding[];
	public flags: BitArray;

	public RecalculateTangentsMikktspace(
		triangles: TriangleCollection | null = null,
		uvChannel = 0
	): boolean {
		if (!this.HasNormals || !this.HasUV_2D(uvChannel)) return false;
		this.HasTangents = true;
		const positions: float3[] = this.RawPositions;
		const normals: float3[] = this.RawNormals;
		const uvs: float2[] = this.GetRawUVs(uvChannel);
		const tangents: float4[] = this.RawTangents;
		const triangleCollection: TriangleCollection = triangles;

		const faceCount =
			triangleCollection != null
				? triangleCollection.Count
				: this.TotalFaceCount;
	}
}
export class UV_Array {
	public uv_2D!: float2[];
	public uv_3D!: float3[];
	public uv_4D!: float4[];
	public get Dimensions(): number {
		if (this.uv_2D != null) return 2;
		if (this.uv_3D != null) return 3;
		return this.uv_4D != null ? 4 : 0;
	}
}

export class VertexEnumerator {
	private meshx: MeshX;
	private _index: number;
	public get Current(): Vertex {
		return this.meshx.GetVertex(this._index);
	}
	constructor(meshx: MeshX) {
		this.meshx = meshx;
		this._index = -1;
	}
	public Dispose(): void {
		//VOID
	}
	public MoveNext(): boolean {
		this._index++;
		return this._index < this.meshx.VertexCount;
	}
	public Reset(): void {
		this._index = -1;
	}
}
