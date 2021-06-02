import { float2 } from "./float2";
import { float3 } from "./float3";
import { Out } from "@bombitmanbomb/utils";
import { MathX } from "./MathX";
import { PrimitivesUtility } from "./PrimitivesUtility";
import { bool4 } from "./bool4";
export class float4 {
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
	public static get Zero(): float4 {
		return new float4();
	}
	public static get One(): float4 {
		return new float4(1, 1, 1, 1);
	}
	public static get MinValue(): float4 {
		return new float4(
			-3.40282347e38,
			-3.40282347e38,
			-3.40282347e38,
			-3.40282347e38
		);
	}
	public static get MaxValue(): float4 {
		return new float4(
			3.40282347e38,
			3.40282347e38,
			3.40282347e38,
			3.40282347e38
		);
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
	public SetComponent(value: number, index: number): float4 {
		switch (index) {
		case 0:
			return new float4(value, this.y, this.z, this.z);
		case 1:
			return new float4(this.x, value, this.z, this.z);
		case 2:
			return new float4(this.x, this.y, value, this.z);
		case 3:
			return new float4(this.x, this.y, this.z, value);
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
	constructor(xyzw: float4);
	constructor(
		x?: number | float2 | float3 | float4,
		y?: number | float2 | float3,
		z?: number | float2,
		w?: number
	) {
		this.float4(x as number, y as number, z as number, w as number);
	}
	public float4(): void;
	public float4(x: number, y: number, z: number, w: number): void;
	public float4(xy: float2, z: number, w: number): void;
	public float4(x: number, yz: float2, w: number): void;
	public float4(x: number, y: number, zw: float2): void;
	public float4(xy: float2, zw: float2): void;
	public float4(xyz: float3, w: number): void;
	public float4(x: number, yzw: float3): void;
	public float4(xyzw: float4): void;
	public float4(
		x: number | float2 | float3 | float4 = 0,
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
		} else if (x instanceof float4) {
			this.x = x.x;
			this.y = x.y;
			this.z = x.z;
			this.w = x.w;
			return;
		} else {
			throw new Error("Invalid Input");
		}
	}
	public GetNormalized(magnitude: Out<number>): float4 {
		magnitude.Out = this.Magnitude;
		if (magnitude.Out == 0) return float4.Zero;
		return float4.Multiply(this, 1 / (magnitude.Out as number));
	}
	public get Normalized(): float4 {
		if (float4.Equals(this, float4.Zero)) return this;
		return float4.Multiply(this, 1 / this.Magnitude);
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
	public IsUniform(tolerance = 1e-5): boolean {
		const num = Math.min(this.x, this.y, this.z, this.w) * tolerance;
		return (
			Math.abs(this.x - this.y) <= num &&
			Math.abs(this.y - this.z) <= num &&
			Math.abs(this.z - this.w) <= num
		);
	}
	public Approximately(v: float4, tolerance: number): boolean {
		return (
			Math.abs(this.x - v.x) < tolerance &&
			Math.abs(this.y - v.y) < tolerance &&
			Math.abs(this.z - v.z) < tolerance &&
			Math.abs(this.w - v.w) < tolerance
		);
	}
	public toString(): string {
		return `[${this.x};${this.y};${this.z};${this.w}]`;
	}
	public static Parse(s: string): float4 {
		const elements = PrimitivesUtility.ExtractElements(s, 4) as [
			string,
			string,
			string,
			string
		];
		return new float4(
			parseFloat(elements[0]),
			parseFloat(elements[1]),
			parseFloat(elements[2]),
			parseFloat(elements[3])
		);
	}
	public static TryParse(s: string, val: Out<float4>): boolean {
		const elements = PrimitivesUtility.ExtractElements(s, 4) as [
			string,
			string,
			string,
			string
		];
		if (elements == null) {
			val.Out = new float4();
			return false;
		}
		val.Out = new float4(
			parseFloat(elements[0]),
			parseFloat(elements[1]),
			parseFloat(elements[2]),
			parseFloat(elements[3])
		);
		return true;
	}
	public static DistanceSqr(a: float4, b: float4): number {
		return (
			(a.x - b.x) * (a.x - b.x) +
			(a.y - b.y) * (a.y - b.y) +
			(a.z - b.z) * (a.z - b.z) +
			(a.w - b.w) * (a.w - b.w)
		);
	}
	public static Distance(a: float4, b: float4): number {
		return MathX.Sqrt(
			(a.x - b.x) * (a.x - b.x) +
				(a.y - b.y) * (a.y - b.y) +
				(a.z - b.z) * (a.z - b.z) +
				(a.w - b.w) * (a.w - b.w)
		);
	}
	public Mask(mask: bool4, masked: float4 | number): float4 {
		if (masked instanceof float4) {
			return new float4(
				mask.x ? this.x : masked.x,
				mask.y ? this.y : masked.y,
				mask.z ? this.z : masked.z,
				mask.w ? this.w : masked.w
			);
		} else {
			return new float4(
				mask.x ? this.x : masked,
				mask.y ? this.y : masked,
				mask.z ? this.z : masked,
				mask.w ? this.w : masked
			);
		}
	}
	public static Add(a: float4, b: float4): float4;
	public static Add(a: number, b: float4): float4;
	public static Add(a: float4, b: number): float4;
	public static Add(a: float4 | number, b: float4 | number): float4 {
		if (a instanceof float4 && b instanceof float4) {
			return new float4(a.x + b.x, a.y + b.y, a.z + b.z, a.w + b.w);
		} else if (typeof a == "number" && b instanceof float4) {
			return new float4(a + b.x, a + b.y, a + b.z, a + b.w);
		} else if (a instanceof float4 && typeof b == "number") {
			return new float4(a.x + b, a.y + b, a.z + b, a.w + b);
		}
		throw new Error("Invalid Parameters");
	}
	public static Subtract(a: float4, b: float4): float4;
	public static Subtract(a: number, b: float4): float4;
	public static Subtract(a: float4, b: number): float4;
	public static Subtract(a: float4 | number, b: float4 | number): float4 {
		if (a instanceof float4 && b instanceof float4) {
			return new float4(a.x - b.x, a.y - b.y, a.z - b.z, a.w - b.w);
		} else if (typeof a == "number" && b instanceof float4) {
			return new float4(a - b.x, a - b.y, a - b.z, a - b.w);
		} else if (a instanceof float4 && typeof b == "number") {
			return new float4(a.x - b, a.y - b, a.z - b, a.w - b);
		}
		throw new Error("Invalid Parameters");
	}
	public static Multiply(a: float4, b: float4): float4;
	public static Multiply(a: number, b: float4): float4;
	public static Multiply(a: float4, b: number): float4;
	public static Multiply(a: float4 | number, b: float4 | number): float4 {
		if (a instanceof float4 && b instanceof float4) {
			return new float4(a.x * b.x, a.y * b.y, a.z * b.z, a.w * b.w);
		} else if (typeof a == "number" && b instanceof float4) {
			return new float4(a * b.x, a * b.y, a * b.z, a * b.w);
		} else if (a instanceof float4 && typeof b == "number") {
			return new float4(a.x * b, a.y * b, a.z * b, a.w * b);
		}
		throw new Error("Invalid Parameters");
	}
	public static Divide(a: float4, b: float4): float4;
	public static Divide(a: number, b: float4): float4;
	public static Divide(a: float4, b: number): float4;
	public static Divide(a: float4 | number, b: float4 | number): float4 {
		if (a instanceof float4 && b instanceof float4) {
			return new float4(a.x / b.x, a.y / b.y, a.z / b.z, a.w / b.w);
		} else if (typeof a == "number" && b instanceof float4) {
			return new float4(a / b.x, a / b.y, a / b.z, a / b.w);
		} else if (a instanceof float4 && typeof b == "number") {
			return new float4(a.x / b, a.y / b, a.z / b, a.w / b);
		}
		throw new Error("Invalid Parameters");
	}
	public static Modulo(a: float4, b: float4): float4;
	public static Modulo(a: number, b: float4): float4;
	public static Modulo(a: float4, b: number): float4;
	public static Modulo(a: float4 | number, b: float4 | number): float4 {
		if (a instanceof float4 && b instanceof float4) {
			return new float4(a.x % b.x, a.y % b.y, a.z % b.z, a.w % b.w);
		} else if (typeof a == "number" && b instanceof float4) {
			return new float4(a % b.x, a % b.y, a % b.z, a % b.w);
		} else if (a instanceof float4 && typeof b == "number") {
			return new float4(a.x % b, a.y % b, a.z % b, a.w % b);
		}
		throw new Error("Invalid Parameters");
	}
	public static Equals(a: float4, b: float4): boolean {
		return a.x == b.x && a.y == b.y && a.z == b.z && a.w == b.w;
	}

	public Equals(other: float4): boolean {
		return (
			this.x == other.x &&
			this.y == other.y &&
			this.z == other.z &&
			this.w == other.w
		);
	}
	public static EQUAL(a: float4, b: number): bool4;
	public static EQUAL(a: float4, b: float4): bool4;
	public static EQUAL(a: number, b: float4): bool4;
	public static EQUAL(a: float4 | number, b: float4 | number): bool4 {
		if (a instanceof float4 && b instanceof float4) {
			return new bool4(a.x == b.x, a.y == b.y, a.z == b.z, a.w == b.w);
		}
		if (typeof a == "number" && b instanceof float4) {
			return new bool4(b.x == a, b.y == a, b.z == a, b.w == a);
		}
		if (a instanceof float4 && typeof b == "number") {
			return new bool4(a.x == b, a.y == b, a.z == b, a.w == b);
		}
		throw new Error("Invalid Input");
	}
	public static NOTEQUAL(a: float4, b: number): bool4;
	public static NOTEQUAL(a: number, b: float4): bool4;
	public static NOTEQUAL(a: float4 | number, b: float4 | number): bool4 {
		if (a instanceof float4 && b instanceof float4) {
			return new bool4(a.x != b.x, a.y != b.y, a.z != b.z, a.w != b.w);
		}
		if (a instanceof float4 && typeof b == "number")
			return new bool4(a.x != b, a.y != b, a.z != b, a.w != b);
		if (typeof a == "number" && b instanceof float4)
			return new bool4(b.x != a, b.y != a, b.z != a, b.w != a);
		throw new Error("Invalid input");
	}
	public static GREATER(a: float4, b: number): bool4;
	public static GREATER(a: float4, b: float4): bool4;
	public static GREATER(a: number, b: float4): bool4;
	public static GREATER(a: float4 | number, b: float4 | number): bool4 {
		if (a instanceof float4 && b instanceof float4) {
			return new bool4(a.x > b.x, a.y > b.y, a.z > b.z, a.w > b.w);
		}
		if (typeof a == "number" && b instanceof float4) {
			return new bool4(a > b.x, a > b.y, a > b.z, a > b.w);
		}
		if (a instanceof float4 && typeof b == "number") {
			return new bool4(a.x > b, a.y > b, a.z > b, a.w > b);
		}
		throw new Error("Invalid Input");
	}
	public static LESS(a: float4, b: number): bool4;
	public static LESS(a: float4, b: float4): bool4;
	public static LESS(a: number, b: float4): bool4;
	public static LESS(a: float4 | number, b: float4 | number): bool4 {
		if (a instanceof float4 && b instanceof float4) {
			return new bool4(a.x < b.x, a.y < b.y, a.z < b.z, a.w < b.w);
		}
		if (typeof a == "number" && b instanceof float4) {
			return new bool4(a < b.x, a < b.y, a < b.z, a < b.w);
		}
		if (a instanceof float4 && typeof b == "number") {
			return new bool4(a.x < b, a.y < b, a.z < b, a.w < b);
		}
		throw new Error("Invalid Input");
	}
	public static GREATEREQUAL(a: float4, b: number): bool4;
	public static GREATEREQUAL(a: float4, b: float4): bool4;
	public static GREATEREQUAL(a: number, b: float4): bool4;
	public static GREATEREQUAL(a: float4 | number, b: float4 | number): bool4 {
		if (a instanceof float4 && b instanceof float4) {
			return new bool4(a.x >= b.x, a.y >= b.y, a.z >= b.z, a.w >= b.w);
		}
		if (typeof a == "number" && b instanceof float4) {
			return new bool4(a >= b.x, a >= b.y, a >= b.z, a >= b.w);
		}
		if (a instanceof float4 && typeof b == "number") {
			return new bool4(a.x >= b, a.y >= b, a.z >= b, a.w >= b);
		}
		throw new Error("Invalid Input");
	}
	public static LESSEQUAL(a: float4, b: number): bool4;
	public static LESSEQUAL(a: float4, b: float4): bool4;
	public static LESSEQUAL(a: number, b: float4): bool4;
	public static LESSEQUAL(a: float4 | number, b: float4 | number): bool4 {
		if (a instanceof float4 && b instanceof float4) {
			return new bool4(a.x <= b.x, a.y <= b.y, a.z <= b.z, a.w <= b.w);
		}
		if (typeof a == "number" && b instanceof float4) {
			return new bool4(a <= b.x, a <= b.y, a <= b.z, a <= b.w);
		}
		if (a instanceof float4 && typeof b == "number") {
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
