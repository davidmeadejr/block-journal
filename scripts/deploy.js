// Address of the deployed contract = 0xEA5bE015f4b8cf9e3e81128fDC2502Bd5Ee04bfB

const main = async () => {
  const journalContractFactory = await hre.ethers.getContractFactory("BlockJournal");
  const journalContract = await journalContractFactory.deploy({
    value: hre.ethers.utils.parseEther("0.001"),
  });

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
