
import { useState } from "react";
import { Calendar, Clock, User, Settings } from "lucide-react";
import { AppointmentBooking } from "@/components/AppointmentBooking";
import { AdminPanel } from "@/components/AdminPanel";
import { Button } from "@/components/ui/button";

const Index = () => {
  const [isAdminMode, setIsAdminMode] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-green-50">
      <header className="bg-white shadow-sm border-b border-blue-100">
        <div className="max-w-4xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="p-3 bg-blue-100 rounded-full">
                <Calendar className="h-8 w-8 text-blue-600" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-800">
                  Barber Shop
                </h1>
                <p className="text-lg text-gray-600">
                  Agenda tu cita fácilmente
                </p>
              </div>
            </div>
            <Button
              onClick={() => setIsAdminMode(!isAdminMode)}
              variant={isAdminMode ? "default" : "outline"}
              size="lg"
              className="flex items-center space-x-2"
            >
              <Settings className="h-5 w-5" />
              <span>{isAdminMode ? "Modo Cliente" : "Administración"}</span>
            </Button>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-8">
        {isAdminMode ? <AdminPanel /> : <AppointmentBooking />}
      </main>

      <footer className="mt-16 bg-white border-t border-blue-100">
        <div className="max-w-4xl mx-auto px-4 py-6 text-center">
          <p className="text-gray-600">
            Agenda de citas a tu barbería facilmente
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
