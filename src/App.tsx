import { getAccountAddress, signTransaction } from "pte-browser-extension-sdk";
import { useEffect, useState } from "react";
import { ResponseModal } from "./components/Modal";
import { useModalContex } from "./hooks/ModalContrext";

import xrdImage from "./img/xrd.png";
import arrowIcon from "./img/switch_horizontal.svg";
import radBralls from "./img/RAD-BRALLS.jpg";
import { DefaultApi, ManifestBuilder } from "pte-sdk";

import loading from "./img/loading.json";
import error from "./img/error.json";
import success from "./img/success.json";

import "./app.css";

interface Anima {
  animation: any;
}

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
          <div className="card-header">
            <div className="header-titles">
              <p>
                <div className={page}>Swap</div>
              </p>
              <p>
                <div>Liquidity</div>
              </p>
            </div>
            <div className="space-box"></div>
            <div
              className={
                connectedWallet
                  ? `header-wallet-address-connected`
                  : `header-wallet-address-no-connected`
              }
            >
              <p>
                {connectedWallet
                  ? accountAddress.slice(0, 5) +
                    "..." +
                    accountAddress.slice(-5)
                  : "account"}
              </p>
            </div>
          </div>
          <div className="card-content">
            <div className="card-content-child">
              <div className="card-content-info">
                <p>From</p>
                <div></div>
                <div className="card-content-balance">
                  <span>Balance: {machineBalance}</span>
                </div>
              </div>
              <div className="card-content-input">
                <div>
                  <input
                    type="number"
                    placeholder="0.0"
                    min={0}
                    value={fromToken}
                    onChange={(e) =>
                      handleCalSwapFromTo(parseFloat(e.target.value))
                    }
                  />
                  <div className="card-content-input-token">
                    <img src={xrdImage} alt="" />
                    <span>XRD</span>
                  </div>
                </div>
              </div>
            </div>
            <div className="arrow-icon">
              <div className="arrow-icon-child">
                <img src={arrowIcon} alt="" />
              </div>
            </div>
            <div id="input-to" className="card-content-child">
              <div className="card-content-info">
                <p>To (estimated)</p>
                <div></div>
                <div className="card-content-balance">
                  <span>Balance: {userBalance === NaN ? 0 : userBalance}</span>
                </div>
              </div>
              <div className="card-content-input">
                <div>
                  <input
                    type="number"
                    placeholder="0.0"
                    min={0}
                    value={toToken}
                    onChange={(e) =>
                      handleCalSwapToFron(parseFloat(e.target.value))
                    }
                  />
                  <div className="card-content-input-token">
                    <img id="bralls" src={radBralls} alt="" />
                    <span>BRA</span>
                  </div>
                </div>
              </div>
            </div>

            <button
              onClick={() => handleShoSwapDetails()}
              className="card-content-swap-info-btn"
            >
              <div className="card-content-swap-info-content">
                <span>
                  <span id="amount">1</span>
                  <span id="buy-token">BRA</span> =
                  <span id="amount-token-swap">
                    {(valueTokenB / valueTokenA).toString().slice(0, 8)}
                  </span>
                  <span id="swap-token">XRD</span>
                  <span id="value-money-token"> (${valueTokenA})</span>
                </span>
              </div>
            </button>
            {showSwapDetails ? (
              <div className="card-content-swap-details">
                <div className="minimum-receveid">
                  <p>Minimum Received</p>
                  <p className="value">{minimumReceived.toString().slice(0)}</p>
                </div>
                <div className="fee">
                  <p>Price Impact</p>
                  <p className="value-white">{fee + `%`}</p>
                </div>
                <div className="fee">
                  <p>Liquidity Provider Fee</p>
                  <p className="value-white">
                    {(fee * fromToken).toString().slice(0, 8) + ` XRD`}
                  </p>
                </div>
              </div>
            ) : (
              <div></div>
            )}

            <div className="card-content-action-btn">
              <button
                onClick={() =>
                  connectedWallet ? swap_xrd_for_bra() : fetchAccountAddress()
                }
              >
                {connectedWallet ? "Swap" : "Connect Wallet"}
              </button>
            </div>
          </div>
        </div>
        <div className="video-background">
          <video
            autoPlay
            muted
            loop
            src="https://assets.website-files.com/6053f7fca5bf627283b582c2/60ba5985f394bf1012c0c83a_Comp%201%20-%20v2-transcode.mp4"
          ></video>
        </div>
      </div>
    </>
  );
}
