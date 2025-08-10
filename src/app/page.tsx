'use client'

import { useState, useRef } from 'react'

export default function Home() {
  const [file, setFile] = useState<File | null>(null)
  const [isConverting, setIsConverting] = useState(false)
  const [error, setError] = useState<string>('')
  const [isDragOver, setIsDragOver] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0]
    processFile(selectedFile)
  }

  const processFile = (selectedFile: File | undefined) => {
    if (selectedFile && (selectedFile.type === 'text/csv' || selectedFile.name.endsWith('.csv'))) {
      setFile(selectedFile)
      setError('')
    } else {
      setError('Please select a valid CSV file')
      setFile(null)
    }
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(true)
  }

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(false)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(false)
    const droppedFile = e.dataTransfer.files[0]
    processFile(droppedFile)
  }

  const handleConvert = async () => {
    if (!file) return

    setIsConverting(true)
    setError('')

    try {
      const formData = new FormData()
      formData.append('file', file)

      const response = await fetch('/api/convert', {
        method: 'POST',
        body: formData,
      })

      if (!response.ok) {
        throw new Error('Conversion failed')
      }

      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = file.name.replace(/\.csv$/i, '.xlsx')
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      window.URL.revokeObjectURL(url)
    } catch (err) {
      setError('Failed to convert file. Please try again.')
    } finally {
      setIsConverting(false)
    }
  }

  const clearFile = () => {
    setFile(null)
    setError('')
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50">
      {/* Header */}
      <header className="px-4 py-6 sm:py-8">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
            Free CSV to Excel Converter
          </h1>
          <p className="text-lg sm:text-xl text-gray-600 max-w-2xl mx-auto">
            Convert your CSV files to Excel format instantly. No registration required, completely free and secure.
          </p>
        </div>
      </header>

      {/* Main Content */}
      <main className="px-4 pb-12">
        <div className="max-w-2xl mx-auto">
          <div className="bg-white rounded-2xl shadow-xl p-6 sm:p-8 border border-gray-100">
            <div className="space-y-6">
              {/* Upload Area */}
              <div
                className={`relative border-2 border-dashed rounded-xl transition-all duration-300 ${
                  isDragOver
                    ? 'border-blue-500 bg-blue-50 scale-105'
                    : file
                    ? 'border-green-400 bg-green-50'
                    : 'border-gray-300 bg-gray-50 hover:bg-gray-100 hover:border-gray-400'
                }`}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
              >
                <label
                  htmlFor="file-upload"
                  className="flex flex-col items-center justify-center w-full h-48 sm:h-64 cursor-pointer p-6"
                >
                  <div className="flex flex-col items-center justify-center text-center">
                    {isConverting ? (
                      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
                    ) : (
                      <svg
                        className={`w-12 h-12 mb-4 transition-colors ${
                          file ? 'text-green-500' : 'text-gray-400'
                        }`}
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                        />
                      </svg>
                    )}
                    
                    {file ? (
                      <div className="text-center">
                        <p className="text-sm sm:text-base font-semibold text-green-700 mb-1">
                          {file.name}
                        </p>
                        <p className="text-xs text-green-600">
                          {(file.size / 1024).toFixed(1)} KB • Ready to convert
                        </p>
                      </div>
                    ) : (
                      <div className="text-center">
                        <p className="mb-2 text-sm sm:text-base text-gray-700">
                          <span className="font-semibold">Click to upload</span> or drag and drop
                        </p>
                        <p className="text-xs sm:text-sm text-gray-500">
                          Supports CSV files up to 10MB
                        </p>
                      </div>
                    )}
                  </div>
                  
                  <input
                    ref={fileInputRef}
                    id="file-upload"
                    type="file"
                    accept=".csv,text/csv"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                </label>

                {file && (
                  <button
                    onClick={clearFile}
                    className="absolute top-3 right-3 p-1 bg-gray-200 hover:bg-gray-300 rounded-full transition-colors"
                    aria-label="Remove file"
                  >
                    <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                )}
              </div>

              {/* Error Message */}
              {error && (
                <div className="bg-red-50 border border-red-200 rounded-xl p-4 animate-shake">
                  <div className="flex items-center">
                    <svg className="w-5 h-5 text-red-500 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16c-.77.833.192 2.5 1.732 2.5z" />
                    </svg>
                    <p className="text-sm text-red-700 font-medium">{error}</p>
                  </div>
                </div>
              )}

              {/* Convert Button */}
              <button
                onClick={handleConvert}
                disabled={!file || isConverting}
                className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white py-4 px-6 rounded-xl font-semibold text-lg hover:from-blue-700 hover:to-blue-800 disabled:from-gray-300 disabled:to-gray-300 disabled:cursor-not-allowed transition-all duration-300 transform hover:scale-105 disabled:hover:scale-100 shadow-lg disabled:shadow-none"
              >
                {isConverting ? (
                  <div className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3"></div>
                    Converting...
                  </div>
                ) : (
                  <div className="flex items-center justify-center">
                    <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    Convert to Excel
                  </div>
                )}
              </button>
            </div>
          </div>

          {/* Features */}
          <div className="mt-12 grid grid-cols-1 sm:grid-cols-3 gap-6">
            <div className="text-center p-6 bg-white rounded-xl shadow-md border border-gray-100">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">100% Secure</h3>
              <p className="text-sm text-gray-600">Files are processed locally and never stored on our servers</p>
            </div>

            <div className="text-center p-6 bg-white rounded-xl shadow-md border border-gray-100">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Lightning Fast</h3>
              <p className="text-sm text-gray-600">Convert your CSV files to Excel format in seconds</p>
            </div>

            <div className="text-center p-6 bg-white rounded-xl shadow-md border border-gray-100">
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Mobile Friendly</h3>
              <p className="text-sm text-gray-600">Works perfectly on all devices - desktop, tablet, and mobile</p>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="px-4 py-8 border-t border-gray-200 bg-white">
        <div className="max-w-4xl mx-auto text-center text-sm text-gray-600">
          <p>© 2024 CSV to Excel Converter. Free online tool for converting CSV files to Excel format.</p>
        </div>
      </footer>
    </div>
  )
}