const main = async () => {
  const journalContractFactory = await hre.ethers.getContractFactory("BlockJournal"); // Compiles the contract and generates all the needed files to use the contract under the artifacts directory.
  const journalContract = await journalContractFactory.deploy({
    value: hre.ethers.utils.parseEther("0.1"),
  }); //
  await journalContract.deployed();
  console.log("Contract address:", journalContract.address);

  // Get contract balance
  let contractBalance = await hre.ethers.provider.getBalance(journalContract.address);
  console.log("Contract balance:", hre.ethers.utils.formatEther(contractBalance));

  // Send Journal
  let journalTxn = await journalContract.journal("A message!");
  await journalTxn.wait(); // Wait for the transaction to be mined.

  // Get contract balance to see what happened!
  contractBalance = await hre.ethers.provider.getBalance(journalContract.address);
  console.log("Contract Balance:", hre.ethers.utils.formatEther(contractBalance));

  let allJournals = await journalContract.getAllJournals();
  console.log(allJournals);
};

const runMain = async () => {
  try {
    await main();
    process.exit(0); // Exit Node process without error.
  } catch (error) {
    console.log(error);
    process.exit(1); // Exit Node process while indicating 'Uncaught Fatal Exception' error.
  }
};

runMain();
