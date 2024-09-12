import Image from 'next/image';
import { ModalComponent } from '../modal';

type ShowQrModalProps = {
   modalId: string;
   code: string;
   imgUrl: string;
   name: string;
   clientId: string;
};

export const ShowQrModal = ({ modalId, code, imgUrl, name, clientId }: ShowQrModalProps) => {
   console.log(modalId, code, imgUrl, name, clientId);
   const closeModal = () => {
      const modal = document.getElementById(`${modalId}`);
      if (modal) {
         (modal as HTMLDialogElement).close();
      }
   };
   return (
      <dialog id={modalId} className="modal">
         <div className="modal-box p-0">
            <img src={`/${imgUrl}`} alt="QR Code" className="w-full" />
         </div>
         <form method="dialog" className="modal-backdrop">
            <button>close</button>
         </form>
      </dialog>
   );
};
