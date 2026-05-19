import React, { useState } from "react";
import ReactQuill from "react-quill-new";

interface TextEditorProps {
  value: string;
  setValue: () => void;
}

const TextEditor = ({ value, setValue }: TextEditorProps) => {
  const modules = {
    toolbar: [
      // Font & Size
      // [{ size: ["small", false, "large", "huge"] }],

      // Headings
      [{ header: [1, 2, 3, 4, 5, 6, false] }],

      // Text styling
      ["bold", "italic", "underline", "strike"],

      // Colors
      [{ color: [] }, { background: [] }],

      // // Script
      // [{ script: "sub" }, { script: "super" }],

      // Alignment
      [{ align: [] }],

      // Lists
      [{ list: "ordered" }, { list: "bullet" }],
      [{ indent: "-1" }, { indent: "+1" }],

      // Direction
      // [{ direction: "rtl" }],

      // Block styles
      ["blockquote"],

      // Media
      ["link"],

      // // Table-like formatting
      // ["formula"],

      // Undo/Redo (custom handlers needed)
      ["clean"],
    ],
  };

  return (
    <div className="w-full h-120 mb-26 md:mb-20 ">
      <ReactQuill
        className="h-full"
        theme="snow"
        value={value}
        onChange={setValue}
        modules={modules}
      />
    </div>
  );
};

export default TextEditor;
