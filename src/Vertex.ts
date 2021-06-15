import { IVertex } from "./IVertex";
import { MeshX } from "./MeshX";
import { float3 } from "./float3";
import { float4 } from "./float4";
import { color } from "./color";
import { BoneBinding } from "./BoneBinding";
import { float2 } from "./float2";
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

	public Copy(v: Vertex): void {
		this.Position = v.Position;
		if (v.Mesh.HasNormals) this.Normal = v.Normal;
		if (v.Mesh.HasTangents) this.Tangent4 = v.Tangent4;
		if (v.Mesh.HasColors) this.Color = v.Color;
		for (
			let uvChannel1 = 0;
			uvChannel1 < v.Mesh.UV_ChannelCount;
			uvChannel1++
		) {
			const uvChannel2 = uvChannel1;
			const uv = v.GetUV(uvChannel1);
			this.SetUV(uvChannel2, uv);
		}
		if (!v.Mesh.HasBoneBindings) return;
		this.BoneBinding = v.BoneBinding;
	}
	public get IndexUnsafe(): number {
		return this.index;
	}
	public get Index(): number {
		this.UpdateIndex();
		return this.index;
	}
	public get Position(): float3 {
		this.UpdateIndex();
		return this.meshx.positions[this.index];
	}
	public set Position(value: float3) {
		this.UpdateIndex();
		this.meshx.positions[this.index] = value;
	}
	public get PositionUnsafe(): float3 {
		return this.meshx.positions[this.index];
	}
	public set PositionUnsafe(value: float3) {
		this.meshx.positions[this.index] = value;
	}
	public get NormalUnsafe(): float3 {
		return this.meshx.normals[this.index];
	}

	public get Normal(): float3 {
		this.UpdateIndex();
		this.meshx.CheckNormals();
		return this.meshx.normals[this.index];
	}
	public set Normal(value: float3) {
		this.UpdateIndex();
		this.meshx.HasNormals = true;
		this.meshx.normals[this.index] = value;
	}

	public get Tangent4Unsafe(): float4 {
		return this.meshx.tangents[this.index];
	}

	public get Tangent(): float3 {
		const tan: float4 = this.Tangent4;
		return new float3(tan.x, tan.y, tan.z);
	}
	public set Tangent(value: float3 | float4) {
		this.Tangent4 = new float4(value.x, value.y, value.z, -1);
	}

	public get Tangent4(): float4 {
		this.UpdateIndex();
		this.meshx.CheckTangents();
		return this.meshx.tangents[this.index];
	}

	public set Tangent4(value: float4) {
		this.UpdateIndex();
		this.meshx.CheckTangents();
		this.meshx.tangents[this.index] = value;
	}

	public get ColorUnsafe(): color {
		return this.meshx.colors[this.index];
	}
	public get Color(): color {
		this.UpdateIndex();
		this.meshx.CheckColors();
		return this.meshx.colors[this.index];
	}
	public set Color(value: color) {
		this.UpdateIndex();
		this.meshx.HasColors = true;
		this.meshx.colors[this.index] = value;
	}
	public get BoneBindingUnsafe(): BoneBinding {
		return this.meshx.boneBindings[this.index];
	}

	public get BoneBinding(): BoneBinding {
		this.UpdateIndex();
		this.meshx.CheckBoneBindings();
		return this.meshx.boneBindings[this.index];
	}
	public set BoneBinding(value: BoneBinding) {
		this.UpdateIndex();
		this.meshx.HasBoneBindings = true;
		this.meshx.boneBindings[this.index] = value;
	}

	public get UV0Unsafe(): float2 {
		return this.meshx.uv_channels[0].uv_2D[this.index];
	}
	public get UV1Unsafe(): float2 {
		return this.meshx.uv_channels[1].uv_2D[this.index];
	}
	public get UV2Unsafe(): float2 {
		return this.meshx.uv_channels[2].uv_2D[this.index];
	}
	public get UV3Unsafe(): float2 {
		return this.meshx.uv_channels[3].uv_2D[this.index];
	}
	public get UV0(): float2 {
		return this.GetUV(0);
	}
	public set UV0(v: float2) {
		this.SetUV(0, v);
	}
	public get UV1(): float2 {
		return this.GetUV(1);
	}
	public set UV1(v: float2) {
		this.SetUV(1, v);
	}
	public get UV2(): float2 {
		return this.GetUV(2);
	}
	public set UV2(v: float2) {
		this.SetUV(2, v);
	}
	public get UV3(): float2 {
		return this.GetUV(3);
	}
	public set UV3(v: float2) {
		this.SetUV(3, v);
	}
	public GetUV(uvChannel: number): float2 {
		this.UpdateIndex();
		this.meshx.CheckUV(uvChannel);
		return this.meshx.GetRawUVs()[this.index];
	}
	public GetUV_Auto(uvChannel: number): float4 {
		this.UpdateIndex();
		const rawUvArray = this.meshx.TryGetRawUV_Array(uvChannel);
		if (rawUvArray.uv_2D != null)
			return new float4(rawUvArray.uv_2D[this.index], 0, 0);
		if (rawUvArray.uv_3D != null)
			return new float4(rawUvArray.uv_3D[this.index], 0);
		return rawUvArray.uv_4D != null
			? rawUvArray.uv_4D[this.index]
			: new float4();
	}
	public SetUV(uvChannel: number, uv: float2): void {
		this.UpdateIndex();
		this.meshx.SetHasUV(uvChannel, true);
		this.meshx.GetRawUVs(uvChannel)[this.index] = uv;
	}

	public get FlagUnsafe(): boolean {
		return this.meshx.flags[this.index];
	}
	public set FlagUnsafe(v: boolean) {
		this.meshx.flags[this.index] = v;
	}
	public get Flag(): boolean {
		this.UpdateIndex();
		this.meshx.CheckFlags();
		return this.meshx.flags[this.index];
	}
	public set Flag(v: boolean) {
		this.UpdateIndex();
		this.meshx.HasFlags = true;
		this.meshx.flags[this.index] = v;
	}
	public GetBlendShapePositionDelta(key: string, frame = 0): float3 {
		this.UpdateIndex();
		return this.meshx.GetBlendShape(key).THIS(frame).positions[this.index];
	}

	public SetBlendShapePositionDelta(
		key: string,
		delta: float3,
		frame = 0
	): void {
		this.UpdateIndex();
		this.meshx.GetBlendShape(key).THIS(frame).positions[this.index] = delta;
	}

	public GetBlendShapeNormalDelta(key: string, frame = 0): float3 {
		this.UpdateIndex();
		return this.meshx.GetBlendShape(key).THIS(frame).normals[this.index];
	}

	public SetBlendShapeNormalDelta(key: string, delta: float3, frame = 0): void {
		this.UpdateIndex();
		this.meshx.GetBlendShape(key).THIS(frame).SetNormalDelta(this.index, delta);
	}

	public GetBlendShapeTangentDelta(key: string, frame = 0): float3 {
		this.UpdateIndex();
		return this.meshx.GetBlendShape(key).THIS(frame).tangents[this.index];
	}

	public SetBlendShapeTangentDelta(
		key: string,
		delta: float3,
		frame = 0
	): void {
		this.UpdateIndex();
		this.meshx
			.GetBlendShape(key)
			.THIS(frame)
			.SetTangentDelta(this.index, delta);
	}
	public SetPosition(value: float3): void {
		this.Position = value;
	}

	public SetNormal(value: float3): void {
		this.Normal = value;
	}
	public SetTangent(value: float3): void {
		this.Tangent = value;
	}

	public SetTangent4(value: float4): void {
		this.Tangent4 = value;
	}

	public SetColor(value: color): void {
		this.Color = value;
	}

	public SetFlag(value: boolean): void {
		this.Flag = value;
	}
	/**@intenal */
	public UpdateIndex(): boolean {
		if (this.version < 0) {
			if (this.version != this.meshx.VerticesVersion)
				throw new Error(
					"Vertex has been invalidated, index: " + this.index.toString()
				);
		} else if (this.version != this.meshx.vertexIDs[this.index]) {
			const index = this.index;
			while (this.index > 0 && this.meshx.vertexIDs[this.index] > this.version)
				this.index++;
			if (this.meshx.vertexIDs[this.index] != this.version)
				throw new Error(
					"Vertex has been removed, original index: " +
						index.toString() +
						", version: " +
						this.version.toString()
				);
			return true;
		}
		return false;
	}
}
