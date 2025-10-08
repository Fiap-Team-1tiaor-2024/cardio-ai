"use client";

import { useState, useMemo } from "react";
import { useData } from "@/contexts/DataContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  ChevronLeft, 
  ChevronRight, 
  Calendar as CalendarIcon,
  Clock,
  User
} from "lucide-react";

type ViewMode = "day" | "week" | "month";

export default function CalendarioPage() {
  const { agendamentos, pacientes } = useData();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [viewMode, setViewMode] = useState<ViewMode>("month");
  const [showWeekends, setShowWeekends] = useState(true);

  // Helper functions
  const getMonthName = (date: Date) => {
    return date.toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' });
  };

  const getWeekDays = (date: Date, includeWeekends: boolean) => {
    const days = [];
    const startOfWeek = new Date(date);
    startOfWeek.setDate(date.getDate() - date.getDay());

    const daysToShow = includeWeekends ? 7 : 5;
    const startDay = includeWeekends ? 0 : 1;

    for (let i = startDay; i < startDay + daysToShow; i++) {
      const day = new Date(startOfWeek);
      day.setDate(startOfWeek.getDate() + i);
      days.push(day);
    }
    return days;
  };

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    const days = [];
    
    // Add empty cells for days before month starts
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null);
    }
    
    // Add all days in month
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(new Date(year, month, day));
    }
    
    return days;
  };

  const getAgendamentosForDate = (date: Date) => {
    return agendamentos
      .filter(ag => {
        const agDate = new Date(ag.data);
        return agDate.toDateString() === date.toDateString();
      })
      .sort((a, b) => {
        const timeA = a.horario.split(':').map(Number);
        const timeB = b.horario.split(':').map(Number);
        return timeA[0] * 60 + timeA[1] - (timeB[0] * 60 + timeB[1]);
      });
  };

  const getAgendamentosForWeek = (weekDays: Date[]) => {
    const weekAgendamentos = new Map<string, typeof agendamentos>();
    
    weekDays.forEach(day => {
      const dayKey = day.toDateString();
      weekAgendamentos.set(dayKey, getAgendamentosForDate(day));
    });
    
    return weekAgendamentos;
  };

  const handlePrevious = () => {
    const newDate = new Date(currentDate);
    if (viewMode === "day") {
      newDate.setDate(newDate.getDate() - 1);
    } else if (viewMode === "week") {
      newDate.setDate(newDate.getDate() - 7);
    } else {
      newDate.setMonth(newDate.getMonth() - 1);
    }
    setCurrentDate(newDate);
  };

  const handleNext = () => {
    const newDate = new Date(currentDate);
    if (viewMode === "day") {
      newDate.setDate(newDate.getDate() + 1);
    } else if (viewMode === "week") {
      newDate.setDate(newDate.getDate() + 7);
    } else {
      newDate.setMonth(newDate.getMonth() + 1);
    }
    setCurrentDate(newDate);
  };

  const handleToday = () => {
    setCurrentDate(new Date());
  };

  const isToday = (date: Date) => {
    const today = new Date();
    return date.toDateString() === today.toDateString();
  };

  const isSameMonth = (date: Date) => {
    return date.getMonth() === currentDate.getMonth();
  };

  // Render Daily View
  const renderDailyView = () => {
    const dayAgendamentos = getAgendamentosForDate(currentDate);

    return (
      <div className="space-y-4">
        <div className="text-center py-4 bg-blue-50 rounded-lg">
          <h3 className="text-2xl font-bold text-gray-800">
            {currentDate.toLocaleDateString('pt-BR', { 
              weekday: 'long', 
              day: 'numeric', 
              month: 'long',
              year: 'numeric'
            })}
          </h3>
        </div>

        <div className="space-y-2">
          {dayAgendamentos.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              <CalendarIcon className="mx-auto h-12 w-12 mb-2 opacity-30" />
              <p>Nenhum agendamento para este dia</p>
            </div>
          ) : (
            dayAgendamentos.map((ag) => (
              <Card key={ag.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4 flex-1">
                      <div className="flex items-center gap-2 min-w-[80px]">
                        <Clock className="h-4 w-4 text-blue-600" />
                        <span className="font-semibold text-lg">{ag.horario}</span>
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <User className="h-4 w-4 text-gray-600" />
                          <span className="font-medium text-gray-900">{ag.pacienteNome}</span>
                        </div>
                        <div className="text-sm text-gray-600">
                          {ag.tipo} - Dr(a). {ag.medico}
                        </div>
                      </div>
                    </div>
                    <span
                      className={`px-3 py-1 rounded-full text-sm font-medium ${
                        ag.status === "Confirmado"
                          ? "bg-green-100 text-green-800"
                          : ag.status === "Pendente"
                          ? "bg-yellow-100 text-yellow-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {ag.status}
                    </span>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>
    );
  };

  // Render Weekly View
  const renderWeeklyView = () => {
    const weekDays = getWeekDays(currentDate, showWeekends);
    const weekAgendamentos = getAgendamentosForWeek(weekDays);
    const timeSlots = Array.from({ length: 13 }, (_, i) => i + 7); // 7:00 to 19:00

    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="text-lg font-semibold">
            {weekDays[0].toLocaleDateString('pt-BR', { day: 'numeric', month: 'short' })} - {' '}
            {weekDays[weekDays.length - 1].toLocaleDateString('pt-BR', { day: 'numeric', month: 'short', year: 'numeric' })}
          </div>
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={showWeekends}
              onChange={(e) => setShowWeekends(e.target.checked)}
              className="w-4 h-4 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
            />
            <span className="text-sm text-gray-700">Incluir finais de semana</span>
          </label>
        </div>

        <div className="border rounded-lg overflow-hidden">
          <div className="grid grid-cols-[60px_repeat(auto-fit,minmax(0,1fr))] bg-gray-50 border-b">
            <div className="p-2 border-r"></div>
            {weekDays.map((day, idx) => (
              <div
                key={idx}
                className={`p-2 text-center border-r last:border-r-0 ${
                  isToday(day) ? "bg-blue-100 font-bold" : ""
                }`}
              >
                <div className="text-xs text-gray-600">
                  {day.toLocaleDateString('pt-BR', { weekday: 'short' })}
                </div>
                <div className={`text-lg ${isToday(day) ? "text-blue-600" : ""}`}>
                  {day.getDate()}
                </div>
              </div>
            ))}
          </div>

          <div className="max-h-[600px] overflow-y-auto">
            {timeSlots.map((hour) => (
              <div key={hour} className="grid grid-cols-[60px_repeat(auto-fit,minmax(0,1fr))] border-b min-h-[60px]">
                <div className="p-2 border-r bg-gray-50 text-xs text-gray-600 text-right pr-2">
                  {hour}:00
                </div>
                {weekDays.map((day, idx) => {
                  const dayAgendamentos = weekAgendamentos.get(day.toDateString()) || [];
                  const hourAgendamentos = dayAgendamentos.filter(ag => {
                    const agHour = parseInt(ag.horario.split(':')[0]);
                    return agHour === hour;
                  });

                  return (
                    <div key={idx} className="border-r last:border-r-0 p-1">
                      {hourAgendamentos.map((ag) => (
                        <div
                          key={ag.id}
                          className={`text-xs p-2 rounded mb-1 ${
                            ag.status === "Confirmado"
                              ? "bg-green-100 border-l-2 border-green-600"
                              : ag.status === "Pendente"
                              ? "bg-yellow-100 border-l-2 border-yellow-600"
                              : "bg-red-100 border-l-2 border-red-600"
                          }`}
                        >
                          <div className="font-semibold truncate">{ag.horario}</div>
                          <div className="truncate">{ag.pacienteNome}</div>
                        </div>
                      ))}
                    </div>
                  );
                })}
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  // Render Monthly View
  const renderMonthlyView = () => {
    const daysInMonth = getDaysInMonth(currentDate);
    const weekDays = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];

    return (
      <div className="space-y-4">
        <div className="grid grid-cols-7 gap-2 mb-2">
          {weekDays.map((day) => (
            <div key={day} className="text-center font-semibold text-gray-700 py-2">
              {day}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-7 gap-2">
          {daysInMonth.map((day, idx) => {
            if (!day) {
              return <div key={`empty-${idx}`} className="aspect-square"></div>;
            }

            const dayAgendamentos = getAgendamentosForDate(day);
            const hasAgendamentos = dayAgendamentos.length > 0;

            return (
              <div
                key={idx}
                className={`aspect-square border rounded-lg p-2 hover:bg-gray-50 cursor-pointer transition-colors ${
                  isToday(day) ? "border-blue-500 border-2 bg-blue-50" : "border-gray-200"
                } ${!isSameMonth(day) ? "opacity-50" : ""}`}
                onClick={() => {
                  setCurrentDate(day);
                  setViewMode("day");
                }}
              >
                <div className={`text-sm font-semibold mb-1 ${isToday(day) ? "text-blue-600" : "text-gray-700"}`}>
                  {day.getDate()}
                </div>
                <div className="space-y-1">
                  {dayAgendamentos.slice(0, 3).map((ag) => (
                    <div
                      key={ag.id}
                      className={`text-xs px-1 py-0.5 rounded truncate ${
                        ag.status === "Confirmado"
                          ? "bg-green-100 text-green-800"
                          : ag.status === "Pendente"
                          ? "bg-yellow-100 text-yellow-800"
                          : "bg-red-100 text-red-800"
                      }`}
                      title={`${ag.horario} - ${ag.pacienteNome}`}
                    >
                      {ag.horario} {ag.pacienteNome}
                    </div>
                  ))}
                  {dayAgendamentos.length > 3 && (
                    <div className="text-xs text-gray-500 pl-1">
                      +{dayAgendamentos.length - 3} mais
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">Calendário de Agendamentos</h1>
      </div>

      <Card>
        <CardHeader className="border-b">
          <div className="flex items-center justify-between flex-wrap gap-4">
            {/* Navigation Controls */}
            <div className="flex items-center gap-2">
              <Button onClick={handleToday} variant="outline" size="sm">
                Hoje
              </Button>
              <div className="flex items-center gap-1">
                <Button onClick={handlePrevious} variant="outline" size="icon">
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <Button onClick={handleNext} variant="outline" size="icon">
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
              <div className="text-lg font-semibold text-gray-800 min-w-[200px]">
                {viewMode === "month" && getMonthName(currentDate)}
                {viewMode === "week" && getMonthName(currentDate)}
                {viewMode === "day" && getMonthName(currentDate)}
              </div>
            </div>

            {/* View Mode Switcher */}
            <div className="flex items-center gap-1 bg-gray-100 p-1 rounded-lg">
              <Button
                onClick={() => setViewMode("day")}
                variant={viewMode === "day" ? "default" : "ghost"}
                size="sm"
                className={viewMode === "day" ? "" : "hover:bg-gray-200"}
              >
                Diário
              </Button>
              <Button
                onClick={() => setViewMode("week")}
                variant={viewMode === "week" ? "default" : "ghost"}
                size="sm"
                className={viewMode === "week" ? "" : "hover:bg-gray-200"}
              >
                Semanal
              </Button>
              <Button
                onClick={() => setViewMode("month")}
                variant={viewMode === "month" ? "default" : "ghost"}
                size="sm"
                className={viewMode === "month" ? "" : "hover:bg-gray-200"}
              >
                Mensal
              </Button>
            </div>
          </div>
        </CardHeader>

        <CardContent className="p-6">
          {viewMode === "day" && renderDailyView()}
          {viewMode === "week" && renderWeeklyView()}
          {viewMode === "month" && renderMonthlyView()}
        </CardContent>
      </Card>

      {/* Stats Card */}
      <Card>
        <CardHeader>
          <CardTitle>Estatísticas do Período</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <div className="text-sm text-gray-600">Total de Agendamentos</div>
              <div className="text-2xl font-bold">{agendamentos.length}</div>
            </div>
            <div>
              <div className="text-sm text-gray-600">Confirmados</div>
              <div className="text-2xl font-bold text-green-600">
                {agendamentos.filter(a => a.status === "Confirmado").length}
              </div>
            </div>
            <div>
              <div className="text-sm text-gray-600">Pendentes</div>
              <div className="text-2xl font-bold text-yellow-600">
                {agendamentos.filter(a => a.status === "Pendente").length}
              </div>
            </div>
            <div>
              <div className="text-sm text-gray-600">Cancelados</div>
              <div className="text-2xl font-bold text-red-600">
                {agendamentos.filter(a => a.status === "Cancelado").length}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
