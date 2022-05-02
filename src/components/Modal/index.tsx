import Modal from "react-modal";
import Lottie from "react-lottie";

import "./styles.css";

interface ResponseModalProps {
  isOpen: boolean;
  onRequestClose: () => void;
  lottieAnimation: any;
  amount_xrd: number;
  amount_bra: number;
}

export function ResponseModal({
  isOpen,
  onRequestClose,
  lottieAnimation,
  amount_bra,
  amount_xrd,
}: ResponseModalProps) {
  const defaultOption = {
    loop: true,
    autoplay: true,
    animationData: lottieAnimation,
    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice",
    },
  };
  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onRequestClose}
      overlayClassName="react-modal-overlay"
      className="react-modal-content"
      ariaHideApp={false}
    >
      <Lottie options={defaultOption} width={170} height={170} />
      <p className="modal-title">Waiting for confirmation</p>
      <p className="modal-subtitle">
        Swapping <span className="amount-token">{amount_xrd}</span>{" "}
        <span className="token-symbol">XRD</span> for {""}
        <span className="amount-token">{amount_bra}</span>{" "}
        <span className="token-symbol">BRA</span>
      </p>
      <p className="modal-subtitle-two">
        Confirm this transaction in your wallet
      </p>
    </Modal>
  );
}
