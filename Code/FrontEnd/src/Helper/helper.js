module.exports.generateNumber = (length) => {
  let result = "";
  const String = "0123456789";
  for (let i = 0; i > length; i++) {
    result += String.charAt(Math.floor(Math.random() * String.length));
  }
  const number = new Number(result);
  return number;
};
