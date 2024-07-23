type DataTablesComponentProps = {
  modalWrapper?: string;
  backgroundColorHeader?: string;
  modalId?: string;
  modalHeader?: string;
  children?: React.ReactNode;
  modalBodyStyle?: string;
  closeModal: () => void;
};

export const ModalComponent = ({
  modalWrapper,
  backgroundColorHeader,
  modalId,
  modalHeader,
  children,
  modalBodyStyle,
  closeModal,
}: DataTablesComponentProps) => {
  return (
    <dialog id={modalId} className="modal">
      <div className={`modal-box ${modalWrapper}`}>
        <div
          className={`flex items-center justify-between ${backgroundColorHeader}`}
        >
          <h3 className="font-bold text-lg">{modalHeader}</h3>
          <button
            className="btn btn-sm btn-circle btn-ghost"
            onClick={closeModal}
          >
            ✕
          </button>
        </div>
        <div className={modalBodyStyle}>{children}</div>
      </div>
    </dialog>
  );
};
