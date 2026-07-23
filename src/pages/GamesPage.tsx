import { Column, Container, Row } from "@/components/commonComponents/Container";
import GamesCreate from "@/components/gamePageComponent/GamesCreate";
import GamesTable from "@/components/gamePageComponent/GamesTable";


export default function GamesPage() {
    return (
        <Container>
            <Row>
                <Column>
                    <GamesCreate />
                </Column>
            </Row>
            <Row>
                <Column>
                    <GamesTable />
                </Column>
            </Row>
        </Container>
    )
}