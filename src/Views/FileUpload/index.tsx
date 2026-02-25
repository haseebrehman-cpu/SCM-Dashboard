import FileUpload from '../../Sections/FileUpload/FileUpload'
import PageMeta from '../../components/common/PageMeta'
import FileLogsGrid from '../../Sections/FileUpload/FileLogsGrid'
import Headline from '../../Sections/FileUpload/Headline'

const FileUploadView = () => {
  return (
    <>
      <PageMeta
        title="File Upload | SCM Dashboard"
        description="Upload your files in two simple steps"
      />
      <div className="w-full max-w-full overflow-hidden">
        <Headline alertMessage={"First you need to fill the sku mapper application after that you can upload the Files."} />
        <FileUpload />
        <FileLogsGrid />
      </div>
    </>
  )
}

export default FileUploadView