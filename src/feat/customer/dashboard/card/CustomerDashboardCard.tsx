import { useState } from "react";
import Button from "../../../../shared/component/Button";
import Card from "../../../../shared/component/Card";

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

const CustomerDashboardCard = () => {
  const TOTAL_PAGES = 4;
  const [currentPage, setCurrentPage] = useState(1);
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

  const handleEditStart = (card: CardItem) => {
    setEditingId(card.id);
    setEditDraft({ cardHolder: card.cardHolder, cardType: card.cardType });
  };

  const handleEditSave = (id: number) => {
    setCards((prev) => prev.map((c) => (c.id === id ? { ...c, ...editDraft } : c)));
    setEditingId(null);
  };

  const handleEditCancel = () => setEditingId(null);

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

  const inputClass = "w-full border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-500 outline-none focus:ring-2 focus:ring-blue-300 bg-white";

  return (
    
    <div className="grid grid-cols-12 gap-10 p-8">

      <Card title="Card List" className="col-span-12" innerClassName="bg-white flex flex-col gap-4">

        {cards.map((card) => (
          <div
            key={card.id}
            className="flex items-center gap-6 p-4 rounded-2xl border border-gray-100 bg-white shadow-sm"
          >
            <span className={`flex items-center justify-center w-12 h-12 rounded-xl text-xl ${card.iconBg} ${card.iconText}`}>
              ☰
            </span>

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


            <div className="flex flex-col w-40">
              <span className="text-xs text-gray-400">Card Number</span>
              <span className="text-sm font-medium text-blue-500">{card.cardNumber}</span>
            </div>

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
        
        {/* temp will be grouped into a component later */}
        <nav className="flex justify-end items-center gap-2 mt-6">
          <button
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            className="flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700 px-2"
          >
            &lt; Previous
          </button>
          {Array.from({ length: TOTAL_PAGES }, (_, i) => i + 1).map((page) => (
            <button
              key={page}
              onClick={() => setCurrentPage(page)}
              className={`w-8 h-8 rounded-full text-sm font-medium ${
                currentPage === page
                  ? "bg-blue-600 text-white"
                  : "text-gray-500 hover:bg-gray-100"
              }`}
            >
              {page}
            </button>
          ))}
          <button
            onClick={() => setCurrentPage((p) => Math.min(TOTAL_PAGES, p + 1))}
            className="flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700 px-2"
          >
            Next &gt;
          </button>
        </nav>
      </Card>

      <Card title="Add New Card" className="col-span-12" innerClassName="bg-white">

        <p className="text-sm text-blue-400 mb-6 leading-relaxed max-w-2xl">
          Credit Card generally means a plastic card issued by Scheduled Commercial Banks assigned
          to a Cardholder, with a credit limit, that can be used to purchase goods and services on
          credit or obtain cash advances.
        </p>

        <form onSubmit={handleAddCard} className="grid grid-cols-2 gap-6">

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

          <div className="flex flex-col gap-1">
            <label className="text-sm text-gray-600">Card Holder</label>
            <input
              className={inputClass}
              placeholder="My Cards"
              value={form.cardHolder}
              onChange={(e) => setForm({ ...form, cardHolder: e.target.value })}
            />
          </div>

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

          <div className="flex flex-col gap-1">
            <label className="text-sm text-gray-600">Expiration Date</label>
            <input
              type="date"
              className={inputClass}
              value={form.expirationDate}
              onChange={(e) => setForm({ ...form, expirationDate: e.target.value })}
            />
          </div>

          <div className="flex flex-col gap-1 ">
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

            <Button type="submit" content="Add Card" className="rounded-xl px-8" />

        </form>
      </Card>

    </div>
  );
};

export default CustomerDashboardCard;