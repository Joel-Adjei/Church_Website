import { useState } from "react";
import {
  Heart,
  Building2,
  ArrowLeftCircleIcon,
  ArrowRightCircleIcon,
  Copy,
  CheckCheck,
  Smartphone,
} from "lucide-react";
import { Seo } from "@/components/Seo";
import { toast } from "sonner";
import heroImg from "@/assets/bg_11.jpg";
import mtnLogo from "@/assets/mtn_logo.jpg";
import telecel_Logo from "@/assets/tetecel_logo.jpg";
import artelTigoLgo from "@/assets/AirtelTigo_logo.jpg";
import mobileMoney from "@/assets/img_07.jpg";
import bankMoney from "@/assets/img_05.jpg";
import { useAccounts } from "@/services/queries";
import type { Account } from "@/types";

const networkLogoMap: Record<string, string> = {
  mtn: mtnLogo,
  telecel: telecel_Logo,
  vodafone: telecel_Logo,
  airteltigo: artelTigoLgo,
  airtel: artelTigoLgo,
  tigo: artelTigoLgo,
};

function getNetworkLogo(network: string): string | undefined {
  return networkLogoMap[network.toLowerCase().replace(/\s/g, "")];
}

function CopyButton({ value }: { value: string }) {
  const [copied, setCopied] = useState(false);
  const handleCopy = async () => {
    await navigator.clipboard.writeText(value);
    setCopied(true);
    toast.success("Copied to clipboard");
    setTimeout(() => setCopied(false), 2000);
  };
  return (
    <button
      onClick={handleCopy}
      className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-primary transition-colors"
    >
      {copied ? (
        <CheckCheck className="h-3.5 w-3.5 text-green-500" />
      ) : (
        <Copy className="h-3.5 w-3.5" />
      )}
      {copied ? "Copied" : "Copy"}
    </button>
  );
}

function BankAccountCard({ account }: { account: Account }) {
  return (
    <div className="rounded-2xl border bg-white shadow-sm p-5 flex flex-col gap-4">
      <div className="flex items-center gap-3">
        <div className="h-10 w-10 rounded-full bg-blue-50 flex items-center justify-center shrink-0 ring-2 ring-white shadow">
          <Building2 className="h-5 w-5 text-blue-600" />
        </div>
        <div>
          <p className="font-semibold text-sm leading-tight">{account.bank_name || "Bank"}</p>
          <p className="text-xs text-muted-foreground">
            {[account.branch, account.currency].filter(Boolean).join(" · ")}
          </p>
        </div>
      </div>

      <div className="space-y-2 rounded-xl bg-gray-50 p-4">
        <div className="flex items-center justify-between gap-2">
          <span className="text-xs text-muted-foreground shrink-0">Account Name</span>
          <span className="text-sm font-medium text-right">{account.account_name}</span>
        </div>
        <div className="h-px bg-gray-100" />
        <div className="flex items-center justify-between gap-2">
          <span className="text-xs text-muted-foreground shrink-0">Account No.</span>
          <div className="flex items-center gap-2">
            <span className="font-mono text-sm font-semibold tracking-wider">
              {account.account_number}
            </span>
            <CopyButton value={account.account_number} />
          </div>
        </div>
        {account.branch && (
          <>
            <div className="h-px bg-gray-100" />
            <div className="flex items-center justify-between gap-2">
              <span className="text-xs text-muted-foreground">Branch</span>
              <span className="text-sm">{account.branch}</span>
            </div>
          </>
        )}
      </div>

      {account.instructions && (
        <p className="text-xs text-muted-foreground leading-relaxed border-t pt-3">
          {account.instructions}
        </p>
      )}
    </div>
  );
}

function MomoAccountCard({ account }: { account: Account }) {
  const logo = getNetworkLogo(account.network ?? "");
  return (
    <div className="rounded-md border bg-white shadow-sm p-5 flex flex-col gap-4">
      <div className="bg-primary rounded p-3">
        <h3 className="text-md text-muted font-semibold">{account.name}</h3>
      </div>
      <div className="flex items-center gap-3">
        {logo ? (
          <img
            src={logo}
            alt={account.network}
            className="h-10 w-10 rounded-full object-cover ring-2 ring-white shadow"
          />
        ) : (
          <div className="h-10 w-10 rounded-full bg-yellow-100 flex items-center justify-center">
            <Smartphone className="h-5 w-5 text-yellow-600" />
          </div>
        )}
        <div>
          <p className="font-semibold text-md leading-tight">{account.network || "Mobile Money"}</p>
          <p className="text-xs text-muted-foreground">{account.currency || "GHS"}</p>
        </div>
      </div>

      <div className="space-y-2 rounded-xl bg-gray-50 p-4">
        <div className="flex items-center justify-between">
          <span className="text-xs text-muted-foreground">Account Name</span>
          <span className="text-md font-medium">{account.account_name}</span>
        </div>
        <div className="h-px bg-gray-100" />
        <div className="flex items-center justify-between gap-2">
          <span className="text-xs text-muted-foreground">Number</span>
          <div className="flex items-center gap-2">
            <span className="font-mono text-md font-semibold tracking-wider">
              {account.account_number}
            </span>
            <CopyButton value={account.account_number} />
          </div>
        </div>
      </div>

      {account.instructions && (
        <p className="text-xs text-muted-foreground leading-relaxed border-t pt-3">
          {account.instructions}
        </p>
      )}
    </div>
  );
}

export default function Give() {
  const [selectedChannel, setSeletedeChannel] = useState<"momo" | "bank" | null>(null);
  const { data: accounts, isLoading: fetchingAccounts } = useAccounts();
  const momoAccounts = accounts?.filter((a) => a.channel_type === "momo") ?? [];
  const bankAccounts = accounts?.filter((a) => a.channel_type === "bank") ?? [];

  return (
    <div className="min-h-screen bg-surface-elevated">
      <Seo
        title="Give & Support"
        description="Support the mission of Grace Cathedral through your generous giving. Every gift helps our community serve the city and beyond."
      />

      {/* Hero */}
      <div className="relative h-120 overflow-hidden bg-primary text-primary-foreground">
        <img src={heroImg} className="absolute inset-0 h-full w-full object-cover" />
        <div className="h-full w-full bg-linear-to-t from-primary to-primary/0 z-10 absolute" />
        <div
          className="absolute inset-0 opacity-10 z-10"
          style={{
            backgroundImage: "radial-gradient(circle at 70% 50%, white 1px, transparent 1px)",
            backgroundSize: "32px 32px",
          }}
        />
        <div className="relative mx-auto max-w-3xl px-6 py-16 text-center z-20">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-primary/20">
            <Heart className="h-7 w-7 text-primary" />
          </div>
          <h1 className="font-display text-white text-4xl lg:text-7xl sm:text-5xl mb-4">
            Give with a Cheerful Heart
          </h1>
          <p className="text-primary-foreground/80 text-lg max-w-xl mx-auto">
            "Each of you should give what you have decided in your heart to give, not reluctantly or
            under compulsion, for God loves a cheerful giver." — 2 Corinthians 9:7
          </p>
        </div>
      </div>

      {/* Channel picker */}
      {!selectedChannel && (
        <div>
          {/* Mobile Money */}
          <div
            onClick={() => setSeletedeChannel("momo")}
            className="group relative w-full bg-secondary cursor-pointer overflow-hidden transition-colors duration-300 hover:bg-secondary/80"
          >
            <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <div className="flex flex-col my-6 md:gap-8 gap-4 md:flex-row p-6 h-full max-w-3xl mx-auto items-center">
              <div className="size-45 group-hover:scale-105 transition-transform duration-300">
                <img src={mobileMoney} alt="MoMo" className="size-full rounded-xl object-cover" />
              </div>
              <div className="flex-1">
                <h3 className="text-xl md:text-3xl font-semibold text-primary mb-2 group-hover:translate-x-1 transition-transform duration-300">
                  Give Through Mobile Money
                </h3>
                <div className="flex justify-center md:justify-start gap-2">
                  {[mtnLogo, telecel_Logo, artelTigoLgo].map((logo, i) => (
                    <img
                      key={i}
                      src={logo}
                      className="size-9 rounded-full object-cover ring-2 ring-white shadow-sm group-hover:scale-110 transition-transform duration-300"
                      style={{ transitionDelay: `${i * 40}ms` }}
                    />
                  ))}
                </div>
              </div>
              <div className="bg-primary/10 rounded-full p-2 group-hover:bg-primary/20 group-hover:translate-x-1 transition-transform duration-300">
                <ArrowRightCircleIcon size={44} className="text-primary duration-300" />
              </div>
            </div>
          </div>

          {/* Bank Transfer */}
          <div
            onClick={() => setSeletedeChannel("bank")}
            className="group relative  w-full bg-primary cursor-pointer overflow-hidden transition-colors duration-300 hover:bg-primary/90"
          >
            <div className="absolute inset-0 bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <div className="flex flex-col md:gap-8 gap-4 md:flex-row my-5 p-6 h-full max-w-3xl mx-auto items-center">
              <div className="size-45 group-hover:scale-105 transition-transform duration-300">
                <img src={bankMoney} alt="MoMo" className="size-full  rounded-xl object-cover" />
              </div>
              <div className="flex-1">
                <h3 className="text-xl md:text-3xl font-semibold text-white mb-1 group-hover:translate-x-1 transition-transform duration-300">
                  Give Through Bank Transfer
                </h3>
                <p className="text-white/60  text-sm">Direct deposit to our church account</p>
              </div>
              <div className="bg-white/10 rounded-full p-2 group-hover:bg-white/20 group-hover:translate-x-1 transition-transform duration-300">
                <ArrowRightCircleIcon size={44} className="text-white  duration-300" />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Mobile Money detail */}
      {selectedChannel === "momo" && (
        <div className="mx-auto max-w-3xl px-4 py-8 space-y-6">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSeletedeChannel(null)}
              className="text-muted-foreground hover:text-primary transition-colors"
            >
              <ArrowLeftCircleIcon className="h-7 w-7" />
            </button>
            <div>
              <h2 className="text-xl font-semibold">Mobile Money</h2>
              <p className="text-sm text-muted-foreground">
                Choose any number below to send your gift
              </p>
            </div>
          </div>

          <div className="flex gap-2 items-center">
            {[mtnLogo, telecel_Logo, artelTigoLgo].map((logo, i) => (
              <img
                key={i}
                src={logo}
                alt=""
                className="h-8 w-8 rounded-full object-cover ring-2 ring-white shadow-sm"
              />
            ))}
            <span className="text-xs text-muted-foreground ml-1">All major networks accepted</span>
          </div>

          {fetchingAccounts ? (
            <div className="space-y-3">
              {[1, 2].map((i) => (
                <div key={i} className="h-36 rounded-2xl bg-gray-100 animate-pulse" />
              ))}
            </div>
          ) : momoAccounts.length === 0 ? (
            <div className="rounded-2xl border border-dashed py-12 text-center text-muted-foreground text-sm">
              No mobile money accounts available at the moment.
            </div>
          ) : (
            <div className=" space-y-4">
              {momoAccounts.map((account) => (
                <MomoAccountCard key={account.id} account={account} />
              ))}
            </div>
          )}
        </div>
      )}

      {/* Bank detail */}
      {selectedChannel === "bank" && (
        <div className="mx-auto max-w-3xl px-4 py-8 space-y-6">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSeletedeChannel(null)}
              className="text-muted-foreground hover:text-primary transition-colors"
            >
              <ArrowLeftCircleIcon className="h-7 w-7" />
            </button>
            <div>
              <h2 className="text-xl font-semibold">Bank Transfer</h2>
              <p className="text-sm text-muted-foreground">
                Use the details below to make a direct deposit
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2.5 rounded-xl bg-blue-50 border border-blue-100 px-4 py-3">
            <Building2 className="h-4 w-4 text-blue-500 shrink-0" />
            <p className="text-xs text-blue-700">
              After your transfer, kindly notify us via the church office or WhatsApp so we can
              confirm receipt.
            </p>
          </div>

          {fetchingAccounts ? (
            <div className="space-y-3">
              {[1, 2].map((i) => (
                <div key={i} className="h-40 rounded-2xl bg-gray-100 animate-pulse" />
              ))}
            </div>
          ) : bankAccounts.length === 0 ? (
            <div className="rounded-2xl border border-dashed py-12 text-center text-muted-foreground text-sm">
              No bank accounts available at the moment.
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 gap-4">
              {bankAccounts.map((account) => (
                <BankAccountCard key={account.id} account={account} />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
