import { type ChannelDataDto } from "@nct/vtp-common";
import Card from "@/components/commonComponents/Card";
import { useEffect, useState } from "react";
import { readChannelData } from "@/api/ChannelDataApi";
import { Area, AreaChart, CartesianGrid, Tooltip, XAxis, YAxis } from "recharts";


const DaysLimit: number = 30;


export default function ChannelData() {
    const [channelData, setChannelData] = useState<ChannelDataDto[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string>('');

    const loadData = async () => {
        try {
            setLoading(true);

            const data = await readChannelData();
            setChannelData(data.slice(-DaysLimit));
        } catch (err) {
            setError((err as Error).message);
        } finally {
            setLoading(false);
        };
    };

    useEffect(() => {
        loadData();
    }, []);

    if (loading) return <p>Loading channel data...</p>;

    if (error) return <p style={{ color: "red" }}>Error loading data: {error}</p>;

    return (
        <Card title="Channel Data!!!">
            <AreaChart
                height={400}
                width={500}
                data={channelData}
            >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis<ChannelDataDto, string> dataKey="id" />
                <YAxis<ChannelDataDto, number> />
                <Tooltip />
                <Area<ChannelDataDto, number> type="monotone" dataKey="views" stroke="#3aca23" fill="#83c01b" />
            </AreaChart>
        </Card>
    )
}