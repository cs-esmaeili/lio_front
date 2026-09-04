import { Label } from "@/components/shadcn/label"
import { RadioGroup, RadioGroupItem } from "@/components/shadcn/radio-group"

export function Test() {
  return (
    <RadioGroup defaultValue="comfortable" className="w-fit">
      <div className="flex justify-end items-center gap-3">
        <Label htmlFor="r1">نتبالتیسنلاتنمسا</Label>
        <RadioGroupItem value="default" id="r1" dir="rtl"/>
      </div>
      <div className="flex justify-end  items-center gap-3">
        <Label htmlFor="r2">ابااسیالب</Label>
        <RadioGroupItem value="comfortable" id="r2" dir="rtl"/>
      </div>
      <div className="flex justify-end  items-center gap-3">
        <Label htmlFor="r3">سیلسابلایبلا</Label>
        <RadioGroupItem value="compact" id="r3" dir="rtl"/>
      </div>
    </RadioGroup>
  )
}
