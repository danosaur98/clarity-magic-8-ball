import { Client, Provider, ProviderRegistry, Result } from "@blockstack/clarity";
import { assert } from "chai";

const decisionOne = "It is certain.";
const decisionTwo = "Outlook good.";
const decisionThree = "You may rely on it.";
const decisionFour = "Ask again later.";
const decisionFive = "Concentrate and ask again.";
const decisionSix = "Reply hazy, try again.";
const decisionSeven = "My reply is no.";
const decisionEight = "My sources say no.";

describe("eight ball contract test suite", () => {
  let eightBallClient: Client;
  let provider: Provider;
  before(async () => {
    provider = await ProviderRegistry.createProvider();
    eightBallClient = new Client("SP3GWX3NE58KXHESRYE4DYQ1S31PQJTCRXB3PE9SB.eight-ball", "eight-ball", provider);
  });
  it("should have a valid syntax", async () => {
    await eightBallClient.checkContract();
  });

  describe("deploying an instance of the contract", () => {
    const getEightBallDecision = async(buffer: string) => {
      const query = eightBallClient.createQuery({
        method: { name: `get-decision`, args: [`0x${Buffer.from(buffer, "hex").toString("hex")}`]},
      });
      const receipt = await eightBallClient.submitQuery(query);
      const result = Result.unwrapString(receipt, "ascii");
      return result;
    }

    const getEightBallDecisionAt = async(height: string) => {
      const tx = eightBallClient.createTransaction({
        method: {
          name: `get-eight-ball-decision-at`,
          args: [height],
        },
      });
      await tx.sign("SP2J6ZY48GV1EZ5V2V5RB9MP66SW86PYKKNRV9EJ7");
      const receipt = await eightBallClient.submitTransaction(tx);
      return receipt;
    }

    before(async () => {
      await eightBallClient.deployContract();
    });
    it("get decision at height u1", async () => {
      const decision = await getEightBallDecisionAt("u1")
      assert.equal(decision.success, true);
    })
    it("get decision at height u2", async () => {
      const decision = await getEightBallDecisionAt("u2")
      assert.equal(decision.success, true);
    })
    it("get decision at byte 0x00", async () => {
      const decision = await getEightBallDecision("00")
      assert.include(decision, decisionOne);
    })
    it("get decision at byte 0x01", async () => {
      const decision = await getEightBallDecision("01")
      assert.include(decision, decisionTwo);
    })
    it("get decision at byte 0x02", async () => {
      const decision = await getEightBallDecision("02")
      assert.include(decision, decisionThree);
    })
    it("get decision at byte 0x03", async () => {
      const decision = await getEightBallDecision("03")
      assert.include(decision, decisionFour);
    })
    it("get decision at byte 0x04", async () => {
      const decision = await getEightBallDecision("04")
      assert.include(decision, decisionFive);
    })
    it("get decision at byte 0x05", async () => {
      const decision = await getEightBallDecision("05")
      assert.include(decision, decisionSix);
    })
    it("get decision at byte 0x06", async () => {
      const decision = await getEightBallDecision("06")
      assert.include(decision, decisionSeven);
    })
    it("get decision at byte 0x07", async () => {
      const decision = await getEightBallDecision("07")
      assert.include(decision, decisionEight);
    })
    it("get decision at byte 0xaf", async () => {
      const decision = await getEightBallDecision("af")
      assert.include(decision, decisionEight);
    })
    it("get decision at byte 0xc0", async () => {
      const decision = await getEightBallDecision("c0")
      assert.include(decision, decisionOne);
    })
  });
  after(async () => {
    await provider.close();
  });
});
