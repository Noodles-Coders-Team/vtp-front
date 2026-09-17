import {type ChannelDataDto} from "@nct/vtp-common";
import Card from "@/components/commonComponents/Card";
import {useEffect, useState} from "react";
import {readChannelData} from "@/api/ChannelDataApi";
import {Area, AreaChart, CartesianGrid, Tooltip, XAxis, YAxis} from "recharts";
import {Column, Container, Row} from "@/components/commonComponents/Container";


export default function ChannelData() {
    const [channelData, setChannelData] = useState<ChannelDataDto[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string>('');
    const [daysLimit, setDaysLimit] = useState<number>(30);

    useEffect(() => {
        let requestingData = true;

        readChannelData().then(data => {
            if (daysLimit == 0) {
                setChannelData(data);
            } else {
                //TODO: this should be at the API level
                setChannelData(data.slice(-daysLimit));
            }
        }).catch((e) => {
            if (requestingData) setError(e);
        }).finally(() => {
            if (requestingData) setLoading(false);
        });

        return () => {
            requestingData = false;
        };
    }, [daysLimit]);

    if (loading) return <p>Loading channel data...</p>;

    if (error) return <p style={{color: "red"}}>Error loading data: {error}</p>;

    return (
        <Card title="Channel Data graph!">
            <Container>
                <Row>
                    <Column>
                        <label className="form-label">Limit to last: {daysLimit} days</label>
                    </Column>
                </Row>
                <Row>
                    <Column>
                        <input type="range" className="form-range" min="0" max="100" step="5" id="range"
                               style={{width: '20%'}}
                               value={daysLimit}
                               onChange={(e) => {
                                   e.preventDefault();
                                   setDaysLimit(Number(e.target.value));
                               }}></input>
                    </Column>
                </Row>
                <Row>
                    <Column>
                        <AreaChart
                            height={400}
                            width={500}
                            data={channelData}
                        >
                            <CartesianGrid strokeDasharray="3 3"/>
                            <XAxis<ChannelDataDto, string> dataKey="id"/>
                            <YAxis<ChannelDataDto, number> />
                            <Tooltip/>
                            <Area<ChannelDataDto, number> type="monotone" dataKey="views" stroke="#3aca23"
                                                          fill="#83c01b"/>
                        </AreaChart>
                    </Column>
                </Row>
            </Container>
        </Card>
    )
}