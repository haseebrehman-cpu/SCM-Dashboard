import FileUploadView from "../../Views/FileUpload"
import PageMeta from "../../components/common/PageMeta"


const FileUploadPage = () => {
  return (
    <>
      <PageMeta
        title="File Upload | SCM Dashboard"
        description="Upload your files in two simple steps"
      />
    <div className="w-full max-w-full overflow-hidden">
      <FileUploadView/>
    </div>
    </>
  )
}

export default FileUploadPage