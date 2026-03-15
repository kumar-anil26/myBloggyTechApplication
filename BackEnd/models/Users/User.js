const mongoose = require("mongoose");
const crypto = require("crypto");

const UserSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      required: true,
      enum: ["user", "admin"],
      default: "user",
    },
    password: {
      type: String,
      required: true,
    },
    lastlogin: {
      type: Date,
      default: Date.now(),
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    accountLabel: {
      type: String,
      enum: ["bronze", "silver", "gold"],
      default: "bronze",
    },
    profilePicture: {
      type: String,
      default: "",
    },
    coverImage: {
      type: String,
      default: "",
    },
    bio: {
      type: String,
    },
    location: {
      type: String,
    },
    Notification: {
      email: { type: String },
    },
    gender: {
      type: String,

      enum: ["male", "female", "Prefer not to say", "non-binary"],
    },

    // Other properties will deal with relationship

    profileViewers: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    followers: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    following: [{ type: mongoose.Schema.Types.ObjectId, ref: "Users" }],
    blockedUsers: [{ type: mongoose.Schema.Types.ObjectId, ref: "Users" }],
    posts: [{ type: mongoose.Schema.Types.ObjectId, ref: "post" }],
    likesPosts: [{ type: mongoose.Schema.Types.ObjectId, ref: "post" }],

    passwordResetToken: {
      type: String,
    },
    passwordResetExpires: {
      type: Date,
    },
    accountVerificationToken: {
      type: String,
    },
    accountVerificationExpires: {
      type: Date,
    },
  },

  {
    timestamps: true,
  },
  {
    toJSON: {
      virtuals: true,
    },
    toObject: {
      virtuals: true,
    },
  }
);

UserSchema.methods.generatePasswordResetToken = function () {
  //!Generate Token
  const resetToken = crypto.randomBytes(20).toString("hex");
  this.passwordResetToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");
 
  //!Set the expiry time to 10 min
  this.passwordResetExpires = Date.now() + 10 * 60 * 1000;

  return resetToken;
};

UserSchema.methods.generateAccountVerificationToken = function () {
  //!Generate Token
  const verificationToken = crypto.randomBytes(20).toString("hex");
  this.accountVerificationToken = crypto
    .createHash("sha256")
    .update(verificationToken)
    .digest("hex");

  //!Set the expire time to 1 hours
  this.accountVerificationExpires = Date.now() + 10 * 60 * 1000;

  return verificationToken;
};

//! Convert schema to model

const User = mongoose.model("User", UserSchema);

module.exports = User;
