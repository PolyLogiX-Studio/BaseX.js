import { MikktspaceContext } from "./MikktspaceContext";
import { VerticesPerFaceHandler } from "./VerticesPerFaceHandler";
import { VetrexPositionHandler } from "./VetrexPositionHandler";
import { VertexNormalHandler } from "./VertexNormalHandler";
import { VertexUVHandler } from "./VertexUVHandler";
import { TangentHandler } from "./TangentHandler";
import { BasicTangentHandler } from "./BasicTangentHandler";
import { SMikkTSpaceInterface } from './SMikkTSpaceInterface';
export class MikkGenerator {
	public static GenerateTangentSpace(
		faceCount: number,
		getVerticesPerFace: VerticesPerFaceHandler,
		getPosition: VetrexPositionHandler,
		getNormal: VertexNormalHandler,
		getUV: VertexUVHandler,
		setTangent: TangentHandler,
		angularThreshhold?: number
	): boolean;
	public static GenerateTangentSpace(
		faceCount: number,
		getVerticesPerFace: VerticesPerFaceHandler,
		getPosition: VetrexPositionHandler,
		getNormal: VertexNormalHandler,
		getUV: VertexUVHandler,
		setTangentBasic: BasicTangentHandler,
		angularThreshhold?: number
	): boolean;
	public static GenerateTangentSpace(
		context: MikktspaceContext,
		angularThreashhold: number
	): boolean;
	public static GenerateTangentSpace(
		context: number | MikktspaceContext,
		getVerticesPerFace: number | VerticesPerFaceHandler = 180,
		getPosition?: VetrexPositionHandler,
		getNormal?: VertexNormalHandler,
		getUV?: VertexUVHandler,
		setTangent?: TangentHandler | BasicTangentHandler,
		angularThreshhold = 180
	): boolean {
		if (context instanceof MikktspaceContext) {
			const smikkTspaceInterface = new SMikkTSpaceInterface();
		} else {
			if (setTangent?.length) {
			}
		}
	}
}
