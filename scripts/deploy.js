// Address if the deployed contract = 0xac855178ED2E7B8a3C64795E626544a176b619CA

const main = async () => {
  const [deployer] = await hre.ethers.getSigners();
  const accountBalance = await deployer.getBalance();

  console.log("Deployer contracts with account: ", deployer.address);
  console.log("Account balance: ", accountBalance.toString());

  const journalContractFactory = await hre.ethers.getContractFactory("BlockJournal");
  const journalContract = await journalContractFactory.deploy();
  await journalContract.deployed();

  console.log("BlockJournal address: ", journalContract.address);
};

const runMain = async () => {
  try {
    await main();
    process.exit(0);
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
};

runMain();
