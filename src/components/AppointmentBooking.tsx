
import { useState } from "react";
import { ChevronLeft, ChevronRight, Clock, User, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";

const DAYS_OF_WEEK = [
  "Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado"
];

const DEFAULT_HOURS = [
  "09:00", "10:00", "11:00", "12:00", "14:00", "15:00", "16:00", "17:00"
];

export const AppointmentBooking = () => {
  const [currentDayIndex, setCurrentDayIndex] = useState(0);
  const [selectedHour, setSelectedHour] = useState("");
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [step, setStep] = useState(1); // 1: seleccionar día/hora, 2: datos personales, 3: confirmación
  const { toast } = useToast();

  // Simulamos horarios disponibles (en una app real vendría del backend)
  const getAvailableHours = (dayIndex: number) => {
    // Por simplicidad, algunos horarios están "ocupados"
    const busyHours = dayIndex === 0 ? ["10:00", "15:00"] : dayIndex === 1 ? ["09:00", "16:00"] : [];
    return DEFAULT_HOURS.filter(hour => !busyHours.includes(hour));
  };

  const handlePreviousDay = () => {
    setCurrentDayIndex(prev => prev > 0 ? prev - 1 : DAYS_OF_WEEK.length - 1);
    setSelectedHour("");
  };

  const handleNextDay = () => {
    setCurrentDayIndex(prev => prev < DAYS_OF_WEEK.length - 1 ? prev + 1 : 0);
    setSelectedHour("");
  };

  const handleContinue = () => {
    if (step === 1 && selectedHour) {
      setStep(2);
    } else if (step === 2 && fullName && phone) {
      setStep(3);
    }
  };

  const handleConfirmAppointment = () => {
    // Aquí se guardaría la cita en el backend
    toast({
      title: "¡Cita agendada!",
      description: `Tu cita para el ${DAYS_OF_WEEK[currentDayIndex]} a las ${selectedHour} ha sido confirmada.`,
    });
    
    // Resetear formulario
    setStep(1);
    setSelectedHour("");
    setFullName("");
    setPhone("");
    setCurrentDayIndex(0);
  };

  const availableHours = getAvailableHours(currentDayIndex);

  if (step === 3) {
    return (
      <Card className="max-w-2xl mx-auto">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl text-green-600">
            Confirmar Cita
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="bg-green-50 p-6 rounded-lg space-y-4">
            <div className="flex items-center space-x-3">
              <Clock className="h-6 w-6 text-green-600" />
              <div>
                <p className="text-lg font-semibold">
                  {DAYS_OF_WEEK[currentDayIndex]} a las {selectedHour}
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <User className="h-6 w-6 text-green-600" />
              <p className="text-lg">{fullName}</p>
            </div>
            <div className="flex items-center space-x-3">
              <Phone className="h-6 w-6 text-green-600" />
              <p className="text-lg">{phone}</p>
            </div>
          </div>
          
          <div className="flex space-x-4">
            <Button
              onClick={() => setStep(2)}
              variant="outline"
              size="lg"
              className="flex-1"
            >
              Volver
            </Button>
            <Button
              onClick={handleConfirmAppointment}
              size="lg"
              className="flex-1 bg-green-600 hover:bg-green-700"
            >
              Confirmar Cita
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (step === 2) {
    return (
      <Card className="max-w-2xl mx-auto">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">
            Tus Datos
          </CardTitle>
          <p className="text-gray-600">
            Cita: {DAYS_OF_WEEK[currentDayIndex]} a las {selectedHour}
          </p>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="fullName" className="text-lg font-semibold">
              Nombre Completo
            </Label>
            <Input
              id="fullName"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="Escribe tu nombre completo"
              className="text-lg p-4 h-14"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="phone" className="text-lg font-semibold">
              Teléfono
            </Label>
            <Input
              id="phone"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="Escribe tu número de teléfono"
              className="text-lg p-4 h-14"
            />
          </div>
          
          <div className="flex space-x-4">
            <Button
              onClick={() => setStep(1)}
              variant="outline"
              size="lg"
              className="flex-1"
            >
              Volver
            </Button>
            <Button
              onClick={handleContinue}
              disabled={!fullName || !phone}
              size="lg"
              className="flex-1"
            >
              Continuar
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader className="text-center">
        <CardTitle className="text-2xl">
          Selecciona tu Cita
        </CardTitle>
        <p className="text-gray-600">
          Elige el día y la hora que mejor te convenga
        </p>
      </CardHeader>
      <CardContent className="space-y-8">
        {/* Selector de día */}
        <div className="space-y-4">
          <Label className="text-xl font-semibold block text-center">
            Día de la Semana
          </Label>
          <div className="flex items-center justify-center space-x-4">
            <Button
              onClick={handlePreviousDay}
              variant="outline"
              size="lg"
              className="p-4"
            >
              <ChevronLeft className="h-6 w-6" />
            </Button>
            
            <div className="bg-blue-50 px-8 py-4 rounded-lg min-w-[200px] text-center">
              <p className="text-2xl font-bold text-blue-700">
                {DAYS_OF_WEEK[currentDayIndex]}
              </p>
            </div>
            
            <Button
              onClick={handleNextDay}
              variant="outline"
              size="lg"
              className="p-4"
            >
              <ChevronRight className="h-6 w-6" />
            </Button>
          </div>
        </div>

        {/* Selector de hora */}
        <div className="space-y-4">
          <Label className="text-xl font-semibold block text-center">
            Horario Disponible
          </Label>
          <div className="grid grid-cols-2 gap-3">
            {availableHours.map((hour) => (
              <Button
                key={hour}
                onClick={() => setSelectedHour(hour)}
                variant={selectedHour === hour ? "default" : "outline"}
                size="lg"
                className="h-16 text-lg"
              >
                <Clock className="h-5 w-5 mr-2" />
                {hour}
              </Button>
            ))}
          </div>
          
          {availableHours.length === 0 && (
            <p className="text-center text-gray-500 py-8">
              No hay horarios disponibles para este día.
              Prueba con otro día.
            </p>
          )}
        </div>

        <Button
          onClick={handleContinue}
          disabled={!selectedHour}
          size="lg"
          className="w-full h-16 text-lg"
        >
          Continuar
        </Button>
      </CardContent>
    </Card>
  );
};
