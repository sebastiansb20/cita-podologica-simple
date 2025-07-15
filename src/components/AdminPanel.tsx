
import { useState } from "react";
import { Calendar, Clock, Users, Trash2, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";

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

  const [workingHours, setWorkingHours] = useState({
    "09:00": true,
    "10:00": true,
    "11:00": true,
    "12:00": true,
    "14:00": true,
    "15:00": true,
    "16:00": true,
    "17:00": true,
  });

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

  const toggleWorkingHour = (hour: string) => {
    setWorkingHours(prev => ({
      ...prev,
      [hour]: !prev[hour]
    }));
    toast({
      title: "Horario actualizado",
      description: `Horario ${hour} ${!workingHours[hour] ? "habilitado" : "deshabilitado"}.`,
    });
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
                  {Object.values(workingHours).filter(Boolean).length}
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

      {/* Gestión de horarios */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Clock className="h-5 w-5" />
            <span>Horarios Disponibles</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {DEFAULT_HOURS.map((hour) => (
              <div key={hour} className="flex items-center justify-between p-4 border rounded-lg">
                <Label htmlFor={`hour-${hour}`} className="text-lg">{hour}</Label>
                <Switch
                  id={`hour-${hour}`}
                  checked={workingHours[hour]}
                  onCheckedChange={() => toggleWorkingHour(hour)}
                />
              </div>
            ))}
          </div>
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
