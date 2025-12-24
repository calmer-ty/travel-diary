import { Button } from "@/components/ui/button";
import { CountryLabelColor } from "../maps/colorList";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";

import type { ITravelWaringItem } from "@/types";
interface ICountryModalProps {
  country: ITravelWaringItem | null;
  closeDialog: () => void;
}

export default function CountryDialog({ country, closeDialog }: ICountryModalProps) {
  if (!country) return null;

  const alertNotes = [country.attention_note, country.control_note, country.limita_note, country.ban_yna || country.ban_note];

  const alerts = CountryLabelColor.map((el, idx) => ({
    label: el.label,
    note: alertNotes[idx],
    textColor: el.text,
    bg: el.bg,
  })).filter((a) => a.note);

  return (
    <Dialog
      open={!!country}
      onOpenChange={(open) => {
        if (!open) closeDialog(); // ESC 눌러서 닫힐 때 처리
      }}
    >
      <DialogContent className="sm:max-w-104">
        <DialogHeader>
          <div className="flex items-center gap-2">
            <img className="w-16 h-10 object-cover rounded shadow-[1px_1px_8px_1px_rgba(0,0,0,0.25)]" src={country.img_url} alt={country.country_name} />
            <DialogTitle className="text-xl">
              <span className="text-[#1D538A] dark:text-[#2884e0]">{country.country_name}</span> 여행 경보
            </DialogTitle>
          </div>
          <DialogDescription>
            <span>
              {country.country_en_name} | {country.continent}
            </span>
            {country.wrt_dt && <span className="text-gray-500 mb-4 text-sm">등록일: {country.wrt_dt}</span>}
          </DialogDescription>
        </DialogHeader>

        {/* 경보 섹션 */}
        <div className="space-y-3">
          {alerts.map((alert, idx) => (
            <div key={idx} className="flex gap-2 items-start">
              <span className={`flex-shrink-0 px-2 py-1 rounded-full text-sm ${alert.textColor} ${alert.bg}`}>{alert.label}</span>
              <p className="mt-0.5 text-muted-foreground">{alert.note}</p>
            </div>
          ))}
        </div>

        <DialogFooter>
          <Button variant="remove" onClick={closeDialog}>
            닫기
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
