import { useEffect, useState } from "react";
function ImagePreview({
  src,
  alt,
  handlePreview,
  onDelete,
  onReset,
}) {
  const [open, setOpen] = useState(false);
  const [fileKey, setFileKey] = useState(Date.now());
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "auto";
  }, [open]);

  const handleDelete = () => {
    const answer = confirm("Bạn có chắc chắn muốn xóa ảnh không?");
    if (answer) {
      onDelete();
    }
  };
  return (
    <>
      <div className="h-full w-full">
        <input
          key={fileKey}
          type="file"
          name="image"
          id="fileUpload"
          className="hidden"
          accept="image/*"
          onChange={handlePreview}
        />
        <img
          src={src}
          alt={alt}
          className="absolute top-0 left-0 h-full w-full object-cover"
          onClick={() => setOpen(true)}
        />
        <div className="absolute flex items-center cursor-pointer px-[8px] py-[4px] bg-black/60 rounded-[5px] bottom-[5px] right-[5px]">
          <label htmlFor="fileUpload">
            <img src="/pen.svg" alt="" className="pr-[8px] mr-[8px] border-r" />
          </label>
          <img
            src="/bin2.svg"
            alt=""
            onClick={() => {
              handleDelete();
              setFileKey(Date.now());
              onReset();
            }}
          />
        </div>
      </div>
      {open && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-[9999]">
          <div className="relative">
            <img
              src={src}
              alt={alt}
              className="w-[60vw] h-[80vh] object-contain"
            />
          </div>
          <img
            src="/close.svg"
            alt=""
            className="w-[40px] h-[40px] cursor-pointer absolute top-[20px] right-[20px]"
            onClick={() => setOpen(false)}
          />
        </div>
      )}
    </>
  );
}

export default ImagePreview;
