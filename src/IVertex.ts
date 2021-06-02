import type { MeshX } from './MeshX';
import type { float3 } from './float3';
import type { float4 } from './float4';
import type { color } from './color';
import type { float2 } from './float2';
import type { BoneBinding } from './BoneBinding';
export interface IVertex {
  Mesh:MeshX
  Position:float3
  Normal:float3
  Tangent:float3
  Tangent4:float4
  Color:color
  UV0:float2
  UV1:float2
  UV2:float2
  UV3:float2
  BoneBinding:BoneBinding
  GetUV:(channel:number)=>float2
  SetUV: (channel:number, uv:float2)=>void
  GetBlendShapePositionDelta:(key:string, frame:number)=>float3;
  SetBlendShapePositionDelta:(key:string,delta:float3, frame:number)=>void
  GetBlendShapeNormalDelta:(key:string,frame:number)=>float3
  SetBlendShapeNormalDelta:(key:string,delta:float3,frame:number)=>void
  GetBlendShapeTangentDelta:(key:string,frame:number)=>float3
  SetBlendShapeTangentDelta:(key:string, delta:float3,frame:number)=>void
}