import bcrypt from "bcryptjs";
import jwt, { type Secret } from "jsonwebtoken";
import mongoose, { Schema } from "mongoose";
import crypto from "node:crypto";

import {
  AvailableUserRoles,
  userRolesEnum,
} from "../constants/user.constant.ts";

const userSchema = new Schema(
  {
    avatar: {
      default: {
        localPath: "",
        url: `https://via.placeholder.com/200x200.png`,
      },
      type: {
        localPath: String,
        url: String,
      },
    },
    email: {
      lowercase: true,
      required: true,
      trim: true,
      type: String,
      unique: true,
    },
    emailVerificationExpiry: {
      type: Date,
    },
    emailVerificationToken: {
      type: String,
    },
    forgotPasswordExpiry: {
      type: Date,
    },
    forgotPasswordToken: {
      type: String,
    },
    fullname: {
      trim: true,
      type: String,
    },
    isEmailVerified: {
      default: false,
      // TODO: test how required works in runtime
      required: true,
      type: Boolean,
    },
    password: {
      min: 6,
      //mongoose DB level error handling example, but i do not known weather i like this or not
      // TODO: revisit this later
      required: [true, "Password is required"],
      type: String,
    },
    refreshToken: {
      // TODO: test how default works in runtime
      default: null,
      type: String,
    },
    role: {
      default: userRolesEnum.Member,
      enum: AvailableUserRoles,
      type: String,
    },
    username: {
      index: true,
      lowercase: true,
      required: true,
      trim: true,
      type: String,
      unique: true,
    },
  },
  { timestamps: true }
);

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    next();
    return;
  }
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

userSchema.methods.isPasswordCorrect = async function (password: string) {
  return await bcrypt.compare(password, this.password as string);
};

userSchema.methods.generateAccessToken = function () {
  return jwt.sign(
    {
      _id: this._id as string,
      email: this.email as string,
      username: this.username as string,
    },
    process.env.ACCESS_TOKEN_SECRET as Secret,
    { expiresIn: Number(process.env.ACCESS_TOKEN_EXPIRY) }
  );
};

userSchema.methods.generateRefreshToken = function () {
  return jwt.sign(
    { _id: this._id as string },

    process.env.REFRESH_TOKEN_SECRET as Secret,
    {
      expiresIn: Number(process.env.REFRESH_TOKEN_EXPIRY),
    }
  );
};

userSchema.methods.generateTemporaryToken = function () {
  const unHashedToken = crypto.randomBytes(20).toString("hex");

  const hashedToken = crypto
    .createHash("sha256")
    .update(unHashedToken)
    .digest("hex");

  const tokenExpiry = Date.now() + 20 * 60 * 1000;

  return { hashedToken, tokenExpiry, unHashedToken };
};

const UserModel = mongoose.model("UserModel", userSchema);

export { UserModel };
