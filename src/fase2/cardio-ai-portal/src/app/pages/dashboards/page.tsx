import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function DashboardPage() {
  return (
    <div className="grid gap-6 md:grid-cols-3">
      <Card>
        <CardHeader>
          <CardTitle>Pacientes Ativos</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-3xl font-bold">120</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Consultas Hoje</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-3xl font-bold">15</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Taxa de Ocupação</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-3xl font-bold">82%</p>
        </CardContent>
      </Card>
    </div>
  )
}
