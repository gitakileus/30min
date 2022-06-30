/* eslint-disable global-require */
// @ts-nocheck
import React, {useEffect, useRef, useState} from 'react';

const Editor = ({
  onChange,
  name,
  value,
  setDescLength,
}: {
  onChange: (value: string) => void;
  name: string;
  value: string;
  setDescLength?: (data: number) => void;
}) => {
  const editorRef = useRef();
  const {CKEditor, ClassicEditor} = editorRef.current || {};
  const [editorLoaded, setEditorLoaded] = useState(false);

  useEffect(() => {
    editorRef.current = {
      CKEditor: require('@ckeditor/ckeditor5-react').CKEditor,
      ClassicEditor: require('@ckeditor/ckeditor5-build-classic'),
    };
    setEditorLoaded(true);
  }, []);

  return (
    <div>
      {editorLoaded ? (
        <CKEditor
          type=''
          name={name}
          editor={ClassicEditor}
          data={value}
          config={{
            toolbar: [
              'undo',
              'redo',
              'heading',
              '|',
              'bold',
              'italic',
              'link',
              '|',
              'blockQuote',
              'bulletedList',
              'numberedList',
            ],
          }}
          onChange={(event, editor) => {
            const data = editor.getData();
            onChange(data);
            if (setDescLength)
              setDescLength(data.length === 0 ? 0 : data.replace(/&nbsp;/gm, ' ').length);
          }}
        />
      ) : (
        <div>Editor loading</div>
      )}
    </div>
  );
};

export default Editor;
