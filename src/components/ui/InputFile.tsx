import React, { useState, useEffect } from 'react'
import { useDropzone } from 'react-dropzone'

interface InputFileProps {
  onChange?: (file: File | string) => void
  onValidate?: (isValid: boolean) => void
  size?: 'avatar' | 'featured' | 'cover'
  label?: string
  feedback?: string
  defaultSrc?: string
  noRadius?: boolean
  required?: boolean
}

const InputFile: React.FC<InputFileProps> = ({
  onChange = () => {},
  onValidate = () => {},
  size = 'avatar',
  label = 'File',
  feedback = 'Please provide a valid file',
  defaultSrc = '',
  noRadius = false,
  required = false
}) => {
  const [src, setSrc] = useState('')
  useEffect(() => {
    if (defaultSrc) setSrc(defaultSrc)
  }, [defaultSrc])

  const onDrop = (acceptedFiles: File[]) => {
    const file = acceptedFiles[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e: ProgressEvent<FileReader>) => {
        if (e.target && typeof e.target.result === 'string') {
          setSrc(e.target.result)
        }
      }
      reader.readAsDataURL(file)
      onChange(file)
    } else {
      onValidate(false)
    }
  }

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop })
  const handleReset = (e: React.MouseEvent<HTMLLabelElement, MouseEvent>) => {
    e.stopPropagation()
    setSrc('')
    onChange(null as any) // Reset với null thay vì chuỗi rỗng để tránh lỗi formData
  }

  return (
    <div
      className={`cus-input-group cus-input-group--file ${
        size === 'avatar' ? 'cus-avatar-wrap' : ''
      }`}
    >
      <div
        className={`${size === 'avatar' ? 'cus-avatar-box' : 'cus-cover-box'}`}
        {...getRootProps()}
      >
        <input {...getInputProps()} />
        <div
          className={`${
            size === 'avatar'
              ? 'cus-avatar'
              : size === 'featured'
                ? 'cus-featured'
                : 'cus-cover'
          }`}
        >
          {src && (
            <img
              loading='lazy'
              src={src}
              className={size === 'avatar' ? 'cus-avatar-img' : 'cus-cover-img'}
              style={{ borderRadius: `${noRadius ? '0' : '0.275rem'}` }}
              alt=''
            />
          )}

          {src && (
            <label
              className={`${
                size === 'avatar'
                  ? 'cus-avatar-icon cus-avatar-icon--rm'
                  : 'cus-cover-icon cus-cover-icon--rm'
              }`}
              onClick={handleReset}
            >
              <i className='fa-solid fa-times' />
            </label>
          )}

          {!src && (
            <label
              className={`${
                size === 'avatar'
                  ? 'cus-avatar-label rounded-1'
                  : 'cus-cover-label rounded-1'
              }`}
              style={{ borderRadius: `${noRadius ? '0' : '0.275rem'}` }}
            >
              {isDragActive ? (
                <>
                  <i className='fa-light fa-cloud-check text-secondary' />
                </>
              ) : (
                <>
                  <i className='fa-light fa-cloud-arrow-up text-primary-rgba' />
                  <small
                    className='invalid-feedback ms-2 mt-0'
                    style={{ width: 'unset' }}
                  >
                    {feedback}
                  </small>
                </>
              )}
            </label>
          )}
        </div>
      </div>
      <label className='text-secondary mt-1 fs-9'>
        {label} {required && <span className='text-danger'>*</span>}
      </label>
    </div>
  )
}

export default InputFile
