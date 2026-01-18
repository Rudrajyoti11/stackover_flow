"use client";

import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { DefaultValues, FieldValues, Path, SubmitHandler, useForm } from "react-hook-form";
import { ZodType } from "zod";
import { Eye, EyeOff } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import ROUTES from "@/constants/routes";
import { toast } from "sonner";

/* ---------- TYPES ---------- */
interface ActionResponse {
  success: boolean;
  status?: number;
  error?: {
    message?: string;
  };
}

interface AuthFormProps<T extends FieldValues> {
  schema: ZodType<T>;
  defaultValues: T;
  onSubmit: (data: T) => Promise<ActionResponse>;
  formType: "SIGN_IN" | "SIGN_UP";
}

/* ---------- COMPONENT ---------- */
function AuthForm<T extends FieldValues>({ schema, defaultValues, formType, onSubmit }: AuthFormProps<T>) {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);

  const form = useForm<T>({
    resolver: zodResolver(schema),
    defaultValues: defaultValues as DefaultValues<T>,
  });

  const handleSubmit: SubmitHandler<FieldValues> = async (data) => {
    const result = await onSubmit(data as T);

    if (result?.success) {
      toast.success(formType === "SIGN_IN" ? "Signed in successfully" : "Signed up successfully");
      router.push(ROUTES.HOME);
    } else {
      toast.error(result?.error?.message ?? "Something went wrong");
    }
  };

  const buttonText = formType === "SIGN_IN" ? "Sign In" : "Sign Up";

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="mt-10 space-y-6">
        {Object.keys(defaultValues).map((key) => (
          <FormField
            key={key}
            control={form.control}
            name={key as Path<T>}
            render={({ field }) => (
              <FormItem className="flex w-full flex-col gap-2.5">
                <FormLabel>
                  {field.name === "email" ? "Email Address" : field.name.charAt(0).toUpperCase() + field.name.slice(1)}
                </FormLabel>

                <FormControl>
                  <div className="relative">
                    <Input
                      {...field}
                      required
                      type={field.name === "password" && !showPassword ? "password" : "text"}
                      className="pr-10"
                    />

                    {field.name === "password" && (
                      <button
                        type="button"
                        aria-label={showPassword ? "Hide password" : "Show password"}
                        onClick={() => setShowPassword((prev) => !prev)}
                        className="text-muted-foreground absolute top-1/2 right-3 -translate-y-1/2"
                      >
                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    )}
                  </div>
                </FormControl>

                <FormMessage />
              </FormItem>
            )}
          />
        ))}

        <Button type="submit" disabled={form.formState.isSubmitting} className="w-full">
          {form.formState.isSubmitting ? (buttonText === "Sign In" ? "Signing In..." : "Signing Up...") : buttonText}
        </Button>

        {formType === "SIGN_IN" ? (
          <p className="text-sm">
            Don&apos;t have an account?{" "}
            <Link href={ROUTES.SIGN_UP} className="font-medium underline">
              Sign up
            </Link>
          </p>
        ) : (
          <p className="text-sm">
            Already have an account?{" "}
            <Link href={ROUTES.SIGN_IN} className="font-medium underline">
              Sign in
            </Link>
          </p>
        )}
      </form>
    </Form>
  );
}

export default AuthForm;
