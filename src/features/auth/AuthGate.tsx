import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion } from "framer-motion";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useSessionStore } from "@/store/session";

const authSchema = z.object({
  fullName: z.string().min(2, "Please enter your full name"),
  email: z.string().email("Enter a valid work email"),
  password: z.string().min(6, "At least 6 characters")
});

type AuthFields = z.infer<typeof authSchema>;

export const AuthGate = () => {
  const signIn = useSessionStore((state) => state.signIn);
  const form = useForm<AuthFields>({
    resolver: zodResolver(authSchema),
    defaultValues: {
      fullName: "",
      email: "",
      password: ""
    }
  });

  const onSubmit = (values: AuthFields) => {
    signIn({ email: values.email, fullName: values.fullName });
  };

  return (
    <div className="mx-auto max-w-lg">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        <Card className="space-y-6 border-slate-800/40 bg-slate-900/70 shadow-2xl shadow-blue-500/10">
          <div>
            <p className="text-sm uppercase tracking-[0.3em] text-brand-300">
              Tripzy Studio
            </p>
            <h1 className="mt-2 text-3xl font-semibold text-white">
              Sign in to craft your next journey
            </h1>
            <p className="mt-2 text-sm text-slate-400">
              Use your email to access the planner. No passwords are stored — the
              session lives locally for this prototype.
            </p>
          </div>

          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="fullName">Full name</Label>
              <Input
                id="fullName"
                placeholder="E.g. Alex Carter"
                {...form.register("fullName")}
              />
              {form.formState.errors.fullName && (
                <p className="text-sm text-rose-300">
                  {form.formState.errors.fullName.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Work email</Label>
              <Input
                id="email"
                type="email"
                placeholder="alex@brand.com"
                {...form.register("email")}
              />
              {form.formState.errors.email && (
                <p className="text-sm text-rose-300">
                  {form.formState.errors.email.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="•••••••"
                {...form.register("password")}
              />
              {form.formState.errors.password && (
                <p className="text-sm text-rose-300">
                  {form.formState.errors.password.message}
                </p>
              )}
            </div>

            <Button type="submit" className="w-full text-base">
              Enter Tripzy Planner
            </Button>
          </form>
        </Card>
      </motion.div>
    </div>
  );
};


