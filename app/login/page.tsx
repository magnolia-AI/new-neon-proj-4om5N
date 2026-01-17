'use client'

import { useState, useActionState } from 'react';
import { loginAction, registerAction } from '@/app/actions/auth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
import { Label } from '@/components/ui/label';

export default function LoginPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [loginState, loginActionFn, loginPending] = useActionState(loginAction, null);
  const [registerState, registerActionFn, registerPending] = useActionState(registerAction, null);

  const state = isLogin ? loginState : registerState;
  const isPending = isLogin ? loginPending : registerPending;

  return (
    <div className="flex items-center justify-center min-h-screen bg-muted/40 p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>{isLogin ? 'Login' : 'Create Account'}</CardTitle>
        </CardHeader>
        <form action={isLogin ? loginActionFn : registerActionFn}>
          <CardContent className="space-y-4">
            {!isLogin && (
              <div className="space-y-2">
                <Label htmlFor="name">Name</Label>
                <Input id="name" name="name" placeholder="John Doe" required />
              </div>
            )}
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" name="email" type="email" placeholder="john@example.com" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input id="password" name="password" type="password" required />
            </div>
            {state?.error && (
              <p className="text-sm text-destructive">{state.error}</p>
            )}
          </CardContent>
          <CardFooter className="flex flex-col gap-4">
            <Button className="w-full" disabled={isPending}>
              {isPending 
                ? (isLogin ? 'Logging in...' : 'Registering...') 
                : (isLogin ? 'Login' : 'Register')}
            </Button>
            <Button
              type="button"
              variant="link"
              onClick={() => setIsLogin(!isLogin)}
              className="text-sm"
            >
              {isLogin ? "Don't have an account? Sign up" : 'Already have an account? Login'}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}

