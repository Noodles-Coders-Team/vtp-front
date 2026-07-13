import { UserLogin } from "../components/UserCreate";
import { DeleteUserByIdDropdown } from "../components/UserManage";
import { UserTable } from "../components/UserTable";

export default function UserManagmentPage() {
    return (
        <div style={{
            width: 250
        }}>
            <UserLogin />
            <UserTable />
            <DeleteUserByIdDropdown />
        </div>
    );
}