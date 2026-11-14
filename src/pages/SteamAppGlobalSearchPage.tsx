import Card from "@commonComponents/Card.tsx";
import UserSteamAppFilterPage from "@components/UserSteamAppFilterPage.tsx";

export default function SteamAppGlobalSearchPage() {
    return (
        <Card title="Steam Apps list">
            <UserSteamAppFilterPage/>
        </Card>
    )
}