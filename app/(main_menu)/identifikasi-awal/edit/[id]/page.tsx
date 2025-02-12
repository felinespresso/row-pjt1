"use server";
import { getDataById } from "@/lib/identifikasi/data";
import { notFound } from "next/navigation";
import EditIdentifikasiAwal from "@/app/_components/edit-identifikasi";

const UpdateForm = async ({params}: {params:{id:string}}) =>{
    const id = params.id;
    const data = await getDataById(id);

    if(!data){
        notFound();
    }

    return (
            <>
                <EditIdentifikasiAwal data={data}/>
            </>
    );
};

export default UpdateForm;