import { float2 } from "./float2";
import { float3 } from "./float3";
import { Out } from "@bombitmanbomb/utils";
import { MathX } from "./MathX";
import { PrimitivesUtility } from "./PrimitivesUtility";
import { bool4 } from "./bool4";
import { float4 } from "./float4";
export class floatQ {
	public DIMENSIONS = 4;
	public BASE_TYPENAME = "System.Single";
	public COMPONENT_RATIO = 0.25;
	public x!: number;
	public y!: number;
	public z!: number;
	public w!: number;
	public get Dimensions(): 4 {
		return 4;
	}
	public static get Identity(): floatQ {
		return new floatQ(0, 0, 0, 1);
	}
	public static get MinValue(): floatQ {
		return new floatQ(-1, -1, -1, -1);
	}
	public static get MaxValue(): floatQ {
		return new floatQ(1, 1, 1, 1);
	}
	public get X(): number {
		return this.x;
	}
	public get Y(): number {
		return this.y;
	}
	public get Z(): number {
		return this.z;
	}
	public get W(): number {
		return this.w;
	}
	public THIS(n: number): number {
		switch (n) {
		case 0:
			return this.x;
		case 1:
			return this.y;
		case 2:
			return this.z;
		case 3:
			return this.w;
		default:
			throw new Error("Invalid vector element index");
		}
	}
	public SetComponent(value: number, index: number): floatQ {
		switch (index) {
		case 0:
			return new floatQ(value, this.y, this.z, this.z);
		case 1:
			return new floatQ(this.x, value, this.z, this.z);
		case 2:
			return new floatQ(this.x, this.y, value, this.z);
		case 3:
			return new floatQ(this.x, this.y, this.z, value);
		default:
			throw new Error("Invalid vector element index");
		}
	}
	public GetBoxedElement(n: number): number {
		return this.THIS(n);
	}
	public get ElementType(): "float" {
		return "float";
	}
	constructor();
	constructor(x: number, y: number, z: number, w: number);
	constructor(xy: float2, z: number, w: number);
	constructor(x: number, yz: float2, w: number);
	constructor(x: number, y: number, zw: float2);
	constructor(xy: float2, zw: float2);
	constructor(xyz: float3, w: number);
	constructor(x: number, yzw: float3);
	constructor(xyzw: floatQ);
	constructor(
		x?: number | float2 | float3 | floatQ,
		y?: number | float2 | float3,
		z?: number | float2,
		w?: number
	) {
		this.floatQ(x as number, y as number, z as number, w as number);
	}
	public floatQ(): void;
	public floatQ(x: number, y: number, z: number, w: number): void;
	public floatQ(xy: float2, z: number, w: number): void;
	public floatQ(x: number, yz: float2, w: number): void;
	public floatQ(x: number, y: number, zw: float2): void;
	public floatQ(xy: float2, zw: float2): void;
	public floatQ(xyz: float3, w: number): void;
	public floatQ(x: number, yzw: float3): void;
	public floatQ(xyzw: floatQ | float4): void;
	public floatQ(
		x: number | float2 | float3 | float4 | floatQ = 0,
		y: number | float2 | float3 = 0,
		z: number | float2 = 0,
		w = 0
	): void {
		if (
			typeof x == "number" &&
			typeof y == "number" &&
			typeof z == "number" &&
			typeof w == "number"
		) {
			this.x = x;
			this.y = y;
			this.z = z;
			this.w = w;
			return;
		} else if (
			x instanceof float2 &&
			typeof y == "number" &&
			typeof z == "number"
		) {
			this.x = x.x;
			this.y = x.y;
			this.z = y;
			this.w = z;
			return;
		} else if (x instanceof float2 && y instanceof float2) {
			this.x = x.X;
			this.y = x.y;
			this.z = y.x;
			this.w = y.y;
			return;
		} else if (
			typeof x == "number" &&
			y instanceof float2 &&
			typeof z == "number"
		) {
			this.x = x;
			this.y = y.x;
			this.z = y.y;
			this.w = z;
			return;
		} else if (
			typeof x == "number" &&
			typeof y == "number" &&
			z instanceof float2
		) {
			this.x = x;
			this.y = y;
			this.z = z.x;
			this.w = z.y;
			return;
		} else if (x instanceof float3 && typeof y == "number") {
			this.x = x.x;
			this.y = x.y;
			this.z = x.z;
			this.w = y;
			return;
		} else if (typeof x == "number" && y instanceof float3) {
			this.x = x;
			this.y = y.x;
			this.z = y.y;
			this.w = y.z;
			return;
		} else if (x instanceof floatQ || x instanceof float4) {
			this.x = x.x;
			this.y = x.y;
			this.z = x.z;
			this.w = x.w;
			return;
		} else {
			throw new Error("Invalid Input");
		}
	}
	public get Normalized(): floatQ {
		const num = 1 / this.Magnitude;
		return floatQ.Multiply(this, num);
	}
	public get FastNormalized(): floatQ {
		const sqrMagnitude = this.SqrMagnitude;
		if (Math.abs(1 - sqrMagnitude) < 2.1073420342077e-8) {
			const num = 2.0 / (1.0 + sqrMagnitude);
			return floatQ.Multiply(this, num);
		}
		const num1 = 1 / MathX.Sqrt(this.SqrMagnitude);
		return floatQ.Multiply(this, num1);
	}
	public get IsIdentity(): boolean {
		return (
			Math.abs(this.x) < 9.99999974737875e-6 &&
			Math.abs(this.y) < 9.99999974737875e-6 &&
			Math.abs(this.z) < 9.99999974737875e-6 &&
			Math.abs(this.w - 1) < 9.99999974737875e-6
		);
	}
	public get IsValid(): boolean {
		const sqrMagnitude = this.SqrMagnitude;
		return sqrMagnitude > 0.899999976158142 && sqrMagnitude < 1.10000002384186;
	}
	public get SqrMagnitude(): number {
		return (
			this.x * this.x + this.y * this.y + this.z * this.z + this.w * this.w
		);
	}
	public get Magnitude(): number {
		return MathX.Sqrt(this.SqrMagnitude);
	}
	public get IsNaN(): boolean {
		return isNaN(this.x) || isNaN(this.y) || isNaN(this.z) || isNaN(this.w);
	}
	public get IsInfinity(): boolean {
		return (
			!isFinite(this.x) ||
			!isFinite(this.y) ||
			!isFinite(this.z) ||
			!isFinite(this.w)
		);
	}
	public get Negated(): floatQ {
		return floatQ.Multiply(-1, this);
	}
	public get Conjugated(): floatQ {
		return new floatQ(-this.x, -this.y, -this.z, -this.w);
	}
	public get Inverted(): floatQ {
		return this.Conjugated;
	}
	public get EulerAngles(): float3 {
		const eulerAnglesRad = this.EulerAnglesRad;
		return float3.Multiply(eulerAnglesRad, 57.29578);
	}
	public get EulerAnglesRad(): float3 {
		return new float3(
			Math.asin(MathX.Clamp(2.0 * (this.x * this.w - this.z * this.y), -1, 1)),
			Math.atan2(
				2.0 * (this.w * this.y + this.z * this.x),
				1.0 - 2.0 * (this.x * this.x + this.y * this.y)
			),
			Math.atan2(
				2.0 * (this.y * this.x + this.z * this.w),
				1.0 - 2.0 * (this.x * this.x + this.z * this.z)
			)
		);
	}
	public static AxisAngle(axis: float3, angle: number): floatQ {
		return floatQ.AxisAngleRad(axis, angle * (Math.PI / 180));
	}
	public static AxisAngleRad(axis: float3, radians: number): floatQ {
		radians *= 0.5;
		axis = float3.Multiply(axis.Normalized, Math.sin(radians));
		return new floatQ(axis.x, axis.y, axis.z, Math.cos(radians));
	}
	public static LookRotation(forward: float3): floatQ;
	public static LookRotation(forward: float3, up: float3): floatQ;
	public static LookRotation(forward: float3, up: float3 = float3.Up): floatQ {
		const local1 = forward;
		const zero1 = float3.Zero;
		const local2 = zero1;
		if (float3.Equals(local1, local2)) return floatQ.Identity;
		const normalized = forward.Normalized;
		let b = MathX.Cross(up, normalized);
		const local3 = b;
		const zero2 = float3.Zero;
		const local4 = zero2;
		if (float3.Equals(local3, local4)) {
			b = floatQ.Multiply(floatQ.Euler(-90, 0.0, 0.0), normalized);
		} else b = b.Normalized;
		const float3_1 = MathX.Cross(normalized, b);
		const num1 = b.x + float3_1.y + normalized.z;
		let w;
		let x;
		let y;
		let z;
		if (num1 > 0.0) {
			const num2 = MathX.Sqrt(num1 + 1);
			w = num2 * 0.5;
			const num3 = 0.5 / num2;
			x = (float3_1.z - normalized.y) * num3;
			y = (normalized.x - b.z) * num3;
			z = (b.y - float3_1.x) * num3;
		} else if (b.x >= float3_1.y && b.x >= normalized.z) {
			const num2 = MathX.Sqrt(1 + b.x - float3_1.y - normalized.z);
			const num3 = 0.5 / num2;
			x = 0.5 * num2;
			y = (b.y + float3_1.x) * num3;
			z = (b.z + normalized.x) * num3;
			w = (float3_1.z - normalized.y) * num3;
		} else if (float3_1.y > normalized.z) {
			const num2 = MathX.Sqrt(1 + float3_1.y - b.x - normalized.z);
			const num3 = 0.5 / num2;
			x = (float3_1.x + b.y) * num3;
			y = 0.5 * num2;
			z = (normalized.y + float3_1.z) * num3;
			w = (normalized.x - b.z) * num3;
		} else {
			const num2 = MathX.Sqrt(1 + normalized.z - b.x - float3_1.y);
			const num3 = 0.5 / num2;
			x = (normalized.x + b.z) * num3;
			y = (normalized.y + float3_1.z) * num3;
			z = 0.5 * num2;
			w = (b.y - float3_1.x) * num3;
		}
		return new floatQ(x, y, z, w);
	}
	public static Euler(x: number, y: number, z: number): floatQ;
	public static Euler(rotation: float3): floatQ;
	public static Euler(
		rotation: float3 | number,
		y?: number,
		z?: number
	): floatQ {
		if (
			typeof rotation == "number" &&
			typeof y == "number" &&
			typeof z == "number"
		) {
			return floatQ.Euler(new float3(rotation, y, z));
		} else if (rotation instanceof float3) {
			const rotation1 = float3.Multiply(rotation, Math.PI / 180);
			return floatQ.EulerRad(rotation1);
		}
		throw new Error("Invalid Arguments");
	}

	public static EulerRad(x: number, y: number, z: number): floatQ;
	public static EulerRad(rotation: float3): floatQ;
	public static EulerRad(
		rotation: number | float3,
		y?: number,
		z?: number
	): floatQ {
		if (
			typeof rotation == "number" &&
			typeof y == "number" &&
			typeof z == "number"
		) {
			return floatQ.EulerRad(new float3(rotation, y, z));
		} else if (rotation instanceof float3) {
			const float3_1 = float3.Multiply(rotation, 0.5);
			const num1 = Math.sin(float3_1.x);
			const num2 = Math.sin(float3_1.y);
			const num3 = Math.sin(float3_1.z);
			const num4 = Math.cos(float3_1.x);
			const num5 = Math.cos(float3_1.y);
			const num6 = Math.cos(float3_1.z);
			return new floatQ(
				num5 * num1 * num6 + num2 * num4 * num3,
				num2 * num4 * num6 - num5 * num1 * num3,
				num5 * num4 * num3 - num2 * num1 * num6,
				num5 * num4 * num6 + num2 * num1 * num3
			);
		}
		throw new Error("Invalid Arguments");
	}

	public static FromToRotation(
		from: float3 | floatQ,
		to: float3 | floatQ
	): floatQ {
		if (from instanceof float3 && to instanceof float3) {
			const num = MathX.Dot(from, to);
			if (!float3.Equals(from, to)) {
				let a = float3.Zero;
				if (!float3.Equals(from, to)) {
					const zero = float3.Zero;
					if (!float3.Equals(to, zero)) {
						const float3_1 = MathX.Cross(from, to);
						if (float3_1.SqrMagnitude > 9.99999993922529e-9 || num >= 0.0)
							return new floatQ(
								float3_1.x,
								float3_1.y,
								float3_1.z,
								MathX.Sqrt(from.SqrMagnitude * to.SqrMagnitude) + num
							).Normalized;
						a = new float3(1, 0, 0);
						let float3_2 = MathX.Cross(a, from);
						if (float3_2.SqrMagnitude <= 9.99999993922529e-9) {
							a = new float3(0, 1, 0);
							float3_2 = MathX.Cross(a, from);
						}
						return floatQ.AxisAngleRad(float3_2.Normalized, 3.141593);
					}
				}
			}
			return floatQ.Identity;
		} else if (from instanceof floatQ && to instanceof floatQ) {
			return floatQ.Multiply(to, from.Inverted);
		}
		throw new Error("Invalid input");
	}

	public toString(): string {
		return `[${this.x};${this.y};${this.z};${this.w}]`;
	}
	public static Parse(s: string): floatQ {
		const elements = PrimitivesUtility.ExtractElements(s, 4) as [
			string,
			string,
			string,
			string
		];
		return new floatQ(
			parseFloat(elements[0]),
			parseFloat(elements[1]),
			parseFloat(elements[2]),
			parseFloat(elements[3])
		);
	}
	public static TryParse(s: string, val: Out<floatQ>): boolean {
		const elements = PrimitivesUtility.ExtractElements(s, 4) as [
			string,
			string,
			string,
			string
		];
		if (elements == null) {
			val.Out = new floatQ();
			return false;
		}
		val.Out = new floatQ(
			parseFloat(elements[0]),
			parseFloat(elements[1]),
			parseFloat(elements[2]),
			parseFloat(elements[3])
		);
		return true;
	}
	public static DistanceSqr(a: floatQ, b: floatQ): number {
		return (
			(a.x - b.x) * (a.x - b.x) +
			(a.y - b.y) * (a.y - b.y) +
			(a.z - b.z) * (a.z - b.z) +
			(a.w - b.w) * (a.w - b.w)
		);
	}
	public static Distance(a: floatQ, b: floatQ): number {
		return MathX.Sqrt(
			(a.x - b.x) * (a.x - b.x) +
				(a.y - b.y) * (a.y - b.y) +
				(a.z - b.z) * (a.z - b.z) +
				(a.w - b.w) * (a.w - b.w)
		);
	}
	public Mask(mask: bool4, masked: floatQ | number): floatQ {
		if (masked instanceof floatQ) {
			return new floatQ(
				mask.x ? this.x : masked.x,
				mask.y ? this.y : masked.y,
				mask.z ? this.z : masked.z,
				mask.w ? this.w : masked.w
			);
		} else {
			return new floatQ(
				mask.x ? this.x : masked,
				mask.y ? this.y : masked,
				mask.z ? this.z : masked,
				mask.w ? this.w : masked
			);
		}
	}
	public static Add(a: floatQ, b: floatQ): floatQ;
	public static Add(a: number, b: floatQ): floatQ;
	public static Add(a: floatQ, b: number): floatQ;
	public static Add(a: floatQ | number, b: floatQ | number): floatQ {
		if (a instanceof floatQ && b instanceof floatQ) {
			return new floatQ(a.x + b.x, a.y + b.y, a.z + b.z, a.w + b.w);
		} else if (typeof a == "number" && b instanceof floatQ) {
			return new floatQ(a + b.x, a + b.y, a + b.z, a + b.w);
		} else if (a instanceof floatQ && typeof b == "number") {
			return new floatQ(a.x + b, a.y + b, a.z + b, a.w + b);
		}
		throw new Error("Invalid Parameters");
	}
	public static Subtract(a: floatQ, b: floatQ): floatQ;
	public static Subtract(a: number, b: floatQ): floatQ;
	public static Subtract(a: floatQ, b: number): floatQ;
	public static Subtract(a: floatQ | number, b: floatQ | number): floatQ {
		if (a instanceof floatQ && b instanceof floatQ) {
			return new floatQ(a.x - b.x, a.y - b.y, a.z - b.z, a.w - b.w);
		} else if (typeof a == "number" && b instanceof floatQ) {
			return new floatQ(a - b.x, a - b.y, a - b.z, a - b.w);
		} else if (a instanceof floatQ && typeof b == "number") {
			return new floatQ(a.x - b, a.y - b, a.z - b, a.w - b);
		}
		throw new Error("Invalid Parameters");
	}
	public static Multiply(a: floatQ, b: floatQ): floatQ;
	public static Multiply(a: number, b: floatQ): floatQ;
	public static Multiply(a: floatQ, b: number): floatQ;
	public static Multiply(q: floatQ, v: float3): float3;
	public static Multiply(
		a: floatQ | number,
		b: floatQ | number | float3
	): floatQ | float3 {
		if (a instanceof floatQ && b instanceof float3) {
			const num1 = a.x + a.x;
			const num2 = a.y + a.y;
			const num3 = a.z + a.z;
			const num4 = a.w * num1;
			const num5 = a.w * num2;
			const num6 = a.w * num3;
			const num7 = a.x * num1;
			const num8 = a.x * num2;
			const num9 = a.x * num3;
			const num10 = a.y * num2;
			const num11 = a.y * num3;
			const num12 = a.z * num3;
			const num13 = 1 - num10 - num12;
			const num14 = num8 - num6;
			const num15 = num9 + num5;
			const num16 = num8 + num6;
			const num17 = 1 - num7 - num12;
			const num18 = num11 - num4;
			const num19 = num9 - num5;
			const num20 = num11 + num4;
			const num21 = 1 - num7 - num10;
			return new float3(
				b.x * num13 + b.y * num14 + b.z * num15,
				b.x * num16 + b.y * num17 + b.z * num18,
				b.x * num19 + b.y * num20 + b.z * num21
			);
		} else if (a instanceof floatQ && b instanceof floatQ) {
			return new floatQ(a.x * b.x, a.y * b.y, a.z * b.z, a.w * b.w);
		} else if (typeof a == "number" && b instanceof floatQ) {
			return new floatQ(a * b.x, a * b.y, a * b.z, a * b.w);
		} else if (a instanceof floatQ && typeof b == "number") {
			return new floatQ(a.x * b, a.y * b, a.z * b, a.w * b);
		}
		throw new Error("Invalid Parameters");
	}
	public static Divide(a: floatQ, b: floatQ): floatQ;
	public static Divide(a: number, b: floatQ): floatQ;
	public static Divide(a: floatQ, b: number): floatQ;
	public static Divide(a: floatQ | number, b: floatQ | number): floatQ {
		if (a instanceof floatQ && b instanceof floatQ) {
			return new floatQ(a.x / b.x, a.y / b.y, a.z / b.z, a.w / b.w);
		} else if (typeof a == "number" && b instanceof floatQ) {
			return new floatQ(a / b.x, a / b.y, a / b.z, a / b.w);
		} else if (a instanceof floatQ && typeof b == "number") {
			return new floatQ(a.x / b, a.y / b, a.z / b, a.w / b);
		}
		throw new Error("Invalid Parameters");
	}
	public static Modulo(a: floatQ, b: floatQ): floatQ;
	public static Modulo(a: number, b: floatQ): floatQ;
	public static Modulo(a: floatQ, b: number): floatQ;
	public static Modulo(a: floatQ | number, b: floatQ | number): floatQ {
		if (a instanceof floatQ && b instanceof floatQ) {
			return new floatQ(a.x % b.x, a.y % b.y, a.z % b.z, a.w % b.w);
		} else if (typeof a == "number" && b instanceof floatQ) {
			return new floatQ(a % b.x, a % b.y, a % b.z, a % b.w);
		} else if (a instanceof floatQ && typeof b == "number") {
			return new floatQ(a.x % b, a.y % b, a.z % b, a.w % b);
		}
		throw new Error("Invalid Parameters");
	}
	public static Equals(a: floatQ, b: floatQ): boolean {
		return MathX.Dot(a, b) > 0.999998986721039;
	}

	public Equals(other: floatQ): boolean {
		return (
			this.x == other.x &&
			this.y == other.y &&
			this.z == other.z &&
			this.w == other.w
		);
	}
	public static EQUAL(a: floatQ, b: number): bool4;
	public static EQUAL(a: floatQ, b: floatQ): bool4;
	public static EQUAL(a: number, b: floatQ): bool4;
	public static EQUAL(a: floatQ | number, b: floatQ | number): bool4 {
		if (a instanceof floatQ && b instanceof floatQ) {
			return new bool4(a.x == b.x, a.y == b.y, a.z == b.z, a.w == b.w);
		}
		if (typeof a == "number" && b instanceof floatQ) {
			return new bool4(b.x == a, b.y == a, b.z == a, b.w == a);
		}
		if (a instanceof floatQ && typeof b == "number") {
			return new bool4(a.x == b, a.y == b, a.z == b, a.w == b);
		}
		throw new Error("Invalid Input");
	}
	public static NOTEQUAL(a: floatQ, b: number): bool4;
	public static NOTEQUAL(a: number, b: floatQ): bool4;
	public static NOTEQUAL(a: floatQ | number, b: floatQ | number): bool4 {
		if (a instanceof floatQ && b instanceof floatQ) {
			return new bool4(a.x != b.x, a.y != b.y, a.z != b.z, a.w != b.w);
		}
		if (a instanceof floatQ && typeof b == "number")
			return new bool4(a.x != b, a.y != b, a.z != b, a.w != b);
		if (typeof a == "number" && b instanceof floatQ)
			return new bool4(b.x != a, b.y != a, b.z != a, b.w != a);
		throw new Error("Invalid input");
	}
	public static GREATER(a: floatQ, b: number): bool4;
	public static GREATER(a: floatQ, b: floatQ): bool4;
	public static GREATER(a: number, b: floatQ): bool4;
	public static GREATER(a: floatQ | number, b: floatQ | number): bool4 {
		if (a instanceof floatQ && b instanceof floatQ) {
			return new bool4(a.x > b.x, a.y > b.y, a.z > b.z, a.w > b.w);
		}
		if (typeof a == "number" && b instanceof floatQ) {
			return new bool4(a > b.x, a > b.y, a > b.z, a > b.w);
		}
		if (a instanceof floatQ && typeof b == "number") {
			return new bool4(a.x > b, a.y > b, a.z > b, a.w > b);
		}
		throw new Error("Invalid Input");
	}
	public static LESS(a: floatQ, b: number): bool4;
	public static LESS(a: floatQ, b: floatQ): bool4;
	public static LESS(a: number, b: floatQ): bool4;
	public static LESS(a: floatQ | number, b: floatQ | number): bool4 {
		if (a instanceof floatQ && b instanceof floatQ) {
			return new bool4(a.x < b.x, a.y < b.y, a.z < b.z, a.w < b.w);
		}
		if (typeof a == "number" && b instanceof floatQ) {
			return new bool4(a < b.x, a < b.y, a < b.z, a < b.w);
		}
		if (a instanceof floatQ && typeof b == "number") {
			return new bool4(a.x < b, a.y < b, a.z < b, a.w < b);
		}
		throw new Error("Invalid Input");
	}
	public static GREATEREQUAL(a: floatQ, b: number): bool4;
	public static GREATEREQUAL(a: floatQ, b: floatQ): bool4;
	public static GREATEREQUAL(a: number, b: floatQ): bool4;
	public static GREATEREQUAL(a: floatQ | number, b: floatQ | number): bool4 {
		if (a instanceof floatQ && b instanceof floatQ) {
			return new bool4(a.x >= b.x, a.y >= b.y, a.z >= b.z, a.w >= b.w);
		}
		if (typeof a == "number" && b instanceof floatQ) {
			return new bool4(a >= b.x, a >= b.y, a >= b.z, a >= b.w);
		}
		if (a instanceof floatQ && typeof b == "number") {
			return new bool4(a.x >= b, a.y >= b, a.z >= b, a.w >= b);
		}
		throw new Error("Invalid Input");
	}
	public static LESSEQUAL(a: floatQ, b: number): bool4;
	public static LESSEQUAL(a: floatQ, b: floatQ): bool4;
	public static LESSEQUAL(a: number, b: floatQ): bool4;
	public static LESSEQUAL(a: floatQ | number, b: floatQ | number): bool4 {
		if (a instanceof floatQ && b instanceof floatQ) {
			return new bool4(a.x <= b.x, a.y <= b.y, a.z <= b.z, a.w <= b.w);
		}
		if (typeof a == "number" && b instanceof floatQ) {
			return new bool4(a <= b.x, a <= b.y, a <= b.z, a <= b.w);
		}
		if (a instanceof floatQ && typeof b == "number") {
			return new bool4(a.x <= b, a.y <= b, a.z <= b, a.w <= b);
		}
		throw new Error("Invalid Input");
	}
	public GetHashCode(): number {
		return (((((this.x * 397) ^ this.y) * 397) ^ this.z) * 397) ^ this.w;
	}
	toJSON(): { x: number; y: number; z: number; w: number } {
		return { x: this.x, y: this.y, z: this.z, w: this.w };
	}
}
