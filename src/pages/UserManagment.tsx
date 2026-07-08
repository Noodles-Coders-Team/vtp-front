import { UserLogin } from "../components/userLogin";
import { DeleteUserById } from "../components/userManageData";
import { UserTable } from "../components/userTable";

export default function UserManagmentPage() {
    return (
        <div>
            <UserLogin />
            <UserTable />
            <DeleteUserById />
        </div>
    );
}