"use server";
import { notFound } from "next/navigation";
import EditEvidence from "@/app/_components/edit-evidence";
import { getEvidenceById } from "@/lib/identifikasi/data";

const UpdateForm = async ({params}: {params:{id:string}}) =>{
    const id = params.id;
    const data = await getEvidenceById(id);
    if(!data) return notFound();

    return (
            <>
                <EditEvidence data={data}/>
            </>
    );
};

export default UpdateForm;