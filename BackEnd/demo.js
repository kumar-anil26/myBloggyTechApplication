const bcrypt = require("bcrypt");
let hashpwd;

console.log("hello user !");
hash = async (pwd) => {
  const Spwd = await bcrypt.genSalt(10)
  console.log("SaltedPassword", Spwd);
  hashpwd = await bcrypt.hash(pwd, Spwd);
  console.log("Full password is :", hashpwd);
};

const compare = async (pwd) => {
    console.log(pwd,hashpwd);
  const result = await bcrypt.compare(pwd, hashpwd);
  console.log("Result is ", result);
};

 async function run() {
    const pwd = 'anil'
 await hash(pwd);
  compare("ram");
}
run()