"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { createFloor } from "@/utils/actions/floor.actions";
import { FloorFormValues, floorSchema } from "@/utils/schema/zod.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { PlusCircle, Upload } from "lucide-react";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";

export function CreateFloorDialog({ venueId }: { venueId: string }) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const form = useForm<FloorFormValues>({
    resolver: zodResolver(floorSchema),
    defaultValues: {
      levelNumber: undefined,
      name: "",
      bundle: undefined,
    },
  });

  async function onSubmit(data: FloorFormValues) {
    setLoading(true);
    try {
      const res = await createFloor(venueId, data);
      if (res.success) {
        toast.success("Floor added successfully");
        setOpen(false);
        form.reset();
      } else {
        toast.error(res.error || "Failed to create floor");
      }
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error("An unexpected error occurred");
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-indigo-600 text-white hover:bg-indigo-700">
          <PlusCircle className="w-4 h-4 mr-2" /> Add Floor
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add New Floor</DialogTitle>
          <DialogDescription>
            Upload Unity AssetBundles and track multiple levels.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 py-4">
          <div className="grid grid-cols-4 gap-4">
            <Controller
              name="levelNumber"
              control={form.control}
              render={({ field, fieldState }) => (
                <div className="col-span-1">
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor={field.name}>Level</FieldLabel>
                    <Input
                      id={field.name}
                      name={field.name}
                      ref={field.ref}
                      onBlur={field.onBlur}
                      type="number"
                      value={field.value ?? ""}
                      onChange={(e) => {
                        const val = e.target.value;
                        field.onChange(val === "" ? undefined : parseInt(val, 10));
                      }}
                      aria-invalid={fieldState.invalid}
                      placeholder="0"
                    />
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                </div>
              )}
            />

            <Controller
              name="name"
              control={form.control}
              render={({ field, fieldState }) => (
                <div className="col-span-3">
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor={field.name}>Floor Name</FieldLabel>
                    <Input
                      {...field}
                      id={field.name}
                      aria-invalid={fieldState.invalid}
                      placeholder="e.g. Ground Floor, Basement"
                    />
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                </div>
              )}
            />
          </div>

          <Controller
            name="bundle"
            control={form.control}
            render={({
              field: { value, onChange, ...fieldProps },
              fieldState,
            }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor="bundle">
                  Unity AssetBundle (Optional)
                </FieldLabel>
                <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md relative group hover:border-indigo-500 transition-colors bg-gray-50">
                  <div className="space-y-1 text-center">
                    <Upload className="mx-auto h-12 w-12 text-gray-400 group-hover:text-indigo-500 transition-colors" />
                    <div className="flex text-sm text-gray-600 justify-center">
                      <label
                        htmlFor="bundle"
                        className="relative cursor-pointer rounded-md font-medium text-indigo-600 hover:text-indigo-500"
                      >
                        <span className="p-1 px-3 border border-indigo-200 rounded block hover:bg-indigo-50 transition-colors">
                          {value?.name || "Upload a file"}
                        </span>
                      </label>
                      <Input
                        {...fieldProps}
                        id="bundle"
                        type="file"
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer text-[0px]"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) onChange(file);
                        }}
                        aria-invalid={fieldState.invalid}
                        accept=".bundle,.zip"
                      />
                    </div>
                    <p className="text-xs text-gray-500 pt-2">
                      .bundle or .zip up to 50MB
                    </p>
                  </div>
                </div>
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />

          <div className="pt-4 flex justify-end gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                setOpen(false);
                form.reset();
              }}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={loading}
              className="bg-indigo-600 text-white hover:bg-indigo-700"
            >
              {loading ? "Creating..." : "Create Floor"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
