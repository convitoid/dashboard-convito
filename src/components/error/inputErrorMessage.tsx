type InputErrorMessageProps = {
    message: string;
    color?: string;
    id: string;
};
const InputErrorMessage = ({ message, color, id }: InputErrorMessageProps) => {
    return (
        <small className={`text-sm ${color}`} id={id}>
            {message}
        </small>
    );
};

export default InputErrorMessage;
