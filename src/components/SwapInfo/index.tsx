import "./styles.scss";

interface SwapInfoProps {
  handleShowSwapDetails: () => void;
  valueTokenA: number;
  valueTokenB: number;
}
export function SwapInfo({
  handleShowSwapDetails,
  valueTokenA,
  valueTokenB,
}: SwapInfoProps) {
  return (
    <button onClick={() => handleShowSwapDetails()}>
      <div>
        <span>
          <span>1</span>
          <span>BRA</span> =
          <span id="amount-token-swap">
            {(valueTokenB / valueTokenA).toString().slice(0, 8)}
          </span>
          <span>XRD</span>
          <span id="value-money-token"> (${valueTokenA})</span>
        </span>
      </div>
    </button>
  );
}
