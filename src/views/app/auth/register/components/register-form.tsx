"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";

import {
  Button,
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  Input,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui";
import { hasLegalAge, isRutValid } from "@/lib/utils";

import { useRegister } from "../hooks";

const formSchema = z
  .object({
    firstName: z
      .string()
      .min(2, { message: "El nombre debe tener al menos 2 caracteres" })
      .max(20, { message: "El nombre debe tener como máximo 20 caracteres" }),
    lastName: z
      .string()
      .min(2, { message: "El apellido debe tener al menos 2 caracteres" })
      .max(20, { message: "El apellido debe tener como máximo 20 caracteres" }),
    rut: z
      .string()
      .min(1, { message: "El RUT es requerido" })
      .regex(/^\d{7,8}-[0-9kK]$/, {
        message: "El RUT no está en formato correcto",
      })
      .refine(isRutValid, { message: "El RUT no es válido" }),
    gender: z.enum(["Masculino", "Femenino", "Otro"]),
    birthDate: z
      .string()
      .min(1, { message: "La fecha de nacimiento es requerida" })
      .refine(
        dateString => {
          try {
            const date = new Date(dateString);
            return !isNaN(date.getTime());
          } catch {
            return false;
          }
        },
        {
          message: "Debe ingresar una fecha de nacimiento válida",
        }
      )
      .refine(
        dateString => {
          const date = new Date(dateString);
          return hasLegalAge(date);
        },
        {
          message: "Debe ser mayor de 18 años para registrarse",
        }
      ),
    phoneNumber: z.string().regex(/^9\d{8}$/, {
      message: "El número de teléfono debe tener 9 dígitos y comenzar con un 9",
    }),
    email: z.email({ message: "El correo electrónico no es válido" }),
    password: z
      .string()
      .min(8, { message: "La contraseña debe tener al menos 8 caracteres" })
      .regex(/[A-Z]/, {
        message: "La contraseña debe contener al menos una letra mayúscula",
      })
      .regex(/[a-z]/, {
        message: "La contraseña debe contener al menos una letra minúscula",
      })
      .regex(/[0-9]/, {
        message: "La contraseña debe contener al menos un número",
      })
      .regex(/[\W_]/, {
        message: "La contraseña debe contener al menos un carácter especial",
      }),
    confirmPassword: z.string().min(1, { message: "Confirma tu contraseña" }),
  })
  .refine(data => data.password === data.confirmPassword, {
    message: "Las contraseñas no coinciden",
    path: ["confirmPassword"],
  });

export function RegisterForm() {
  const { handleRegister, isLoading } = useRegister();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      rut: "",
      gender: undefined,
      birthDate: "",
      phoneNumber: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
    mode: "onTouched",
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    handleRegister(values);
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        {/* Name Field */}
        <FormField
          control={form.control}
          name="firstName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nombre</FormLabel>
              <FormControl>
                <Input placeholder="Juan" {...field} disabled={isLoading} />
              </FormControl>
              <FormDescription>De 2 a 20 caracteres máximo.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Last Name Field */}
        <FormField
          control={form.control}
          name="lastName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Apellido</FormLabel>
              <FormControl>
                <Input placeholder="Pérez" {...field} disabled={isLoading} />
              </FormControl>
              <FormDescription>De 2 a 20 caracteres máximo.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* RUT Field */}
        <FormField
          control={form.control}
          name="rut"
          render={({ field }) => (
            <FormItem>
              <FormLabel>RUT</FormLabel>
              <FormControl>
                <Input
                  placeholder="12345678-9"
                  {...field}
                  disabled={isLoading}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Genre Field */}
        <FormField
          control={form.control}
          name="gender"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Género</FormLabel>
              <FormControl>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                  disabled={isLoading}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Selecciona tu género" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Masculino">Masculino</SelectItem>
                    <SelectItem value="Femenino">Femenino</SelectItem>
                    <SelectItem value="Otro">Otro</SelectItem>
                  </SelectContent>
                </Select>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Birth Date Field */}
        <FormField
          control={form.control}
          name="birthDate"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Fecha de Nacimiento</FormLabel>
              <FormControl>
                <Input type="date" {...field} disabled={isLoading} />
              </FormControl>
              <FormDescription>
                Debes ser mayor de edad para crear tu cuenta
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Phone Number Field */}
        <FormField
          control={form.control}
          name="phoneNumber"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Número de Teléfono</FormLabel>
              <FormControl>
                <Input
                  placeholder="912345678"
                  {...field}
                  disabled={isLoading}
                />
              </FormControl>
              <FormDescription>Número chileno válido</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Email Field */}
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Correo electrónico</FormLabel>
              <FormControl>
                <Input
                  placeholder="correo@ejemplo.com"
                  {...field}
                  disabled={isLoading}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Password Field */}
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Contraseña</FormLabel>
              <FormControl>
                <Input
                  type="password"
                  placeholder="••••••••"
                  {...field}
                  disabled={isLoading}
                />
              </FormControl>
              <FormDescription>
                Alfanumérica de mínimo 8 caracteres con al menos una mayúscula y
                un caracter especial
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Confirm Password Field */}
        <FormField
          control={form.control}
          name="confirmPassword"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Confirmar Contraseña</FormLabel>
              <FormControl>
                <Input
                  type="password"
                  placeholder="••••••••"
                  {...field}
                  disabled={isLoading}
                />
              </FormControl>
              <FormDescription>Repita su contraseña</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-center items-center">
          <Button
            type="submit"
            className={`w-full ${isLoading ? "cursor-wait" : "cursor-pointer"}`}
            disabled={isLoading || !form.formState.isValid}
          >
            {isLoading ? "Creando cuenta..." : "Crear cuenta"}
          </Button>
        </div>
      </form>
    </Form>
  );
}
