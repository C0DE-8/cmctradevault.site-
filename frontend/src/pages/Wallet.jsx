import AssetBalances from "../components/AssetBalances";
import { assets } from "../constants/assets";
import { money } from "../utils/format";
import { useState } from "react";
import { FiCopy, FiArrowDownLeft, FiArrowUpRight } from "react-icons/fi";
import { useApi } from "../hooks/useApi";
import { Heading, Status, Empty, Field, Button } from "../components/UI";
import ActionForm from "../components/ActionForm";
import s from "./Wallet.module.css";
export default function Wallet() {
  const [tab, setTab] = useState("deposit"),
    [asset, setAsset] = useState(""),
    [method, setMethod] = useState("crypto"),
    [copied, setCopied] = useState("");
  const wallets = useApi("/wallet-addresses"),
    balance = useApi("/balances"),
    deposits = useApi("/deposits"),
    withdrawals = useApi("/withdrawals");
  const chosen = wallets.data?.wallets.find((w) => w.asset === asset);
  const currencySymbol = balance.data?.balances.currency_symbol || "$";
  const history = tab === "deposit" ? deposits : withdrawals;
  const rows =
    history.data?.[tab === "deposit" ? "deposits" : "withdrawals"] || [];
  function refresh() {
    balance.reload();
    deposits.reload();
    withdrawals.reload();
  }
  async function copy() {
    try {
      await navigator.clipboard.writeText(chosen.address);
      setCopied("Address copied");
    } catch {
      setCopied("Copy unavailable. Select and copy the address below.");
    }
  }
  return (
    <>
      <Heading eyebrow="YOUR MONEY, IN PERSPECTIVE" title="Your wallet.">
        Manage funding, request withdrawals, and follow every step.
      </Heading>
      <div className={s.balance}>
        <span>Available balance</span>
        <Status {...balance} retry={balance.reload} />
        {balance.data && (
          <h2>
            {money(
              Math.max(
                0,
                Number(balance.data.balances.main_balance) -
                  Number(balance.data.balances.withdraw_hold || 0),
              ),
              currencySymbol,
            )}{" "}
            <small>{currencySymbol}</small>
          </h2>
        )}
        <p>
          Withdrawal requests are subject to your available funds and platform
          review.
        </p>
      </div>
      {balance.data && (
        <div className={s.totals}>
          <div>
            <span>Profit balance · {currencySymbol}</span>
            <strong>{money(balance.data.balances.profit_balance, currencySymbol)}</strong>
          </div>
          <div>
            <span>Investment balance · {currencySymbol}</span>
            <strong>{money(balance.data.balances.investment_balance, currencySymbol)}</strong>
          </div>
          <div>
            <span>Reserved for withdrawals · {currencySymbol}</span>
            <strong>{money(balance.data.balances.withdraw_hold || 0, currencySymbol)}</strong>
          </div>
        </div>
      )}
      <Button type="button" secondary onClick={balance.reload}>
        Refresh balances
      </Button>
      <h2>Your crypto balances</h2>
      <p>
        Coin balances are shown in their native units, separately from your cash
        account.
      </p>
      {balance.data && (
        <AssetBalances balances={balance.data.balances.crypto_balances} />
      )}
      <div className={s.grid}>
        <section className={s.panel}>
          <div className={s.tabs}>
            <button
              className={tab === "deposit" ? s.active : ""}
              onClick={() => setTab("deposit")}
            >
              <FiArrowDownLeft />
              Deposit
            </button>
            <button
              className={tab === "withdraw" ? s.active : ""}
              onClick={() => setTab("withdraw")}
            >
              <FiArrowUpRight />
              Withdraw
            </button>
          </div>
          {tab === "deposit" ? (
            <>
              <Status {...wallets} retry={wallets.reload} />
              {wallets.data &&
                (wallets.data.wallets.length ? (
                  <ActionForm
                    endpoint="/deposits"
                    multipart
                    label="Submit deposit for review"
                    onSuccess={refresh}
                  >
                    <Field
                      label="Deposit asset"
                      name="asset"
                      as="select"
                      value={asset}
                      onChange={(e) => {
                        setAsset(e.target.value);
                        setCopied("");
                      }}
                      required
                    >
                      <option value="">Choose an available asset</option>
                      {wallets.data.wallets.map((w) => (
                        <option key={w.id} value={w.asset}>
                          {w.asset}
                        </option>
                      ))}
                    </Field>
                    {chosen && (
                      <div className={s.address}>
                        <span>Platform deposit address · {chosen.asset}</span>
                        <code>{chosen.address}</code>
                        <button type="button" onClick={copy}>
                          <FiCopy />
                          Copy address
                        </button>
                        {copied && <small role="status">{copied}</small>}
                        <p>
                          {chosen.address.startsWith("LOCAL-TEST-")
                            ? "Local testing only. Upload a sample proof image; do not send real funds."
                            : "Confirm the supported network with the platform before sending. Only send the selected asset."}
                        </p>
                      </div>
                    )}
                    <Field
                      label="Deposit amount (USD)"
                      name="amount"
                      type="number"
                      min="0.01"
                      step="0.01"
                      required
                    />
                    <Field
                      label="Payment proof (PNG, JPG or WEBP · max 5 MB)"
                      name="proof"
                      type="file"
                      accept="image/png,image/jpeg,image/webp"
                      required
                      onChange={(e) =>
                        e.target.setCustomValidity(
                          e.target.files[0]?.size > 5 * 1024 * 1024
                            ? "File must be 5 MB or smaller."
                            : "",
                        )
                      }
                    />
                    <p className={s.note}>
                      {chosen?.address.startsWith("LOCAL-TEST-")
                        ? "Submit a sample image to test the local deposit review flow. No payment is needed."
                        : "Submit after sending your payment. Your balance updates once the deposit is approved."}
                    </p>
                  </ActionForm>
                ) : (
                  <Empty>
                    No deposit addresses are available. Please check again
                    later.
                  </Empty>
                ))}
            </>
          ) : (
            <ActionForm
              endpoint="/withdrawals"
              label="Review withdrawal"
              review
              reviewText="Check the destination carefully. This submits a withdrawal request for platform review."
              onSuccess={refresh}
            >
              <Field
                label="Withdrawal method"
                name="method"
                as="select"
                value={method}
                onChange={(e) => setMethod(e.target.value)}
              >
                <option value="crypto">Crypto</option>
                <option value="bank">Bank transfer</option>
              </Field>
              <Field
                label="Amount (USD)"
                name="amount"
                type="number"
                min="0.01"
                step="0.01"
                required
              />
              {method === "crypto" ? (
                <>
                  <Field label="Asset" name="asset" as="select">
                    {assets.map((a) => (
                      <option key={a}>{a}</option>
                    ))}
                  </Field>
                  <Field
                    label="Destination wallet address"
                    name="crypto_address"
                    minLength={10}
                    required
                  />
                  <Field
                    label="Network"
                    name="crypto_network"
                    placeholder="e.g. ERC20"
                    required
                  />
                </>
              ) : (
                <>
                  <Field label="Bank name" name="bank_name" required />
                  <Field
                    label="Account holder name"
                    name="bank_account_name"
                    required
                  />
                  <Field
                    label="Account number"
                    name="bank_account_number"
                    required
                  />
                  <Field label="Bank country" name="bank_country" required />
                </>
              )}
              <Field
                label="Withdrawal PIN"
                name="pin"
                type="password"
                inputMode="numeric"
                pattern="[0-9]{4,6}"
                minLength={4}
                maxLength={6}
                required
                autoComplete="off"
              />
              <p className={s.note}>
                Use the withdrawal PIN assigned to your account. Contact the
                platform administrator if you haven’t received one.
              </p>
            </ActionForm>
          )}
        </section>
        <section className={s.panel}>
          <h3>{tab === "deposit" ? "Deposit" : "Withdrawal"} history</h3>
          <Status {...history} retry={history.reload} />
          {history.data &&
            (rows.length ? (
              <div className={s.table}>
                <table>
                  <thead>
                    <tr>
                      <th>Amount</th>
                      <th>Asset / method</th>
                      <th>Status</th>
                      <th>Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {rows.map((row) => (
                      <tr key={row.id}>
                        <td>{money(row.amount, currencySymbol)}</td>
                        <td>{row.asset || row.method}</td>
                        <td>
                          <span className={s.badge}>{row.status}</span>
                        </td>
                        <td>{new Date(row.created_at).toLocaleDateString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <Empty>
                Your {tab === "deposit" ? "deposits" : "withdrawals"} will
                appear here.
              </Empty>
            ))}
        </section>
      </div>
    </>
  );
}
