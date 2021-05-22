import { StringBuilder } from "@bombitmanbomb/utils";
export class PrimitivesUtility {
	public static ExtractElements(
		s: string,
		requiredCount: number
	): string[] | null {
		if (s == null || s.trim() == "") return null;
		const num1 = s.indexOf("[");
		const num2 = s.indexOf("]");
		if (num1 < 0 || num2 < 0) return null;
		s = s.substr(num1 + 1, num2 - num1 - 1);
		const strArray: string[] = s.split(";");
		return strArray.length != requiredCount ? null : strArray;
	}
	public static BitsToString(
		value: number,
		bits: number,
		one = "1",
		zero = "0"
	): string {
		const stringBuilder = new StringBuilder();
		let num = 1 << (bits - 1);
		for (let index = 0; index < bits; index++) {
			stringBuilder.Append((value & num) != 0 ? one : zero);
			num = num >> 1;
		}
		return stringBuilder.toString();
	}
}
