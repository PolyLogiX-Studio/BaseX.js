import { Out } from "@bombitmanbomb/utils";
import { MathX } from "./MathX";
import { PrimitivesUtility } from "./PrimitivesUtility";
import { bool2 } from "./bool2";
export class float2 {
	public DIMENSIONS = 2;
	public BASE_TYPENAME = "System.Single";
	public COMPONENT_RATIO = 0.5;
	public x!: number;
	public y!: number;
	public get Dimensions(): 2 {
		return 2;
	}
	public static get Zero(): float2 {
		return new float2();
	}
	public static get One(): float2 {
		return new float2(1, 1);
	}
	public static get MinValue(): float2 {
		return new float2(-3.40282347e38, -3.40282347e38);
	}
	public static get MaxValue(): float2 {
		return new float2(3.40282347e38, 3.40282347e38);
	}
	public get X(): number {
		return this.x;
	}
	public get Y(): number {
		return this.y;
	}
	public THIS(n: number): number {
		if (n == 0) return this.x;
		if (n == 1) return this.y;
		throw new Error("Invalid vector element index");
	}
	public SetComponent(value: number, index: number): float2 {
		if (index == 0) return new float2(value, this.y);
		if (index == 1) return new float2(this.x, value);
		throw new Error("Invalid vector element index");
	}
	public GetBoxedElement(n: number): number {
		return this.THIS(n);
	}
	public get ElementType(): "float" {
		return "float";
	}
	constructor(x = 0, y = 0) {
		this.float2(x, y);
	}

	public float2(xy: float2): float2;
	public float2(x: number, y: number): void;
	public float2(
		x: float2 | number | { x: number; y: number } = 0,
		y = 0
	): void | float2 {
		if (typeof x == "number" && typeof y == "number") {
			this.x = x;
			this.y = y;
			return;
		}
		if (
			typeof x != "number" &&
			(x instanceof float2 ||
				(typeof x.x == "number" && typeof x.y == "number"))
		) {
			return new float2(x.x, x.y);
		}
	}
	public GetNormalized(magnitude: Out<number> = []): float2 {
		magnitude.Out = this.Magnitude;
		if (magnitude.Out == 0) return float2.Zero;
		return float2.Multiply(this, 1 / magnitude.Out);
	}
	public get Normalized(): float2 {
		if (this.Equals(float2.Zero)) return this;
		return float2.Multiply(this, 1 / this.Magnitude);
	}
	public get SqrMagnitude(): number {
		return this.x * this.x + this.y * this.y;
	}
	public get Magnitude(): number {
		return MathX.Sqrt(this.SqrMagnitude);
	}
	public get IsNaN(): boolean {
		return isNaN(this.x) || isNaN(this.y);
	}
	public get IsInfinity(): boolean {
		return !isFinite(this.x) || !isFinite(this.y);
	}
	public IsUniform(tolerance = 1e-5): boolean {
		return Math.abs(this.x - this.y) <= Math.min(this.x, this.y) * tolerance;
	}
	public Approximately(v: float2, tolerance: number): boolean {
		return (
			Math.abs(this.x - v.x) < tolerance && Math.abs(this.y - v.y) < tolerance
		);
	}
	public toString(): string {
		return `[${this.x};${this.y}]`;
	}
	public static Parse(s: string): float2 {
		const elements = PrimitivesUtility.ExtractElements(s, 2) as [
			string,
			string
		];
		return new float2(parseFloat(elements[0]), parseFloat(elements[1]));
	}
	public static TryParse(s: string, val: Out<float2> = []): boolean {
		const elements = PrimitivesUtility.ExtractElements(s, 2) as [
			string,
			string
		];
		if (elements.length != 2) {
			val.Out = new float2();
			return false;
		}
		val.Out = new float2(parseFloat(elements[0]), parseFloat(elements[1]));
		return true;
	}
	public static DistanceSqr(a: float2, b: float2): number {
		return (a.x - b.x) * (a.x - b.x) + (a.y - b.y) * (a.y - b.y);
	}
	public static Distance(a: float2, b: float2): number {
		return Math.sqrt((a.x - b.x) * (a.x - b.x) + (a.y - b.y) * (a.y - b.y));
	}
	public Mask(mask: float2, masked: number): float2;
	public Mask(mask: float2, masked: float2): float2;
	public Mask(mask: float2, masked: float2 | number = 0): float2 {
		if (masked instanceof float2) {
			return new float2(mask.x ? this.x : masked.x, mask.y ? this.y : masked.y);
		}
		return new float2(mask.x ? this.x : masked, mask.y ? this.y : masked);
	}

	public static Subtract(a: float2, b: float2): float2;
	public static Subtract(value: float2, n: number): float2;
	public static Subtract(n: number, value: float2): float2;
	public static Subtract(value: float2): float2;
	public static Subtract(a: number | float2, b?: number | float2): float2 {
		if (a instanceof float2 && b == null) {
			return new float2(-a.x, -a.y);
		}
		if (a instanceof float2 && typeof b == "number") {
			return new float2(a.x - b, a.y - b);
		}
		if (typeof a == "number" && b instanceof float2) {
			return new float2(a - b.x, a - b.y);
		}
		if (a instanceof float2 && b instanceof float2) {
			return new float2(a.x - b.x, a.y - b.y);
		}
		throw new Error("Invalid Input");
	}
	public static Add(a: float2, b: float2): float2;
	public static Add(value: float2, n: number): float2;
	public static Add(n: number, value: float2): float2;
	public static Add(a: number | float2, b: number | float2): float2 {
		if (a instanceof float2 && typeof b == "number") {
			return new float2(a.x + b, a.y + b);
		}
		if (typeof a == "number" && b instanceof float2) {
			return new float2(a + b.x, a + b.y);
		}
		if (a instanceof float2 && b instanceof float2) {
			return new float2(a.x + b.x, a.y + b.y);
		}
		throw new Error("Invalid Input");
	}
	public static Multiply(a: float2, b: float2): float2;
	public static Multiply(value: float2, n: number): float2;
	public static Multiply(n: number, value: float2): float2;
	public static Multiply(a: number | float2, b: number | float2): float2 {
		if (a instanceof float2 && typeof b == "number") {
			return new float2(a.x * b, a.y * b);
		}
		if (typeof a == "number" && b instanceof float2) {
			return new float2(a * b.x, a * b.y);
		}
		if (a instanceof float2 && b instanceof float2) {
			return new float2(a.x * b.x, a.y * b.y);
		}
		throw new Error("Invalid Input");
	}
	public static Divide(a: float2, b: float2): float2;
	public static Divide(value: float2, n: number): float2;
	public static Divide(n: number, value: float2): float2;
	public static Divide(a: number | float2, b: number | float2): float2 {
		if (a instanceof float2 && typeof b == "number") {
			return new float2(a.x / b, a.y / b);
		}
		if (typeof a == "number" && b instanceof float2) {
			return new float2(a / b.x, a / b.y);
		}
		if (a instanceof float2 && b instanceof float2) {
			return new float2(a.x / b.x, a.y / b.y);
		}
		throw new Error("Invalid Input");
	}
	public static Modulo(a: float2, b: float2): float2;
	public static Modulo(value: float2, n: number): float2;
	public static Modulo(n: number, value: float2): float2;
	public static Modulo(a: number | float2, b: number | float2): float2 {
		if (a instanceof float2 && typeof b == "number") {
			return new float2(a.x % b, a.y % b);
		}
		if (typeof a == "number" && b instanceof float2) {
			return new float2(a % b.x, a % b.y);
		}
		if (a instanceof float2 && b instanceof float2) {
			return new float2(a.x % b.x, a.y % b.y);
		}
		throw new Error("Invalid Input");
	}
	public Equals(other: float2): boolean {
		return this.x == other.x && this.y == other.y;
	}
	public static Equals(a: float2, b: number): boolean;
	public static Equals(a: float2, b: float2): boolean;
	public static Equals(a: number, b: float2): boolean;
	public static Equals(
		a: float2 | number,
		b: float2 | number
	): boolean | bool2 {
		if (a instanceof float2 && b instanceof float2) {
			return a.x == b.x && a.y == b.y;
		}
		if (typeof a == "number" && b instanceof float2) {
			return new bool2(b.x == a, b.y == a);
		}
		if (a instanceof float2 && typeof b == "number") {
			return new bool2(a.x == b, a.y == b);
		}
		throw new Error("Invalid Input");
	}
	public static NotEqual(a: float2, b: number): bool2;
	public static NotEqual(a: number, b: float2): bool2;
	public static NotEqual(a: float2 | number, b: float2 | number): bool2 {
		if (a instanceof float2 && typeof b == "number")
			return new bool2(a.x != b, a.y != b);
		if (typeof a == "number" && b instanceof float2)
			return new bool2(b.x != a, b.y != a);
		throw new Error("Invalid input");
	}
	public static Greater(a: float2, b: number): bool2;
	public static Greater(a: float2, b: float2): bool2;
	public static Greater(a: number, b: float2): bool2;
	public static Greater(a: float2 | number, b: float2 | number): bool2 {
		if (a instanceof float2 && b instanceof float2) {
			return new bool2(a.x > b.x, a.y > b.y);
		}
		if (typeof a == "number" && b instanceof float2) {
			return new bool2(a > b.x, a > b.y);
		}
		if (a instanceof float2 && typeof b == "number") {
			return new bool2(a.x > b, a.y > b);
		}
		throw new Error("Invalid Input");
	}
	public static Less(a: float2, b: number): bool2;
	public static Less(a: float2, b: float2): bool2;
	public static Less(a: number, b: float2): bool2;
	public static Less(a: float2 | number, b: float2 | number): bool2 {
		if (a instanceof float2 && b instanceof float2) {
			return new bool2(a.x < b.x, a.y < b.y);
		}
		if (typeof a == "number" && b instanceof float2) {
			return new bool2(a < b.x, a < b.y);
		}
		if (a instanceof float2 && typeof b == "number") {
			return new bool2(a.x < b, a.y < b);
		}
		throw new Error("Invalid Input");
	}
	public static GreaterEqual(a: float2, b: number): bool2;
	public static GreaterEqual(a: float2, b: float2): bool2;
	public static GreaterEqual(a: number, b: float2): bool2;
	public static GreaterEqual(a: float2 | number, b: float2 | number): bool2 {
		if (a instanceof float2 && b instanceof float2) {
			return new bool2(a.x >= b.x, a.y >= b.y);
		}
		if (typeof a == "number" && b instanceof float2) {
			return new bool2(a >= b.x, a >= b.y);
		}
		if (a instanceof float2 && typeof b == "number") {
			return new bool2(a.x >= b, a.y >= b);
		}
		throw new Error("Invalid Input");
	}
	public static LessEqual(a: float2, b: number): bool2;
	public static LessEqual(a: float2, b: float2): bool2;
	public static LessEqual(a: number, b: float2): bool2;
	public static LessEqual(a: float2 | number, b: float2 | number): bool2 {
		if (a instanceof float2 && b instanceof float2) {
			return new bool2(a.x <= b.x, a.y <= b.y);
		}
		if (typeof a == "number" && b instanceof float2) {
			return new bool2(a <= b.x, a <= b.y);
		}
		if (a instanceof float2 && typeof b == "number") {
			return new bool2(a.x <= b, a.y <= b);
		}
		throw new Error("Invalid Input");
	}
	public GetHashCode(): number {
		return (this.x & 397) ^ +this.y;
	}
	toJSON(): { x: number; y: number } {
		return { x: this.x, y: this.y };
	}
}
