import { useState, useEffect } from 'react'
import { Editor } from 'react-draft-wysiwyg'
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css'
import React from 'react'

const Draft = () => {
  const [iShow, setIshow] = useState(false)
  useEffect(() => {
    setIshow(true)
  }, [])
  return (
    <>
      {iShow && (
        <Editor
          wrapperClassName="novel-map__editor-wrapper"
          editorClassName="novel-map__editor-content"
          toolbar={{
            blockType: {
              inDropdown: true,
              options: ['Normal', 'H1', 'H2', 'H3', 'H4', 'H5', 'H6'],
              className: undefined,
              component: undefined,
              dropdownClassName: undefined,
            },
          }}
        />
      )}
    </>
  )
}

export default Draft
