import { PrimitivesUtility } from "./PrimitivesUtility";
import type { Out } from "@bombitmanbomb/utils";
import { bool2 } from "./bool2";
export class bool3 {
	public DIMENSIONS = 3;
	public BASE_TYPENAME = "System.Boolean";
	public flags!: number;

	public get Dimensions(): 3 {
		return 3;
	}
	public static get False(): bool3 {
		return new bool3();
	}
	public static get True(): bool3 {
		return new bool3(true, true, true);
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
	public THIS(n: number): boolean {
		switch (n) {
		case 0:
			return this.x;
		case 1:
			return this.y;
		case 2:
			return this.z;
		default:
			throw new Error("Invalid vector element index");
		}
	}
	public SetComponent(value: boolean, index: number): bool3 {
		switch (index) {
		case 0:
			return new bool3(value, this.y, this.z);
		case 1:
			return new bool3(this.x, value, this.z);
		case 2:
			return new bool3(this.x, this.y, value);
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
	constructor(x = false, y = false, z = false) {
		this.bool3(x, y, z);
	}
	public bool3(flags: number): void;
	public bool3(xy: bool2, y: boolean): void;
	public bool3(x: boolean, yz: bool2): void;
	public bool3(x: boolean, y: boolean, z: boolean): void;
	public bool3(xyz: bool3): bool3;
	public bool3(
		x: boolean | number | bool3 | bool2 = false,
		y: boolean | bool2 = false,
		z = false
	): boolean | void | bool3 {
		if (typeof x === "number") {
			this.flags = x;
			return;
		}
		if (
			typeof x == "boolean" &&
			typeof y == "boolean" &&
			typeof z == "boolean"
		) {
			this.flags = 0;
			this.flags |= x ? 1 : 0;
			this.flags |= y ? 2 : 0;
			this.flags |= z ? 4 : 0;
			return;
		}
		if (x instanceof bool2 && typeof y == "boolean")
			return this.bool3(x.x, x.y, y);

		if (typeof x == "boolean" && y instanceof bool2)
			return this.bool3(x, y.x, y.y);

		if (x instanceof bool3) return new bool3(x.x, x.y, x.z);
	}
	public toString(): string {
		return `[${this.x};${this.y};${this.z}]`;
	}
	public static Parse(s: string): bool3 {
		const elements = PrimitivesUtility.ExtractElements(s, 3) as [
			string,
			string,
			string
		];
		return new bool3(
			elements[0].toLowerCase() == "true",
			elements[1].toLowerCase() == "true",
			elements[2].toLowerCase() == "true"
		);
	}
	public static TryParse(s: string, val: Out<bool3>): boolean {
		const elements: string[] = PrimitivesUtility.ExtractElements(s, 3) as [
			string,
			string,
			string
		];
		if (elements == null) {
			val.Out = new bool3();
			return false;
		}
		val.Out = new bool3(
			elements[0].toLowerCase() == "true",
			elements[1].toLowerCase() == "true",
			elements[2].toLowerCase() == "true"
		);
		return true;
	}
	public get Any(): boolean {
		return this.flags > 0;
	}
	public get All(): boolean {
		return this.flags == 7;
	}
	public get None(): boolean {
		return this.flags == 0;
	}
	public static NOT(v: bool3): bool3 {
		return new bool3(!v.x, !v.y, !v.z);
	}
	public static AND(n: boolean, v: bool3): bool3;
	public static AND(v: bool3, n: boolean): bool3;
	public static AND(a: bool3, b: bool3): bool3;
	public static AND(a: bool3 | boolean, b?: bool3 | boolean): bool3 {
		if (typeof a == "boolean" && b instanceof bool3)
			return new bool3(a && b.x, a && b.y, a && b.z);

		if (typeof b == "boolean" && a instanceof bool3)
			return new bool3(b && a.x, b && a.y, b && a.z);

		if (a instanceof bool3 && b instanceof bool3)
			return new bool3(a.x && b.x, a.y && b.y, a.z && b.z);

		throw new Error("Invalid Input");
	}
	public static OR(n: boolean, v: bool3): bool3;
	public static OR(v: bool3, n: boolean): bool3;
	public static OR(a: bool3, b: bool3): bool3;
	public static OR(a: bool3 | boolean, b?: bool3 | boolean): bool3 {
		if (typeof a == "boolean" && b instanceof bool3)
			return new bool3(a || b.x, a || b.y, a || b.z);

		if (typeof b == "boolean" && a instanceof bool3)
			return new bool3(b || a.x, b || a.y, b || a.z);

		if (a instanceof bool3 && b instanceof bool3)
			return new bool3(a.x || b.x, a.y || b.y, a.z || b.z);

		throw new Error("Invalid Input");
	}
	public static XOR(n: boolean, v: bool3): bool3;
	public static XOR(v: bool3, n: boolean): bool3;
	public static XOR(a: bool3, b: bool3): bool3;
	public static XOR(a: bool3 | boolean, b?: bool3 | boolean): bool3 {
		if (typeof a == "boolean" && b instanceof bool3)
			return new bool3(a != b.x, a != b.y, a != b.z);

		if (typeof b == "boolean" && a instanceof bool3)
			return new bool3(b != a.x, b != a.y, b != a.z);

		if (a instanceof bool3 && b instanceof bool3)
			return new bool3(a.x != b.x, a.y != b.y, a.z != b.z);

		throw new Error("Invalid Input");
	}
	public Equals(other: bool3): boolean {
		return this.x == other.x && this.y == other.y && this.z == other.z;
	}
	public static Equals(n: boolean, v: bool3): bool3;
	public static Equals(v: bool3, n: boolean): bool3;
	public static Equals(a: bool3, b: bool3): bool3;
	public static Equals(a: bool3 | boolean, b?: bool3 | boolean): bool3 {
		if (typeof a == "boolean" && b instanceof bool3)
			return new bool3(a == b.x, a == b.y, a == b.z);

		if (typeof b == "boolean" && a instanceof bool3)
			return new bool3(b == a.x, b == a.y, b == a.z);

		if (a instanceof bool3 && b instanceof bool3)
			return new bool3(a.x == b.x, a.y == b.y, a.z == b.z);

		throw new Error("Invalid Input");
	}
	public GetHashCode(): number {
		return (((+this.x * 397) ^ +this.y) * 397) ^ +this.z;
	}
}
