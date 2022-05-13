import "./styles.scss";

interface DetailsProps {
  minimumReceived: number;
  fromToken: number;
  fee: number;
}

export function Details({ fee, fromToken, minimumReceived }: DetailsProps) {
  return (
    <div className="details">
      <div>
        <p>Minimum Received</p>
        <strong>{minimumReceived.toString().slice(0)}</strong>
      </div>
      <div>
        <p>Price Impact</p>
        <span>{fee + `%`}</span>
      </div>
      <div>
        <p>Liquidity Provider Fee</p>
        <span>{(fee * fromToken).toString().slice(0, 8) + ` XRD`}</span>
      </div>
    </div>
  );
}
