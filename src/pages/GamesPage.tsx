import {Column, Container, Row} from "@commonComponents/Container";
import SteamAppTable from "@components/gamePageComponent/SteamAppTable.tsx";
import SteamAppSearcher from "@components/gamePageComponent/SteamAppSearcher.tsx";


export default function GamesPage() {
    return (
        <Container>
            <Row>
                <Column>
                    <SteamAppTable/>
                </Column>
            </Row>
            <Row>
                <Column>
                    <SteamAppSearcher/>
                </Column>
            </Row>
        </Container>
    )
}