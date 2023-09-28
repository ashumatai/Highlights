import { ObjectId } from "mongodb";

const checkId = (inputId) => {
  /**
   * @param inputId string - The input to be validated as an ID
   * @throws {InvalidInput} - The error message informing the user about the incorrect input;
   */
  if (!id || typeof id == "undefined") {
    throw  `The input ${inputId} does not exist`;
  } else if (inputId.trim().length < 1) {
    throw `The input ${inputId} is empty`;
  } else if (!ObjectId.isValid(inputId)) {
    throw `The input ${inputId} is not a valid Object ID`;
  }
};

const checkName = (inputName) => {
  /**
   * @param inputName string - The input to be validated as a name
   * @throws {InvalidInput} - The error message informing the user about the incorrect input;
   */
  if (!id || typeof id == "undefined") {
    throw  `The input ${inputName} does not exist`;
  } else if (inputName.trim().length < 1) {
    throw `The input ${inputName} is empty`;
  }
};

export default {
  checkId,
  checkName
};