import { time, loadFixture } from "@nomicfoundation/hardhat-network-helpers";
import { anyValue } from "@nomicfoundation/hardhat-chai-matchers/withArgs";
import { expect } from "chai";
import { ethers } from "hardhat";

describe("Lock", function () {

  describe("Deployment", function () {
    it("ok",async () => {
      const Lock = await ethers.getContractFactory("Lock");
      const lock = await Lock.deploy();
  
      const [owner, otherAccount] = await ethers.getSigners();
  
  
      const tx1 = await lock.connect(otherAccount).withdraw(33);
      console.log(`tx1: ${tx1.data}`);

      const tx = await lock.populateTransaction.withdraw(33);
      console.log(`tx.data: ${tx.data}`);

      const data = lock.interface.encodeFunctionData("withdraw", [33]);
      console.log(data);
    });
  });
});
