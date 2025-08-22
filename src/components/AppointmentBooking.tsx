
import { useState } from "react";
import { ChevronLeft, ChevronRight, Clock, User, Phone, CalendarIcon, Tag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { format, addDays, startOfWeek, isSameDay } from "date-fns";
import { es } from "date-fns/locale";
import { cn } from "@/lib/utils";

const DAYS_OF_WEEK = [
  "Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado"
];

const DEFAULT_HOURS = [
  "09:00", "10:00", "11:00", "12:00", "14:00", "15:00", "16:00", "17:00"
];

// Servicios disponibles (en una app real vendría del backend)
const AVAILABLE_SERVICES = [
  "Corte común",
  "Corte y cejas", 
  "Corte, cejas y barba",
  "Tinte",
  "Otro"
];

export const AppointmentBooking = () => {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>();
  const [selectedHour, setSelectedHour] = useState("");
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [selectedService, setSelectedService] = useState("");
  const [step, setStep] = useState(1); // 1: seleccionar fecha/hora, 2: datos personales, 3: confirmación
  const [useCalendar, setUseCalendar] = useState(false);
  const { toast } = useToast();

  // Para navegación por días de la semana
  const [currentDayIndex, setCurrentDayIndex] = useState(0);
  
  // Generar fechas de la semana actual
  const getWeekDates = () => {
    const today = new Date();
    const startOfCurrentWeek = startOfWeek(today, { weekStartsOn: 1 }); // Lunes
    return DAYS_OF_WEEK.map((_, index) => addDays(startOfCurrentWeek, index));
  };
  
  const weekDates = getWeekDates();
  const currentSelectedDate = useCalendar ? selectedDate : weekDates[currentDayIndex];

  // Simulamos horarios disponibles (en una app real vendría del backend)
  const getAvailableHours = (date: Date | undefined) => {
    if (!date) return [];
    // Por simplicidad, algunos horarios están "ocupados" según el día
    const dayOfWeek = date.getDay();
    const busyHours = dayOfWeek === 1 ? ["10:00", "15:00"] : dayOfWeek === 2 ? ["09:00", "16:00"] : [];
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
    if (step === 1 && selectedHour && currentSelectedDate) {
      setStep(2);
    } else if (step === 2 && fullName && phone && selectedService) {
      setStep(3);
    }
  };

  const handleConfirmAppointment = () => {
    if (!currentSelectedDate) return;
    
    // Aquí se guardaría la cita en el backend
    toast({
      title: "¡Cita agendada!",
      description: `Tu cita para el ${format(currentSelectedDate, "EEEE dd/MM/yyyy", { locale: es })} a las ${selectedHour} ha sido confirmada.`,
    });
    
    // Resetear formulario
    setStep(1);
    setSelectedHour("");
    setFullName("");
    setPhone("");
    setSelectedService("");
    setSelectedDate(undefined);
    setCurrentDayIndex(0);
    setUseCalendar(false);
  };

  const availableHours = getAvailableHours(currentSelectedDate);

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
                  {currentSelectedDate && format(currentSelectedDate, "EEEE dd/MM/yyyy", { locale: es })} a las {selectedHour}
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
            <div className="flex items-center space-x-3">
              <Tag className="h-6 w-6 text-green-600" />
              <p className="text-lg">{selectedService}</p>
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
            Cita: {currentSelectedDate && format(currentSelectedDate, "EEEE dd/MM/yyyy", { locale: es })} a las {selectedHour}
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
          
          <div className="space-y-2">
            <Label htmlFor="service" className="text-lg font-semibold">
              Servicio Requerido
            </Label>
            <Select value={selectedService} onValueChange={setSelectedService}>
              <SelectTrigger className="text-lg p-4 h-14">
                <SelectValue placeholder="Selecciona un servicio" />
              </SelectTrigger>
              <SelectContent>
                {AVAILABLE_SERVICES.map((service) => (
                  <SelectItem key={service} value={service} className="text-lg">
                    {service}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
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
              disabled={!fullName || !phone || !selectedService}
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
        {/* Alternar entre navegación por días y calendario */}
        <div className="flex justify-center space-x-4">
          <Button
            onClick={() => setUseCalendar(false)}
            variant={!useCalendar ? "default" : "outline"}
            size="lg"
          >
            Navegar por Días
          </Button>
          <Button
            onClick={() => setUseCalendar(true)}
            variant={useCalendar ? "default" : "outline"}
            size="lg"
          >
            <CalendarIcon className="h-5 w-5 mr-2" />
            Usar Calendario
          </Button>
        </div>

        {/* Selector de fecha */}
        {useCalendar ? (
          <div className="space-y-4">
            <Label className="text-xl font-semibold block text-center">
              Selecciona una Fecha
            </Label>
            <div className="flex justify-center">
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-[300px] justify-start text-left font-normal text-lg h-14",
                      !selectedDate && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-5 w-5" />
                    {selectedDate ? format(selectedDate, "EEEE dd/MM/yyyy", { locale: es }) : "Selecciona una fecha"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="center">
                  <Calendar
                    mode="single"
                    selected={selectedDate}
                    onSelect={setSelectedDate}
                    initialFocus
                    className="p-3 pointer-events-auto"
                    locale={es}
                    disabled={(date) => date < new Date() || date.getDay() === 0}
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>
        ) : (
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
              
              <div className="bg-blue-50 px-8 py-4 rounded-lg min-w-[240px] text-center">
                <p className="text-xl font-bold text-blue-700">
                  {DAYS_OF_WEEK[currentDayIndex]}
                </p>
                <p className="text-sm text-blue-600">
                  {format(weekDates[currentDayIndex], "dd/MM/yyyy")}
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
        )}

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
          disabled={!selectedHour || !currentSelectedDate}
          size="lg"
          className="w-full h-16 text-lg"
        >
          Continuar
        </Button>
      </CardContent>
    </Card>
  );
};
