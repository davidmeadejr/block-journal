const main = async () => {
  const journalContractFactory = await hre.ethers.getContractFactory("blockJournal"); // Compiles the contract and generates all the needed files to use the contract under the artifacts directory.
  const journalContract = await journalContractFactory.deploy(); //
  await journalContract.deployed();
  console.log("Contract deployed to:", journalContract.address);
};

const runMain = async () => {
  try {
    await main();
    process.exit(0); // Exit Node process without error.
  } catch (error) {
    process.exit(1); // Exit Node process while indicating 'Uncaught Fatal Exception' error.
  }
};

runMain();
