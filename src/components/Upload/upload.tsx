import React, { ChangeEvent, FC, useRef, useState } from 'react'
import axios from 'axios'
import Dragger from './dragger'
import { UploadList } from './uploadList'

export type UploadFileStatus = 'ready' | 'uploading' | 'success' | 'error'

export interface UploadFile {
    uid: string
    size: number
    name: string
    status?: UploadFileStatus
    percent?: number
    raw?: File
    response?: any
    error?: any
}

export interface UploadProps {
    action: string
    defaultFileList?: UploadFile[]
    beforeUpload?: (file: File) => boolean | Promise<File>
    onProgress?: (percentage: number, file: File) => void
    onSuccess?: (data: any, file: File) => void
    onError?: (err: any, file: File) => void
    onChange?: (file: File) => void
    onRemove?: (file: UploadFile) => void
    headers?: { [key: string]: any }
    name?: string
    data?: { [key: string]: any }
    withCredentials?: boolean
    accept?: string
    multiple?: boolean
    drag?: boolean
}

export const Upload: FC<UploadProps> = (props) => {
    const {
        action,
        onProgress,
        onSuccess,
        onError,
        beforeUpload,
        onChange,
        onRemove,
        headers,
        name,
        data,
        withCredentials,
        accept,
        multiple,
        drag,
        children,
    } = props
    const fileInput = useRef<HTMLInputElement>(null)
    const [fileList, setFileList] = useState<UploadFile[]>([])

    const updateFileList = (updateFile: UploadFile, updateObj: Partial<UploadFile>) => {
        setFileList((prevList) => {
            return prevList.map((file) => {
                if (file.uid === updateFile.uid) {
                    return { ...file, ...updateObj }
                } else {
                    return file
                }
            })
        })
    }
    const post = (file: File) => {
        const _file: UploadFile = {
            uid: Date.now() + 'upload-file',
            status: 'ready',
            name: file.name,
            size: file.size,
            percent: 0,
            raw: file,
        }
        setFileList((prevList) => {
            return [_file, ...prevList]
        })
        const formData = new FormData()
        formData.append(name || 'file', file)
        if (data) {
            Object.keys(data).forEach((key) => {
                formData.append(key, data[key])
            })
        }
        axios
            .post(action, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    ...headers,
                },
                withCredentials,
                onUploadProgress: (e) => {
                    const percentage = Math.round((e.loaded * 100) / e.total) || 0
                    if (percentage < 100) {
                        updateFileList(_file, { percent: percentage, status: 'uploading' })
                        onProgress?.(percentage, file)
                    }
                },
            })
            .then((resp) => {
                updateFileList(_file, { status: 'success', response: resp.data })
                onSuccess?.(resp.data, file)
                onChange?.(file)
            })
            .catch((err) => {
                updateFileList(_file, { status: 'error', error: err })
                onError?.(err, file)
                onChange?.(file)
            })
    }

    const handleClick = () => {
        if (fileInput.current) {
            fileInput.current.click()
        }
    }

    const uploadFile = (files: FileList) => {
        const postFiles = Array.from(files)
        postFiles.forEach((file) => {
            if (!beforeUpload) {
                post(file)
            } else {
                const result = beforeUpload(file)
                if (result && result instanceof Promise) {
                    result.then((processedFile) => {
                        post(processedFile)
                    })
                } else if (result !== false) {
                    post(file)
                }
            }
        })
    }
    const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files
        if (!files) {
            return
        }
        uploadFile(files)
        if (fileInput.current) {
            fileInput.current.value = ''
        }
    }

    const handleRemove = (file: UploadFile) => {
        setFileList((prevList) => {
            return prevList.filter((item) => item.uid !== file.uid)
        })
        onRemove?.(file)
    }

    return (
        <div className="rol-upload-component">
            <div className="rol-upload-input" style={{ display: 'inline-block' }} onClick={handleClick}>
                {drag ? (
                    <Dragger
                        onFile={(files) => {
                            uploadFile(files)
                        }}
                    >
                        {children}
                    </Dragger>
                ) : (
                    children
                )}
                <input
                    className="rol-file-input"
                    style={{ display: 'none' }}
                    type="file"
                    accept={accept}
                    multiple={multiple}
                    ref={fileInput}
                    onChange={handleFileChange}
                />
            </div>

            <UploadList fileList={fileList} onRemove={handleRemove} />
        </div>
    )
}

Upload.defaultProps = {
    name: 'file',
}

export default Upload
