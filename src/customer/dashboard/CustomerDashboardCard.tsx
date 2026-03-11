import { useState } from "react";
import Card from "../../shared/component/Card";
import Button from "../../shared/component/Button";

// ── Types ───────────────────────────────────────────────────────────────────
type CardType = "Credit" | "Debit";

type CardItem = {
  id: number;
  cardType: string;
  cardHolder: string;
  cardNumber: string;
  iconBg: string;
  iconText: string;
};

type NewCardForm = {
  cardType: CardType;
  cardHolder: string;
  cardPrivilege: string;
  expirationDate: string;
  annualFee: string;
};

// ── Mock data ───────────────────────────────────────────────────────────────
const initialCards: CardItem[] = [
  { id: 1, cardType: "Secondary", cardHolder: "William", cardNumber: "**** **** 5600", iconBg: "bg-blue-100",   iconText: "text-blue-500"  },
  { id: 2, cardType: "Secondary", cardHolder: "Michel",  cardNumber: "**** **** 4300", iconBg: "bg-pink-100",   iconText: "text-pink-500"  },
  { id: 3, cardType: "Secondary", cardHolder: "Edward",  cardNumber: "**** **** 7560", iconBg: "bg-yellow-100", iconText: "text-yellow-500" },
];

const CARD_PRIVILEGES = ["Classic", "Gold", "Platinum"] as const;

// ── Component ───────────────────────────────────────────────────────────────
const CustomerDashboardCard = () => {
  const [cards, setCards] = useState<CardItem[]>(initialCards);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editDraft, setEditDraft]   = useState<Partial<CardItem>>({});

  const [form, setForm] = useState<NewCardForm>({
    cardType: "Credit",
    cardHolder: "",
    cardPrivilege: "Classic",
    expirationDate: "",
    annualFee: "",
  });

  // ── Card list handlers ────────────────────────────────────────────────────
  const handleEditStart = (card: CardItem) => {
    setEditingId(card.id);
    setEditDraft({ cardHolder: card.cardHolder, cardType: card.cardType });
  };

  const handleEditSave = (id: number) => {
    setCards((prev) => prev.map((c) => (c.id === id ? { ...c, ...editDraft } : c)));
    setEditingId(null);
  };

  const handleEditCancel = () => setEditingId(null);

  // ── Add card handler ──────────────────────────────────────────────────────
  const handleAddCard = (e: React.SubmitEvent) => {
    e.preventDefault();
    const next: CardItem = {
      id: Date.now(),
      cardType: form.cardType,
      cardHolder: form.cardHolder,
      cardNumber: `**** **** ${Math.floor(1000 + Math.random() * 9000)}`,
      iconBg: "bg-blue-100",
      iconText: "text-blue-500",
    };
    setCards((prev) => [...prev, next]);
    setForm({ cardType: "Credit", cardHolder: "", cardPrivilege: "Classic", expirationDate: "", annualFee: "" });
  };

  // ── Shared input class ────────────────────────────────────────────────────
  const inputClass = "w-full border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-500 outline-none focus:ring-2 focus:ring-blue-300 bg-white";

  return (
    <div className="grid grid-cols-12 gap-10 p-8">

      {/* ── Row 1 : Card List ──────────────────────────────────────────────── */}
      <Card title="Card List" className="col-span-12" innerClassName="bg-white flex flex-col gap-4">

        {cards.map((card) => (
          <div
            key={card.id}
            className="flex items-center gap-6 p-4 rounded-2xl border border-gray-100 bg-white shadow-sm"
          >
            {/* Icon */}
            <span className={`flex items-center justify-center w-12 h-12 rounded-xl text-xl ${card.iconBg} ${card.iconText}`}>
              ☰
            </span>

            {/* Card Type */}
            {editingId === card.id ? (
              <input
                className={`${inputClass} w-32`}
                value={editDraft.cardType ?? ""}
                onChange={(e) => setEditDraft({ ...editDraft, cardType: e.target.value })}
              />
            ) : (
              <div className="flex flex-col w-32">
                <span className="text-xs text-gray-400">Card Type</span>
                <span className="text-sm font-medium text-blue-500">{card.cardType}</span>
              </div>
            )}

            {/* Card Number */}
            <div className="flex flex-col w-40">
              <span className="text-xs text-gray-400">Card Number</span>
              <span className="text-sm font-medium text-blue-500">{card.cardNumber}</span>
            </div>

            {/* Card Holder */}
            {editingId === card.id ? (
              <input
                className={`${inputClass} w-36`}
                value={editDraft.cardHolder ?? ""}
                onChange={(e) => setEditDraft({ ...editDraft, cardHolder: e.target.value })}
              />
            ) : (
              <div className="flex flex-col w-36">
                <span className="text-xs text-gray-400">Card Holder</span>
                <span className="text-sm font-medium text-blue-500">{card.cardHolder}</span>
              </div>
            )}

            {/* Actions */}
            <div className="ml-auto flex items-center gap-4 text-sm font-medium text-blue-600">
              {editingId === card.id ? (
                <>
                  <button onClick={() => handleEditSave(card.id)} className="hover:underline">Save</button>
                  <button onClick={handleEditCancel} className="text-gray-400 hover:underline">Cancel</button>
                </>
              ) : (
                <>
                  <button className="hover:underline">View Details</button>
                  <span className="text-gray-300">|</span>
                  <button onClick={() => handleEditStart(card)} className="hover:underline">Edit</button>
                </>
              )}
            </div>
          </div>
        ))}

      </Card>

      {/* ── Row 2 : Add New Card ───────────────────────────────────────────── */}
      <Card title="Add New Card" className="col-span-12" innerClassName="bg-white">

        <p className="text-sm text-blue-400 mb-6 leading-relaxed max-w-2xl">
          Credit Card generally means a plastic card issued by Scheduled Commercial Banks assigned
          to a Cardholder, with a credit limit, that can be used to purchase goods and services on
          credit or obtain cash advances.
        </p>

        <form onSubmit={handleAddCard} className="grid grid-cols-2 gap-6">

          {/* Card Type */}
          <div className="flex flex-col gap-1">
            <label className="text-sm text-gray-600">Card Type</label>
            <select
              className={inputClass}
              value={form.cardType}
              onChange={(e) => setForm({ ...form, cardType: e.target.value as CardType })}
            >
              <option value="Credit">Credit</option>
              <option value="Debit">Debit</option>
            </select>
          </div>

          {/* Card Holder */}
          <div className="flex flex-col gap-1">
            <label className="text-sm text-gray-600">Card Holder</label>
            <input
              className={inputClass}
              placeholder="My Cards"
              value={form.cardHolder}
              onChange={(e) => setForm({ ...form, cardHolder: e.target.value })}
            />
          </div>

          {/* Card Privilege */}
          <div className="flex flex-col gap-1">
            <label className="text-sm text-gray-600">Card Privilege</label>
            <select
              className={inputClass}
              value={form.cardPrivilege}
              onChange={(e) => setForm({ ...form, cardPrivilege: e.target.value })}
            >
              {CARD_PRIVILEGES.map((p) => (
                <option key={p} value={p}>{p}</option>
              ))}
            </select>
          </div>

          {/* Expiration Date */}
          <div className="flex flex-col gap-1">
            <label className="text-sm text-gray-600">Expiration Date</label>
            <input
              type="date"
              className={inputClass}
              value={form.expirationDate}
              onChange={(e) => setForm({ ...form, expirationDate: e.target.value })}
            />
          </div>

          {/* Annual Fee */}
          <div className="flex flex-col gap-1 col-span-2">
            <label className="text-sm text-gray-600">Annual Fee ($)</label>
            <input
              type="number"
              min="0"
              className={inputClass}
              placeholder="0"
              value={form.annualFee}
              onChange={(e) => setForm({ ...form, annualFee: e.target.value })}
            />
          </div>

          <div className="col-span-2">
            <Button type="submit" content="Add Card" className="rounded-xl px-8" />
          </div>

        </form>
      </Card>

    </div>
  );
};

export default CustomerDashboardCard;