type DataTablesComponentProps = {
  modalWrapper?: string;
  backgroundColorHeader?: string;
  modalId?: string;
  modalHeader?: string;
  children?: React.ReactNode;
  modalBodyStyle?: string;
};

export const ModalComponent = ({
  modalWrapper,
  backgroundColorHeader,
  modalId,
  modalHeader,
  children,
  modalBodyStyle,
}: DataTablesComponentProps) => {
  return (
    <dialog id={modalId} className="modal">
      <div className={`modal-box ${modalWrapper}`}>
        <div
          className={`flex items-center justify-between ${backgroundColorHeader}`}
        >
          <h3 className="font-bold text-lg">{modalHeader}</h3>
          <form method="dialog">
            <button className="btn btn-sm btn-circle btn-ghost">✕</button>
          </form>
        </div>
        <div className={modalBodyStyle}>{children}</div>
      </div>
      <form method="dialog" className="modal-backdrop">
        <button>close</button>
      </form>
    </dialog>
  );
};
