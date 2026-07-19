"use client"

import { useState } from "react"
import { Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { useStore } from "@/lib/store"
import type { Vehicle } from "@/lib/types"

const TYPES: Vehicle["type"][] = ["Sedan", "SUV", "Hatchback", "Truck", "Van"]

export function AddVehicleDialog({ customerId }: { customerId: string }) {
  const { addVehicle } = useStore()
  const [open, setOpen] = useState(false)
  const [form, setForm] = useState({
    make: "",
    model: "",
    year: "",
    regNumber: "",
    type: "" as Vehicle["type"] | "",
  })
  const [error, setError] = useState("")

  function reset() {
    setForm({ make: "", model: "", year: "", regNumber: "", type: "" })
    setError("")
  }

  function submit() {
    if (!form.make || !form.model || !form.year || !form.regNumber || !form.type) {
      setError("Please complete all fields.")
      return
    }
    addVehicle({
      customerId,
      make: form.make,
      model: form.model,
      year: Number(form.year),
      regNumber: form.regNumber,
      type: form.type as Vehicle["type"],
    })
    reset()
    setOpen(false)
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(o) => {
        setOpen(o)
        if (!o) reset()
      }}
    >
      <DialogTrigger render={<Button variant="outline" size="sm" className="gap-2" />}>
        <Plus className="h-4 w-4" />
        Add vehicle
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Add a vehicle</DialogTitle>
          <DialogDescription>
            Register a vehicle to your account for faster booking.
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col gap-4 py-2">
          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-2">
              <Label htmlFor="make">Make</Label>
              <Input
                id="make"
                placeholder="Toyota"
                value={form.make}
                onChange={(e) => setForm({ ...form, make: e.target.value })}
              />
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="model">Model</Label>
              <Input
                id="model"
                placeholder="Camry"
                value={form.model}
                onChange={(e) => setForm({ ...form, model: e.target.value })}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-2">
              <Label htmlFor="year">Year</Label>
              <Input
                id="year"
                type="number"
                placeholder="2021"
                value={form.year}
                onChange={(e) => setForm({ ...form, year: e.target.value })}
              />
            </div>
            <div className="flex flex-col gap-2">
              <Label>Type</Label>
              <Select
                value={form.type}
                onValueChange={(v) =>
                  setForm({ ...form, type: v as Vehicle["type"] })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select" />
                </SelectTrigger>
                <SelectContent>
                  {TYPES.map((t) => (
                    <SelectItem key={t} value={t}>
                      {t}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="reg">Registration number</Label>
            <Input
              id="reg"
              placeholder="KA-01-AB-1234"
              value={form.regNumber}
              onChange={(e) => setForm({ ...form, regNumber: e.target.value })}
            />
          </div>

          {error ? <p className="text-sm text-destructive">{error}</p> : null}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button onClick={submit}>Add vehicle</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
