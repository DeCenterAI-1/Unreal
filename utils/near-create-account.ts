import { connect, keyStores, KeyPair, utils } from "near-api-js";
import dotenv from "dotenv";
import { KeyPairString } from "near-api-js/lib/utils";

dotenv.config({ path: "../.env" });
const privateKey = process.env.NEAR_PRIVATE_KEY;
const accountId = process.env.ACCOUNT_ID;

const myKeyStore = new keyStores.InMemoryKeyStore();
const keyPair = KeyPair.fromString(privateKey as KeyPairString);
await myKeyStore.setKey("testnet", accountId as string, keyPair);

const connectionConfig = {
  networkId: "testnet",
  keyStore: myKeyStore,
  nodeUrl: "https://test.rpc.fastnear.com",
};
const nearConnection = await connect(connectionConfig);

const account = await nearConnection.account(accountId as string);

// Create a .testnet account
// Generate a new account ID based on the current timestamp
const newAccountId = Date.now() + ".testnet";
// Generate a new key pair
const newKeyPair = KeyPair.fromRandom("ed25519");
const newPublicKey = newKeyPair.getPublicKey().toString();
const newPrivateKey = newKeyPair.toString();
console.log("Private key", newPrivateKey);
console.log("Public key", newPublicKey);

// const createAccountResult = await account.functionCall({
//   contractId: "testnet",
//   methodName: "create_account",
//   args: {
//     new_account_id: newAccountId, // example-account.testnet
//     new_public_key: newPublicKey, // ed25519:2ASWc...
//   },
//   attachedDeposit: BigInt(utils.format.parseNearAmount("0.1")), // Initial balance for new account in yoctoNEAR
// });
//

const parsedDeposit = utils.format.parseNearAmount("0.1");

if (!parsedDeposit) throw new Error("Invalid NEAR amount");

const createAccountResult = await account.functionCall({
  contractId: "testnet",
  methodName: "create_account",
  args: {
    new_account_id: newAccountId,
    new_public_key: newPublicKey,
  },
  attachedDeposit: BigInt(parsedDeposit), // safely convert to bigint
});

console.log(createAccountResult);

// Create a sub account
// Generate a new sub account ID based on the current timestamp
const newSubAccountId = Date.now() + "." + accountId;
// Generate a new key pair
const newSubKeyPair = KeyPair.fromRandom("ed25519");
const newSubPublicKey = newSubKeyPair.getPublicKey().toString();
const newSubPrivateKey = newSubKeyPair.toString();
console.log("Private key", newSubPrivateKey);
console.log("Public key", newSubPublicKey);

// const createSubAccountResult = await account.createAccount(
//   newSubAccountId, // sub.example-account.testnet
//   newSubPublicKey, // ed25519:2ASWc...
//   utils.format.parseNearAmount("0.1"), // Initial balance for new account in yoctoNEAR
// );
//
const initialBalance = utils.format.parseNearAmount("0.1");

if (!initialBalance) throw new Error("Invalid initial balance");

const createSubAccountResult = await account.createAccount(
  newSubAccountId,
  newSubPublicKey,
  BigInt(initialBalance), // convert string to bigint
);

console.log(createSubAccountResult);
