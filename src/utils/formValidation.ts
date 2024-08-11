type LoginValidationProps = {
    input: string;
};

export const loginValidation = ({ input }: LoginValidationProps) => {
    if (!input) {
        return {
            isValidate: false,
        };
    }

    return {
        isValidate: true,
    };
};
