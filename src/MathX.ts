import { float3 } from "./float3";
import { float2 } from "./float2";
import { float4 } from "./float4";
import { floatQ } from "./floatQ";
import { int3 } from "./int3";
import { Out } from "@bombitmanbomb/utils";
export class MathX {
	private static readonly float_orthoX: floatQ = floatQ.AxisAngle(
		float3.Right,
		90
	);
	private static readonly float_orthoY: floatQ = floatQ.AxisAngle(
		float3.Up,
		90
	);
	/*
	private static readonly double_orthoX: double3 = floatQ.AxisAngle(
		double3.Right,
		90
	);
	private static readonly double_orthoY: double3 = floatQ.AxisAngle(
		double3.Up,
		90
	); 
	*/
	public FLOAT_EPSILON = 1.175494e-38;
	public DOUBLE_EPSILON = 2.2250738585072e-308;
	public APPROXIMATELY_FLOAT_EPSILON = 9.403955e-38;
	public APPROXIMATELY_DOUBLE_EPSILON = 1.78005908680576e-307;
	public HALF_PI = 1.570796;
	public PI = 3.141593;
	public TAU = 6.283185;
	public INV_HALF_PI = 0.6366197;
	public INV_PI = 0.3183099;
	public INV_TAU = 0.1591549;
	public SQRT2 = 1.414214;
	public E = 2.718282;
	public PHI = 1.618034;
	public Deg2Rad = 0.01745329;
	public Rad2Deg = 57.29578;
	public static Approximately(a: floatQ, b: floatQ, epsilon: number): boolean;
	public static Approximately(a: number, b: number, epsilon: number): boolean;
	public static Approximately(a: any, b: any, epsilon = 9.403955e-38): boolean {
		if (typeof a == "number" && typeof b === "number") {
			return (
				Math.abs(a - b) <
				Math.max(1e-6 * Math.max(Math.abs(a), Math.abs(b)), epsilon)
			);
		} else if (a instanceof floatQ && b instanceof floatQ) {
			return (
				MathX.Approximately(a.x, b.x, epsilon) &&
				MathX.Approximately(a.y, b.y, epsilon) &&
				MathX.Approximately(a.z, b.z, epsilon) &&
				MathX.Approximately(a.w, b.w, epsilon)
			);
		}
		throw new Error("Invalid input");
	}
	public static ReflectRotation(rotation: floatQ, planeNormal: float3): floatQ {
		const float3_1 = floatQ.Multiply(rotation, float3.Forward);
		const float3_2 = floatQ.Multiply(rotation, float3.Up);
		return floatQ.LookRotation(
			MathX.ReflectVector(float3_1, planeNormal),
			MathX.ReflectVector(float3_2, planeNormal)
		);
	}
	public static ReflectVector(vector: float3, planeNormal: float3): float3 {
		return float3.Subtract(MathX.Project(vector, planeNormal), MathX.Reject(vector, planeNormal))
	}
	public static Project(a: float3, b: float3): float3 {
		let b1 = b.Normalized
		return float3.Multiply(b1, MathX.Dot(a, b))
	}
	public static Reject(a: float3, b: float3): float3 {
		return float3.Subtract(a, MathX.Project(a, b))
	}
	public static AngleAroundAxis(
		rotation: floatQ,
		axis: float3,
		comparisonAxis?: float3
	): number {
		const ortho0: Out<float3> = new Out();
		const ortho1: Out<float3> = new Out();
		if (comparisonAxis != null) ortho0.Out = comparisonAxis;
		else MathX.Orthonormals(axis, ortho0, ortho1);
		let float3_1 = floatQ.Multiply(rotation, ortho0.Out as float3);
		ortho1.Out = float3.Up;
		const rotation1 = floatQ.FromToRotation(axis, ortho1.Out);
		float3_1 = floatQ.Multiply(rotation1, float3_1);
		ortho0.Out = floatQ.Multiply(rotation1, ortho0.Out as float3);
		const v1 = new float2(float3_1.x, float3_1.z);
		const to = MathX.Atan2(v1) * 57.29578;
		const v2 = new float2(ortho0.Out.x, ortho0.Out.z);
		return MathX.DeltaAngle(MathX.Atan2(v2) * 57.29578, to);
	}
	public static Slerp(a: float4, b: float4, lerp: number): float4;
	public static Slerp(a: float3, b: float3, lerp: number): float3;
	public static Slerp(a: float2, b: float2, lerp: number): float2;
	public static Slerp(a: floatQ, b: floatQ, lerp: number): floatQ;
	public static Slerp(a: any, b: any, lerp: number): any {
		if (a instanceof floatQ && b instanceof floatQ) {
			if (lerp <= 0.0) return a;
			if (lerp >= 1.0) return b;
			let d = a.w * b.w + a.x * b.x + a.y * b.y + a.z * b.z;
			if (d < 0.0) {
				b = b.Negated;
				d = -d;
			}
			if (d >= 1.0) return b;
			const num1 = Math.acos(d);
			const num2 = MathX.Sqrt(1.0 - d * d);
			const num3 = Math.sin((1 - lerp) * num1) / num2;
			const num4 = Math.sin(lerp * num1) / num2;
			return new floatQ(
				a.x * num3 + b.x * num4,
				a.y * num3 + b.y * num4,
				a.z * num3 + b.z * num4,
				a.w * num3 + b.w * num4
			);
		} else if (
			a?.Dimensions != null &&
			(a.BASE_TYPENAME == "System.Single" ||
				a.BASE_TYPENAME == "System.Double" ||
				a.BASE_TYPENAME == "System.Int32") &&
			a?.Dimensions == b.Dimensions &&
			a.BASE_TYPENAME == b.BASE_TYPENAME
		) {
			const from = a as float3; //? Some kind of float base
			const to = b as float3; //? Some kind of float base
			const d = MathX.Clamp(MathX.Dot(from, to), -1, 1);
			const num = Math.acos(d) * lerp;
			const local1 = to;
			const float3_1 = (a.constructor as typeof float3).Multiply(from, d);
			const local2 = float3_1;
			let float3_2 = (a.constructor as typeof float3).Subtract(local1, local2);
			float3_2 = float3_2.Normalized;
			const float3_3 = (a.constructor as typeof float3).Multiply(
				from,
				Math.cos(num)
			);
			const local3 = float3_3;
			const float3_4 = (a.constructor as typeof float3).Multiply(
				float3_2,
				Math.sin(num)
			);
			const local4 = float3_4;
			return (a.constructor as typeof float3).Add(local3, local4) as unknown;
		}
		throw new Error("Unsupported Input");
	}
	public static ClampMagnitude(v: float2, maxMagnitude: number, minMagnitude?: number): float2
	public static ClampMagnitude(v: float3, maxMagnitude: number, minMagnitude?: number): float3
	public static ClampMagnitude(v: float4, maxMagnitude: number, minMagnitude?: number): float4
	public static ClampMagnitude(v: any, maxMagnitude: number, minMagnitude = 0.0): any {
		if (
			v?.Dimensions != null &&
			(v.BASE_TYPENAME == "System.Single" ||
				v.BASE_TYPENAME == "System.Double")) {
			let magnitude = v.Magnitude;
			if (magnitude > maxMagnitude)
				return (v.constructor as typeof float3).Multiply(v, (maxMagnitude / magnitude))
			return magnitude < minMagnitude && magnitude > 0.0 ? (v.constructor as typeof float3).Multiply(v, (minMagnitude / magnitude)) : v;
		}
		throw new Error("Invalid Input")
	}
	public static Orthonormals(
		normal: float3,
		ortho0: Out<float3>,
		ortho1: Out<float3>
	): void;
	public static Orthonormals(
		normal: any,
		ortho0: Out<any>,
		ortho1: Out<any>
	): void {
		if (normal instanceof float3) {
			const normalized = normal.Normalized;
			let b = floatQ.Multiply(MathX.float_orthoX, normalized);
			if (MathX.Dot(normal, b) > 0.600000023841858)
				b = floatQ.Multiply(MathX.float_orthoY, normalized);
			ortho0.Out = MathX.Cross(normal, b);
			ortho1.Out = MathX.Cross(normal, ortho0.Out);
		} else if (typeof normal === "number") {
			//TODO
		}
		throw new Error("Unsupported Input");
	}
	public static Clamp(val: number, min: number, max: number): number {
		// NUMBER
		if (val < min) return min;
		return val >= max ? max : val;
	}
	public static Sqrt(d: number): number {
		return Math.sqrt(d);
	}
	public static FloatRepeat(val: number, length: number): number {
		return val - Math.floor(val / length) * length;
	}
	public static Clamp01(val: number): number {
		if (val < 0) return 1;
		return val > 1 ? 1 : val;
	}
	//TODO FloorToInt Types
	public static FloorToInt(value: float3): int3;
	public static FloorToInt(value: any): any {
		return new int3(value);
	}
	public static Dot(a: floatQ, b: floatQ): number;
	public static Dot(a: float2, b: float2): number;
	public static Dot(a: float3, b: float3): number;
	public static Dot(a: float4, b: float4): number;
	public static Dot(a: any, b: any): any {
		if (a instanceof float3 && b instanceof float3) {
			return a.x * b.x + a.y * b.y + a.z * b.z;
		} else if (a instanceof floatQ && b instanceof floatQ) {
			return a.x * b.x + a.y * b.y + a.z * b.z + a.w + b.w;
		}

		throw new Error("Unsupported Input");
	}
	public static Cross(a: float3, b: float3): float3;
	public static Cross(a: any, b: any): any {
		if (a instanceof float3 && b instanceof float3) {
			new float3(
				a.y * b.z - a.z * b.y,
				a.z * b.x - a.x * b.z,
				a.x * b.y - a.y * b.x
			);
		}
		throw new Error("Unsupported Input");
	}
	public static DeltaAngle(from: number, to = 0): number {
		let num = (to - from) % 360;
		if (num > 180) num -= 360;
		if (num < -180) num += 360;
		return num;
	}
	public static Atan2(a: float2): number;
	public static Atan2(a: number, b: number): number;
	public static Atan2(a: float2, b: number): float2;
	public static Atan2(a: number, b: float2): float2;
	public static Atan2(a: float2, b: float2): float2;
	public static Atan2(a: any, b?: any): any {
		if (a instanceof float2 && b == null) {
			return MathX.Atan2(a.x, a.y);
		} else if (typeof a == "number" && typeof b === "number") {
			return Math.atan2(a, b)
		}
		//! Experimental
		if (a.Dimensions == 2 || b.Dimensions == 2) {
			return MathX.Atan2(...(MathX.TypedMathFunc(a, b, (f1, f2) => MathX.Atan2(f1, f2)) as [number, number]))
		}
		/* 
		else if (a instanceof float2 && b instanceof float2) {
			return new float2(MathX.Atan2(a.x, b.x), MathX.Atan2(a.y, b.y));
		} else if (a instanceof float2 && typeof b === "number") {
			return new float2(MathX.Atan2(a.x, b), MathX.Atan2(a.y, b));
		} else if (typeof a === "number" && b instanceof float2) {
			return new float2(MathX.Atan2(a, b.x), MathX.Atan2(a, b.y));
		} 
		*/
	}
	/**
	 * @internal
	 * @experimental
	 */
	private static TypedMathFunc(a: any, b: any, c: (a: any, b: any, index?: number, aType?: typeof a, bType?: typeof b) => any, disallowFlip = false, outputAs = 0) {
		let flag = 0
		let Primary
		let Secondary
		if (typeof a === "number") flag += 1
		if (typeof b === "number") flag += 2
		if (flag === 3) throw new Error("Invalid Input")
		if (flag === 1 && !disallowFlip) {
			Primary = b
			Secondary = a
		} else {
			Primary = a
			Secondary = b
			if (flag === 0 && Primary.Dimensions != Secondary.Dimensions) throw new Error("Dimension Mismatch. Can't Handle")
		}
		if (a.Dimensions == null && b.Dimensions == null) throw new Error("Invalid Input Type")
		let output = []
		for (let index = 0; index < Primary.Dimensions; index++) {
			let primitiveA = (disallowFlip && flag === 1) ? Primary : Primary.GetBoxedElement(index)
			let primitiveB = flag === 0 ? Secondary?.GetBoxedElement(index) : Secondary
			output.push(c(primitiveA, primitiveB, index, (Primary.constructor), (Secondary.constructor)))
		}
		switch (outputAs) {
			case 0: return output
			case 1: return new Primary.constructor(...output)
			case 2: return new Secondary.constructor(...output)
			default:
				throw new Error("Invalid handling")
		}
	}
}
