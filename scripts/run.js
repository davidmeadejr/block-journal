const main = async () => {
  const [owner, randomPerson] = await hre.ethers.getSigners(); // Gets the wallet address of the contract owner and a random wallet address for testing purposes.
  const journalContractFactory = await hre.ethers.getContractFactory("BlockJournal"); // Compiles the contract and generates all the needed files to use the contract under the artifacts directory.
  const journalContract = await journalContractFactory.deploy(); //
  await journalContract.deployed();

  console.log("Contract deployed to:", journalContract.address);
  console.log("Contract deployed by:", owner.address);

  await journalContract.getTotalJournals(); // Grabs the total number of journals.

  const firstJournalTxn = await journalContract.journal();
  await firstJournalTxn.wait();

  await journalContract.getTotalJournals();

  const secondJournalTxn = await journalContract.connect(randomPerson).journal();
  await secondJournalTxn.wait();

  await journalContract.getTotalJournals();
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
