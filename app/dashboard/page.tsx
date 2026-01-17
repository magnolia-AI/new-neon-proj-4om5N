import db from '@/lib/db';
import { todos, users } from '@/lib/schema';
import { eq, desc } from 'drizzle-orm';
import { getSessionId } from '@/lib/session';
import { redirect } from 'next/navigation';
import { logoutAction } from '@/app/actions/auth';
import { addTodo, toggleTodo, deleteTodo } from '@/app/actions/todos';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Trash2, LogOut } from 'lucide-react';

export default async function DashboardPage() {
  const userIdStr = await getSessionId();
  if (!userIdStr) redirect('/login');

  const userId = parseInt(userIdStr);
  
  const [user] = await db.select().from(users).where(eq(users.id, userId)).limit(1);
  const userTodos = await db
    .select()
    .from(todos)
    .where(eq(todos.userId, userId))
    .orderBy(desc(todos.createdAt));

  return (
    <div className="min-h-screen bg-muted/40 p-4 md:p-8">
      <div className="max-w-2xl mx-auto space-y-8">
        <header className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">My Todos</h1>
            <p className="text-muted-foreground">Welcome back, {user?.name || 'User'}</p>
          </div>
          <form action={logoutAction}>
            <Button variant="ghost" size="icon">
              <LogOut className="h-5 w-5" />
            </Button>
          </form>
        </header>

        <Card>
          <CardHeader>
            <CardTitle>Add Task</CardTitle>
          </CardHeader>
          <CardContent>
            <form action={addTodo} className="flex gap-2">
              <Input name="title" placeholder="What needs to be done?" required />
              <Button type="submit">Add</Button>
            </form>
          </CardContent>
        </Card>

        <div className="space-y-4">
          {userTodos.length === 0 ? (
            <p className="text-center text-muted-foreground py-12">No tasks yet. Add one above!</p>
          ) : (
            userTodos.map((todo) => (
              <Card key={todo.id}>
                <CardContent className="p-4 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <form action={toggleTodo.bind(null, todo.id, todo.completed)}>
                      <Checkbox 
                        checked={todo.completed} 
                        onCheckedChange={(checked) => {
                          // This is a server component, so we use the form action
                          // In a full client app, we'd handle this differently
                        }}
                        type="submit"
                      />
                    </form>
                    <span className={todo.completed ? 'line-through text-muted-foreground' : ''}>
                      {todo.title}
                    </span>
                  </div>
                  <form action={deleteTodo.bind(null, todo.id)}>
                    <Button variant="ghost" size="icon" className="text-destructive">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </form>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

