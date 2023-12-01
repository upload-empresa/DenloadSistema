// pages/YourPage.js
import PDFViewer from "@/components/pdfviewer";
import { useRouter } from "next/router";


const YourPage = () => {
    // const pdfUrl = 'https%3A%2F%2Fres.cloudinary.com%2Fdk2cds2bv%2Fimage%2Fupload%2Fv1701443042%2Fg35zuhlmhhbc3jx0ts73.pdf';

    const router = useRouter();

    const { photoId } = router.query;

    console.log(photoId)

    return (
        <div>
            <PDFViewer file={photoId} />
        </div>
    );
};

export default YourPage;
