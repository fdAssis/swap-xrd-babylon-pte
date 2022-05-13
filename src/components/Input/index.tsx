import "./styles.scss";

interface InputProps {
  balance: number;
  opToken: number;
  handleCalSwapFromTo: (value: number) => void;
  icon: string;
  tokenName: string;
  opt: string;
}

export function Input({
  balance,
  opToken,
  handleCalSwapFromTo,
  icon,
  tokenName,
  opt,
}: InputProps) {
  return (
    <>
      <header>
        <p>{opt} (estimated)</p>
        <div></div>
        <div>
          <span>Balance: {balance}</span>
        </div>
      </header>
      <div className="input">
        <input
          type="number"
          placeholder="0.0"
          min={0}
          value={opToken}
          onChange={(e) => handleCalSwapFromTo(parseFloat(e.target.value))}
        />
        <div>
          <img src={icon} alt="" />
          <span>{tokenName}</span>
        </div>
      </div>
    </>
  );
}
