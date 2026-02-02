"use client"

import React, { useMemo } from 'react'
import dynamic from 'next/dynamic'
import 'quill/dist/quill.snow.css'

// Dynamic import with SSR disabled
const ReactQuill = dynamic(
  async () => {
    const { default: RQ } = await import('react-quill-new')
    return function quill({ forwardedRef, ...props }) {
      return <RQ ref={forwardedRef} {...props} />
    }
  },
  { ssr: false }
)

const RichTextEditor = ({ value, onChange, placeholder = "Write something..." }) => {
  const quillRef = React.useRef(null)

  const modules = useMemo(() => ({
    toolbar: {
      container: [
        ['undo', 'redo'],
        [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
        ['bold', 'italic', 'underline', 'strike'],
        [{ 'list': 'ordered' }, { 'list': 'bullet' }],
        [{ 'script': 'sub' }, { 'script': 'super' }],
        [{ 'indent': '-1' }, { 'indent': '+1' }],
        [{ 'align': [] }],
        ['link', 'image', 'code-block'],
        ['clean'],
      ],
      handlers: {
        undo: function () { this.quill.history.undo() },
        redo: function () { this.quill.history.redo() }
      }
    },
    history: {
      delay: 1000,
      maxStack: 50,
      userOnly: false,
    }
  }), [])

  const formats = [
    'header', 'bold', 'italic', 'underline', 'strike',
    'list', 'bullet', 'indent', 'link', 'image', 'align', 'script', 'code-block'
  ]

  return (
    <div className="rich-text-editor bg-background rounded-2xl overflow-hidden border border-border shadow-sm">
      <ReactQuill
        forwardedRef={quillRef}
        theme="snow"
        value={value}
        onChange={onChange}
        modules={modules}
        formats={formats}
        placeholder={placeholder}
      />
      <style jsx global>{`
        /* Toolbar Styling */
        .ql-toolbar.ql-snow {
          border: none !important;
          border-bottom: 1px solid var(--border) !important;
          background: #f8fafc;
          padding: 12px !important;
          display: flex;
          flex-wrap: wrap;
          gap: 4px;
        }
        .ql-snow.ql-toolbar button, 
        .ql-snow .ql-toolbar button {
          border-radius: 6px;
          width: 32px;
          height: 32px;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.2s;
        }
        .ql-snow.ql-toolbar button:hover {
          background-color: white !important;
          color: var(--primary) !important;
          box-shadow: 0 2px 4px rgba(0,0,0,0.05);
        }
        
        /* Undo/Redo Custom Icons */
        .ql-undo:after {
          content: '⟲';
          font-size: 18px;
          font-weight: bold;
        }
        .ql-redo:after {
          content: '⟳';
          font-size: 18px;
          font-weight: bold;
        }

        /* Container & Editor */
        .ql-container.ql-snow {
          border: none !important;
          font-family: 'Nunito', sans-serif !important;
          font-size: 15px !important;
        }
        .ql-editor {
          min-height: 350px;
          padding: 24px !important;
          line-height: 1.6;
          color: #1e293b;
        }
        .ql-editor.ql-blank::before {
          color: #94a3b8 !important;
          font-style: normal !important;
          left: 24px !important;
        }

        /* Active states */
        .ql-snow.ql-toolbar button.ql-active {
          background-color: white !important;
          color: var(--primary) !important;
          box-shadow: inset 0 0 0 1px var(--primary);
        }
      `}</style>
    </div>
  )
}

export default RichTextEditor
