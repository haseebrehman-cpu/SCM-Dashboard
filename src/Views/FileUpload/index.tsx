import FileUpload from '../../Sections/FileUpload/FileUpload'
import PageMeta from '../../components/common/PageMeta'
import FileLogsGrid from '../../Sections/FileUpload/FileLogsGrid'

const FileUploadView = () => {
  return (
    <>
      <PageMeta
        title="File Upload | SCM Dashboard"
        description="Upload your files in two simple steps"
      />
      <div className="w-full max-w-full overflow-hidden">
        <FileUpload />
        <FileLogsGrid />
      </div>
    </>
  )
}

export default FileUploadView