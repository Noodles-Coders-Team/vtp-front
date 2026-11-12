import {authClient} from "@api/AuthApi.ts";
import {LoadingComponent} from "@commonComponents/ItemLoadingErrorState.tsx";
import {UserRoles} from "@nct/vtp-common";
import type {ReactNode} from "react";

type ShowAdminOnlyProps = {
    children: ReactNode
}

export function ShowAdminOnly({children}: ShowAdminOnlyProps) {
    const {data, isPending} = authClient.useSession();

    if (isPending) {
        return (
            <LoadingComponent/>
        );
    }

    if (data?.user.role != UserRoles.Admin) {
        return (<></>);
    }

    return children;
}