import { color } from "./color";
import { Out } from "@bombitmanbomb/utils";
export class color32 {
	public r!: number;
	public g!: number;
	public b!: number;
	public a!: number;

	public color32(r: number, g: number, b: number, a?: number): void;
	public color32(c: color): void;
	public color32(r: number | color, g?: number, b?: number, a = 255): void {
		if (r instanceof color) {
			this.r = color32.ToByte(r.r);
			this.g = color32.ToByte(r.g);
			this.b = color32.ToByte(r.b);
			this.a = color32.ToByte(r.a);
		} else {
			this.r = r;
			this.g = g as number;
			this.b = b as number;
			this.a = a;
		}
	}
	constructor(r: number, g: number, b: number, a?: number);
	constructor(c: color);
	constructor(r: number | color, g?: number, b?: number, a = 255) {
		this.color32(r as number, g as number, b as number, a);
	}
	public THIS(index: number): number {
		switch (index) {
		case 0:
			return this.r;
		case 1:
			return this.g;
		case 2:
			return this.b;
		case 3:
			return this.a;
		default:
			throw new Error("Invalid color channel index!");
		}
	}
	public static ToColor(c: color32): color {
		return new color(c.r / 255, c.g / 255, c.b / 255, c.a / 255);
	}
	public static ToByte(value: number): number {
		value *= 255;
		value += 0.5;
		if (value <= 0) return 0;
		return value >= 255 ? 255 : value;
	}
	public static FromHexCode(
		hex: string,
		color: Out<color32>,
		hasAlpha: Out<boolean>,
		defaultAlpha?: number
	): boolean;
	public static FromHexCode(
		hex: string,
		color: Out<color32>,
		defaultAlpha?: number
	): boolean;
	public static FromHexCode(
		hex: string,
		col: Out<color32>,
		hasAlpha: Out<boolean> | number = 255,
		defaultAlpha = 255
	): boolean {
		if (typeof hasAlpha == "number") {
			return color32.FromHexCode(hex, col, new Out(), defaultAlpha);
		} else {
			hex = hex.trim();
			if (hex == "") {
				col.Out = new color32(0, 0, 0, 0);
				hasAlpha.Out = false;
				return false;
			}
			if (hex[0] == "#") hex = hex.slice(1);
			const flag1 = 1;
			if (hex.length == 3 || hex.length == 4) {
				const r: Out<number> = new Out();
				const num: Out<number> = new Out();
				const b: Out<number> = new Out();
				let flag2 =
					flag1 &
					((color32.TryParseHex(hex.substr(0, 1), r) as unknown) as number) &
					((color32.TryParseHex(hex.substr(1, 1), num) as unknown) as number) &
					((color32.TryParseHex(hex.substr(2, 1), b) as unknown) as number);
				const a: Out<number> = new Out();
				if (hex.length == 4) {
					flag2 &= (color32.TryParseHex(
						hex.substr(3, 1),
						a
					) as unknown) as number;
					(a.Out as number) *= 17;
					hasAlpha.Out = true;
				} else {
					a.Out = defaultAlpha;
					hasAlpha.Out = false;
				}
				(r.Out as number) *= 17;
				const g = (num.Out as number) * 17;
				(b.Out as number) *= 17;
				col.Out = new color32(r.Out as number, g, b.Out as number, a.Out);
				return flag2 != 0;
			}
			if (hex.length == 6 || hex.length == 8) {
				const r: Out<number> = new Out();
				const g: Out<number> = new Out();
				const b: Out<number> = new Out();
				let flag2 =
					flag1 &
					((color32.TryParseHex(hex.substr(0, 2), r) as unknown) as number) &
					((color32.TryParseHex(hex.substr(2, 2), g) as unknown) as number) &
					((color32.TryParseHex(hex.substr(4, 2), b) as unknown) as number);
				const a: Out<number> = new Out();
				if (hex.length == 8) {
					flag2 &= (color32.TryParseHex(
						hex.substr(6, 2),
						a
					) as unknown) as number;
					hasAlpha.Out = true;
				} else {
					a.Out = defaultAlpha;
					hasAlpha.Out = false;
				}
				col.Out = new color32(
					r.Out as number,
					g.Out as number,
					b.Out as number,
					a.Out as number
				);
				return flag2 != 0;
			}
			col.Out = new color32(0, 0, 0, 0);
			hasAlpha.Out = false;
			return false;
		}
	}
	public static TryParseHex(hex: string, value: Out<number>): boolean {
		value.Out = 0;
		for (let index = 0; index < hex.length; index++) {
			value.Out <<= 4;
			const num: Out<number> = new Out();
			if (!color32.HexValue(hex[index], num)) return false;
			value.Out |= num.Out as number;
		}
		return true;
	}

	private static HexValue(ch: string, value: Out<number>): boolean {
		const charCode = ch.charCodeAt(0);
		if (charCode >= "0".charCodeAt(0) && charCode <= "9".charCodeAt(0)) {
			value.Out = charCode - 48;
			return true;
		}
		if (charCode >= "a".charCodeAt(0) && charCode <= "f".charCodeAt(0)) {
			value.Out = charCode - 97 + 10;
			return true;
		}
		if (charCode >= "A".charCodeAt(0) && charCode <= "F".charCodeAt(0)) {
			value.Out = charCode - 65 + 10;
			return true;
		}
		value.Out = 0;
		return false;
	}
	public GetHashCode(): number {
		return (
			(((-490236692 * -1521134295 + this.r) * -1521134295 + this.g) *
				-1521134295 +
				this.b) *
				-1521134295 +
			this.a
		);
	}
}
