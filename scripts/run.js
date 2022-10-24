const main = async () => {
  const journalContractFactory = await hre.ethers.getContractFactory("BlockJournal"); // Compiles the contract and generates all the needed files to use the contract under the artifacts directory.
  const journalContract = await journalContractFactory.deploy(); //
  await journalContract.deployed();
  console.log("Contract address:", journalContract.address);

  let journalCount;
  journalCount = await journalContract.getTotalJournals();
  console.log(journalCount.toNumber());

  // Mock journals
  let journalTxn = await journalContract.journal("Testing, testing, 1, 2, 3.");
  await journalTxn.wait(); // Wait for the transaction to be mined.

  const [_, randomPerson] = await hre.ethers.getSigners();
  journalTxn = await journalContract.connect(randomPerson).journal("Houston we have lift off!");
  await journalTxn.wait(); // Wait for transaction to be mined

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
