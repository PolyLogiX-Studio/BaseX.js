import { PrimitivesUtility } from "./PrimitivesUtility";
import type { Out } from "@bombitmanbomb/utils";
import { bool2 } from "./bool2";
import { bool3 } from "./bool3";
export class bool4 {
	public DIMENSIONS = 4;
	public BASE_TYPENAME = "System.Boolean";
	public flags!: number;

	public get Dimensions(): 4 {
		return 4;
	}
	public static get False(): bool4 {
		return new bool4();
	}
	public static get True(): bool4 {
		return new bool4(true, true, true);
	}
	public get x(): boolean {
		return (this.flags & 1) > 0;
	}
	public get y(): boolean {
		return (this.flags & 2) > 0;
	}
	public get z(): boolean {
		return (this.flags & 4) > 0;
	}
	public get w(): boolean {
		return (this.flags & 8) > 0;
	}
	public THIS(n: number): boolean {
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
	public SetComponent(value: boolean, index: number): bool4 {
		switch (index) {
		case 0:
			return new bool4(value, this.y, this.z, this.w);
		case 1:
			return new bool4(this.x, value, this.z, this.w);
		case 2:
			return new bool4(this.x, this.y, value, this.w);
		case 3:
			return new bool4(this.x, this.y, this.z, value);
		default:
			throw new Error("Invalid vector element index");
		}
	}
	public GetBoxedElement(n: number): boolean {
		return this.THIS(n);
	}
	public get ElementType(): "boolean" {
		return "boolean";
	}
	constructor(x = false, y = false, z = false, w = false) {
		this.bool4(x, y, z, w);
	}
	public bool4(flags: number): void;
	public bool4(xyz: bool3, w: boolean): void;
	public bool4(xy: bool2, z: boolean, w: boolean): void;
	public bool4(x: boolean, yz: bool2, z: boolean): void;
	public bool4(x: boolean, y: boolean, z: boolean, w: boolean): void;
	public bool4(x: boolean, y: boolean, zw: bool2): void;
	public bool4(xy: bool2, zw: bool2): void;
	public bool4(x: boolean, yzw: bool3): void;
	public bool4(xyzw: bool4): bool4;
	public bool4(
		x: number | boolean | bool2 | bool3 | bool4 = false,
		y: boolean | bool2 | bool3 = false,
		z: boolean | bool2 | bool3 = false,
		w: boolean | bool2 = false
	): boolean | void | bool4 {
		if (typeof x == "number") {
			this.flags = x;
			return;
		}
		if (x instanceof bool3 && typeof y == "boolean")
			return this.bool4(x.x, x.y, x.z, y);

		if (typeof x == "boolean" && y instanceof bool3)
			return this.bool4(x, y.x, y.y, y.z);

		if (x instanceof bool2 && y instanceof bool2)
			return this.bool4(x.x, x.y, y.x, y.y);

		if (typeof x == "boolean" && y instanceof bool2 && typeof z == "boolean")
			return this.bool4(x, y.x, y.y, z);

		if (x instanceof bool2 && typeof y == "boolean" && typeof z == "boolean")
			return this.bool4(x.x, x.y, y, z);

		if (typeof x == "boolean" && typeof y == "boolean" && z instanceof bool2)
			return this.bool4(x, y, z.x, z.y);

		if (
			typeof x == "boolean" &&
			typeof y == "boolean" &&
			typeof z == "boolean" &&
			typeof w == "boolean"
		) {
			this.flags = 0;
			this.flags |= x ? 1 : 0;
			this.flags |= y ? 2 : 0;
			this.flags |= z ? 4 : 0;
			this.flags |= w ? 8 : 0;
			return;
		}
		if (x instanceof bool4) return new bool4(x.x, x.y, x.z, x.w);
	}
	public toString(): string {
		return `[${this.x};${this.y};${this.z};${this.w}]`;
	}
	public static Parse(s: string): bool4 {
		const elements = PrimitivesUtility.ExtractElements(s, 4) as [
			string,
			string,
			string,
			string
		];
		return new bool4(
			elements[0].toLowerCase() == "true",
			elements[1].toLowerCase() == "true",
			elements[2].toLowerCase() == "true",
			elements[3].toLowerCase() == "true"
		);
	}
	public static TryParse(s: string, val: Out<bool4>): boolean {
		const elements: string[] = PrimitivesUtility.ExtractElements(s, 4) as [
			string,
			string,
			string,
			string
		];
		if (elements == null) {
			val.Out = new bool4();
			return false;
		}
		val.Out = new bool4(
			elements[0].toLowerCase() == "true",
			elements[1].toLowerCase() == "true",
			elements[2].toLowerCase() == "true",
			elements[3].toLowerCase() == "true"
		);
		return true;
	}
	public get Any(): boolean {
		return this.flags > 0;
	}
	public get All(): boolean {
		return this.flags == 15;
	}
	public get None(): boolean {
		return this.flags == 0;
	}
	public static NOT(v: bool4): bool4 {
		return new bool4(!v.x, !v.y, !v.z, !v.w);
	}
	public static AND(n: boolean, v: bool4): bool4;
	public static AND(v: bool4, n: boolean): bool4;
	public static AND(a: bool4, b: bool4): bool4;
	public static AND(a: bool4 | boolean, b?: bool4 | boolean): bool4 {
		if (typeof a == "boolean" && b instanceof bool4)
			return new bool4(a && b.x, a && b.y, a && b.z, a && b.w);

		if (typeof b == "boolean" && a instanceof bool4)
			return new bool4(b && a.x, b && a.y, b && a.z, b && a.w);

		if (a instanceof bool4 && b instanceof bool4)
			return new bool4(a.x && b.x, a.y && b.y, a.z && b.z, a.w && b.w);

		throw new Error("Invalid Input");
	}
	public static OR(n: boolean, v: bool4): bool4;
	public static OR(v: bool4, n: boolean): bool4;
	public static OR(a: bool4, b: bool4): bool4;
	public static OR(a: bool4 | boolean, b?: bool4 | boolean): bool4 {
		if (typeof a == "boolean" && b instanceof bool4)
			return new bool4(a || b.x, a || b.y, a || b.z, a || b.w);

		if (typeof b == "boolean" && a instanceof bool4)
			return new bool4(b || a.x, b || a.y, b || a.z, b || a.w);

		if (a instanceof bool4 && b instanceof bool4)
			return new bool4(a.x || b.x, a.y || b.y, a.z || b.z, a.w || b.w);

		throw new Error("Invalid Input");
	}
	public static XOR(n: boolean, v: bool4): bool4;
	public static XOR(v: bool4, n: boolean): bool4;
	public static XOR(a: bool4, b: bool4): bool4;
	public static XOR(a: bool4 | boolean, b?: bool4 | boolean): bool4 {
		if (typeof a == "boolean" && b instanceof bool4)
			return new bool4(a != b.x, a != b.y, a != b.z, a != b.w);

		if (typeof b == "boolean" && a instanceof bool4)
			return new bool4(b != a.x, b != a.y, b != a.z, b != a.w);

		if (a instanceof bool4 && b instanceof bool4)
			return new bool4(a.x != b.x, a.y != b.y, a.z != b.z, a.w != b.w);

		throw new Error("Invalid Input");
	}
	public Equals(other: bool4): boolean {
		return this.x == other.x && this.y == other.y && this.z == other.z;
	}
	public static EQUAL(n: boolean, v: bool4): bool4;
	public static EQUAL(v: bool4, n: boolean): bool4;
	public static EQUAL(a: bool4, b: bool4): bool4;
	public static EQUAL(a: bool4 | boolean, b?: bool4 | boolean): bool4 {
		if (typeof a == "boolean" && b instanceof bool4)
			return new bool4(a == b.x, a == b.y, a == b.z, a == b.w);

		if (typeof b == "boolean" && a instanceof bool4)
			return new bool4(b == a.x, b == a.y, b == a.z, b == a.w);

		if (a instanceof bool4 && b instanceof bool4)
			return new bool4(a.x == b.x, a.y == b.y, a.z == b.z, a.w == b.w);

		throw new Error("Invalid Input");
	}
	public GetHashCode(): number {
		return (((((+this.x * 397) ^ +this.y) * 397) ^ +this.z) * 397) ^ +this.w;
	}
}
