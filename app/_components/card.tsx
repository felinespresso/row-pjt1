import Image from "next/image"; 
import { DeleteEvidence, EditEvidence } from "./buttons"; 
import type { Evidences } from "@prisma/client"; 
 
const Card = ({data}:{data:Evidences}) => { 
    return ( 
    <div className="max-w-sm transition-shadow duration-300 bg-white border border-gray-200 rounded-md shadow hover:shadow-lg"> 
        <div className="relative aspect-video"> 
            <Image src={data.file} alt={`Evidence ${data.namaPemilik}`} fill priority sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw" 
            className="object-cover rounded-t-md"/> 
        </div> 
        <div className="p-5"> 
            <h1 className="text-lg font-bold text-gray-900 truncate">{data.namaPemilik}</h1> 
        </div> 
        <div className="flex items-center justify-between"> 
            <EditEvidence id={data.id}/> 
            <DeleteEvidence id={data.id}/> 
        </div> 
    </div> 
    ) 
} 
 
export default Card;