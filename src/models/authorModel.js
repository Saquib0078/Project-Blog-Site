const mongoose = require("mongoose");
const validator = require("validator");

const authorSchema = new mongoose.Schema(
  {
    fname: {
      type: String,
      required: true,
      trim: true,
      validate(value) {
         if (!validator.isAlpha(value)) {
           throw new Error("fname is not valid");
         }
       },
    },
    lname: {
      type: String,
      required: true,
      trim: true,
      validate(value) {
         if (!validator.isAlpha(value)) {
           throw new Error("Lname is not valid");
         }
       },
    },
    title: {
      required: true,
      type: String,
      enum: ["Mr", "Mrs", "Miss"],
      trim: true,
    },
    email: {
      type: String,
      require: true,
      trim: true,
      lowercase: true,
      unique: true,
      validate(value) {
        if (!validator.isEmail(value)) {
          throw new Error("email is Invalid");
        }
      },
    },
    password: {
      type: String,
      required: true,
      trim: true,
      validate(value) {
         if (!validator.isStrongPassword(value)) {
           throw new Error("password must contain : minLength:8 minLowercase:1 minUppercase:1 minNumbers:1 minSymbols:1");
         }
       },
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("NewAuthor", authorSchema);
