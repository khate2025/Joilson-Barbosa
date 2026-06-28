import express from "express";
import path from "path";
import fs from "fs";
import { createServer as createViteServer } from "vite";

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Body parser middlewares
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // Ensure data directory exists
  const DATA_DIR = path.join(process.cwd(), "data");
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }

  const APPOINTMENTS_FILE = path.join(DATA_DIR, "appointments.json");
  const PROVIDERS_FILE = path.join(DATA_DIR, "providers.json");

  // Helper functions to read/write JSON files
  const readData = (filePath: string) => {
    try {
      if (!fs.existsSync(filePath)) {
        return [];
      }
      const data = fs.readFileSync(filePath, "utf-8");
      return JSON.parse(data || "[]");
    } catch (err) {
      console.error(`Error reading ${filePath}:`, err);
      return [];
    }
  };

  const writeData = (filePath: string, data: any) => {
    try {
      fs.writeFileSync(filePath, JSON.stringify(data, null, 2), "utf-8");
      return true;
    } catch (err) {
      console.error(`Error writing to ${filePath}:`, err);
      return false;
    }
  };

  // Seed default data if files are empty/not present
  if (!fs.existsSync(APPOINTMENTS_FILE)) {
    writeData(APPOINTMENTS_FILE, [
      {
        id: "1",
        name: "Carlos Silva",
        email: "carlos.silva@example.com",
        phone: "(11) 98765-4321",
        serviceType: "Residencial",
        date: "2026-07-01",
        message: "Preciso de uma pintura completa na sala de estar e lavabo.",
        createdAt: new Date().toISOString()
      },
      {
        id: "2",
        name: "Ana Oliveira",
        email: "ana.oliveira@example.com",
        phone: "(11) 99888-7766",
        serviceType: "Texturização",
        date: "2026-07-05",
        message: "Gostaria de aplicar grafiato na parede da varanda.",
        createdAt: new Date().toISOString()
      }
    ]);
  }

  if (!fs.existsSync(PROVIDERS_FILE)) {
    writeData(PROVIDERS_FILE, [
      {
        id: "1",
        name: "Marcio Roberto",
        email: "marcio.pinturas@example.com",
        phone: "(11) 97777-5555",
        specialty: "Pintor Geral",
        experience: "8",
        portfolio: "https://instagram.com/marcio_pinturas",
        message: "Especialista em fino acabamento e airless.",
        createdAt: new Date().toISOString()
      },
      {
        id: "2",
        name: "Julio Cesar",
        email: "julio.texturas@example.com",
        phone: "(11) 96666-4444",
        specialty: "Especialista em Fachadas",
        experience: "12",
        portfolio: "Julio Pinturas e Texturas no Google",
        message: "Trabalho em altura com certificação NR35 em dia.",
        createdAt: new Date().toISOString()
      }
    ]);
  }

  // API Route: Get all statistics & list data for our premium database viewer
  app.get("/api/dashboard-data", (req, res) => {
    const appointments = readData(APPOINTMENTS_FILE);
    const providers = readData(PROVIDERS_FILE);
    res.json({
      appointments,
      providers,
      stats: {
        totalAppointments: appointments.length,
        totalProviders: providers.length,
        baseClients: 1250 // Base client stat animates from 1000
      }
    });
  });

  // API Route: Book an appointment
  app.post("/api/appointments", (req, res) => {
    const { name, email, phone, serviceType, date, message } = req.body;

    if (!name || !email || !phone || !serviceType || !date) {
      return res.status(400).json({ error: "Por favor, preencha todos os campos obrigatórios." });
    }

    const appointments = readData(APPOINTMENTS_FILE);
    const newAppointment = {
      id: Math.random().toString(36).substring(2, 9),
      name,
      email,
      phone,
      serviceType,
      date,
      message: message || "",
      createdAt: new Date().toISOString()
    };

    appointments.push(newAppointment);
    if (writeData(APPOINTMENTS_FILE, appointments)) {
      return res.json({ success: true, message: "Agradecemos seu contato!" });
    } else {
      return res.status(500).json({ error: "Erro ao salvar agendamento no banco de dados." });
    }
  });

  // API Route: Register a service provider
  app.post("/api/providers", (req, res) => {
    const { name, email, phone, specialty, experience, portfolio, message } = req.body;

    if (!name || !email || !phone || !specialty || !experience) {
      return res.status(400).json({ error: "Por favor, preencha todos os campos obrigatórios." });
    }

    const providers = readData(PROVIDERS_FILE);
    const newProvider = {
      id: Math.random().toString(36).substring(2, 9),
      name,
      email,
      phone,
      specialty,
      experience,
      portfolio: portfolio || "",
      message: message || "",
      createdAt: new Date().toISOString()
    };

    providers.push(newProvider);
    if (writeData(PROVIDERS_FILE, providers)) {
      return res.json({ success: true, message: "Cadastro de prestador recebido com sucesso!" });
    } else {
      return res.status(500).json({ error: "Erro ao salvar prestador de serviços no banco de dados." });
    }
  });

  // API Route: Reset data to initial seed
  app.post("/api/reset-database", (req, res) => {
    fs.unlinkSync(APPOINTMENTS_FILE);
    fs.unlinkSync(PROVIDERS_FILE);
    return res.json({ success: true, message: "Banco de dados reiniciado para os valores padrão." });
  });

  // Vite integration as middleware for dev, static serving for production
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*all", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Akis Pintura Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
