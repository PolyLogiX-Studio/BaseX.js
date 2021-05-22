import { MathX } from "./MathX";
export class PrimitiveCircularBuffer<T> {
	private head: number;
	private tail: number;
	private capacity: number;
	private size: number;
	private static elementSize = 0;
	private buffer: T[];

	public LinearHead: number;

	public LinearTail: number;

	public CanOverflow: boolean;

	public CanExpand: boolean;

	public MaxCapacity: number;

	public get ElementSize(): number {
		return PrimitiveCircularBuffer.elementSize;
	}

	public get Capacity(): number {
		return this.capacity;
	}
	public set Capacity(value: number) {
		this.SetCapacity(value);
	}

	public get Size(): number {
		return this.size;
	}

	public get Free(): number {
		return this.capacity - this.size;
	}

	constructor(capacity: number) {
		if (!(capacity > 0)) throw new Error("Capacity must be greater than 0");
		Object.defineProperties(this, {
			head: { enumerable: false, value: 0, configurable: true, writable: true },
			tail: { enumerable: false, value: 0, configurable: true, writable: true },
			capacity: {
				enumerable: false,
				value: 0,
				configurable: true,
				writable: true,
			},
			size: { enumerable: false, value: 0, configurable: true, writable: true },
			buffer: {
				enumerable: false,
				value: null,
				configurable: true,
				writable: true,
			},
		});
		this.head = 0;
		this.tail = 0;
		this.size = 0;
		this.LinearHead = 0;
		this.LinearTail = 0;
		this.CanOverflow = false;
		this.CanExpand = false;
		this.MaxCapacity = 64;
		this.capacity = capacity;
		this.buffer = new Array(capacity);
		if (PrimitiveCircularBuffer.elementSize != 0) return;
		PrimitiveCircularBuffer.elementSize = 1;
	}
	public Put(data: unknown[], allowOverwrite: boolean): void;
	public Put(
		data: unknown[],
		offset: number,
		count?: number,
		allowOverwrite?: boolean
	): void;
	public Put(
		data: unknown[],
		offset: boolean | number,
		count?: number,
		allowOverwrite = false
	): void {
		if (count == null) {
			return this.Put(
				data,
				0,
				data.length / PrimitiveCircularBuffer.elementSize,
				offset as boolean
			);
		}
		this.InternalPut(data, offset as number, count as number, allowOverwrite);
	}
	private InternalPut(
		data: Array<unknown>,
		offset: number,
		count: number,
		overwrite = false
	): void {
		if (count > this.capacity) {
			if (this.CanExpand) this.SetCapacity(count);
			else if (!overwrite)
				throw new Error("Capacity of the buffer is too small!");
		}
		if (count > this.Free) {
			let num1 = this.capacity;
			if (this.CanExpand) {
				num1 = this.capacity + (count - this.Free);
				if (this.MaxCapacity > 0) num1 = Math.min(num1, this.MaxCapacity);
			}
			if (num1 < count) {
				if (!overwrite)
					throw new Error(
						"The maximum capacity is smaller than the amount of data being written"
					);
				const num2 = count - num1;
				this.LinearHead += num2;
				this.LinearTail += num2;
				count = num1;
				offset = num2 * PrimitiveCircularBuffer.elementSize;
			}
			const num3 = count > num1 - this.Size ? 1 : 0;
			if (num3 != 0 && !this.CanOverflow) throw new Error("Buffer overflow!");
			if (num1 > this.capacity) this.SetCapacity(num1);
			if (num3 != 0) {
				const num2 = count - this.Free;
				this.tail += num2;
				this.LinearTail += num2;
				this.tail %= this.capacity;
				this.size -= num2;
			}
		}
		while (count > 0) {
			const num = Math.min(
				this.head < this.tail ? this.Free : this.capacity - this.head,
				count
			);
			this.buffer.splice(
				this.head * PrimitiveCircularBuffer.elementSize,
				num * PrimitiveCircularBuffer.elementSize,
				...(data.slice(
					offset,
					num * PrimitiveCircularBuffer.elementSize
				) as Array<T>)
			);
			count -= num;
			offset += num * PrimitiveCircularBuffer.elementSize;
			this.head += num;
			this.LinearHead += num;
			this.head %= this.capacity;
			this.size += num;
		}
	}
	public Read(
		target: T[],
		offset: number,
		count: number,
		readOffset = 0
	): number {
		return this.InternalRead(target, offset, count, readOffset, false);
	}
	public Get(target: T[], offset: number, count: number): number;
	public Get(count: number): T[];
	public Get(): T[];
	public Get(
		target?: T[] | number,
		offset?: number,
		count?: number
	): T[] | number {
		if (target == null) 
			return this.Get(this.size);

		if (offset == null) {
			const t: T[] = [];
			this.Get(t, 0, target as number);
			return t;
		}
		return this.InternalRead(target as T[], offset, count as number, 0, true);
	}
	public Trim(): void {
		this.SetCapacity(this.Size);
	}
	private InternalRead(
		target: T[],
		offset: number,
		count: number,
		readOffset: number,
		advanceTail: boolean
	): number {
		count = MathX.Clamp(count, 0, Math.max(0, this.size - readOffset));
		const num1 = count;
		let num2 = (this.tail + readOffset) % this.capacity;
		while (count > 0) {
			const num3 = Math.min(
				num2 < this.head ? this.head - num2 : this.capacity - num2,
				count
			);
			target.splice(
				offset,
				num3 * PrimitiveCircularBuffer.elementSize,
				...(this.buffer.slice(
					num2 * PrimitiveCircularBuffer.elementSize,
					PrimitiveCircularBuffer.elementSize * num3
				) as Array<T>)
			);
			count -= num3;
			offset += num3 * PrimitiveCircularBuffer.elementSize;
			num2 = (num2 + num3) % this.capacity;
			if (advanceTail) {
				this.tail += num3;
				this.tail %= this.capacity;
				this.LinearTail += num3;
				this.size -= num3;
			}
		}
		return num1;
	}

	private SetCapacity(newCapacity: number): void {
		if (!(newCapacity >= this.Size))
			throw new Error(
				"Cannot set capacity below the size of the data in the buffer"
			);
		const target = new Array(newCapacity);
		const size = this.Size;
		this.Get(target, 0, this.Size);
		this.buffer = target;
		this.tail = 0;
		this.head = size;
		this.capacity = newCapacity;
		this.size = size;
	}
}
