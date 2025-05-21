import jwt from "jsonwebtoken";

export const sendSuccessResponse = (data, message = "") => {
  return {
    message: message || "Success",
    data,
  };
};

export const sendErrorResponse = (error, message = "") => {
  return {
    message: message || "Failed",
    error,
    data: {},
  };
};

export const generateTokens = (userId, res) => {
  const sessionToken = jwt.sign({ userId }, process.env.JWT_TOKEN_SECRET, {
    expiresIn: "1h",
  });
  const refreshToken = jwt.sign(
    { userId },
    process.env.JWT_REFRESH_TOKEN_SECRET,
    {
      expiresIn: "12h",
    }
  );

  res.cookie("sessionToken", sessionToken, {
    maxAge: 60 * 60 * 1000, // 1h
    httpOnly: true, // prevent XSS attacks cross-site scripting attacks
    sameSite: "strict", // CSRF attacks cross-site request forgery attacks
    secure: process.env.NODE_ENV !== "development",
  });

  res.cookie("refreshToken", refreshToken, {
    maxAge: 12 * 60 * 60 * 1000, // 12h
    httpOnly: true, // prevent XSS attacks cross-site scripting attacks
    sameSite: "strict", // CSRF attacks cross-site request forgery attacks
    secure: process.env.NODE_ENV !== "development",
  });
};

export const clearTokens = (res) => {
  res.clearCookie("sessionToken", {
    httpOnly: true, // prevent XSS attacks cross-site scripting attacks
    sameSite: "strict", // CSRF attacks cross-site request forgery attacks
    secure: process.env.NODE_ENV !== "development",
  });

  res.clearCookie("refreshToken", {
    httpOnly: true, // prevent XSS attacks cross-site scripting attacks
    sameSite: "strict", // CSRF attacks cross-site request forgery attacks
    secure: process.env.NODE_ENV !== "development",
  });
};
