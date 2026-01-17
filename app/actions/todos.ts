'use server'

import db from '@/lib/db';
import { todos } from '@/lib/schema';
import { eq, and } from 'drizzle-orm';
import { getSessionId } from '@/lib/session';
import { revalidatePath } from 'next/cache';

export async function addTodo(formData: FormData) {
  const title = formData.get('title') as string;
  const userIdStr = await getSessionId();

  if (!title || !userIdStr) return;

  const userId = parseInt(userIdStr);

  await db.insert(todos).values({
    title,
    userId,
  });

  revalidatePath('/dashboard');
}

export async function toggleTodo(id: number, completed: boolean) {
  const userIdStr = await getSessionId();
  if (!userIdStr) return;

  const userId = parseInt(userIdStr);

  await db
    .update(todos)
    .set({ completed: !completed })
    .where(and(eq(todos.id, id), eq(todos.userId, userId)));

  revalidatePath('/dashboard');
}

export async function deleteTodo(id: number) {
  const userIdStr = await getSessionId();
  if (!userIdStr) return;

  const userId = parseInt(userIdStr);

  await db
    .delete(todos)
    .where(and(eq(todos.id, id), eq(todos.userId, userId)));

  revalidatePath('/dashboard');
}

