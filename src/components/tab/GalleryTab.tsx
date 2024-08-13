export const GalleryTab = () => {
   return (
      <div>
         <h2 className="text-xl font-bold mb-4">Gallery</h2>
         <div className="border-2 border-dashed border-gray-300 p-4 text-center">
            <label
               htmlFor="dropzone-image"
               className="text-slate-900 flex flex-col items-center justify-center gap-4 cursor-pointer"
            >
               <svg
                  className="size-16"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 20 16"
               >
                  <path
                     stroke="currentColor"
                     strokeLinecap="round"
                     strokeLinejoin="round"
                     strokeWidth="2"
                     d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"
                  />
               </svg>
               <div>
                  <p className="mb-2">
                     <strong>Click to upload</strong> <span>or drag and drop</span>
                  </p>
                  <p className="text-sm text-gray-500">PNG, JPG, JPEG up to 10MB </p>
               </div>
            </label>
            <input id={'dropzone-image'} type="file" className="hidden" />
         </div>
      </div>
   );
};
