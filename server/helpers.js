const { ObjectId } = require("mongodb");
// client.connect().then(() => {});


const getFormattedEvent = (event) => {
    event.comments.forEach((comment) => {
        comment._id = comment._id.toString();
        comment.userThatPostedComment._id = comment.userThatPostedComment._id.toString();
    });
    event.likes.forEach((like) => {
        like = like.toString();
    });
    event.userThatPosted._id = recipe.userThatPosted._id.toString();
    event._id = event._id.toString();
    event.location = event.location.toString();
    event.description = event.description.toString();
    event.date = event.date.toString();
    return event;
};

const badRequestError = (message) => {
  return { message, status: 400 };
};

const internalServerError = (message) => {
  return { message, status: 500 };
};

const notFoundError = (message) => {
  return { message, status: 404 };
};

const unauthorizedError = (message) => {
  return { message, status: 401 };
};

const checkID = (id) => {
  if (!id || typeof id == "undefined") throw `The input ID is empty`;
  if (typeof id != "string" || id.trim().length === 0) throw `The input ID is not a string`;
  id = id.trim();
  if (!ObjectId.isValid(id)) throw "The input ID is not a valid object ID";
};

// const checkName = (name) => {
//   if (!name || typeof name == "undefined") throw `The input name is empty`;
//   if (typeof name != "string") throw `The input name is not a string`;
//   name = name.trim();
//   if (name.length < 3) throw `Name should have atleast 3 characters`;
//   const nameRegex = /^[a-zA-Z]+\s[a-zA-Z]+$/;
//   if (!nameRegex.test(name))
//     throw `Name should contain only alphabets and spaces`;
// };

const checkName = (inputName) => {
      if (!inputName || typeof inputName == "undefined") throw `The input name is empty`;
  if (typeof inputName != "string") throw `The input name is not a string`;

    inputName = inputName.trim();
    /**
     * @param {string} inputName - The input string to validated as a name
     * @throws {ImproperNameFormat} `The input ${varName} should contain only "FirstName LastName"` || `The firstName in ${varName} should contain atleast 3 characters` || `The lastName in ${varName} should contain atleast 3 characters` || `The input ${varName} should not contain numbers or special characters!`
     */
    const nameSplit = inputName.split(" ");
    if (nameSplit.length < 2 || nameSplit.length > 3)
        throw `The input name should contain only "FirstName LastName"`;
    const firstName = nameSplit[0],
        lastName = nameSplit[1];
    if (inputName.length < 3)
        throw `The input name should contain atleast 3 characters`;
    const nameRegex = /^[a-zA-Z]+$/;
    if (!nameRegex.test(firstName) || !nameRegex.test(lastName))
        throw `The input name should not contain numbers or special characters!`;
};

const checkUsername = (username) => {
  if (!username || typeof username == "undefined")
    throw `The input username is empty`;
  if (typeof username != "string") throw `The input username is not a string`;
  username = username.trim();
  if (username.length < 3) throw `Username should have atleast 3 characters`;
  const usernameRegex = /^[A-Za-z0-9]*$/;
  if (!usernameRegex.test(username))
    throw `Username should contain only alphabets and numbers`;
};

const checkPassword = (password) => {
  if (!password || typeof password == "undefined")
    throw `The input password is empty`;
  if (typeof password != "string") throw `The input password is not a string`;
  password = password.trim();
  if (password.length < 6) throw `Password should have atleast 6 characters`;
  const passwordRegex =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[$@$!%*?&_])[A-Za-z\d$@$!%*?&_]{6,}$/;
  if (!passwordRegex.test(password))
    throw `Password should contain atleast 1 uppercase, 1 lowercase, 1 number and 1 non-alphanumeric character`;
};

// const checkStep = (step) => {
//     if (!step || typeof step == "undefined")
//       throw `The input step is empty`;
//     if (typeof step != "string")
//       throw `The input step is not a string`;
//     step = step.trim();
//     if (step.length < 20)
//       throw `The input step must be atleast 20 characters long`;
//     const stepRegex = /^[a-zA-Z0-9\s,;':-]*$/;
//     if (!stepRegex.test(step))
//       throw `The step must contain valid characters`;
//   };

// const checkIngredients = (ingredients) => {
//   if (!ingredients || typeof ingredients == "undefined")
//     throw `The input ingredients list is empty`;
//   if (typeof ingredients != "object" || !Array.isArray(ingredients))
//     throw `The input is not an array`;
//   if (ingredients.length < 3)
//     throw `The input list must contain atleast 3 elements`;
//   try {
//     ingredients.forEach((ingredient) => {
//       checkIngredient(ingredient);
//     });
//   } catch (err) {
//     throw err;
//   }
// };

// const checkIngredient = (ingredient) => {
//   if (!ingredient || typeof ingredient == "undefined")
//   throw `The input ingredient is empty`;
// if (typeof ingredient != "string") throw `The input ingredient is not a string`;
// ingredient = ingredient.trim();
// if (ingredient.length < 3 || ingredient.length > 50) throw `The input ingredient must be 3-50 characters long`;
// };

// const checkSteps = (steps) => {
//     if (!steps || typeof steps == "undefined")
//       throw `The input steps list is empty`;
//     if (typeof steps != "object" || !Array.isArray(steps))
//       throw `The input steps is not an array`;
//     if (steps.length < 5)
//       throw `The input list steps must contain atleast 5 elements`;
//     try {
//         steps.forEach((step) => {
//         checkStep(step);
//       });
//     } catch (err) {
//       throw err;
//     }
//   };

const checkString = (input, varname = "") => {
  if (!input || typeof input == "undefined")
    throw `The input ${varname} is empty`;
  if (typeof input != "string") throw `The input ${varname} is not a string`;
  input = input.trim();
  if (!input.length > 0) throw `The input ${varname} is empty`;
};

const checkPageNum = (num) => {
  if (!num || typeof num == "undefined") throw `The input page number does not exist`;
  if (typeof num != "number" || !Number.isInteger(num)) throw `The input is not an integer number`;
  if (num < 1) throw `The page number must be greater than or equal to 1`;
}; 

const checkDate = (date) => {};

const checkEmail = (email) => {};

// const checkCookingSkill = (cookingSkillRequired) => {
//   if (!cookingSkillRequired || typeof cookingSkillRequired == "undefined")
//     throw `The input cookingSkillRequired is empty`;
//   if (typeof cookingSkillRequired != "string")
//     throw `The input cookingSkillRequired is not a string`;
//   cookingSkillRequired = cookingSkillRequired.trim().toUpperCase();
//   if (!cookingSkillRequired.length > 0) throw `The input cookingSkillRequired is empty`;
//   const skillLevels = ["NOVICE", "INTERMEDIATE", "ADVANCED"];
//   if (!skillLevels.includes(cookingSkillRequired))
//     throw `invalid cooking skill required error:  "Novice", "Intermediate", "Advanced"`;
// };

// const checkTitle = (title) => {
//     if (!title || typeof title == "undefined")
//     throw `The input title is empty`;
//   if (typeof title != "string") throw `The input title is not a string`;
//   title = title.trim();
//   const titleRegex = /[A-Za-z0-9]/;
//   if (title.match(titleRegex).length <= 0) throw `The input title must contain atleast 1 alphanumeric character`;
//   if (!title.length > 0) throw `The input title is empty`;
// };

module.exports = {
  badRequestError,
  notFoundError,
  internalServerError,
  unauthorizedError,
  checkName,
  checkUsername,
  checkPassword,
  checkID,
  checkString,
  getFormattedEvent,
  checkPageNum,
  checkDate,
  checkEmail,
};
