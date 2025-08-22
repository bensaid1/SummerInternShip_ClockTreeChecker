import React from "react";
import {
  PieChart, Pie, Cell, Tooltip, BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Legend, LabelList
} from "recharts";
import { Box, Typography, Paper, Chip, Stack } from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import ErrorIcon from "@mui/icons-material/Error";
import InsertChartIcon from "@mui/icons-material/InsertChart";

const COLORS = ["#5443a0ff", "#f44336"];
const GRADIENTS = [
  { id: "validGradient", from: "#43e97b", to: "#38f9d7" },
  { id: "invalidGradient", from: "#f85032", to: "#e73827" },
];

type StatProps = {
  results: { fileName: string; valid: boolean; errors: string[] }[];
};

const ValidationStats: React.FC<StatProps> = ({ results }) => {
  const validCount = results.filter(r => r.valid).length;
  const invalidCount = results.length - validCount;
  const total = results.length;
  const successRate = total ? ((validCount / total) * 100).toFixed(1) : "0";

  // Erreurs fréquentes
  const errorMap: Record<string, number> = {};
  results.forEach(r => r.errors.forEach(e => { errorMap[e] = (errorMap[e] || 0) + 1; }));
  const topErrors = Object.entries(errorMap)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([error, count]) => ({ error, count }));

  return (
    <Paper
      elevation={8}
      sx={{
        p: 4,
        borderRadius: 4,
        mt: 4,
        background: "linear-gradient(135deg, #f5fafd 60%, #e3f2fd 100%)",
        boxShadow: "0 8px 32px 0 rgba(25,118,210,0.10)",
      }}
    >
      <Stack direction="row" alignItems="center" gap={1} mb={2}>
        <InsertChartIcon color="primary" sx={{ fontSize: 32 }} />
        <Typography variant="h5" fontWeight={800} color="primary">
          Validation Statistics
        </Typography>
      </Stack>
      <Box display="flex" gap={4} flexWrap="wrap" alignItems="flex-start">
        <Box>
          <Typography fontWeight={600} mb={1} color="success.main">
            Valid / Invalid
          </Typography>
          <ResponsiveContainer width={220} height={220}>
            <PieChart>
              <defs>
                <linearGradient id="validGradient" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0%" stopColor="#43e97b" />
                  <stop offset="100%" stopColor="#38f9d7" />
                </linearGradient>
                <linearGradient id="invalidGradient" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0%" stopColor="#fa9c8cff" />
                  <stop offset="100%" stopColor="#fc1b07ff" />
                </linearGradient>
              </defs>
             <Pie
  data={[
    { name: "Valid", value: validCount },
    { name: "Invalid", value: invalidCount }
  ]}
  dataKey="value"
  cx="50%"
  cy="50%"
  outerRadius={80}
  innerRadius={50}
  label={({ percent }) => percent !== undefined ? `${(percent * 100).toFixed(0)}%` : ""}
  isAnimationActive
  animationDuration={1200}
>
  <Cell fill="url(#validGradient)" />
  <Cell fill="url(#invalidGradient)" />
</Pie>
              <Legend />
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
          <Stack direction="row" gap={1} justifyContent="center" mt={2}>
            <Chip
              icon={<CheckCircleIcon />}
              label={`Valid: ${validCount}`}
              color="success"
              sx={{ fontWeight: 700, fontSize: 15 }}
            />
            <Chip
              icon={<ErrorIcon />}
              label={`Invalid: ${invalidCount}`}
              color="error"
              sx={{ fontWeight: 700, fontSize: 15 }}
            />
          </Stack>
        </Box>
        <Box flex={1} minWidth={220}>
          <Typography fontWeight={600} mb={1} color="error.main">
            Top 5 Errors
          </Typography>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={topErrors} barCategoryGap={20}>
              <XAxis dataKey="error" tick={{ fontSize: 11 }} />
              <YAxis allowDecimals={false} />
              <Bar
                dataKey="count"
                fill="url(#invalidGradient)"
                isAnimationActive
                animationDuration={1200}
                radius={[8, 8, 0, 0]}
              >
                <LabelList dataKey="count" position="top" fontSize={12} />
              </Bar>
              <Tooltip />
            </BarChart>
          </ResponsiveContainer>
        </Box>
      </Box>
      <Box mt={3} textAlign="center">
        <Chip
          label={`Total files: ${total}`}
          color="primary"
          sx={{ fontWeight: 700, fontSize: 15, mx: 1 }}
        />
        <Chip
          label={`Success rate: ${successRate}%`}
          color="success"
          sx={{ fontWeight: 700, fontSize: 15, mx: 1 }}
        />
      </Box>
    </Paper>
  );
};

export default ValidationStats;