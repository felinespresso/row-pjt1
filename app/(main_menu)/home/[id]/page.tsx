"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { LoadingUI } from "@/app/_components/loading-ui/load";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Cell,
} from "recharts";
import { useParams, useRouter } from "next/navigation";

interface DashboardStats {
  identifikasi: number;
  sosialisasi: number;
  inventarisasi: number;
  pengumuman: number;
  musyawarah: number;
  pemberkasan: number;
  pembayaran: number;
  penebangan: number;
}

export default function Home() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const { id } = useParams();

  useEffect(() => {
    if (!id) {
      router.push("/dashboard");
      return;
    }

    // console.log(id)

    const fetchStats = async () => {
      try {
        const response = await fetch(`/api/dashboard-stats?id=${id}`);
        if (!response.ok) {
          throw new Error("Failed to fetch stats");
        }
        const data = await response.json();
        setStats(data);
      } catch (error) {
        console.error("Error fetching stats:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, [id, router]);

  const chartData = stats
    ? [
        {
          name: "Identifikasi Awal",
          jumlah: stats.identifikasi,
          color: "#A7E6FF",
        },
        { name: "Sosialisasi", jumlah: stats.sosialisasi, color: "#82CFFF" },
        {
          name: "Inventarisasi",
          jumlah: stats.inventarisasi,
          color: "#3ABEF9",
        },
        {
          name: "Pengumuman Hasil\nInventarisasi",
          jumlah: stats.pengumuman,
          color: "#65A6DC",
        },
        { name: "Musyawarah", jumlah: stats.musyawarah, color: "#3572EF" },
        { name: "Pemberkasan", jumlah: stats.pemberkasan, color: "#2D40E8" },
        { name: "Pembayaran", jumlah: stats.pembayaran, color: "#000DFFFF" },
        { name: "Penebangan", jumlah: stats.penebangan, color: "#010ABCFF" },
      ]
    : [];

  const yAxisMax =
    Math.ceil((Math.max(...chartData.map((item) => item.jumlah)) || 100) / 50) *
      50 +
    50;

  return (
    <div className="items-center justify-center pt-28">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="p-6 bg-white rounded-lg shadow-lg"
      >
        <h1 className="mb-6 text-2xl font-bold text-gray-800">
          Statistik Data ROW
        </h1>
        <div className="h-[500px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={chartData}
              margin={{
                top: 20,
                right: 30,
                left: 20,
                bottom: 5,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis
                dataKey="name"
                tick={({
                  x,
                  y,
                  payload,
                }: {
                  x: number;
                  y: number;
                  payload: { value: string; index: number };
                }) => {
                  const lines: string[] = payload.value.split("\n"); // Pisahkan berdasarkan "\n"

                  return (
                    <g transform={`translate(${x},${y})`}>
                      <text
                        x={0}
                        y={10}
                        dy={12}
                        textAnchor="middle"
                        fill="#666"
                        fontSize={12}
                      >
                        {lines.map((line: string, index: number) => (
                          <tspan key={index} x={0} dy={index * 14}>
                            {line}
                          </tspan>
                        ))}
                      </text>
                      <text
                        x={0}
                        y={0}
                        dy={42}
                        textAnchor="middle"
                        fill="#2D40E8"
                        fontSize={14}
                        fontWeight="bold"
                      >
                        {`${chartData[payload.index].jumlah} Data`}
                      </text>
                    </g>
                  );
                }}
                height={90}
                interval={0}
              />
              <YAxis
                domain={[0, yAxisMax]}
                tickCount={11}
                tick={{ fill: "#666", fontSize: 12 }}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "white",
                  border: "1px solid #cccccc",
                  borderRadius: "4px",
                  padding: "10px",
                }}
                cursor={{ fill: "rgba(0, 0, 0, 0.1)" }}
                formatter={(value) => [`${value} Data`, ""]}
              />
              <Bar
                name=""
                dataKey="jumlah"
                animationBegin={0}
                animationDuration={1500}
              >
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </motion.div>
    </div>
  );
}
