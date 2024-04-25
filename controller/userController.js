const Joi = require("joi");
const bcrypt = require("bcrypt");
const { encode } = require("../middleware/token");

const {
  register_user,
  checkUserMail,
  get_user,

  getAllUser,
} = require("../models/userModel");

async function hashedPassword(password) {
  return await bcrypt.hash(password, 10);
}

async function validatePassword(plainpassword, hashedPassword) {
  return await bcrypt.compare(plainpassword, hashedPassword);
}

exports.adduser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const schema = Joi.object({
      name: Joi.string().required().messages({
        "any.required": "buyer_name is required",
        "string.base": "buyer_name must be a string",
      }),

      email: Joi.string().email().required().messages({
        "any.required": "Email is required",
        "string.email": "Email must be a valid email address",
      }),

      password: Joi.string().min(4).max(12).required().messages({
        "any.required": "{{#label}} is required!!",
        "string.empty": "can't be empty!!",
        "string.min": "minimum 4 value required",
        "string.max": "maximum 12 values allowed",
      }),
    });

    const result = schema.validate(req.body);

    if (result.error) {
      const message = result.error.details.map((i) => i.message).join(",");
      return res.json({
        message: result.error.details[0].message,
        error: message,
        missingParams: result.error.details[0].message,
        status: 400,
        success: false,
      });
    } else {
      let passwordHash = await hashedPassword(password);

      let mailCheck = await checkUserMail(email);
      if (mailCheck.length > 0) {
        return res.json({
          success: true,
          status: 200,
          message: "User with same mail is already registered",
        });
      }

      let user = {
        name: name,
        email: email,
        password: passwordHash,
      };

      console.log("user aaya==>>", user);

      const create_user = await register_user(user);
      console.log("create_user===>>>", create_user);

      let userId = create_user.insertId;

      const get__user = await get_user(userId);
      console.log("get_user==>>", get__user);

      if (create_user) {
        res.json({
          success: true,
          status: 200,
          message: "User registered successfully",
          data: get__user,
        });
      }
    }
  } catch (error) {
    console.error(error);
    return res.json({
      success: false,
      message: "An internal server error occurred. Please try again later.",
      status: 500,
      error: error,
    });
  }
};

exports.loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate input data
    const schema = Joi.object({
      email: Joi.string().email().required().messages({
        "any.required": "Email is required",
        "string.email": "Email must be a valid email address",
      }),

      password: Joi.string().min(4).max(12).required().messages({
        "any.required": "{{#label}} is required!!",
        "string.empty": "can't be empty!!",
        "string.min": "minimum 4 value required",
        "string.max": "maximum 12 values allowed",
      }),
    });

    const { error } = schema.validate(req.body);
    if (error) {
      return res
        .status(400)
        .json({ success: false, message: error.details[0].message });
    } else {
      let mailCheck = await checkUserMail(email);

      if (mailCheck.length === 0) {
        return res.json({
          success: false,
          message: "No account found with this email",
        });
      } else {
        let checkPassword = await validatePassword(
          password,
          mailCheck[0].password
        );
        if (!checkPassword) {
          return res.json({
            success: false,
            message: "Invalid Password!",
          });
        }
      }
      // Generate token
      const token = await encode({
        id: mailCheck[0].id,
        name: mailCheck[0].name,
      });
      console.log("token me aaya ?==>>>", token);
      // Return success response
      return res.status(200).json({
        success: true,
        message: "User login successful!",
        user_token: token,
      });
    }
  } catch (error) {
    console.error("Error:", error);
    return res.status(500).json({
      success: false,
      message: "An internal server error occurred. Please try again later.",
    });
  }
};

exports.get__user_info = async (req, res) => {
  try {
    const myUser = await getAllUser();

    return res.json({
      success: true,
      status: 200,
      message: "successfully fetch",
      data: myUser,
    });
  } catch (error) {
    console.log(error.message);
    return error;
  }
};
