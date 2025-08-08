
import { useState } from "react";
import { Calendar, Clock, Users, Trash2, Plus, CalendarIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Calendar as CalendarPicker } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { cn } from "@/lib/utils";

const DAYS_OF_WEEK = [
  "Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado"
];

const DEFAULT_HOURS = [
  "09:00", "10:00", "11:00", "12:00", "14:00", "15:00", "16:00", "17:00"
];

export const AdminPanel = () => {
  const [appointments, setAppointments] = useState([
    { id: 1, day: "Lunes", time: "10:00", name: "María García", phone: "555-0123" },
    { id: 2, day: "Martes", time: "15:00", name: "Juan Pérez", phone: "555-0456" },
    { id: 3, day: "Miércoles", time: "11:00", name: "Ana López", phone: "555-0789" },
  ]);

  const [workingDays, setWorkingDays] = useState({
    Lunes: true,
    Martes: true,
    Miércoles: true,
    Jueves: true,
    Viernes: true,
    Sábado: false,
  });

  // Horarios bloqueados por fecha específica: { "2025-01-14": ["12:00", "13:00"] }
  const [blockedHours, setBlockedHours] = useState<Record<string, string[]>>({});
  
  const [selectedDate, setSelectedDate] = useState<Date | undefined>();

  const { toast } = useToast();

  const handleDeleteAppointment = (id: number) => {
    setAppointments(prev => prev.filter(apt => apt.id !== id));
    toast({
      title: "Cita eliminada",
      description: "La cita ha sido cancelada exitosamente.",
    });
  };

  const toggleWorkingDay = (day: string) => {
    setWorkingDays(prev => ({
      ...prev,
      [day]: !prev[day]
    }));
    toast({
      title: "Horario actualizado",
      description: `${day} ${!workingDays[day] ? "habilitado" : "deshabilitado"} para citas.`,
    });
  };

  const toggleBlockedHour = (hour: string) => {
    if (!selectedDate) {
      toast({
        title: "Error",
        description: "Selecciona una fecha primero.",
        variant: "destructive",
      });
      return;
    }

    const dateKey = format(selectedDate, "yyyy-MM-dd");
    const currentBlocked = blockedHours[dateKey] || [];
    
    if (currentBlocked.includes(hour)) {
      // Remover hora bloqueada
      setBlockedHours(prev => ({
        ...prev,
        [dateKey]: currentBlocked.filter(h => h !== hour)
      }));
      toast({
        title: "Horario habilitado",
        description: `Horario ${hour} habilitado para ${format(selectedDate, "dd/MM/yyyy")}.`,
      });
    } else {
      // Agregar hora bloqueada
      setBlockedHours(prev => ({
        ...prev,
        [dateKey]: [...currentBlocked, hour]
      }));
      toast({
        title: "Horario bloqueado",
        description: `Horario ${hour} bloqueado para ${format(selectedDate, "dd/MM/yyyy")}.`,
      });
    }
  };

  const isHourBlocked = (hour: string): boolean => {
    if (!selectedDate) return false;
    const dateKey = format(selectedDate, "yyyy-MM-dd");
    return blockedHours[dateKey]?.includes(hour) || false;
  };

  return (
    <div className="space-y-8">
      {/* Resumen */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-blue-100 rounded-full">
                <Calendar className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{appointments.length}</p>
                <p className="text-gray-600">Citas Agendadas</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-green-100 rounded-full">
                <Clock className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">
                  {DEFAULT_HOURS.length}
                </p>
                <p className="text-gray-600">Horarios Activos</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-purple-100 rounded-full">
                <Users className="h-6 w-6 text-purple-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">
                  {Object.values(workingDays).filter(Boolean).length}
                </p>
                <p className="text-gray-600">Días Laborales</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Gestión de días laborales */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Calendar className="h-5 w-5" />
            <span>Días Laborales</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {DAYS_OF_WEEK.map((day) => (
              <div key={day} className="flex items-center justify-between p-4 border rounded-lg">
                <Label htmlFor={`day-${day}`} className="text-lg">{day}</Label>
                <Switch
                  id={`day-${day}`}
                  checked={workingDays[day]}
                  onCheckedChange={() => toggleWorkingDay(day)}
                />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Gestión de horarios por fecha específica */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Clock className="h-5 w-5" />
            <span>Bloquear Horarios por Fecha</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Selector de fecha */}
          <div className="flex flex-col space-y-2">
            <Label>Seleccionar fecha:</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-[240px] justify-start text-left font-normal",
                    !selectedDate && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {selectedDate ? format(selectedDate, "dd/MM/yyyy", { locale: es }) : "Seleccionar fecha"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <CalendarPicker
                  mode="single"
                  selected={selectedDate}
                  onSelect={setSelectedDate}
                  initialFocus
                  className="p-3 pointer-events-auto"
                  locale={es}
                />
              </PopoverContent>
            </Popover>
          </div>

          {/* Horarios disponibles para la fecha seleccionada */}
          {selectedDate && (
            <div>
              <Label className="text-base font-semibold mb-4 block">
                Horarios para {format(selectedDate, "dd/MM/yyyy", { locale: es })}:
              </Label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {DEFAULT_HOURS.map((hour) => (
                  <div key={hour} className="flex items-center justify-between p-4 border rounded-lg">
                    <Label className="text-lg">{hour}</Label>
                    <Switch
                      checked={!isHourBlocked(hour)}
                      onCheckedChange={() => toggleBlockedHour(hour)}
                    />
                  </div>
                ))}
              </div>
              {blockedHours[format(selectedDate, "yyyy-MM-dd")]?.length > 0 && (
                <div className="mt-4 p-4 bg-red-50 rounded-lg">
                  <p className="text-sm text-red-700">
                    <strong>Horarios bloqueados:</strong> {blockedHours[format(selectedDate, "yyyy-MM-dd")].join(", ")}
                  </p>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Lista de citas */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Users className="h-5 w-5" />
            <span>Citas Programadas</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {appointments.length === 0 ? (
            <p className="text-center text-gray-500 py-8">
              No hay citas programadas
            </p>
          ) : (
            <div className="space-y-4">
              {appointments.map((appointment) => (
                <div key={appointment.id} className="flex items-center justify-between p-4 border rounded-lg bg-gray-50">
                  <div className="flex items-center space-x-4">
                    <Badge variant="outline" className="text-sm">
                      {appointment.day}
                    </Badge>
                    <Badge variant="outline" className="text-sm">
                      {appointment.time}
                    </Badge>
                    <div>
                      <p className="font-semibold">{appointment.name}</p>
                      <p className="text-gray-600">{appointment.phone}</p>
                    </div>
                  </div>
                  <Button
                    onClick={() => handleDeleteAppointment(appointment.id)}
                    variant="destructive"
                    size="sm"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
