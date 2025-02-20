"use server";
import { notFound } from "next/navigation";
import EditEvidence from "@/app/_components/edit-evidence";
import { getEvidenceById } from "@/lib/identifikasi/data";

const UpdateForm = async ({ params }: { params: { id: string, editFormId: string, identifikasiId: string } }) => {
    const { id, editFormId, identifikasiId } = params;
    const data = await getEvidenceById(editFormId);
    if (!data) return notFound();

    return (
        <>
            <EditEvidence data={data} itemId={id} identifikasiId={identifikasiId} />
        </>
    );
};

export default UpdateForm;