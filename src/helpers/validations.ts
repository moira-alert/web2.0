import { ValidationContainer, ValidationInfo } from "@skbkontur/react-ui-validations";

export const validateContactValueWithConfigRegExp = (
    value?: string,
    regExp?: string
): ValidationInfo | null => {
    if (!value) {
        return {
            message: "Contact value can`t be empty",
            type: "submit",
        };
    }

    if (!regExp) {
        return null;
    }

    const re = new RegExp(regExp, "i");

    return value.trim().match(re)
        ? null
        : {
              message: "Invalid format",
              type: "submit",
          };
};

export const validateForm = async (
    validationContainer: React.RefObject<ValidationContainer>
): Promise<boolean> => {
    if (!validationContainer.current) {
        return true;
    }
    return validationContainer.current.validate();
};
