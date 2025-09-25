"use client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const router = useRouter();

  const handleClick = () => {
    router.push('pages/dashboards');
  };

  return (
    <main className="flex items-center justify-center h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-2xl shadow-md w-full max-w-md">
        <h1 className="text-3xl font-bold mb-6 text-center">CardioIA</h1>
        <form className="space-y-4">
          <Input type="email" placeholder="Email" />
          <Input type="password" placeholder="Senha" />
          <Button className="w-full" onClick={handleClick}>Entrar</Button>
        </form>
      </div>
    </main>
  )
}