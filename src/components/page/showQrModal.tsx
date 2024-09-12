import Image from 'next/image';
import { ModalComponent } from '../modal';

type ShowQrModalProps = {
   modalId: string;
   code: string;
   imgUrl: string;
};

export const ShowQrModal = ({ modalId, code, imgUrl }: ShowQrModalProps) => {
   console.log(modalId, code, imgUrl);
   const closeModal = () => {
      const modal = document.getElementById(`${modalId}`);
      if (modal) {
         (modal as HTMLDialogElement).close();
      }
   };
   return (
      <dialog id={modalId} className="modal">
         <div className="modal-box p-0">
            <Image src={`/${imgUrl}`} alt="QR Code" width={500} height={500} className="w-full" unoptimized />
         </div>
         <form method="dialog" className="modal-backdrop">
            <button>close</button>
         </form>
      </dialog>
   );
};
