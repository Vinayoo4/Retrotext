import express from 'express';
import cors from 'cors';
import authRoutes from './routes/authRoutes';
import sessionRoutes from './routes/sessionRoutes';
import catalogueRoutes from './routes/catalogueRoutes';
import partiesRoutes from './routes/partiesRoutes';
import expensesRoutes from './routes/expensesRoutes';
import knowledgeRoutes from './routes/knowledgeRoutes';
import missionRoutes from './routes/missionRoutes';

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api', sessionRoutes);
app.use('/api', catalogueRoutes);
app.use('/api', partiesRoutes);
app.use('/api', expensesRoutes);
app.use('/api', knowledgeRoutes);
app.use('/api', missionRoutes);

const seedThemes = [
  { id: "theme-dark", name: "Dark Canvas", colors: { background: "#1e1e1e", text: "#d4d4d4", primary: "#007acc", secondary: "#333333", accent: "#569cd6" } },
  { id: "theme-light", name: "Light Canvas", colors: { background: "#ffffff", text: "#000000", primary: "#005cc5", secondary: "#f6f8fa", accent: "#d73a49" } }
];

app.get('/api/themes', (req, res) => {
  res.json(seedThemes);
});

app.listen(PORT, () => {
  console.log(`Backend server running on http://localhost:${PORT}`);
});
