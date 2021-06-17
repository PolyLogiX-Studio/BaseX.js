import { Out } from "@bombitmanbomb/utils";
import { MathX } from "./MathX";
import { PrimitivesUtility } from "./PrimitivesUtility";
import { float2 } from "./float2";
import { bool3 } from "./bool3";
import { float3 } from "./float3";
//TODO Long
export class int3 {
	public DIMENSIONS = 3;
	public BASE_TYPENAME = "System.Int32";
	public COMPONENT_RATIO = 0;
	public x!: number;
	public y!: number;
	public z!: number;
	public get Dimensions(): 3 {
		return 3;
	}
	public static get Zero(): int3 {
		return new int3();
	}
	public static get One(): int3 {
		return new int3(1, 1, 1);
	}
	public static get MinValue(): int3 {
		return new int3(-2147483648, -2147483648, -2147483648);
	}
	public static get MaxValue(): int3 {
		return new int3(2147483647, 2147483647, 2147483647);
	}
	public static get Forward(): int3 {
		return new int3(0, 0, 1);
	}
	public static get Backward(): int3 {
		return new int3(0, 0, -1);
	}
	public static get Up(): int3 {
		return new int3(0, 1, 0);
	}
	public static get Down(): int3 {
		return new int3(0, -1, 0);
	}
	public static get Left(): int3 {
		return new int3(1, 0, 0);
	}
	public static get Right(): int3 {
		return new int3(-1, 0, 0);
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
	public THIS(n: number): number {
		switch (n) {
		case 0:
			return this.x;
		case 1:
			return this.y;
		case 2:
			return this.z;
		}
		throw new Error("Invalid vector element index");
	}
	public SetComponent(value: number, index: number): int3 {
		switch (index) {
		case 0:
			return new int3(value, this.y, this.z);
		case 1:
			return new int3(this.x, value, this.z);
		case 2:
			return new int3(this.x, this.y, value);
		}
		throw new Error("Invalid vector element index");
	}
	public GetBoxedElement(n: number): number {
		return this.THIS(n);
	}
	public get ElementType(): "Int32" {
		return "Int32";
	}
	constructor();
	constructor(x: number, y: number, z: number);
	constructor(xyz: int3);
	constructor(x: number, yx: float2);
	constructor(xy: float2, z: number);
	constructor(xyz: float3);
	constructor(
		x: number | float3 | float2 | int3 = 0,
		y: number | float2 = 0,
		z = 0
	) {
		this.int3(x as number, y as number, z as number);
	}

	public int3(x: number, y: number, z: number): void;
	public int3(xyz: int3): void;
	public int3(x: number, yx: float2): void;
	public int3(xy: float2, z: number): void;
	public int3(xyz: float3): void;
	public int3(
		x?: number | float2 | int3 | float3,
		y?: number | float2,
		z?: number | float2 | int3
	): void {
		if (x instanceof float3) {
			this.x = Math.floor(x.x);
			this.y = Math.floor(x.y);
			this.z = Math.floor(x.z);
		} else if (
			typeof x == "number" &&
			typeof y == "number" &&
			typeof z == "number"
		) {
			this.x = x;
			this.y = y;
			this.z = z;
		} else if (x instanceof float2 && typeof y == "number") {
			this.x = x.x;
			this.y = x.y;
			this.z = y;
		} else if (typeof x == "number" && y instanceof float2) {
			this.x = x;
			this.y = y.x;
			this.z = y.y;
		} else if (x instanceof int3) {
			this.x = x.x;
			this.y = x.y;
			this.z = x.z;
		} else {
			this.x = 0;
			this.y = 0;
			this.z = 0;
		}
	}
	public toString(): string {
		return `[${this.x};${this.y};${this.z}]`;
	}

	public static Parse(s: string): int3 {
		const elements = PrimitivesUtility.ExtractElements(s, 3) as [
			string,
			string,
			string
		];
		return new int3(
			parseInt(elements[0]),
			parseInt(elements[1]),
			parseInt(elements[2])
		);
	}
	public static TryParse(s: string, val: Out<int3>): boolean {
		const elements = PrimitivesUtility.ExtractElements(s, 3) as [
			string,
			string,
			string
		];
		if (elements == null) {
			val.Out = new int3();
			return false;
		}
		val.Out = new int3(
			parseInt(elements[0]),
			parseInt(elements[1]),
			parseInt(elements[2])
		);
		return true;
	}
	public GetNormalized(magnitude: Out<number>): int3 {
		magnitude.Out = this.Magnitude as number;
		if (magnitude.Out == 0) return int3.Zero;
		return int3.Multiply(this, 1 / magnitude.Out);
	}
	public get Normalized(): int3 {
		const zero = int3.Zero;
		if (int3.Equals(zero, this)) return new int3(this);
		return int3.Multiply(this, 1 / this.Magnitude);
	}
	public get SqrMagnitude(): number {
		return this.x * this.x + this.y * this.y + this.z * this.z;
	}
	public get Magnitude(): number {
		return MathX.Sqrt(this.SqrMagnitude);
	}
	public get IsNaN(): boolean {
		return isNaN(this.x) || isNaN(this.y) || isNaN(this.z);
	}
	public get IsInfinity(): boolean {
		return !isFinite(this.x) || !isFinite(this.y) || !isFinite(this.z);
	}
	public IsUniform(tolerance = 1e-5): boolean {
		const num = Math.min(this.x, this.y, this.z) * tolerance;
		return Math.abs(this.x - this.y) <= num && Math.abs(this.y - this.z) <= num;
	}
	public Approximately(v: int3, tolerance: number): boolean {
		return (
			Math.abs(this.x - v.x) < tolerance &&
			Math.abs(this.y - v.y) < tolerance &&
			Math.abs(this.z - v.z) < tolerance
		);
	}

	public static DistanceSqr(a: int3, b: int3): number {
		return (
			(a.x - b.x) * (a.x - b.x) +
			(a.y - b.y) * (a.y - b.y) +
			(a.z - b.z) * (a.z - b.z)
		);
	}
	public static Distance(a: int3, b: int3): number {
		return MathX.Sqrt(
			(a.x - b.x) * (a.x - b.x) +
				(a.y - b.y) * (a.y - b.y) +
				(a.z - b.z) * (a.z - b.z)
		);
	}
	public Mask(mask: bool3, masked: int3 | number): int3 {
		if (masked instanceof int3) {
			return new int3(
				mask.x ? this.x : masked.x,
				mask.y ? this.y : masked.y,
				mask.z ? this.z : masked.z
			);
		} else {
			return new int3(
				mask.x ? this.x : masked,
				mask.y ? this.y : masked,
				mask.z ? this.z : masked
			);
		}
	}
	public static Add(a: int3, b: int3): int3;
	public static Add(a: number, b: int3): int3;
	public static Add(a: int3, b: number): int3;
	public static Add(a: int3 | number, b: int3 | number): int3 {
		if (a instanceof int3 && b instanceof int3) {
			return new int3(a.x + b.x, a.y + b.y, a.z + b.z);
		} else if (typeof a == "number" && b instanceof int3) {
			return new int3(a + b.x, a + b.y, a + b.z);
		} else if (a instanceof int3 && typeof b == "number") {
			return new int3(a.x + b, a.y + b, a.z + b);
		}
		throw new Error("Invalid Parameters");
	}
	public static Subtract(a: int3, b: int3): int3;
	public static Subtract(a: number, b: int3): int3;
	public static Subtract(a: int3, b: number): int3;
	public static Subtract(a: int3 | number, b: int3 | number): int3 {
		if (a instanceof int3 && b instanceof int3) {
			return new int3(a.x - b.x, a.y - b.y, a.z - b.z);
		} else if (typeof a == "number" && b instanceof int3) {
			return new int3(a - b.x, a - b.y, a - b.z);
		} else if (a instanceof int3 && typeof b == "number") {
			return new int3(a.x - b, a.y - b, a.z - b);
		}
		throw new Error("Invalid Parameters");
	}
	public static Multiply(a: int3, b: int3): int3;
	public static Multiply(a: number, b: int3): int3;
	public static Multiply(a: int3, b: number): int3;
	public static Multiply(a: int3 | number, b: int3 | number): int3 {
		if (a instanceof int3 && b instanceof int3) {
			return new int3(a.x * b.x, a.y * b.y, a.z * b.z);
		} else if (typeof a == "number" && b instanceof int3) {
			return new int3(a * b.x, a * b.y, a * b.z);
		} else if (a instanceof int3 && typeof b == "number") {
			return new int3(a.x * b, a.y * b, a.z * b);
		}
		throw new Error("Invalid Parameters");
	}
	public static Divide(a: int3, b: int3): int3;
	public static Divide(a: number, b: int3): int3;
	public static Divide(a: int3, b: number): int3;
	public static Divide(a: int3 | number, b: int3 | number): int3 {
		if (a instanceof int3 && b instanceof int3) {
			return new int3(a.x / b.x, a.y / b.y, a.z / b.z);
		} else if (typeof a == "number" && b instanceof int3) {
			return new int3(a / b.x, a / b.y, a / b.z);
		} else if (a instanceof int3 && typeof b == "number") {
			return new int3(a.x / b, a.y / b, a.z / b);
		}
		throw new Error("Invalid Parameters");
	}
	public static Modulo(a: int3, b: int3): int3;
	public static Modulo(a: number, b: int3): int3;
	public static Modulo(a: int3, b: number): int3;
	public static Modulo(a: int3 | number, b: int3 | number): int3 {
		if (a instanceof int3 && b instanceof int3) {
			return new int3(a.x % b.x, a.y % b.y, a.z % b.z);
		} else if (typeof a == "number" && b instanceof int3) {
			return new int3(a % b.x, a % b.y, a % b.z);
		} else if (a instanceof int3 && typeof b == "number") {
			return new int3(a.x % b, a.y % b, a.z % b);
		}
		throw new Error("Invalid Parameters");
	}
	public static Equals(a: int3, b: int3): boolean {
		return a.x == b.x && a.y == b.y && a.z == b.z;
	}

	public Equals(other: int3): boolean {
		return this.x == other.x && this.y == other.y && this.z == other.z;
	}
	public static EQUAL(a: int3, b: number): bool3;
	public static EQUAL(a: int3, b: int3): bool3;
	public static EQUAL(a: number, b: int3): bool3;
	public static EQUAL(a: int3 | number, b: int3 | number): bool3 {
		if (a instanceof int3 && b instanceof int3) {
			return new bool3(a.x == b.x, a.y == b.y, a.z == b.z);
		}
		if (typeof a == "number" && b instanceof int3) {
			return new bool3(b.x == a, b.y == a, b.z == a);
		}
		if (a instanceof int3 && typeof b == "number") {
			return new bool3(a.x == b, a.y == b, a.z == b);
		}
		throw new Error("Invalid Input");
	}
	public static NOTEQUAL(a: int3, b: number): bool3;
	public static NOTEQUAL(a: number, b: int3): bool3;
	public static NOTEQUAL(a: int3 | number, b: int3 | number): bool3 {
		if (a instanceof int3 && typeof b == "number")
			return new bool3(a.x != b, a.y != b, a.z != b);
		if (typeof a == "number" && b instanceof int3)
			return new bool3(b.x != a, b.y != a, b.z != a);
		throw new Error("Invalid input");
	}
	public static GREATER(a: int3, b: number): bool3;
	public static GREATER(a: int3, b: int3): bool3;
	public static GREATER(a: number, b: int3): bool3;
	public static GREATER(a: int3 | number, b: int3 | number): bool3 {
		if (a instanceof int3 && b instanceof int3) {
			return new bool3(a.x > b.x, a.y > b.y, a.z > b.z);
		}
		if (typeof a == "number" && b instanceof int3) {
			return new bool3(a > b.x, a > b.y, a > b.z);
		}
		if (a instanceof int3 && typeof b == "number") {
			return new bool3(a.x > b, a.y > b, a.z > b);
		}
		throw new Error("Invalid Input");
	}
	public static LESS(a: int3, b: number): bool3;
	public static LESS(a: int3, b: int3): bool3;
	public static LESS(a: number, b: int3): bool3;
	public static LESS(a: int3 | number, b: int3 | number): bool3 {
		if (a instanceof int3 && b instanceof int3) {
			return new bool3(a.x < b.x, a.y < b.y, a.z < b.z);
		}
		if (typeof a == "number" && b instanceof int3) {
			return new bool3(a < b.x, a < b.y, a < b.z);
		}
		if (a instanceof int3 && typeof b == "number") {
			return new bool3(a.x < b, a.y < b, a.z < b);
		}
		throw new Error("Invalid Input");
	}
	public static GREATEREQUAL(a: int3, b: number): bool3;
	public static GREATEREQUAL(a: int3, b: int3): bool3;
	public static GREATEREQUAL(a: number, b: int3): bool3;
	public static GREATEREQUAL(a: int3 | number, b: int3 | number): bool3 {
		if (a instanceof int3 && b instanceof int3) {
			return new bool3(a.x >= b.x, a.y >= b.y, a.z >= b.z);
		}
		if (typeof a == "number" && b instanceof int3) {
			return new bool3(a >= b.x, a >= b.y, a >= b.z);
		}
		if (a instanceof int3 && typeof b == "number") {
			return new bool3(a.x >= b, a.y >= b, a.z >= b);
		}
		throw new Error("Invalid Input");
	}
	public static LESSEQUAL(a: int3, b: number): bool3;
	public static LESSEQUAL(a: int3, b: int3): bool3;
	public static LESSEQUAL(a: number, b: int3): bool3;
	public static LESSEQUAL(a: int3 | number, b: int3 | number): bool3 {
		if (a instanceof int3 && b instanceof int3) {
			return new bool3(a.x <= b.x, a.y <= b.y, a.z <= b.z);
		}
		if (typeof a == "number" && b instanceof int3) {
			return new bool3(a <= b.x, a <= b.y, a <= b.z);
		}
		if (a instanceof int3 && typeof b == "number") {
			return new bool3(a.x <= b, a.y <= b, a.z <= b);
		}
		throw new Error("Invalid Input");
	}
	public GetHashCode(): number {
		return (((this.x * 397) ^ this.y) * 397) ^ this.z;
	}
	toJSON(): { x: number; y: number; z: number } {
		return { x: this.x, y: this.y, z: this.z };
	}
}
