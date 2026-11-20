import Card from "@commonComponents/Card.tsx";
import {Column, Row} from "@commonComponents/Container.tsx";
import {useEffect, useState} from "react";
import {type UserGameScoreConfigDto} from "@nct/vtp-common";
import {createUserScoreConfig, getAllUserGameScoreConfigs} from "@api/UserGameScoreApi.ts";
import UserSteamAppFilterPage from "@components/UserSteamAppFilterPage.tsx";
import {InputComponent, SelectComponent, SelectComponentItem} from "@commonComponents/InputComponent.tsx";
import Button from "@commonComponents/Button.tsx";
import {ButtonType} from "@/enum/ButtonType.ts";


export function UserScoreConfigPage() {

    const [isConfigCreation, setIsConfigCreation] = useState<boolean>(false);
    const [configName, setConfigName] = useState<string>('');

    const [userConfigs, setUserConfigs] = useState<UserGameScoreConfigDto[]>([]);
    const [selectedConfig, setSelectedConfig] = useState<string | null>(null);


    const loadUserConfigs = async () => {
        getAllUserGameScoreConfigs().then(setUserConfigs);
    };


    const onDropDownSelected = (selectedId: string) => {
        if (selectedId === "null") {
            setSelectedConfig(null);
            disableCreationOfConfig();
            return;
        } else if (selectedId === "new") {
            setSelectedConfig(null);
            enableCreationOfConfig();
        } else {
            disableCreationOfConfig();
            setSelectedConfig(selectedId);
        }
    }


    const enableCreationOfConfig = () => {
        setIsConfigCreation(true);
    };


    const disableCreationOfConfig = () => {
        setIsConfigCreation(false);
    }


    const createNewConfigAndReload = async () => {
        createUserScoreConfig(configName).then(() => {
            window.location.reload();
        });
    };


    useEffect(() => {
        loadUserConfigs().then();
    }, []);


    return (
        <Card title="User Score Configuration">
            <Row style={{width: '50%'}}>
                <Column>
                    <SelectComponent id={"configId"} label="Config List" toolTip="Select a config"
                                     onChange={onDropDownSelected}>
                        <SelectComponentItem value="new" label="New"/>
                        {userConfigs.map((config: UserGameScoreConfigDto) => {
                            return (
                                <SelectComponentItem key={config.id} value={config.id}
                                                     label={config.score_config_label}/>
                            )
                        })}
                    </SelectComponent>
                </Column>
                {isConfigCreation &&
                    <Column>
                        <InputComponent id="configName" value={configName} onChange={setConfigName}
                                        label={"Config Name"}/>
                        <Button label="Create Config" type={ButtonType.SUCCESS} onClick={createNewConfigAndReload}/>
                    </Column>
                }
            </Row>
            {selectedConfig != null && (
                <>
                    <br/>
                    <Row>
                        <Column>
                            <UserSteamAppFilterPage configId={selectedConfig}/>
                        </Column>
                    </Row>
                </>
            )
            }
        </Card>
    )
}