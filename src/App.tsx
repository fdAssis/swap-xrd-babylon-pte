import { useEffect, useState } from "react";
import { getAccountAddress, signTransaction } from "pte-browser-extension-sdk";
import { DefaultApi, ManifestBuilder } from "pte-sdk";

import { Input } from "./components/Input";
import { Details } from "./components/Details";
import { SwapInfo } from "./components/SwapInfo";
import { Navbar } from "./components/Navbar";
import { ResponseModal } from "./components/Modal";

import { useModalContex } from "./hooks/ModalContrext";

import success from "../src/assets/img/success.json";
import error from "../src/assets/img/error.json";
import loading from "../src/assets/img/loading.json";
import radBralls from "../src/assets/img/RAD-BRALLS.jpg";
import arrowIcon from "../src/assets/img/switch_horizontal.svg";
import xrdImage from "../src/assets/img/xrd.png";

import "./styles/app.scss";

export function App() {
  const page = "swap";
  const fee = 0.02;
  const [showSwapDetails, setShowSwapDetails] = useState(false);
  const [accountAddress, setAccountAddress] = useState("");
  const [connectedWallet, setConnectedWallet] = useState(false);
  const [packageAddress, setPackageAddress] = useState(
    "01f5fbae7c95a0e8ab310e48c1a2f27394b507a36a5e61d4028d7f"
  );
  const [componentAddress, setComponentAddress] = useState(
    "0245c7e07b78554d1c36b7014f607e92debb9fa102d42da37183b7"
  );
  const [resourceAddress, setResourceAddress] = useState(
    "03cb0aa478457681544fe21be78d5e70c6828ddaecbfa3acfdd1ed"
  );

  const [userBalance, setUserBlance] = useState(0);
  const [machineBalance, setMachineBlance] = useState(0);

  const [fromToken, setFromToken] = useState(0);
  const [toToken, setToToken] = useState(0);

  const [valueTokenA, setValueTokenA] = useState(0.123);
  const [valueTokenB, setValueTokenB] = useState(0.061);

  const [minimumReceived, setMinimumReceived] = useState(0);

  const { isOpen, setIsopen } = useModalContex();

  const [animation, setAnimation] = useState<any>(loading);

  function onRequestClose() {
    setIsopen(false);
  }

  const fetchAccountAddress = async () => {
    const accountAddress = await getAccountAddress();
    if (accountAddress != "") {
      setAccountAddress(accountAddress);
      setConnectedWallet(true);
    }
  };

  const handleShoSwapDetails = () => {
    setShowSwapDetails(!showSwapDetails);
  };

  const handleCalSwapFromTo = (quant: number) => {
    setFromToken(quant);
    setToToken((quant * valueTokenA) / valueTokenB);
    setMinimumReceived(((quant - quant * fee) * valueTokenA) / valueTokenB);
  };

  const handleCalSwapToFron = (quant: number) => {
    setToToken(quant);
    setFromToken((quant * valueTokenB) / valueTokenA);
    setMinimumReceived(
      (((quant * valueTokenB) / valueTokenA -
        ((quant * valueTokenB) / valueTokenA) * fee) *
        valueTokenA) /
        valueTokenB
    );
  };

  async function swap_xrd_for_bra() {
    setAnimation(loading);
    setIsopen(true);
    const manifest = new ManifestBuilder()
      .withdrawFromAccountByAmount(
        accountAddress,
        fromToken + fromToken * fee,
        "030000000000000000000000000000000000000000000000000004"
      )
      .takeFromWorktop(
        "030000000000000000000000000000000000000000000000000004",
        "xrd"
      )
      .callMethod(componentAddress, "swap_xrd_for_bra", [
        `Decimal("${toToken}")`,
        'Bucket("xrd")',
      ])
      .callMethodWithAllResources(accountAddress, "deposit_batch")
      .build()
      .toString();

    const receipt = await signTransaction(manifest);
    console.log(receipt);
    if (receipt.status == "Success") {
      setAnimation(success);
      setTimeout(() => setIsopen(false), 3000);
      await checkBalance();
    } else {
      setAnimation(error);
      setTimeout(() => setIsopen(false), 3000);
      await checkBalance();
    }
  }

  const checkBalance = async () => {
    const api = new DefaultApi();

    const userComponent = await api.getComponent({
      address: accountAddress,
    });

    const userBalance = userComponent.ownedResources
      .filter((e) => e.resourceAddress == resourceAddress)
      .map((e) => e.amount)[0];
    setUserBlance(parseFloat(userBalance));

    const machineBalance = userComponent.ownedResources
      .filter(
        (e) =>
          e.resourceAddress ==
          "030000000000000000000000000000000000000000000000000004"
      )
      .map((e) => e.amount)[0];
    setMachineBlance(parseFloat(machineBalance));

    console.log(userBalance);
  };

  useEffect(() => {
    //fetchAccountAddress();
    checkBalance();
  }, [connectedWallet]);

  return (
    <>
      <ResponseModal
        isOpen={isOpen}
        onRequestClose={onRequestClose}
        lottieAnimation={animation}
        amount_bra={toToken}
        amount_xrd={fromToken}
      />
      <div className="main">
        <div className="card">
          <Navbar
            accountAddress={accountAddress}
            connectedWallet={connectedWallet}
            page={page}
          />
          <div className="card-content">
            <Input
              balance={machineBalance}
              icon={xrdImage}
              handleCalSwapFromTo={handleCalSwapFromTo}
              opt="From"
              opToken={fromToken}
              tokenName="XRD"
            />

            <div className="arrow-icon">
              <img src={arrowIcon} alt="" />
            </div>

            <Input
              balance={userBalance}
              handleCalSwapFromTo={handleCalSwapToFron}
              opt="To"
              icon={radBralls}
              opToken={toToken}
              tokenName="BRA"
            />

            <SwapInfo
              handleShowSwapDetails={handleShoSwapDetails}
              valueTokenA={valueTokenA}
              valueTokenB={valueTokenB}
            />

            {showSwapDetails ? (
              <Details
                fee={fee}
                fromToken={fromToken}
                minimumReceived={minimumReceived}
              />
            ) : (
              <div></div>
            )}

            <div>
              <button
                className="action-button"
                onClick={() =>
                  connectedWallet ? swap_xrd_for_bra() : fetchAccountAddress()
                }
              >
                {connectedWallet ? "Swap" : "Connect Wallet"}
              </button>
            </div>
          </div>
        </div>
      </div>
      <div>
        <video
          autoPlay
          muted
          loop
          src="https://assets.website-files.com/6053f7fca5bf627283b582c2/60ba5985f394bf1012c0c83a_Comp%201%20-%20v2-transcode.mp4"
        ></video>
      </div>
    </>
  );
}
