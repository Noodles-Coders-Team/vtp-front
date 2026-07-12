import { UserLogin } from "../components/UserCreate";
import { DeleteUserById } from "../components/UserManageData";
import { UserTable } from "../components/UserTable";

export default function UserManagmentPage() {
    return (
        <div>
            <UserLogin />
            <UserTable />
            <DeleteUserById />
        </div>
    );
}