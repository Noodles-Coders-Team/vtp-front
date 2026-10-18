import {Column, Container, Row} from "@commonComponents/Container";
import GamesCreate from "@components/gamePageComponent/GamesCreate";
import GamesTable from "@components/gamePageComponent/GamesTable";
import SteamAppTable from "@components/gamePageComponent/SteamAppTable.tsx";


export default function GamesPage() {
    return (
        <Container>
            <Row>
                <Column>
                    <SteamAppTable/>
                </Column>
                <Column>
                    <GamesTable/>
                </Column>
            </Row>
            <Row>
                <Column>
                    <GamesCreate/>
                </Column>
            </Row>
        </Container>
    )
}