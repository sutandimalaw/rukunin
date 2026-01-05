'use client'
import React, { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useAuth } from '@/provider/auth-provider'
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ChevronDownIcon, CirclePlus } from 'lucide-react'
import { useForm } from '@tanstack/react-form'
import z from "zod"; 
import { Field, FieldError, FieldLabel } from '@/components/ui/field'
import { Select, SelectContent, SelectItem, SelectSeparator, SelectTrigger, SelectValue } from '@/components/ui/select'
import { formSchema } from './formSchema'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Calendar } from '@/components/ui/calendar'
import { gender, houstType, marialStatus, ownershipStatus } from './constanta'


const DialogForm =  () => {
   const { user } = useAuth() 
   const [open, setOpen] = React.useState(false)
   const [openDateLive, setOpenDateLive] = React.useState(false)
   const [openModal, setOpenModal] = useState(false)

  const defaultValues: z.input<typeof formSchema> = {
    full_name: "",
    id_number: "",
    gender: "",
    date_of_birth: null,
    marial_status: '',
    occupation: '',
    email: '',
    kk: '',
    blok: '',
    rt: '',
    house_number: '',
    house_type: '',
    ownership_status: '',
    start_date_of_occupancy: null
  }
 
  if (!user) return null

  const form = useForm({
    defaultValues,
    validators: {
      onChange: formSchema,
    },
    onSubmit: async ({ value, formApi }) => {
       if (!user) {
          console.error("User belum login")
        return
      }
      const supabase = await createClient()
      try {
          const { error } = await supabase.from("residents").insert({
            created_by: user.id,
            ...value
          });
          if (error) {
              throw error;
          }
          alert('Warga Ditambahkan !')
          formApi.reset()
          setOpenModal(false)

      } catch (error) {
        alert('Error updating the data!')
        console.log("Error occurred", { error });
        // setFeedback("An error occurred"); 
      } 
    },
  })

  return (
    <Dialog open={openModal} onOpenChange={setOpenModal}>  
        <DialogTrigger asChild>
          <Button onClick={() => setOpenModal(true)} variant="outline">Tambah Warga ini<CirclePlus/> </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[825px]">
          <form 
            className='mr-2'
            onSubmit={(e) => {
              e.preventDefault()
              e.stopPropagation()
              form.handleSubmit()
            }}
          >
            <DialogHeader >
              <DialogTitle>Tambar Warga</DialogTitle>
            </DialogHeader>
            <div className="grid mt-5 grid-cols-2 gap-4">
              <div className="grid gap-2">
                <form.Field
                  name="full_name"
                  children={(field) => {
                    const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid
                    return (
                      <Field data-invalid={isInvalid}>
                        <FieldLabel htmlFor={field.name}>Nama Lengkap:</FieldLabel>
                        <Input
                          id={field.name}
                          name={field.name}
                          value={field.state.value}
                          type="text"
                          onBlur={field.handleBlur}
                          aria-invalid={isInvalid}
                          onChange={(e) => field.handleChange(e.target.value)}
                        />
                        {isInvalid && <FieldError errors={field.state.meta.errors} />}
                      </Field>
                    )
                  }}
                />
              </div>
              <div className="grid gap-2">
                <form.Field
                  name="id_number"
                  children={(field) => {
                    const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid
                    return (
                      <Field data-invalid={isInvalid}>
                        <FieldLabel htmlFor={field.name}>No KTP:</FieldLabel>
                        <Input
                          id={field.name}
                          name={field.name}
                          value={field.state.value ?? ""}
                          onBlur={field.handleBlur}
                          aria-invalid={isInvalid}
                          onChange={(e) => field.handleChange(e.target.value)}
                        />
                        {isInvalid && <FieldError errors={field.state.meta.errors} />}
                      </Field>
                    )
                  }}
                />
              </div>
              <div className="grid gap-2">
                <form.Field
                  name="gender"
                  children={(field) => {
                    const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid
                    return (
                      <Field data-invalid={isInvalid} >
                        <FieldLabel htmlFor={field.name}>Gender</FieldLabel>
                        <Select
                          name={field.name}
                          value={field.state.value}
                          onValueChange={field.handleChange}
                          aria-invalid={isInvalid}
                        >
                          <SelectTrigger
                            id="form-tanstack-select-gender"
                            aria-invalid={isInvalid}
                            className="min-w-[120px]"
                          >
                            <SelectValue placeholder="Select Gender" />
                          </SelectTrigger>
                          <SelectContent position="item-aligned">
                            {gender.map((item) => (
                              <SelectItem
                                key={item.value}
                                value={item.value}
                              >
                                {item.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </Field>
                    )
                  }}
                /> 
              </div>
              <div className="grid gap-2">
                <form.Field
                  name="date_of_birth"
                  children={(field) => {
                    const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid;
                    // normalize value coming from form state: could be Date, ISO string, or null
                    const raw = field.state.value as Date | string | null | undefined;
                    const value: Date | null = raw == null ? null : (raw instanceof Date ? raw : new Date(String(raw)));

                    return (
                      <Field data-invalid={isInvalid}>
                        <FieldLabel htmlFor={field.name}>Tanggal Lahir:</FieldLabel>
                        <Popover open={open} onOpenChange={setOpen}>
                          <PopoverTrigger asChild>
                            <Button
                              variant="outline"
                              id="date"
                              className="w-48 justify-between font-normal"
                            >
                              {value ? value.toLocaleDateString() : "Select date"}
                              <ChevronDownIcon />
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto overflow-hidden p-0" align="start">
                            <Calendar
                              mode="single"
                              // Calendar expects Date | undefined for `selected`
                              selected={value ?? undefined}
                              captionLayout="dropdown"
                              onSelect={(d) => {
                                // `d` is Date | undefined depending on Calendar implementation
                                if (d) {
                                  field.handleChange(d);
                                } else {
                                  field.handleChange(null);
                                }
                                setOpen(false);
                              }}
                            />
                          </PopoverContent>
                        </Popover>
                        {isInvalid && <FieldError errors={field.state.meta.errors} />}
                      </Field>
                    )
                  }}
                />    
              </div>
              <div className="grid gap-2">
                <form.Field
                  name="marial_status"
                  children={(field) => {
                    const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid
                    return (
                      <Field data-invalid={isInvalid} >
                        <FieldLabel htmlFor={field.name}>Status Pernikahan</FieldLabel>
                        <Select
                          name={field.name}
                          value={field.state.value}
                          onValueChange={field.handleChange}
                          aria-invalid={isInvalid}
                        >
                          <SelectTrigger
                            id="form-tanstack-select-marian_status"
                            aria-invalid={isInvalid}
                            className="min-w-[120px]"
                          >
                            <SelectValue placeholder="Select Status Pernikahan" />
                          </SelectTrigger>
                          <SelectContent position="item-aligned">
                            {marialStatus.map((item) => (
                              <SelectItem
                                key={item.value}
                                value={item.value}
                              >
                                {item.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </Field>
                    )
                  }}
                /> 
              </div>
              <div className="grid gap-2">
                <form.Field
                  name="occupation"
                  children={(field) => {
                    const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid
                    return (
                      <Field data-invalid={isInvalid}>
                        <FieldLabel htmlFor={field.name}>Pekerjaan:</FieldLabel>
                        <Input
                          id={field.name}
                          name={field.name}
                          value={field.state.value}
                          type="text"
                          onBlur={field.handleBlur}
                          aria-invalid={isInvalid}
                          onChange={(e) => field.handleChange(e.target.value)}
                        />
                        {isInvalid && <FieldError errors={field.state.meta.errors} />}
                      </Field>
                    )
                  }}
                />
              </div>
              <div className="grid gap-2">
                <form.Field
                  name="email"
                  children={(field) => {
                    const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid
                    return (
                      <Field data-invalid={isInvalid}>
                        <FieldLabel htmlFor={field.name}>Email</FieldLabel>
                        <Input
                          id={field.name}
                          name={field.name}
                          value={field.state.value}
                          type="email"
                          onBlur={field.handleBlur}
                          aria-invalid={isInvalid}
                          onChange={(e) => field.handleChange(e.target.value)}
                        />
                        {isInvalid && <FieldError errors={field.state.meta.errors} />}
                      </Field>
                    )
                  }}
                />
              </div>
              <div className="grid gap-2">
                <form.Field
                  name="kk"
                  children={(field) => {
                    const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid
                    return (
                      <Field data-invalid={isInvalid}>
                        <FieldLabel htmlFor={field.name}>KK:</FieldLabel>
                        <Input
                          id={field.name}
                          name={field.name}
                          value={field.state.value}
                          type="text"
                          onBlur={field.handleBlur}
                          aria-invalid={isInvalid}
                          onChange={(e) => field.handleChange(e.target.value)}
                        />
                        {isInvalid && <FieldError errors={field.state.meta.errors} />}
                      </Field>
                    )
                  }}
                />
              </div>
              <div className="grid gap-2">
                <form.Field
                  name="blok"
                  children={(field) => {
                    const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid
                    return (
                      <Field data-invalid={isInvalid}>
                        <FieldLabel htmlFor={field.name}>Blok:</FieldLabel>
                        <Input
                          id={field.name}
                          name={field.name}
                          value={field.state.value}
                          type="text"
                          onBlur={field.handleBlur}
                          aria-invalid={isInvalid}
                          onChange={(e) => field.handleChange(e.target.value)}
                        />
                        {isInvalid && <FieldError errors={field.state.meta.errors} />}
                      </Field>
                    )
                  }}
                />
              </div>
              <div className="grid gap-2">
                <form.Field
                  name="rt"
                  children={(field) => {
                    const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid
                    return (
                      <Field data-invalid={isInvalid}>
                        <FieldLabel htmlFor={field.name}>RT:</FieldLabel>
                        <Input
                          id={field.name}
                          name={field.name}
                          value={field.state.value}
                          type="text"
                          onBlur={field.handleBlur}
                          aria-invalid={isInvalid}
                          onChange={(e) => field.handleChange(e.target.value)}
                        />
                        {isInvalid && <FieldError errors={field.state.meta.errors} />}
                      </Field>
                    )
                  }}
                />           
              </div>
              <div className="grid gap-2">
                <form.Field
                  name="house_number"
                  children={(field) => {
                    const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid
                    return (
                      <Field data-invalid={isInvalid}>
                        <FieldLabel htmlFor={field.name}>No:</FieldLabel>
                        <Input
                          id={field.name}
                          name={field.name}
                          value={field.state.value}
                          type="text"
                          onBlur={field.handleBlur}
                          aria-invalid={isInvalid}
                          onChange={(e) => field.handleChange(e.target.value)}
                        />
                        {isInvalid && <FieldError errors={field.state.meta.errors} />}
                      </Field>
                    )
                  }}
                />    
              </div>
              <div className="grid gap-2">
                <form.Field
                  name="house_type"
                  children={(field) => {
                    const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid
                    return (
                      <Field data-invalid={isInvalid} >
                        <FieldLabel htmlFor={field.name}>Tipe Rumah</FieldLabel>
                        <Select
                          name={field.name}
                          value={field.state.value}
                          onValueChange={field.handleChange}
                          aria-invalid={isInvalid}
                        >
                          <SelectTrigger
                            id="form-tanstack-select-marian_status"
                            aria-invalid={isInvalid}
                            className="min-w-[120px]"
                          >
                            <SelectValue placeholder="Select Status Pernikahan" />
                          </SelectTrigger>
                          <SelectContent position="item-aligned">
                            {houstType.map((item) => (
                              <SelectItem
                                key={item.value}
                                value={item.value}
                              >
                                {item.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </Field>
                    )
                  }}
                /> 
              </div>
              <div className="grid gap-2">
                <form.Field
                  name="ownership_status"
                  children={(field) => {
                    const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid
                    return (
                      <Field data-invalid={isInvalid} >
                        <FieldLabel htmlFor={field.name}>Status Kepemilikan</FieldLabel>
                        <Select
                          name={field.name}
                          value={field.state.value}
                          onValueChange={field.handleChange}
                          aria-invalid={isInvalid}
                        >
                          <SelectTrigger
                            id="form-tanstack-select-marian_status"
                            aria-invalid={isInvalid}
                            className="min-w-[120px]"
                          >
                            <SelectValue placeholder="Select Kepemilikan" />
                          </SelectTrigger>
                          <SelectContent position="item-aligned">
                            {ownershipStatus.map((item) => (
                              <SelectItem
                                key={item.value}
                                value={item.value}
                              >
                                {item.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </Field>
                    )
                  }}
                /> 
              </div>
              <div className="grid gap-2">
                <form.Field
                  name="start_date_of_occupancy"
                  children={(field) => {
                    const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid;
                    // normalize value coming from form state: could be Date, ISO string, or null
                    const raw = field.state.value as Date | string | null | undefined;
                    const value: Date | null = raw == null ? null : (raw instanceof Date ? raw : new Date(String(raw)));

                    return (
                      <Field data-invalid={isInvalid}>
                        <FieldLabel htmlFor={field.name}>Tanggal Mulai Tinggal:</FieldLabel>
                        <Popover open={openDateLive} onOpenChange={setOpenDateLive}>
                          <PopoverTrigger asChild>
                            <Button
                              variant="outline"
                              id="date"
                              className="w-48 justify-between font-normal"
                            >
                              {value ? value.toLocaleDateString() : "Select date"}
                              <ChevronDownIcon />
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto overflow-hidden p-0" align="start">
                            <Calendar
                              mode="single"
                              // Calendar expects Date | undefined for `selected`
                              selected={value ?? undefined}
                              captionLayout="dropdown"
                              onSelect={(d) => {
                                // `d` is Date | undefined depending on Calendar implementation
                                if (d) {
                                  field.handleChange(d);
                                } else {
                                  field.handleChange(null);
                                }
                                setOpenDateLive(false);
                              }}
                            />
                          </PopoverContent>
                        </Popover>
                        {isInvalid && <FieldError errors={field.state.meta.errors} />}
                      </Field>
                    )
                  }}
                />   
              </div>

            </div>
            <DialogFooter className='mt-5'>
              <DialogClose asChild>
                <Button onClick={() => setOpenModal(false)} variant="outline">Cancel</Button>
              </DialogClose>
              <Button type="submit">Save changes</Button>
            </DialogFooter>
          </form>
        </DialogContent>
    </Dialog>
  )
}


export default DialogForm
