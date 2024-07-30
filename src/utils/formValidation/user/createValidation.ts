type CreateValidationType = {
  username: string;
  email: string;
  password: string;
};
export const createValidation = ({
  username,
  email,
  password,
}: CreateValidationType) => {
  if (!username) {
    return {
      status: 400,
      message: "Username is required",
    };
  }

  if (!email) {
    return {
      status: 400,
      message: "Email is required",
    };
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return {
      status: 400,
      message: "Email is not valid",
    };
  }

  if (!password) {
    return {
      status: 400,
      message: "Password is required",
    };
  }

  if (password.length < 8) {
    return {
      status: 400,
      message: "Password must be at least 8 characters",
    };
  }
};
