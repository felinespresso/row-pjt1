import { getDataById } from "@/lib/identifikasi/data";
import { notFound } from "next/navigation";
import EditIdentifikasiAwal from "@/app/_components/edit-identifikasi";

const UpdateForm = async ({ params }: { params: { id: string, editId: string } }) => {
    const { id, editId } = params;
    const data = await getDataById(editId);

    if (!data) {
        notFound()
    }

    return (
        <>
            <EditIdentifikasiAwal data={data} itemId={id} />
        </>
    );
};

export default UpdateForm;