const yup = require("./configuracao");

const schemaEmail = yup.object().shape({
  email: yup.string().required().email(),
});

module.exports = schemaEmail;
