const MedicalContract = artifacts.require("MedicalContract");

module.exports = function (deployer) {
  deployer.deploy(MedicalContract);
};
