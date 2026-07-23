import { Column, Container, Row } from "@/components/commonComponents/Container";
import ImportCsvComponent from "@/components/importComponent/ImportCsvComponent";

export default function ImportPage() {

    return (
        <Container>
            <Row>
                <Column>
                    <ImportCsvComponent title={"Import Games from Google sheets"} end_point={"games"} description={""} />
                </Column>
            </Row>
            <Row>
                <Column>
                    <ImportCsvComponent title={"Import channel Data from YT"} end_point={"channel-data"} description={""} />
                </Column>
            </Row>
            <Row>
                <Column>
                    <ImportCsvComponent title={"Import Table Data from YT"} end_point={"table-data"} description={""} />
                </Column>
            </Row>
        </Container>
    );
}