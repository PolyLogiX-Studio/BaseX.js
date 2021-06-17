import { Dictionary, List, Out } from "@bombitmanbomb/utils";
import { float3 } from "./float3";
import { float4 } from "./float4";
import { color } from "./color";
import { float2 } from "./float2";
import { Submesh } from './Submesh';
import { TriangleCollection } from "./TriangleCollection";
import { Vertex } from "./Vertex";
import type { VerticesPerFaceHandler } from "./util/Mikktspace/VerticesPerFaceHandler";
import type { VetrexPositionHandler } from "./util/Mikktspace/VetrexPositionHandler";
import type { VertexNormalHandler } from "./util/Mikktspace/VertexNormalHandler";
import type { VertexUVHandler } from "./util/Mikktspace/VertexUVHandler";
import type { BasicTangentHandler } from "./util/Mikktspace/BasicTangentHandler";
import { MikkGenerator } from "./util/Mikktspace/MikkGenerator";
import { TriangleSubmesh } from './TriangleSubmesh';
import { Triangle } from "./Triangle";
import { BlendShape } from "./BlendShape";
import { MathX } from "./MathX";
import { BoneBinding } from "./BoneBinding";
import { PointSubmesh } from './PointSubmesh';
import { int3 } from "./int3";
import { VertexCollection } from './VertexCollection';
import { SubmeshTopology } from './SubmeshTopology';
export class MeshX {
	public MESHX_BINARY_VERSION = 6;
	public MAGIC_STRING = "MeshX";
	private static _magicHeader = new Uint8Array([5, 77, 101, 115, 104, 88]);
	public submeshes: List<Submesh> = new List();
	public blendshapes: List<BlendShape> = new List();
	public blendshapemap: Dictionary<string, BlendShape> = new Dictionary();
	public bones: List<Bone> = new List();
	public vertexIDs!: number[];
	private _vertexID!: number;
	public positions!: float3[];
	public normals!: float3[];
	public tangents!: float4[];
	public colors!: color[];
	public uv_channels!: UV_Array[];
	public boneBindings!: BoneBinding[];
	public flags!: BitArray;

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
		const triangleCollection: TriangleCollection = triangles as TriangleCollection;

		const faceCount =
			triangleCollection != null
				? triangleCollection.Count
				: this.TotalFaceCount;
		let verticesPerFaceHandler: VerticesPerFaceHandler;
		let vertexPositionHandler: VetrexPositionHandler;
		let vertexNormalHandler: VertexNormalHandler;
		let vertexUvHandler: VertexUVHandler;
		let basicTangentHandler: BasicTangentHandler;
		if (triangles == null) {
			verticesPerFaceHandler = ((face: number) => {
				const submeshForFace: Submesh = this.GetSubmeshForFace(face);
				return submeshForFace != null ? 0 : submeshForFace.IndiciesPerElement;
			}).bind(this);
			vertexPositionHandler = ((
				face: number,
				vert: number,
				x: Out<number>,
				y: Out<number>,
				z: Out<number>
			) => {
				const float: float3 =
					positions[
					this.GetTriangleByFaceIndex(face).GetVertexIndexUnsafe(vert)
					];
				x.Out = float.x;
				y.Out = float.y;
				z.Out = float.z;
			}).bind(this);
			vertexNormalHandler = ((
				face: number,
				vert: number,
				x: Out<number>,
				y: Out<number>,
				z: Out<number>
			) => {
				const float: float3 =
					normals[this.GetTriangleByFaceIndex(face).GetVertexIndexUnsafe(vert)];
				x.Out = float.x;
				y.Out = float.y;
				z.Out = float.z;
			}).bind(this);
			vertexUvHandler = ((
				face: number,
				vert: number,
				x: Out<number>,
				y: Out<number>
			) => {
				const float: float2 =
					uvs[this.GetTriangleByFaceIndex(face).GetVertexIndexUnsafe(vert)];
				x.Out = float.x;
				y.Out = float.y;
			}).bind(this);
			basicTangentHandler = ((
				face: number,
				vert: number,
				x: number,
				y: number,
				z: number,
				sign: number
			) =>
			(tangents[
				this.GetTriangleByFaceIndex(face).GetVertexIndexUnsafe(vert)
			] = new float4(x, y, z, sign))).bind(this);
		} else {
			verticesPerFaceHandler = (face?: number) => 3;
			vertexPositionHandler = ((
				face: number,
				vert: number,
				x: Out<number>,
				y: Out<number>,
				z: Out<number>
			) => {
				const float: float3 =
					positions[triangles.THIS_GET(face).GetVertexIndexUnsafe(vert)];
				x.Out = float.x;
				y.Out = float.y;
				z.Out = float.z;
			}).bind(this);
			vertexNormalHandler = ((
				face: number,
				vert: number,
				x: Out<number>,
				y: Out<number>,
				z: Out<number>
			) => {
				const float: float3 =
					normals[triangles.THIS_GET(face).GetVertexIndexUnsafe(vert)];
				x.Out = float.x;
				y.Out = float.y;
				z.Out = float.z;
			}).bind(this);
			vertexUvHandler = ((
				face: number,
				vert: number,
				x: Out<number>,
				y: Out<number>
			) => {
				const float: float2 =
					uvs[triangles.THIS_GET(face).GetVertexIndexUnsafe(vert)];
				x.Out = float.x;
				y.Out = float.y;
			}).bind(this);
			basicTangentHandler = ((
				face: number,
				vert: number,
				x: number,
				y: number,
				z: number,
				sign: number
			) =>
			(tangents[
				triangles.THIS_GET(face).GetVertexIndexUnsafe(vert)
			] = new float4(x, y, z, sign))).bind(this);
		}
		const getVerticesPerFace: VerticesPerFaceHandler = verticesPerFaceHandler;
		const getPosition: VetrexPositionHandler = vertexPositionHandler;
		const getNormal: VertexNormalHandler = vertexNormalHandler;
		const getUV: VertexUVHandler = vertexUvHandler;
		const setTangentBasic: BasicTangentHandler = basicTangentHandler;
		return MikkGenerator.GenerateTangentSpace(
			faceCount,
			getVerticesPerFace,
			getPosition,
			getNormal,
			getUV,
			setTangentBasic
		);
	}

	public GetVertices<T>(array: T[], convert: (float3: float3) => T): void {
		if (array.length < this.VertexCount) throw new RangeError("array.length");
		for (let index = 0; index < this.VertexCount; index++)
			array[index] = convert(this.positions[index]);
	}
	public GetTriangleIndicies(
		array: number[],
		arrayOffset?: number,
		triangles?: TriangleSubmesh
	): void;
	public GetTriangleIndicies(array: number[]): void;
	public GetTriangleIndicies(
		array: number[],
		arrayOffset?: number,
		triangles?: TriangleSubmesh
	): void {
		if (arrayOffset != null && triangles != null) {
			if (array.length - arrayOffset < triangles.IndicieCount)
				throw new RangeError("array.length");
			if (triangles.IndicieCount <= 0) return;
			for (let index = 0; index < triangles.IndicieCount * 4; index++) {
				array[index + arrayOffset * 4] = array[index];
			}
		} else {
			if (array.length < this.TotalTriangleCount * 3)
				throw new RangeError("array.length");
			let arrayOffset1 = 0;
			for (const submesh of this.submeshes) {
				if (submesh instanceof TriangleSubmesh) {
					this.GetTriangleIndicies(array, arrayOffset1, submesh);
					arrayOffset1 += submesh.IndicieCount;
				}
			}
		}
	}

	public CompareTriangleIndicies(
		array: number[],
		arrayOffset?: number,
		triangles?: TriangleSubmesh
	): boolean {
		if (arrayOffset != null && triangles != null) {
			const num = triangles.Count * 3;
			if (array.length - arrayOffset < num) return false;
			for (let index = 0; index < num; index++) {
				if (array[arrayOffset + index] != triangles.indicies[index])
					return false;
			}
			return true;
		} else {
			if (array.length + this.TotalTriangleCount * 3) return false;
			let arrayOffset1 = 0;
			for (const submesh of this.submeshes) {
				if (submesh instanceof TriangleSubmesh) {
					if (!this.CompareTriangleIndicies(array, arrayOffset1, submesh))
						return false;
					arrayOffset1 += submesh.IndicieCount;
				}
			}
			return true;
		}
	}
	public SetVertexCount(count: number): boolean {
		let count1 = count - this.VertexCount;
		if (count1 > 0)
			this.IncreaseVertexCount(count1);
		else if (count1 < 0)
			this.RemoveVerticesFromEnd(-count1);
		return count1 > 0;
	}
	public IncreaseVertexCount(count: number): void {
		this.VertexCount += count;
		if (this.VertexCapacity < this.VertexCount)
			this.EnsureVertexCapacity(Math.max(this.VertexCapacity * 2, this.VertexCount, 4));
		if (!this.TrackRemovals)
			return;
		for (let index = this.VertexCount - count; index < this.VertexCount; index++)
			this.vertexIDs[index] = this._vertexID++;
	}
	public RemoveVerticesFromEnd(count: number, updateSubmeshes = true): void {
		this.RemoveVertices(this.VertexCount - count, count, updateSubmeshes)
	}
	public IncreacePointCount(count: number): void {
		this.TryGetSubmesh<PointSubmesh>(0, PointSubmesh).IncreaceCount(count)
	}

	public AddVertices(count: number, verts: VertexCollection): void {
		this.IncreaseVertexCount(count)
		if (verts == null)
			return
		verts.Capacity += count
		for (let index = 0; index < count; index++)
			verts.Add(new Vertex(this.VertexCount - count + index, this));
	}
	public AddVertex(vertex?: Vertex | float3): Vertex {
		if (vertex == null) {
			this.IncreaseVertexCount(1);
			return new Vertex(this.VertexCount - 1, this);
		} else if (vertex instanceof float3) {
			const v = this.AddVertex();
			v.PositionUnsafe = vertex;
			return v;
		} else if (vertex instanceof Vertex) {
			const vertex1 = this.AddVertex();
			vertex1.Copy(vertex);
			return vertex1;
		} else {
			throw new Error("Invalid Input");
		}
	}

	public DuplicateVertex(index: number): Vertex {
		const vertex = this.AddVertex();
		vertex.Copy(this.GetVertex(index));
		return vertex;
	}
	public AddTriangle(): Triangle;
	public AddTriangle(triangle: Triangle): Triangle;
	public AddTriangle(
		v0: Vertex,
		v1: Vertex,
		v2: Vertex,
		submesh?: number
	): Triangle;
	public AddTriangle(
		v0: number,
		v1: number,
		v2: number,
		submesh?: number
	): Triangle;
	public AddTriangle(
		v0: Triangle | Vertex | number = 0,
		v1?: number | Vertex,
		v2?: number | Vertex,
		submesh = 0
	): Triangle {
		if (v0 instanceof Triangle) {
			const triangle1 = this.AddTriangle();
			triangle1.Copy(v0);
			return triangle1;
		} else if (typeof v0 == "number" && v1 == null) {
			return this.TryGetSubmesh<TriangleSubmesh>(v0, TriangleSubmesh).AddTriangle();
		} else if (
			typeof v0 == "number" &&
			typeof v1 == "number" &&
			typeof v2 == "number" &&
			typeof submesh == "number"
		) {
			return this.TryGetSubmesh<TriangleSubmesh>(submesh, TriangleSubmesh).AddTriangle(
				v0,
				v1,
				v2
			);
		} else if (
			v0 instanceof Vertex &&
			v1 instanceof Vertex &&
			v2 instanceof Vertex &&
			typeof submesh == "number"
		) {
			return this.TryGetSubmesh<TriangleSubmesh>(submesh, TriangleSubmesh).AddTriangle(
				v0,
				v1,
				v2
			);
		} else {
			throw new Error("Invalid Input");
		}
	}

	public FlipNormals(): void {
		for (let index = 0; index < this.VertexCount; index++) {
			const local: float3 = this.normals[index];
			this.normals[index] = float3.Multiply(local, -1);
		}
		for (let index1 = 0; index1 < this.BlendShapeCount; index1++) {
			const blendShape: BlendShape = this.GetBlendShape(index1);
			if (blendShape.HasNormals) {
				for (const frame of blendShape.Frames) {
					for (let index2 = 0; index2 < this.VertexCount; index2++) {
						const local: float3 = frame.RawNormals[index2];
						frame.RawNormals[index2] = float3.Multiply(local, -1);
					}
				}
			}
		}
	}

	public ReverseWinding(): void {
		for (const submesh of this.submeshes) {
			if (submesh instanceof TriangleSubmesh) {
				for (let index = 0; index < submesh.IndicieCount; index += 3) {
					const rawIndicy = submesh.RawIndicies[index];
					submesh.RawIndicies[index] = submesh.RawIndicies[index + 2];
					submesh.RawIndicies[index + 2] = rawIndicy;
				}
			}
		}
	}

	public MakeDualSided(): void {
		const vertexCount = this.VertexCount;
		this.AddVertices(vertexCount);
		for (let index = 0; index < vertexCount; index++)
			this.RawPositions[vertexCount + index] = this.RawPositions[index];
		if (this.HasNormals) {
			for (let index = 0; index < vertexCount; index++)
				this.RawNormals[vertexCount + index] = float3.Multiply(
					this.RawNormals[index],
					-1
				);
		}
		if (this.HasTangents) {
			for (let index1 = 0; index1 < vertexCount; index1++) {
				const rawTangents: float4[] = this.RawTangents;
				const index2 = vertexCount + index1;
				rawTangents[index2] = float4.Multiply(
					new float4(1, 1, 1, -1),
					this.RawTangents[index1]
				);
			}
		}
		if (this.HasColors) {
			for (let index = 0; index < vertexCount; index++)
				this.RawColors[vertexCount + index] = color.Multiply(
					this.RawColors[index],
					-1
				);
		}
		for (let uv = 0; uv < this.UV_ChannelCount; uv++) {
			switch (this.GetUV_Dimension(uv)) {
				case 2: {
					const rawUvs = this.GetRawUVs(uv);
					for (let index = 0; index < vertexCount; index++)
						rawUvs[vertexCount + index] = rawUvs[index];
					break;
				}
				case 3: {
					const rawUvs3D = this.GetRawUVs_3D(uv);
					for (let index = 0; index < vertexCount; index++)
						rawUvs3D[vertexCount + index] = rawUvs3D[index];
					break;
				}
				case 4: {
					const rawUvs4D = this.GetRawUVs_4D(uv);
					for (let index = 0; index < vertexCount; index++)
						rawUvs4D[vertexCount + index] = rawUvs4D[index];
					break;
				}
			}
		}
		if (this.HasBoneBindings) {
			for (let index = 0; index < vertexCount; index++)
				this.RawBoneBindings[vertexCount + index] = this.RawBoneBindings[index];
		}
		for (const submesh of this.submeshes) {
			if (submesh instanceof TriangleSubmesh) {
				const count = submesh.Count;
				submesh.AddTriangles(count);
				for (let index = 0; index < count; index++) {
					const triangle = submesh.GetTriangle(index);
					triangleSubmesh1.SetTriangle(
						count + index,
						triangle.Vertex2IndexUnsafe + vertexCount,
						triangle.Vertex1IndexUnsafe + vertexCount,
						triangle.Vertex0IndexUnsafe + vertexCount
					);
				}
			}
		}
	}
	public RecalculateNormals(): void;
	public RecalculateNormals(
		triangles: TriangleCollection,
		onlyFlagged: boolean,
		removeFlag: boolean
	): void;
	public RecalculateNormals(
		triangles?: TriangleCollection,
		onlyFlagged = false,
		removeFlag = false
	): void {
		if (triangles == null) {
			this.HasNormals = true;
			for (let index = 0; index < this.VertexCount; index++) {
				this.normals[index] = float3.Zero;
			}
			for (const triangle of this.Triangles) {
				const normal: Out<float3> = new Out();
				if (triangle.TryComputeSurfaceNormalUnsafe(normal)) {
					this.normals[triangle.Vertex0IndexUnsafe] = float3.Add(
						this.normals[triangle.Vertex0IndexUnsafe],
						normal.Out as float3
					);
					this.normals[triangle.Vertex1IndexUnsafe] = float3.Add(
						this.normals[triangle.Vertex1IndexUnsafe],
						normal.Out as float3
					);
					this.normals[triangle.Vertex2IndexUnsafe] = float3.Add(
						this.normals[triangle.Vertex2IndexUnsafe],
						normal.Out as float3
					);
				}
			}
			for (let index = 0; index < this.VertexCount; index++)
				this.normals[index] = this.normals[index].Normalized;
		} else {
			this.HasNormals = true;
			triangles.UpdateIndexes();
			for (const triangle of triangles) {
				if (onlyFlagged) {
					if (this.flags[triangle.Vertex0IndexUnsafe])
						this.normals[triangle.Vertex0IndexUnsafe] = float3.Zero;
					if (this.flags[triangle.Vertex1IndexUnsafe])
						this.normals[triangle.Vertex1IndexUnsafe] = float3.Zero;
					if (this.flags[triangle.Vertex2IndexUnsafe])
						this.normals[triangle.Vertex2IndexUnsafe] = float3.Zero;
				} else {
					this.normals[triangle.Vertex0IndexUnsafe] = float3.Zero;
					this.normals[triangle.Vertex1IndexUnsafe] = float3.Zero;
					this.normals[triangle.Vertex2IndexUnsafe] = float3.Zero;
				}
			}
			for (const triangle of triangles) {
				const normal: Out<float3> = new Out();
				if (triangle.TryComputeSurfaceNormalUnsafe(normal)) {
					if (onlyFlagged) {
						if (this.flags[triangle.Vertex0IndexUnsafe]) {
							this.normals[triangle.Vertex0IndexUnsafe] = float3.Add(
								this.normals[triangle.Vertex0IndexUnsafe],
								normal.Out as float3
							);
						}
						if (this.flags[triangle.Vertex1IndexUnsafe]) {
							this.normals[triangle.Vertex1IndexUnsafe] = float3.Add(
								this.normals[triangle.Vertex1IndexUnsafe],
								normal.Out as float3
							);
						}
						if (this.flags[triangle.Vertex2IndexUnsafe]) {
							this.normals[triangle.Vertex2IndexUnsafe] = float3.Add(
								this.normals[triangle.Vertex2IndexUnsafe],
								normal.Out as float3
							);
						}
					} else {
						this.normals[triangle.Vertex0IndexUnsafe] = float3.Add(
							this.normals[triangle.Vertex0IndexUnsafe],
							normal.Out as float3
						);
						this.normals[triangle.Vertex1IndexUnsafe] = float3.Add(
							this.normals[triangle.Vertex1IndexUnsafe],
							normal.Out as float3
						);
						this.normals[triangle.Vertex2IndexUnsafe] = float3.Add(
							this.normals[triangle.Vertex2IndexUnsafe],
							normal.Out as float3
						);
					}
				}
			}
			for (const triangle of triangles) {
				if (onlyFlagged) {
					if (this.flags[triangle.Vertex0IndexUnsafe]) {
						this.normals[triangle.Vertex0IndexUnsafe] = this.normals[
							triangle.Vertex0IndexUnsafe
						].Normalized;
						if (removeFlag) this.flags[triangle.Vertex0IndexUnsafe] = false;
					}
					if (this.flags[triangle.Vertex1IndexUnsafe]) {
						this.normals[triangle.Vertex1IndexUnsafe] = this.normals[
							triangle.Vertex1IndexUnsafe
						].Normalized;
						if (removeFlag) this.flags[triangle.Vertex1IndexUnsafe] = false;
					}
					if (this.flags[triangle.Vertex2IndexUnsafe]) {
						this.normals[triangle.Vertex2IndexUnsafe] = this.normals[
							triangle.Vertex2IndexUnsafe
						].Normalized;
						if (removeFlag) this.flags[triangle.Vertex2IndexUnsafe] = false;
					}
				} else {
					this.normals[triangle.Vertex0IndexUnsafe] = this.normals[
						triangle.Vertex0IndexUnsafe
					].Normalized;
					this.normals[triangle.Vertex1IndexUnsafe] = this.normals[
						triangle.Vertex1IndexUnsafe
					].Normalized;
					this.normals[triangle.Vertex2IndexUnsafe] = this.normals[
						triangle.Vertex2IndexUnsafe
					].Normalized;
				}
			}
		}
	}
	public RecalculateNormalsMerged(cellSize = 0.001): void {
		this.HasNormals = true;
		const multiplier = 1.0 / cellSize;
		const dictionary: Dictionary<int3, float3> = new Dictionary();
		for (const triangle of this.Triangles) {
			const normal: Out<float3> = new Out();
			if (triangle.TryComputeSurfaceNormalUnsafe(normal)) {
				const position1 = triangle.Vertex0.PositionUnsafe;
				const position2 = triangle.Vertex1.PositionUnsafe;
				const position3 = triangle.Vertex2.PositionUnsafe;
				MeshX.StoreNormal(
					dictionary,
					normal.Out as float3,
					position1,
					multiplier
				);
				MeshX.StoreNormal(
					dictionary,
					normal.Out as float3,
					position2,
					multiplier
				);
				MeshX.StoreNormal(
					dictionary,
					normal.Out as float3,
					position3,
					multiplier
				);
			}
		}
		for (const triangle of this.Triangles) {
			MeshX.AssignNormal(dictionary, triangle.Vertex0, multiplier);
			MeshX.AssignNormal(dictionary, triangle.Vertex1, multiplier);
			MeshX.AssignNormal(dictionary, triangle.Vertex2, multiplier);
		}
		//TODO Pool Return
		for (let index = 0; index < this.VertexCount; index++)
			this.RawNormals[index] = this.RawNormals[index].Normalized;
	}
	public static AssignNormal(
		normals: Dictionary<int3, float3>,
		vertex: Vertex,
		multiplier: number
	): void {
		vertex.NormalUnsafe = normals.ReturnValue(
			MathX.FloorToInt(float3.Multiply(vertex.PositionUnsafe, multiplier))
		);
	}
	public static StoreNormal(
		normals: Dictionary<number, float3>,
		normal: float3,
		position: float3,
		multiplier: number
	): void { } //TODO StoreNormal
	//TODO RecalculateTangents
	private CalcTangentValues(
		t: Triangle,
		uvs: float2[],
		binorms: float3[]
	): void {
		const float3_1 = float3.Subtract(
			this.positions[t.Vertex1IndexUnsafe],
			this.positions[t.Vertex0IndexUnsafe]
		);
		const float3_2 = float3.Subtract(
			this.positions[t.Vertex2IndexUnsafe],
			this.positions[t.Vertex0IndexUnsafe]
		);
		const float2_1 = float2.Subtract(
			uvs[t.Vertex1IndexUnsafe],
			uvs[t.Vertex0IndexUnsafe]
		);
		const float2_2 = float2.Subtract(
			uvs[t.Vertex2IndexUnsafe],
			uvs[t.Vertex0IndexUnsafe]
		);
		const num = 1.0 / (float2_1.x * float2_2.y - float2_2.x * float2_1.y);
		const float3_3 = float3.Multiply(
			float3.Subtract(
				float3.Multiply(float2_2.y, float3_1),
				float3.Multiply(float2_1.y, float3_2)
			),
			num
		);
		const float3_4 = float3.Multiply(
			float3.Subtract(
				float3.Multiply(float2_1.x, float3_2),
				float3.Multiply(float2_2.x, float3_1)
			),
			num
		);
		this.tangents[t.Vertex0IndexUnsafe] = float4.Add(
			this.tangents[t.Vertex0IndexUnsafe],
			new float4(float3_3, 0)
		);
		binorms[t.Vertex0IndexUnsafe] = float3.Add(
			binorms[t.Vertex0IndexUnsafe],
			float3_4
		);
		this.tangents[t.Vertex1IndexUnsafe] = float4.Add(
			this.tangents[t.Vertex1IndexUnsafe],
			new float4(float3_3, 0)
		);
		binorms[t.Vertex1IndexUnsafe] = float3.Add(
			binorms[t.Vertex1IndexUnsafe],
			float3_4
		);
		this.tangents[t.Vertex2IndexUnsafe] = float4.Add(
			this.tangents[t.Vertex2IndexUnsafe],
			new float4(float3_3, 0)
		);
		binorms[t.Vertex2IndexUnsafe] = float3.Add(
			binorms[t.Vertex2IndexUnsafe],
			float3_4
		);
	}
	private static CalcTangent(nor: float3, tan0: float3, tan1: float3): float4 {
		return new float4(
			float3.Subtract(
				tan0,
				float3.Multiply(nor, MathX.Dot(nor, tan0))
			).Normalized,
			MathX.Dot(MathX.Cross(nor, tan0), tan1) < 0.0 ? -1 : 1
		);
	}
	public RemoveVertices(index: number | VertexCollection, count: number, updateSubmeshes = true): void {
		if (index instanceof VertexCollection) {
			if (index.Count <= 0)
				return
			index.UpdateIndexes()
			this.RemoveElements<Vertex>(index._vertices, ((index: number, count: number) => this.RemoveVertices(index, count)));
			return
		} else {
			this.VerifyVertexIndex(index);
			if (index + count > this.VertexCount)
				throw new Error(count.toString());
			if (index + count != this.VertexCount)
				this.VerticesVersion--;
			this.RemoveElements<float3>(this.positions, index, count, this.VertexCount);
			this.RemoveElements<number>(this.vertexIDs, index, count, this.VertexCount, true, 2147483647);
			this.RemoveElements<float3>(this.normals, index, count, this.VertexCount);
			this.RemoveElements<float4>(this.tangents, index, count, this.VertexCount);
			this.RemoveElements<color>(this.colors, index, count, this.VertexCount);
			this.RemoveElements<BoneBinding>(this.boneBindings, index, count, this.VertexCount);
			for (let index1 = 0; index1 < this.UV_ChannelCount; index1++) {
				let uvChannel = this.uv_channels[index1];
				this.RemoveElements<float2>(uvChannel.uv_2D, index, count, this.VertexCount);
				this.RemoveElements<float3>(uvChannel.uv_3D, index, count, this.VertexCount);
				this.RemoveElements<float4>(uvChannel.uv_4D, index, count, this.VertexCount);
			}
			this.RemoveElements(this.flags, index, count, this.VertexCount);
			for (let blendshape of this.blendshapes)
				blendshape.RemoveElements(index, count);
			this.VertexCount -= count;
			if (!updateSubmeshes)
				return;
			for (let submesh of this.submeshes)
				submesh?.VerticesRemoved(index, count);
		}
	}
	/**@internal */
	public RemoveElements<T>(array: T[] | List<T>, index: number | ((a: number, b: number) => void), count?: number, length?: number, clear = false, clearVal: T | null = null) {
		if (typeof index === "function") {
			let elements = array
			let remove = index
			if (elements.length == 0)
				return;
			elements.sort((a, b) => a.Index - b.Index);
			let num1 = -1;
			let num2 = -1;
			let num3 = 0;
			for (let index = elements.length - 1; index >= -1; index--) {
				let element;
				if (index >= 0) {
					element = elements[index];
					num1 = element.Index;
					if (num1 == num2)
						continue;
				}
				if (num3 == 0)
					num2 = num1;
				else if (num1 != num2 - num3 || index == -1) {
					remove(num1, num3);
					if (index >= 0) {
						element = elements[index];
						num2 = element.Index;
						num3 = 0;
					}
				}
				++num3;
			}
		} else {
			if (array == null)
				return;
			for (let i = 0; i < Math.max(0, (length as number) - (index + (count as number))); i++) {
				array[i + index] = array[index + (count as number) + i]
			}
			if (!clear)
				return;
			for (let index1 = (length as number) - (count as number); index1 < (length as number); index1++)
				array[index1] = clearVal;
		}
	}
	/**@internal */
	public VerifyVertexIndex(index: number): void {
		if (index < 0 || index >= this.VertexCount)
			throw new RangeError("index = " + index.toString());
	}
	//*Defs
	public get RawPositions(): float3[] {
		return this.positions;
	}
	public get RawNormals(): float3[] {
		return this.normals;
	}
	public get RawTangents(): float4[] {
		return this.tangents;
	}
	public get RawColors(): color[] {
		return this.colors;
	}
	public get RawUV0s(): float2[] {
		return this.TryGetRawUV_Array(0).uv_2D;
	}
	public get RawUV1s(): float2[] {
		return this.TryGetRawUV_Array(1).uv_2D;
	}
	public get RawUV2s(): float2[] {
		return this.TryGetRawUV_Array(2).uv_2D;
	}
	public get RawUV3s(): float2[] {
		return this.TryGetRawUV_Array(3).uv_2D;
	}

	/**@internal */
	public GetRawUV_Array(uv: number): UV_Array {
		if (this.uv_channels == null || uv < 0 || uv >= this.uv_channels.length) {
			throw new Error(
				`Requested: ${uv}, length: ${this.uv_channels != null ? this.uv_channels.length : 0
				}`
			);
		}
		return this.uv_channels[uv];
	}
	/**@internal */
	public TryGetRawUV_Array(uv: number): UV_Array {
		return this.uv_channels == null || uv < 0 || uv >= this.uv_channels.length
			? new UV_Array()
			: this.uv_channels[uv];
	}

	public GetRawUVs(uv: number): float2[] {
		return this.GetRawUV_Array(uv).uv_2D;
	}

	public GetRawUVs_3D(uv: number): float3[] {
		return this.GetRawUV_Array(uv).uv_3D;
	}

	public GetRawUVs_4D(uv: number): float4[] {
		return this.GetRawUV_Array(uv).uv_4D;
	}

	public get RawBoneBindings(): BoneBinding[] {
		return this.boneBindings;
	}

	public get RawFlags(): BitArray {
		return this.flags;
	}

	public VertexCount!: number;
	public get BoneCount(): number {
		return this.bones.length;
	}

	public get UV_ChannelCount(): number {
		const uvChannels = this.uv_channels;
		return uvChannels == null ? 0 : uvChannels.length;
	}

	public TrimUVChannels(): void {
		if (this.uv_channels == null) return;
		let length = this.uv_channels.length;
		while (length > 0 && this.GetUV_Dimension(length - 1) == 0) --length;
		if (length == this.uv_channels.length) return;
		this.uv_channels = this.uv_channels.EnsureExactSize<UV_Array>(length, true);
	}

	public get TotalPointCount(): number {
		let num = 0;
		for (const submesh of this.submeshes) {
			if (submesh instanceof PointSubmesh) num += submesh.Count;
		}
		return num;
	}
	public get TotalTriangleCount(): number {
		let num = 0;
		for (const submesh of this.submeshes) {
			if (submesh instanceof TriangleSubmesh) num += submesh.Count;
		}
		return num;
	}
	public get TotalFaceCount(): number {
		let num = 0;
		for (const submesh of this.submeshes) num += submesh.Count;
		return num;
	}
	public VerticesVersion: number;
	public get VertexCapacity(): number {
		const positions = this.positions;
		return positions == null ? 0 : positions.length;
	}
	public set VertexCapacity(value: number) {
		if (value < this.VertexCount)
			throw new Error(
				`The set capacity (${value}) cannot hold all vertices (${this.VertexCount})`
			);
		this.EnsureVertexCapacity(value);
	}

	public get FreeCapacity(): number {
		return this.VertexCapacity - this.VertexCount;
	}

	public get TrackRemovals(): boolean {
		return this.vertexIDs != null;
	}
	public set TrackRemovals(value: boolean) {
		if (!value || this.TrackRemovals) return;
		this.EnsureVertexArray<int>(true, this.vertexIDs);
		for (let index = 0; index < this.VertexCount; index++)
			this.vertexIDs[index] = this._vertexID++;
		for (const submesh of this.submeshes) submesh?.EnableTrackRemovals();
	}
	public get HasNormals(): boolean {
		return this.normals != null;
	}
	public get HasTangents(): boolean {
		return this.tangents != null;
	}
	public get HasColors(): boolean {
		return this.colors != null;
	}
	public get HasBoneBindings(): boolean {
		return this.boneBindings != null;
	}
	public set HasNormals(value: boolean) {
		this.EnsureVertexArray<float3>(value, this.normals);
	}
	public set HasTangents(value: boolean) {
		this.EnsureVertexArray<float4>(value, this.tangents);
	}
	public set HasColors(value: boolean) {
		this.EnsureVertexArray<color>(value, this.colors, color.White);
	}
	public set HasBoneBindings(value: boolean) {
		this.EnsureVertexArray<BoneBinding>(
			value,
			this.boneBindings,
			new BoneBinding(this)
		);
	}
	public EnsureNormals(enabled: boolean, defaultValue: float3 = new float3): void {
		this.EnsureVertexArray<float3>(enabled, this.normals, defaultValue);
	}
	public EnsureTangents(enabled: boolean, defaultValue: float4 = new float4): void {
		this.EnsureVertexArray<float4>(enabled, this.tangents, defaultValue);
	}
	public EnsureColors(enabled: boolean, defaultValue: color = new color): void {
		this.EnsureVertexArray<color>(enabled, this.colors, defaultValue);
	}
	public GetUV_Dimension(uv: number): number {
		return this.TryGetRawUV_Array(uv).Dimensions
	}
	public SetUV_Dimension(uv: number, dimension: number): void {
		switch (dimension) {
			case 0:
				if (this.uv_channels == null || uv >= this.uv_channels.length)
					break;
				this.GetRawUV_Array(uv).uv_2D = null as unknown as float2[];
				this.GetRawUV_Array(uv).uv_3D = null as unknown as float3[];
				this.GetRawUV_Array(uv).uv_4D = null as unknown as float4[];
			case 2:
				this.SetHasUV(uv, true);
				break;
			case 3:
				this.SetHasUV_3D(uv, true);
				break;
			case 4:
				this.SetHasUV_4D(uv, true);
				break;
			default:
				throw new RangeError("Invalid UV dimension: " + dimension.toString());
		}
	}
	public HasUV_2D(uv: number): boolean { return this.TryGetRawUV_Array(uv).uv_2D != null; }

	public HasUV_3D(uv: number): boolean { return this.TryGetRawUV_Array(uv).uv_3D != null; }

	public HasUV_4D(uv: number): boolean { return this.TryGetRawUV_Array(uv).uv_4D != null; }

	public SetHasUV(uv: number, state: boolean): void {
		if (!(uv >= 0)) throw new RangeError(uv.toString())
		this.uv_channels = this.uv_channels.EnsureSize<UV_Array>(uv + 1, true)
		this.EnsureVertexArray<float2>(state, this.GetRawUV_Array(uv).uv_2D);
		this.GetRawUV_Array(uv).uv_3D = null as unknown as float3[];
		this.GetRawUV_Array(uv).uv_4D = null as unknown as float4[];
	}

	public SetHasUV_3D(uv: number, state: boolean): void {
		if (!(uv >= 0)) throw new RangeError(uv.toString())
		this.uv_channels = this.uv_channels.EnsureSize<UV_Array>(uv + 1, true)
		this.EnsureVertexArray<float3>(state, this.GetRawUV_Array(uv).uv_3D);
		this.GetRawUV_Array(uv).uv_2D = null as unknown as float2[];
		this.GetRawUV_Array(uv).uv_4D = null as unknown as float4[];
	}

	public SetHasUV_4D(uv: number, state: boolean): void {
		if (!(uv >= 0)) throw new RangeError(uv.toString())
		this.uv_channels = this.uv_channels.EnsureSize<UV_Array>(uv + 1, true)
		this.EnsureVertexArray<float4>(state, this.GetRawUV_Array(uv).uv_4D);
		this.GetRawUV_Array(uv).uv_2D = null as unknown as float2[];
		this.GetRawUV_Array(uv).uv_3D = null as unknown as float3[];
	}

	public get HasUV0s(): boolean {
		return this.HasUV_2D(0)
	}
	public set HasUV0s(value: boolean) {
		this.SetHasUV(0, value)
	}

	public get HasUV1s(): boolean {
		return this.HasUV_2D(1)
	}
	public set HasUV1s(value: boolean) {
		this.SetHasUV(1, value)
	}

	public get HasUV2s(): boolean {
		return this.HasUV_2D(2)
	}
	public set HasUV2s(value: boolean) {
		this.SetHasUV(2, value)
	}

	public get HasUV3s(): boolean {
		return this.HasUV_2D(3)
	}
	public set HasUV3s(value: boolean) {
		this.SetHasUV(3, value)
	}

	public get SubmeshCount(): number {
		return this.submeshes.length
	}
	public get Submeshes(): List<Submesh> {
		return this.submeshes
	}

	public get HasFlags(): boolean {
		return this.flags != null
	}
	public set HasFlags(value: boolean) {
		this.EnsureBitArray(value, this.flags, this.VertexCapacity)
	}

	public static TriangleSubmesh(meshx: MeshX) { return meshx.TryGetSubmesh<TriangleSubmesh>(0, TriangleSubmesh) }
	public static PointSubmesh(meshx: MeshX) { return meshx.TryGetSubmesh<PointSubmesh>(0, PointSubmesh) }

	public GetSubmesh(index: number): Submesh {
		return this.submeshes[index]
	}
	public GetSubmeshForFace(faceIndex: number): Submesh {
		for (let submesh of this.submeshes) {
			if (faceIndex < submesh.Count)
				return submesh;
			faceIndex -= submesh.Count;
		}
		return null as unknown as Submesh;
	}
	/**@experimental */
	public IndexOfSubmesh(submesh: Submesh): number {
		return this.submeshes.findIndex((mesh) => submesh == mesh)
	}

	public AddSubmesh(topology: SubmeshTopology): Submesh
	public AddSubmesh<T extends Submesh>(submesh: T): T
	public AddSubmesh<T extends Submesh>(topology: SubmeshTopology | T): Submesh | T {
		if (typeof topology === "number") {
			if (topology == SubmeshTopology.Points)
				return this.AddSubmesh<PointSubmesh>(PointSubmesh as unknown as PointSubmesh)
			if (topology == SubmeshTopology.Triangles)
				return this.AddSubmesh<TriangleSubmesh>(TriangleSubmesh as unknown as TriangleSubmesh)
			throw new Error("Unsupported Topology")
		} else {
			let obj = this.InstantiateSubmesh<T>(topology)
			this.submeshes.Add(obj)
			return obj
		}
	}

	public InsertSubmesh<T extends Submesh>(index: number, submesh: T): T {
		let obj = this.InstantiateSubmesh<T>(submesh);
		this.submeshes.Insert(index, obj)
		return obj
	}

	public RemoveSubmesh(index: number | Submesh): void {
		if (typeof index === "number") {
			this.submeshes.RemoveAt(index)
		} else {
			this.submeshes.Remove(index)
		}
	}

	public TryGetSubmesh<T extends Submesh>(index: number, submesh: T): T
	public TryGetSubmesh(topology: SubmeshTopology, index: number): Submesh
	public TryGetSubmesh<T extends Submesh>(topology: SubmeshTopology | number = 0, index: number | T = 0): T {
		if (typeof index === "number") {
			if (topology == SubmeshTopology.Points)
				return this.TryGetSubmesh<PointSubmesh>(index, PointSubmesh as unknown as PointSubmesh) as unknown as T;
			if (topology == SubmeshTopology.Triangles)
				return this.TryGetSubmesh<TriangleSubmesh>(index, TriangleSubmesh as unknown as TriangleSubmesh) as unknown as T;
			throw new Error("Invalid submesh topology");
		} else {
			while (this.submeshes.Count <= topology)
				this.submeshes.Add(null as unknown as Submesh);
			let submesh = this.submeshes[topology];
			if (submesh instanceof (index as unknown as typeof Submesh))
				return submesh as T;
			if (submesh != null && submesh.Count != 0)
				return new (index as unknown as typeof PointSubmesh)(this) as unknown as T;
			let obj2 = this.InstantiateSubmesh<T>(index);
			this.submeshes[topology] = obj2;
			return obj2;
		}
	}

	private InstantiateSubmesh<T extends Submesh>(submesh: T): T {
		return new (submesh as unknown as typeof PointSubmesh)(this) as unknown as T
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
