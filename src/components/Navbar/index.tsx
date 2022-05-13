import "./styles.scss";

interface NavbarProps {
  page: string;
  connectedWallet: boolean;
  accountAddress: string;
}
export function Navbar({ accountAddress, connectedWallet, page }: NavbarProps) {
  return (
    <nav>
      <header>
        <p>
          <div className={page}>Swap</div>
        </p>
        <p>
          <div>Liquidity</div>
        </p>
      </header>
      <div></div>
      <div
        className={connectedWallet ? `wallet-connected` : `wallet-no-connected`}
      >
        <p>
          {connectedWallet
            ? accountAddress.slice(0, 5) + "..." + accountAddress.slice(-5)
            : "account"}
        </p>
      </div>
    </nav>
  );
}
