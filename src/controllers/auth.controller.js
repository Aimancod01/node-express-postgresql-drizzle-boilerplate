import bcrypt from "bcrypt";
import httpStatus from "http-status";

import { tokenService, userService } from "../services/index.js";
import ApiError from "../utils/api-error.js";
import { TOKEN_TYPES } from "../config/tokens.js";
import logger from "../config/logger.js";

export async function register(req, res, next) {
  try {
    const user = await userService.createUser(req.body);
    const tokens = await tokenService.generateAuthTokens(user);
    res.status(httpStatus.CREATED).send({ user, tokens });
  } catch (error) {
    next(error);
  }
}

export async function login(req, res, next) {
  try {
    const user = await userService.getUserByUsernameOrEmail(
      req.body.usernameOrEmail
    );
    if (!user) {
      throw new ApiError(httpStatus.UNAUTHORIZED, "User not found");
    }
    const compare = await bcrypt.compare(req.body.password, user.password);
    if (!compare) {
      throw new ApiError(httpStatus.UNAUTHORIZED, "username/email and password didn't match");
    }
    const tokens = await tokenService.generateAuthTokens(user);
    delete user.password;
    return res.json({ user, tokens });
  } catch (error) {
    next(error);
  }
}

export async function logout(req, res, next) {
  try {
    const token = await tokenService.findToken(
      req.body.refreshToken,
      TOKEN_TYPES.REFRESH
    );
    if (!token) {
      throw new ApiError(httpStatus.BAD_REQUEST, "token not found");
    }
    await tokenService.deleteToken(token.id);
    res.status(httpStatus.NO_CONTENT).send();
  } catch (error) {
    next(error);
  }
}


export async function refreshTokens(req, res, next) {
  try {
    const tokens = await tokenService.refreshAuth(req.body.refreshToken);
    return res.json({ tokens });
  } catch (error) {
    next(error);
  }
}

export async function forgotPassword(req, res, next) {
  try {
    const user = await userService.getUserByUsernameOrEmail(
      req.body.usernameOrEmail
    );
    if (user) {
      const resetPasswordToken = await tokenService.generateResetPasswordToken(
        user.email
      );
      // TODO: Send resetPasswordToken via email. For dev, log it.
      if (process.env.NODE_ENV !== "production") {
        logger.debug("Reset password token (dev only):", resetPasswordToken);
      }
    }
    // Always return same response to avoid user enumeration
    res.status(httpStatus.OK).send({
      message: "If an account exists with that email, a password reset link has been sent.",
    });
  } catch (error) {
    next(error);
  }
}

export async function resetPassword(req, res, next) {
  try {
    const resetPasswordTokenDoc = await tokenService.verifyToken(
      req.body.token,
      TOKEN_TYPES.RESET_PASSWORD
    );
    const user = await userService.getUserById(resetPasswordTokenDoc.userId);
    if (!user) {
      throw new ApiError(httpStatus.UNAUTHORIZED, 'Password reset failed');
    }
    await userService.updateUserById(user.id, { password: req.body.password });
    await tokenService.deleteMany(user.id, TOKEN_TYPES.RESET_PASSWORD);

    res.status(httpStatus.NO_CONTENT).send();
  } catch (error) {
    next(error);
  }
}
